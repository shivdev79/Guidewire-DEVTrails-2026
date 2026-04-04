from pydantic import BaseModel, field_validator
from typing import Optional, Any
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


class WalletTopUpRequest(BaseModel):
    amount: float
    payment_method: str = "UPI"  # UPI | NETBANKING | CARD | OTHER

    @field_validator("amount", mode="before")
    @classmethod
    def coerce_amount(cls, v: Any) -> float:
        if isinstance(v, str):
            cleaned = v.strip().replace(",", "").replace("₹", "").replace("Rs", "").replace("rs", "").strip()
            return float(cleaned) if cleaned else 0.0
        return float(v)

class AIChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None

class AIChatResponse(BaseModel):
    response: str
