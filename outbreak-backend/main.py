from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import random
import io
import pandas as pd

app = FastAPI(title="Disease Surveillance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Backend Active", "project": "AI Outbreak System"}

# 1. FIX FOR THE MAP (County Risks for all 47 counties)
@app.get("/api/v1/county-risks")
def get_risks():
    counties = ["Nairobi", "Mombasa", "Kiambu", "Nakuru", "Kisumu", "Uasin Gishu", "Machakos"]
    # Generating random risk data for demo purposes
    return {county: random.randint(10, 95) for county in counties}

# 2. FIX FOR THE REPORT GENERATOR
@app.get("/api/v1/generate-report")
def generate_report():
    # We create a dummy dataset to download as a CSV
    data = {
        "County": ["Nairobi", "Mombasa", "Kiambu", "Kisumu"],
        "Risk_Level": [85, 45, 70, 30],
        "Outbreak_Probability": ["High", "Medium", "High", "Low"]
    }
    df = pd.DataFrame(data)
    
    # Convert dataframe to a CSV string in memory
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    
    # Send it back to the browser as a downloadable file
    response = StreamingResponse(
        iter([stream.getvalue()]),
        media_type="text/csv"
    )
    response.headers["Content-Disposition"] = "attachment; filename=outbreak_report.csv"
    return response

# 3. FIX FOR THE MAP GEOMETRY (Optional but helpful)
@app.get("/api/v1/map-metadata")
def get_map_metadata():
    return {"message": "Coordinate system active", "projection": "EPSG:4326"}