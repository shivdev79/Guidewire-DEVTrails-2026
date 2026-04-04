from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class WorkerCreate(BaseModel):
    name: str
    phone: str
    upi_id: str
    platform: str
    city: str
    pincode: str
    avg_weekly_earnings: float

class WorkerResponse(WorkerCreate):
    id: int
    r_score: float
    wallet_balance: float

    class Config:
        from_attributes = True

class PolicyCreate(BaseModel):
    worker_id: int
    tier: str
    accepted_terms: bool

class PolicyResponse(BaseModel):
    id: int
    worker_id: int
    tier: str
    week_start: datetime
    week_end: datetime
    coverage_amount: float
    premium_paid: float
    status: str

    class Config:
        from_attributes = True

class PremiumRequest(BaseModel):
    worker_id: int
    tier: str # Base, Pro, Elite

class ClaimResponse(BaseModel):
    id: int
    worker_id: int
    trigger_type: str
    description: str
    status: str
    payout_amount: float
    created_at: datetime

    class Config:
        from_attributes = True

class ManualClaimCreate(BaseModel):
    worker_id: int
    reason: str
    description: str
    amount: float
