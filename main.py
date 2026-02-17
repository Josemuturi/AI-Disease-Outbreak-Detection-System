from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

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

@app.get("/api/v1/county-risks")
def get_risks():
    return {"Nairobi": random.randint(10, 95), "Mombasa": random.randint(10, 95)}
