# main.py  –  FastAPI Entry Point  |  MKU 2026
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router as v1_router
from database import init_db

init_db()

app = FastAPI(
    title="AI-Driven Disease Outbreak Surveillance System",
    description="Backend API for the MKU 2026 BSC CS Project by Joseph Muturi",
    version="1.0.0"
)

# 1. CORS Setup - Allowing the Next.js frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Include the V1 Router
app.include_router(v1_router)

@app.get("/")
def root():
    return {
        "status": "Backend Active", 
        "project": "AI Outbreak System",
        "developer": "Joseph Muturi",
        "reg_no": "BSCCS/2024/34208"
    }
