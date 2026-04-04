#!/usr/bin/env python3
"""
Seed database with 150+ demo workers and their claims
Creates realistic worker data with various earnings, cities, and claim histories
"""
import sys
sys.path.insert(0, '/Users/marthanda/Downloads/Guidewire_Shivanshu/Guidewire-DEVTrails-2026/backend')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import datetime
import random
import models

# Setup database
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
models.Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Demo data
CITIES = ["Mumbai", "Bangalore", "Delhi", "Hyderabad", "Chennai", "Pune"]
PLATFORMS = [
    ["Zomato"],
    ["Swiggy"],
    ["Uber Eats"],
    ["Dunzo"],
    ["Zomato", "Swiggy"],
    ["Swiggy", "Uber Eats"],
    ["Zomato", "Uber Eats"],
    ["Zomato", "Swiggy", "Uber Eats"],
]
TRIGGER_TYPES = [
    "HEAVY_RAIN_MUMBAI",
    "EXTREME_HEAT_BANGALORE",
    "CIVIC_STRIKE_DELHI",
    "HEAT_WAVE_PUNE",
    "FLOOD_EVENT_HYDERABAD",
    "SMOG_EVENT_DELHI",
    "PLATFORM_OUTAGE_ZOMATO",
    "TRAFFIC_GRIDLOCK_BANGALORE",
]

