# schemas.py  –  Pydantic v2 Request Validation Schemas  |  MKU 2026
from pydantic import BaseModel, Field, field_validator
from typing import Literal
from datetime import date, datetime

class HealthRecordCreate(BaseModel):
    disease_type:   str   = Field(..., max_length=100)
    facility_id:    int   = Field(..., gt=0)
    county_id:      int   = Field(..., ge=1, le=47)
    diagnosis_date: date  = Field(...)
    patient_count:  int   = Field(..., gt=0)
    severity_level: Literal["LOW","MEDIUM","HIGH"] = "LOW"
    temperature:    float = Field(..., ge=-10.0, le=60.0)
    rainfall:       float = Field(..., ge=0.0,   le=500.0)
    humidity:       float = Field(..., ge=0.0,   le=100.0)

    @field_validator("diagnosis_date")
    @classmethod
    def date_not_in_future(cls, v:date) -> date:
        from datetime import date as dt
        if v > dt.today():
            raise ValueError("diagnosis_date cannot be in the future")
        if (dt.today()-v).days > 90:
            raise ValueError("diagnosis_date cannot be older than 90 days")
        return v

class PredictionResponse(BaseModel):
    prediction_id:int
    county_id:int
    risk_score:float=Field(...,ge=0.0,le=100.0)
    confidence:float=Field(...,ge=0.0,le=1.0)
    prediction_date:datetime
    alert_dispatched:bool

class AlertUpdate(BaseModel):
    status: Literal["ACKNOWLEDGED","RESOLVED"]
