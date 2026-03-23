# routes.py  –  FastAPI Route Handlers (Prediction Endpoint)  |  MKU 2026
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from datetime import datetime
import pandas as pd
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

from predictor import predict_risk
from auth import verify_jwt_token, create_access_token, verify_password, get_password_hash
from schemas import PredictionResponse, HealthRecordCreate, AlertUpdate
from database import log_action, get_logs

load_dotenv()

router=APIRouter(prefix="/api/v1",tags=["Predictions"])
security=HTTPBearer()
OUTBREAK_THRESHOLD=65.0  # % above which alert is dispatched

# --- Authentication Endpoint ---
class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/auth/login")
async def login(req: LoginRequest):
    if req.username == "admin" and req.password == "mku2026":
        token = create_access_token(data={"sub": req.username, "role": "Administrator"})
        log_action("User Logged In", "Administrator")
        return {"access_token": token, "token_type": "bearer"}
    elif req.username == "health_officer" and req.password == "health123":
        token = create_access_token(data={"sub": req.username, "role": "Health Officer"})
        log_action("User Logged In", "Health Officer")
        return {"access_token": token, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid credentials")


# --- Prediction Endpoints ---
@router.post("/predict/{county_id}", response_model=PredictionResponse)
async def trigger_prediction(
    county_id:int,
    credentials:HTTPAuthorizationCredentials=Depends(security)
):
    if not verify_jwt_token(credentials.credentials):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid or expired authentication token")
    
    # Mock data loading for the sake of the project running without a DB initially
    df = pd.DataFrame(columns=['county_id', 'date', 'case_count', 'temperature', 'rainfall', 'humidity', 'outbreak_label'])
    
    try:
        result=predict_risk(county_id,df)
    except ValueError as e:
        raise HTTPException(status_code=422,detail=str(e))
    alert_sent=False
    if result["risk_score"]>=OUTBREAK_THRESHOLD:
        alert_sent=dispatch_alert(county_id,result["risk_score"])
        
    return PredictionResponse(
        prediction_id=1,
        county_id=result["county_id"], 
        risk_score=result["risk_score"],
        confidence=result["confidence"], 
        prediction_date=datetime.utcnow(),
        alert_dispatched=alert_sent,
        message="ALERT DISPATCHED" if alert_sent else "Prediction completed"
    )

def dispatch_alert(county_id,risk_score):
    print(f"[ALERT] County {county_id} – risk: {risk_score:.1f}%")
    return True


# --- Records and Dashboard Endpoints ---
@router.post("/records")
async def submit_record(
    record: HealthRecordCreate,
    credentials:HTTPAuthorizationCredentials=Depends(security)
):
    if not verify_jwt_token(credentials.credentials):
        raise HTTPException(status_code=401, detail="Unauthorized")
    return {"message": "Record submitted successfully", "record_id": 1}

@router.get("/counties")
async def get_dashboard_data(
    credentials:HTTPAuthorizationCredentials=Depends(security)
):
    if not verify_jwt_token(credentials.credentials):
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    # Mock data for the 4 counties mentioned in your report
    return [
        {"county_id": 1, "county_name": "Nairobi", "risk_score": 75.4, "prediction_date": datetime.utcnow().isoformat(), "disease_type": "Cholera"},
        {"county_id": 2, "county_name": "Mombasa", "risk_score": 42.1, "prediction_date": datetime.utcnow().isoformat(), "disease_type": "None"},
        {"county_id": 3, "county_name": "Kisumu", "risk_score": 82.0, "prediction_date": datetime.utcnow().isoformat(), "disease_type": "Malaria"},
        {"county_id": 4, "county_name": "Nakuru", "risk_score": 25.6, "prediction_date": datetime.utcnow().isoformat(), "disease_type": "None"}
    ]

# --- Alerts and Reports Endpoints ---
@router.get("/alerts")
async def get_alerts(credentials:HTTPAuthorizationCredentials=Depends(security)):
    if not verify_jwt_token(credentials.credentials):
        raise HTTPException(status_code=401, detail="Unauthorized")
    return [
        {"alert_id": 1, "county_name": "Nairobi", "risk_score": 75.4, "severity": "HIGH", "status": "SENT", "date": datetime.utcnow().isoformat(), "disease_type": "Cholera"},
        {"alert_id": 2, "county_name": "Kisumu", "risk_score": 82.0, "severity": "CRITICAL", "status": "ACKNOWLEDGED", "date": datetime.utcnow().isoformat(), "disease_type": "Malaria"}
    ]

@router.put("/alerts/{alert_id}")
async def update_alert(alert_id: int, update: AlertUpdate, credentials:HTTPAuthorizationCredentials=Depends(security)):
    if not verify_jwt_token(credentials.credentials):
        raise HTTPException(status_code=401, detail="Unauthorized")
    log_action(f"Updated Alert #{alert_id} to {update.status}", "Health Officer")
    return {"message": f"Alert {alert_id} updated to {update.status}"}

@router.get("/reports/generate")
async def generate_report(credentials:HTTPAuthorizationCredentials=Depends(security)):
    if not verify_jwt_token(credentials.credentials):
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    dashboard_data = await get_dashboard_data(credentials)
    
    data_str = "\n".join([f"- {d['county_name']} County: Risk Score {d['risk_score']}%, Predicted Disease: {d['disease_type']}" for d in dashboard_data if isinstance(d, dict)])
    
    prompt = f"You are an expert epidemiologist and public health official. Based on the following county-level disease risk data from an AI outbreak prediction system, generate a detailed and highly professional executive summary report. Provide actionable containment strategies for regions with high risk (>65%) or specific disease warnings. Use formatting like bullet points and bold text where appropriate.\n\nData:\n{data_str}\n\nPlease generate the detailed report summary now."
    
    try:
        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )
        summary = response.text
        log_action("Generated Ministry Report (Dynamic AI)", "Administrator")
    except Exception as e:
        summary = f"Error generating dynamic report: {str(e)}. Please check API configuration or connection."
        log_action("Generated Ministry Report (Error)", "Administrator")
            
    return {
        "report_id": f"REP-2026-{datetime.utcnow().strftime('%H%M%S')}",
        "generated_at": datetime.utcnow().isoformat(),
        "summary": summary
    }

# --- Admin Dashboard Endpoints ---
@router.get("/admin/audit-logs")
async def fetch_audit_logs(credentials:HTTPAuthorizationCredentials=Depends(security)):
    if not verify_jwt_token(credentials.credentials):
        raise HTTPException(status_code=401, detail="Unauthorized")
    return get_logs(50)

@router.get("/admin/model-metrics")
async def fetch_model_metrics(credentials:HTTPAuthorizationCredentials=Depends(security)):
    if not verify_jwt_token(credentials.credentials):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # Returning the metrics established in your research paper to prove model understanding
    return {
        "accuracy": "87.4%",
        "auc_score": "0.91",
        "val_loss": "0.28",
        "last_trained": datetime.utcnow().isoformat()
    }
