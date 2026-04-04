#!/usr/bin/env python3
"""
Add a demo claim record for testing purposes
"""
import sys
sys.path.insert(0, '/Users/marthanda/Downloads/Guidewire_Shivanshu/Guidewire-DEVTrails-2026/backend')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import datetime
import models

# Setup database
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
models.Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def add_demo_claim():
    db = SessionLocal()
    
    try:
        # Check if demo worker exists
        demo_worker = db.query(models.Worker).filter(models.Worker.id == 999).first()
        
        if not demo_worker:
            print("❌ Demo worker not found (ID 999)")
            print("Creating demo worker...")
            demo_worker = models.Worker(
                id=999,
                name="Demo Worker",
                phone="9999999999",
                upi_id="worker@upi",
                platform="Zomato",
                city="Mumbai",
                pincode="400001",
                avg_weekly_earnings=8000.0,
                r_score=100.0,
                wallet_balance=4000.0
            )
            db.add(demo_worker)
            db.commit()
            print("✓ Demo worker created")
        
        # Check existing claims
        existing_claims = db.query(models.Claim).filter(models.Claim.worker_id == 999).all()
        print(f"Existing claims for worker 999: {len(existing_claims)}")
        
        # Create a demo claim
        demo_claim = models.Claim(
            worker_id=999,
            trigger_type="HEAVY_RAIN_MUMBAI",
            description="Heavy rainfall triggered in Mumbai zone (>15mm/hour)",
            status="APPROVED",
            payout_amount=4000.0,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=2),
            fraud_score=0.08
        )
        
        db.add(demo_claim)
        db.commit()
        db.refresh(demo_claim)
        
        print(f"✓ Demo claim added successfully!")
        print(f"  Claim ID: {demo_claim.id}")
        print(f"  Worker ID: {demo_claim.worker_id}")
        print(f"  Trigger: {demo_claim.trigger_type}")
        print(f"  Amount: ₹{demo_claim.payout_amount}")
        print(f"  Status: {demo_claim.status}")
        print(f"  Created: {demo_claim.created_at}")
        
        # Get all claims for this worker
        all_claims = db.query(models.Claim).filter(models.Claim.worker_id == 999).all()
        print(f"\n📊 Total claims for demo worker: {len(all_claims)}")
        for claim in all_claims:
            print(f"   - {claim.trigger_type}: ₹{claim.payout_amount} ({claim.status})")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_demo_claim()
