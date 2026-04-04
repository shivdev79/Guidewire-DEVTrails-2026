"""
Mock Data Generator - Create realistic test data for admin portal and parametric insurance scenarios
Supports bulk data injection for demonstrations
"""

import random
from datetime import datetime as dt, timedelta
from typing import List, Dict
import json

class MockDataGenerator:
    """Generate realistic parametric insurance test data"""
    
    # Common Indian pincodes
    PINCODES = {
        "400001": {"city": "Mumbai", "zone": "Downtown Core", "risk_tier": "High"},
        "400002": {"city": "Mumbai", "zone": "North Suburbs", "risk_tier": "Low"},
        "400003": {"city": "Mumbai", "zone": "East Industrial", "risk_tier": "Critical"},
        "560001": {"city": "Bangalore", "zone": "IT Corridor", "risk_tier": "Low"},
        "110001": {"city": "Delhi", "zone": "Central Delhi", "risk_tier": "High"},
        "700001": {"city": "Kolkata", "zone": "South Kolkata", "risk_tier": "Medium"},
        "600001": {"city": "Chennai", "zone": "CBD", "risk_tier": "Medium"},
        "700002": {"city": "Kolkata", "zone": "Flood Zone", "risk_tier": "Critical"},
    }
    
    PLATFORMS = ["Zomato", "Swiggy", "Zepto", "Blinkit", "Ola Food", "Amazon Food"]
    VEHICLES = ["2-Wheeler", "3-Wheeler", "Bicycle", "Scooter"]
    GENDERS = ["Male", "Female", "Other"]
    
    TRIGGER_TYPES = [
        "Heavy Rain (>50mm/hr)",
        "Extreme Heat (>44°C)",
        "Critical AQI (>300)",
        "Civic Strike/Curfew",
        "Platform Outage",
        "Flood (Barometric Drop)"
    ]
    
    @staticmethod
    def generate_workers(count: int = 50) -> List[Dict]:
        """Generate mock worker registrations"""
        workers = []
        for i in range(count):
            pincode = random.choice(list(MockDataGenerator.PINCODES.keys()))
            zone_info = MockDataGenerator.PINCODES[pincode]
            
            worker = {
                "id": 1000 + i,
                "name": f"Worker_{i+1:03d}",
                "phone": f"98{'%08d' % random.randint(0, 99999999)}",
                "upi_id": f"worker{i+1}@upi",
                "email": f"worker{i+1}@gig.com",
                "platform": random.choice(MockDataGenerator.PLATFORMS),
                "vehicle": random.choice(MockDataGenerator.VEHICLES),
                "city": zone_info["city"],
                "pincode": pincode,
                "zone": zone_info["zone"],
                "risk_tier": zone_info["risk_tier"],
                "avg_weekly_earnings": random.randint(2000, 12000),
                "r_score": random.uniform(60, 100),
                "wallet_balance": random.uniform(0, 5000),
                "active_days_count": random.randint(0, 30),
                "kyc_status": random.choice(["Verified", "Pending", "Rejected"]),
                "created_at": (dt.now() - timedelta(days=random.randint(1, 90))).isoformat(),
            }
            workers.append(worker)
        
        return workers
    
    @staticmethod
    def generate_policies(workers: List[Dict], conversion_rate: float = 0.6) -> List[Dict]:
        """Generate policies for workers (with conversion rate)"""
        policies = []
        
        tiers = {
            "Base": {"base_price": 30, "coverage": 1500},
            "Pro": {"base_price": 48, "coverage": 3000},
            "Elite": {"base_price": 72, "coverage": 5000},
        }
        
        for worker in workers:
            # Apply conversion rate
            if random.random() > conversion_rate:
                continue
            
            # Select tier based on earnings
            earnings = worker.get("avg_weekly_earnings", 5000)
            if earnings > 8000:
                tier = "Elite"
            elif earnings > 5000:
                tier = "Pro"
            else:
                tier = "Base"
            
            tier_info = tiers[tier]
            
            # Dynamic pricing - use default 1.0 if risk_tier not available
            risk_tier = worker.get("risk_tier", "Medium")
            risk_multiplier = {"High": 1.3, "Critical": 1.5, "Medium": 1.1, "Low": 0.9}
            multiplier = risk_multiplier.get(risk_tier, 1.0)
            
            premium = tier_info["base_price"] * multiplier
            
            policy = {
                "id": 500 + len(policies),
                "worker_id": worker["id"],
                "tier": tier,
                "premium_paid": round(premium, 2),
                "coverage_amount": tier_info["coverage"],
                "started_at": (dt.now() - timedelta(days=random.randint(1, 30))).isoformat(),
                "status": random.choice(["ACTIVE", "ACTIVE", "ACTIVE", "EXPIRED"]),  # 75% active
                "triggers": random.sample(MockDataGenerator.TRIGGER_TYPES, k=random.randint(2, 4)),
            }
            policies.append(policy)
        
        return policies
    
    @staticmethod
    def generate_claims(policies: List[Dict], claim_rate: float = 0.2) -> List[Dict]:
        """Generate claims for active policies"""
        claims = []
        
        for policy in policies:
            if policy["status"] != "ACTIVE":
                continue
            
            # Apply claim rate
            if random.random() > claim_rate:
                continue
            
            trigger_type = random.choice(policy["triggers"])
            
            # NEW LOGIC: Claim = weekly_premium × trigger_multiplier, capped at 500
            weekly_premium = policy["premium_paid"]  # Customer's weekly premium (20-72)
            
            # Severity multiplier by trigger type
            trigger_multipliers = {
                "Heavy Rain (>50mm/hr)": 8,
                "Heavy Rain (65.5mm rain, 28.0°C)": 9,
                "Extreme Heat (>44°C)": 8,
                "Extreme Heat (44°C+)": 9,
                "Critical AQI (>300)": 12,
                "Critical AQI Spike (>300)": 13,
                "Civic Strike/Curfew": 12,
                "Civic Strike": 11,
                "Platform Outage": 8,
                "Flood (Barometric Drop)": 9,
            }
            
            base_multiplier = trigger_multipliers.get(trigger_type, 8)
            multiplier = base_multiplier + random.uniform(-0.5, 1.5)
            multiplier = max(multiplier, 5)  # Min 5x
            
            # Claim amount = weekly_premium × multiplier, capped at 500
            claim_amount = min(weekly_premium * multiplier, 500)
            claim_amount = round(claim_amount / 50) * 50  # Round to nearest 50 for realistic values
            
            # Status distribution: 70% Approved, 20% Pending, 10% Rejected
            rand = random.random()
            if rand < 0.7:
                status = "APPROVED"
                payout_amount = claim_amount
            elif rand < 0.9:
                status = "PENDING"
                payout_amount = 0
            else:
                status = "REJECTED"
                payout_amount = 0
            
            claim = {
                "id": 300 + len(claims),
                "worker_id": policy["worker_id"],
                "trigger_type": trigger_type,
                "claim_amount": round(claim_amount, 2),
                "payout_amount": round(payout_amount, 2),
                "status": status,
                "created_at": (dt.now() - timedelta(days=random.randint(1, 15))).isoformat(),
                "fraud_score": round(random.uniform(0, 100), 1),
                "gps_verified": random.choice([True, False]),
                "network_verified": random.choice([True, False]),
            }
            claims.append(claim)
        
        return claims
    
    @staticmethod
    def generate_weather_events(zones: List[str] = None, count: int = 20) -> List[Dict]:
        """Generate simulated weather trigger events"""
        if zones is None:
            zones = list(MockDataGenerator.PINCODES.values())
        
        events = []
        for i in range(count):
            zone_info = random.choice(zones)
            trigger = random.choice(MockDataGenerator.TRIGGER_TYPES)
            
            event = {
                "id": 200 + i,
                "zone": zone_info["zone"],
                "city": zone_info["city"],
                "trigger_type": trigger,
                "severity": random.choice(["Low", "Medium", "High", "Critical"]),
                "occurred_at": (dt.now() - timedelta(hours=random.randint(1, 168))).isoformat(),
                "affected_workers": random.randint(5, 50),
                "total_payout": round(random.uniform(50000, 500000), 2),
                "status": random.choice(["Resolved", "Ongoing", "Escalated"]),
            }
            events.append(event)
        
        return events
    
    @staticmethod
    def generate_pool_metrics() -> Dict:
        """Generate liquidity pool and actuarial metrics"""
        total_premiums = random.uniform(500000, 5000000)
        total_claims = total_premiums * random.uniform(0.4, 0.85)
        
        return {
            "total_workers": random.randint(100, 500),
            "active_policies": random.randint(50, 300),
            "total_premiums_collected": round(total_premiums, 2),
            "total_claims_paid": round(total_claims, 2),
            "loss_ratio": round((total_claims / total_premiums * 100) if total_premiums > 0 else 0, 2),
            "liquidity_pool_balance": round(total_premiums - total_claims, 2),
            "weeks_of_runway": round((total_premiums - total_claims) / (total_premiums / 52) if total_premiums > 0 else 0, 1),
            "average_premium_per_worker": round(total_premiums / random.randint(100, 300), 2),
            "claims_processing_time_avg": round(random.uniform(2, 30), 1),  # minutes
        }
    
    @staticmethod
    def generate_fraud_alerts() -> List[Dict]:
        """Generate simulated fraud detection alerts"""
        alerts = []
        
        fraud_patterns = [
            {"type": "GPS_TELEPORTATION", "severity": "Critical", "description": "15km distance in 3 seconds"},
            {"type": "BSSID_CLUSTERING", "severity": "High", "description": "50 workers on same WiFi"},
            {"type": "BATTERY_ANOMALY", "severity": "Medium", "description": "Indoor emulator detected"},
            {"type": "NETWORK_SPOOFING", "severity": "High", "description": "Call tower mismatch"},
            {"type": "TIMING_ANOMALY", "severity": "Low", "description": "Claim filed before event start"},
        ]
        
        for i in range(random.randint(3, 10)):
            pattern = random.choice(fraud_patterns)
            alert = {
                "id": 100 + i,
                "type": pattern["type"],
                "severity": pattern["severity"],
                "description": pattern["description"],
                "workers_affected": random.randint(1, 20),
                "detected_at": (dt.now() - timedelta(hours=random.randint(1, 48))).isoformat(),
                "status": random.choice(["Flagged", "Escalated to SIU", "Resolved"]),
            }
            alerts.append(alert)
        
        return alerts
    
    @staticmethod
    def generate_dashboard_summary() -> Dict:
        """Generate complete admin dashboard summary"""
        workers = MockDataGenerator.generate_workers(random.randint(50, 150))
        policies = MockDataGenerator.generate_policies(workers)
        claims = MockDataGenerator.generate_claims(policies)
        
        zones = list(set([w["zone"] for w in workers]))
        
        return {
            "timestamp": dt.now().isoformat(),
            "workers": workers,
            "policies": policies,
            "claims": claims,
            "weather_events": MockDataGenerator.generate_weather_events(zones=None, count=random.randint(10, 30)),
            "pool_metrics": MockDataGenerator.generate_pool_metrics(),
            "fraud_alerts": MockDataGenerator.generate_fraud_alerts(),
        }
