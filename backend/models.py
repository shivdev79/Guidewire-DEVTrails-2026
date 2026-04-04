from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
import datetime

class Worker(Base):
    __tablename__ = "workers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    phone = Column(String, unique=True, index=True)
    upi_id = Column(String)
    platform = Column(String)
    city = Column(String)
    pincode = Column(String)
    avg_weekly_earnings = Column(Float)
    r_score = Column(Float, default=100.0)
    wallet_balance = Column(Float, default=0.0)
    terms_accepted_at = Column(DateTime, nullable=True)

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, index=True)
    tier = Column(String) # Base, Pro, Elite
    week_start = Column(DateTime, default=datetime.datetime.utcnow)
    week_end = Column(DateTime)
    coverage_amount = Column(Float)
    premium_paid = Column(Float)
    status = Column(String, default="ACTIVE")

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, index=True)
    trigger_type = Column(String)
    description = Column(String)
    status = Column(String, default="PENDING")
    payout_amount = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    fraud_score = Column(Float, nullable=True)
    rejection_reason = Column(String, nullable=True)


class WalletLedger(Base):
    __tablename__ = "wallet_ledger"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, index=True)
    amount = Column(Float)
    description = Column(String)
    txn_type = Column(String)  # CREDIT | DEBIT
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