def seed_workers_and_claims(num_workers=150):
    db = SessionLocal()
    
    try:
        print("\n" + "="*80)
        print("🚀 SEEDING AEGIS DATABASE WITH WORKERS AND CLAIMS")
        print("="*80 + "\n")
        
        # Check existing workers
        existing_workers = db.query(models.Worker).count()
        print(f"📊 Existing workers: {existing_workers}")
        
        # Delete existing demo data (optional - comment out to preserve)
        # print("🗑️ Clearing existing data...")
        # db.query(models.Claim).delete()
        # db.query(models.Policy).delete()
        # db.query(models.WalletLedger).delete()
        # db.query(models.Worker).delete()
        # db.commit()
        
        print(f"➕ Adding {num_workers} new workers with claims...\n")
        
        created_workers = 0
        created_policies = 0
        created_claims = 0
        
        for i in range(num_workers):
            try:
                # Generate worker data
                worker_id_base = 2000 + i  # Start from 2000 to avoid conflicts
                phone = f"{random.randint(7000000000, 9999999999)}"
                city = random.choice(CITIES)
                platforms = random.choice(PLATFORMS)
                earnings = random.randint(3000, 15000)
                
                # Check if worker already exists
                existing = db.query(models.Worker).filter(
                    models.Worker.phone == phone
                ).first()
                
                if existing:
                    continue
                
                # Create worker
                worker = models.Worker(
                    name=f"Rider_{i+1:03d}",
                    phone=phone,
                    upi_id=f"rider{i+1}@aegis.app",
                    platform=", ".join(platforms),
                    city=city,
                    pincode=f"{random.randint(100000, 999999)}",
                    avg_weekly_earnings=float(earnings),
                    r_score=random.uniform(85.0, 100.0),
                    wallet_balance=float(random.randint(500, 3000))
                )
                db.add(worker)
                db.flush()  # Get the ID
                created_workers += 1
                
                # Create active policy for this worker
                week_start = datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(0, 3))
                week_end = week_start + datetime.timedelta(days=7)
                
                # Randomly pick tier
                tiers = [("Base", 25, 1200), ("Pro", 34, 2500), ("Elite", 45, 3500)]
                tier_name, premium, coverage = random.choice(tiers)
                
                policy = models.Policy(
                    worker_id=worker.id,
                    tier=tier_name,
                    week_start=week_start,
                    week_end=week_end,
                    coverage_amount=float(coverage),
                    premium_paid=float(premium),
                    status="ACTIVE"
                )
                db.add(policy)
                created_policies += 1
                
                # Create 1-3 claims for each worker
                num_claims = random.randint(1, 3)
                for _ in range(num_claims):
                    trigger_type = random.choice(TRIGGER_TYPES)
                    
                    # Calculate realistic payout (30-80% of weekly earnings)
                    payout = earnings * random.uniform(0.3, 0.8)
                    
                    # Claim status distribution: 70% APPROVED, 20% PENDING, 10% REJECTED
                    rand = random.random()
                    if rand < 0.7:
                        status = "APPROVED"
                    elif rand < 0.9:
                        status = "PENDING"
                    else:
                        status = "REJECTED"
                    
                    claim_created = datetime.datetime.utcnow() - datetime.timedelta(
                        hours=random.randint(1, 72)
                    )
                    
                    claim = models.Claim(
                        worker_id=worker.id,
                        trigger_type=trigger_type,
                        description=f"{trigger_type.replace('_', ' ')} triggered in {city}",
                        status=status,
                        payout_amount=float(payout),
                        created_at=claim_created,
                        fraud_score=random.uniform(0.01, 0.25) if status == "APPROVED" else random.uniform(0.3, 0.9)
                    )
                    db.add(claim)
                    created_claims += 1
                    
                    # Add to wallet ledger if approved
                    if status == "APPROVED":
                        ledger = models.WalletLedger(
                            worker_id=worker.id,
                            amount=payout,
                            description=f"Claim payout - {trigger_type}",
                            txn_type="CREDIT",
                            created_at=claim_created
                        )
                        db.add(ledger)
                        worker.wallet_balance += payout
                
                # Show progress
                if (i + 1) % 25 == 0:
                    print(f"  ✓ Created {i + 1} workers so far...")
                
                db.commit()
                
            except Exception as e:
                print(f"  ⚠️ Error creating worker {i+1}: {e}")
                db.rollback()
                continue
        
        # Final commit
        db.commit()
        
        # Get statistics
        total_workers = db.query(models.Worker).count()
        total_policies = db.query(models.Policy).count()
        total_claims = db.query(models.Claim).count()
        
        print(f"\n" + "="*80)
        print("✅ DATABASE SEEDING COMPLETE!")
        print("="*80)
        print(f"\n📊 STATISTICS:")
        print(f"  Workers Created:  {created_workers}")
        print(f"  Policies Created: {created_policies}")
        print(f"  Claims Created:   {created_claims}")
        print(f"\n  Total Workers:    {total_workers}")
        print(f"  Total Policies:   {total_policies}")
        print(f"  Total Claims:     {total_claims}")
        
        # Show sample worker data
        print(f"\n" + "="*80)
        print("📋 SAMPLE WORKERS")
        print("="*80)
        
        sample_workers = db.query(models.Worker).limit(5).all()
        for worker in sample_workers:
            policies = db.query(models.Policy).filter(models.Policy.worker_id == worker.id).all()
            claims = db.query(models.Claim).filter(models.Claim.worker_id == worker.id).all()
            
            print(f"\n👤 {worker.name} (ID: {worker.id})")
            print(f"   Phone: {worker.phone}")
            print(f"   City: {worker.city}")
            print(f"   Earnings: ₹{worker.avg_weekly_earnings}/week")
            print(f"   Wallet: ₹{worker.wallet_balance}")
            print(f"   R-Score: {worker.r_score:.1f}")
            print(f"   Platform(s): {worker.platform}")
            
            if policies:
                active = next((p for p in policies if p.status == "ACTIVE"), policies[0])
                print(f"   Policy: {active.tier} (₹{active.premium_paid}/week, ₹{active.coverage_amount} coverage)")
            
            if claims:
                approved_count = len([c for c in claims if c.status == "APPROVED"])
                print(f"   Claims: {len(claims)} total ({approved_count} APPROVED)")
                for claim in claims[:2]:  # Show first 2 claims
                    print(f"     - {claim.trigger_type}: ₹{claim.payout_amount} ({claim.status})")
        
        # Show city breakdown
        print(f"\n" + "="*80)
        print("📍 WORKERS BY CITY")
        print("="*80)
        
        from sqlalchemy import func
        city_stats = db.query(
            models.Worker.city,
            func.count(models.Worker.id).label('count')
        ).group_by(models.Worker.city).all()
        
        for city, count in city_stats:
            print(f"  {city}: {count} workers")
        
        # Show claim breakdown
        print(f"\n" + "="*80)
        print("🚨 CLAIMS BY STATUS")
        print("="*80)
        
        status_stats = db.query(
            models.Claim.status,
            func.count(models.Claim.id).label('count')
        ).group_by(models.Claim.status).all()
        
        for status, count in status_stats:
            print(f"  {status}: {count} claims")
        
        print(f"\n" + "="*80)
        print("✨ READY FOR TESTING!")
        print("="*80 + "\n")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_workers_and_claims(150)  # Create 150 workers
