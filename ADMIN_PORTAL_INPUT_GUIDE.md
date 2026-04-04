# Admin Portal - Data Input & Mock API Guide

## Overview
The admin portal has **three modes** for data input:

### 1. **Real Data Entry** (Manual)
- Register workers manually through the rider onboarding
- Create policies through the worker dashboard
- Claims auto-trigger through the orchestrator engine

### 2. **Mock Data Injection** (Bulk Testing)
- Inject 50-150 realistic test workers instantly
- Auto-generate policies and claims
- Pre-populate dashboard with real-world scenarios

### 3. **Demo Mode** (Live Demonstrations)
- Inject disruptive events on-demand
- Show instant claim triggers
- Demonstrate AI fraud detection

---

## How to Use the Admin Portal

### **Step 1: Access the Admin Portal**

1. Open `http://localhost:5174`
2. Click **"Admin / Insurer"** on the landing page
3. You'll see the **DevTrails Control Center**

---

### **Step 2: Inject Mock Data (Recommended for Demos)**

#### Option A: Quick Mock Data (5 seconds)

**GET endpoint:**
```
http://localhost:8000/admin/mock-summary
```

**Returns:**
- 50-150 sample workers
- Sample policies and claims
- Weather events and fraud alerts
- Pool metrics (loss ratio, liquidity, runway)

**Use case:** Preview the data structure and mock scenarios

---

#### Option B: Inject to Database (Bulk Test Data)

**POST endpoint:**
```
http://localhost:8000/admin/inject-mock-data?worker_count=75
```

**Parameters:**
- `worker_count`: 10-500 workers (default: 50)

**Example:**
```bash
curl -X POST "http://localhost:8000/admin/inject-mock-data?worker_count=100"
```

**Returns:**
```json
{
  "status": "success",
  "message": "Injected mock data: 100 workers, 60 policies, 15 claims",
  "workers_created": 100,
  "policies_created": 60,
  "claims_created": 15,
  "metrics": {
    "total_workers": 100,
    "active_policies": 60,
    "total_premiums_collected": 2850000,
    "total_claims_paid": 1420000,
    "loss_ratio": 49.8,
    "liquidity_pool_balance": 1430000,
    "weeks_of_runway": 26.2
  }
}
```

**What gets created:**
- ✅ 100 worker profiles (randomized across 8 Indian cities)
- ✅ 60 active policies (60% conversion rate)
- ✅ 15 approved claims (20% claim rate)
- ✅ All linked with realistic data

---

### **Step 3: View Admin Dashboard Tabs**

Once data is injected, click through these admin tabs:

#### **1. Overview Tab**
- **KPIs:** Total workers, active policies, loss ratio, liquidity
- **System Status:** Risk engine, premium engine, fraud detection all green
- **Real-time feeds:** Claims processed, policies created, fraud alerts

#### **2. Risk Intelligence Tab**
- **Zone-based risk analysis:** Mumbai flood risk, Delhi AQI risk, etc.
- **Weather forecasts:** 7-day predictions from Open-Meteo
- **Active disruptions:** Current zones with ongoing floods/strikes
- **Historical incidents:** 3-year flood/strike data by city

#### **3. Claims & Payouts Tab**
- **Pending claims:** Show status, fraud scores, verification flags
- **Approved payouts:** UPI transaction status, retry logic
- **Rejected claims:** Reason codes, appeal options
- **Processing timeline:** Average time from trigger to UPI settlement

#### **4. Fraud Intelligence Tab**
- **Fraud alerts:** GPS anomalies, BSSID clustering, battery thermals
- **High-risk workers:** Workers with multiple flags
- **Syndicate detection:** Groups claiming from same WiFi
- **AI confidence scores:** CNN physics check, Transformer network analysis

#### **5. Premium & Actuarial Tab**
- **Dynamic pricing calculation:** Show formula breakdown
- **Expected loss by zone:** Risk-adjusted premiums
- **Resilience wallet status:** Accumulated savings per worker
- **AI rebate calculation:** Auto-rebates for accurate predictions

#### **6-7. Other Tabs**
- User Behavior, Trigger Engine, AI Model Monitoring, System Health, Financial Control, Security, Event Stream, Decision Engine

---

## Data Input Templates

### **Template 1: Manual Worker Registration**

```json
{
  "name": "Rajesh Kumar",
  "phone": "9876543210",
  "email": "rajesh@example.com",
  "platform": "Zomato",
  "vehicle": "2-Wheeler",
  "city": "Mumbai",
  "pincode": "400001",  // Key for zone risk mapping
  "avg_weekly_earnings": 6000,
  "gender": "Male",
  "dob": "1998-05-15"
}
```

### **Template 2: Auto-Generated Worker (Mock)**

```json
{
  "id": 1001,
  "name": "Worker_001",
  "phone": "98456789012",
  "platform": "Swiggy",
  "vehicle": "2-Wheeler",
  "city": "Mumbai",
  "zone": "Downtown Core",
  "pincode": "400001",
  "risk_tier": "High",
  "avg_weekly_earnings": 7500,
  "r_score": 87.3,
  "wallet_balance": 1200,
  "kyc_status": "Verified"
}
```

### **Template 3: Policy Creation**

```json
{
  "worker_id": 1001,
  "tier": "Pro",  // Base | Pro | Elite
  "accepted_terms": true,
  "coverage_amount": 3000,
  "premium_paid": 48
}
```

### **Template 4: Triggered Claim**

```json
{
  "policy_id": 501,
  "worker_id": 1001,
  "trigger_type": "Heavy Rain (>50mm/hr)",
  "trigger_value": 65,
  "gps_location": {"lat": 19.0176, "lon": 72.8479},
  "timestamp": "2026-04-04T15:30:00Z",
  "active_on_platform": true,
  "claim_amount": 2400  // 80% of avg weekly earnings
}
```

---

## Mock Data Generation Rules

### **Worker Distribution**

| City | Workers | Avg Earnings | Risk Profile |
|------|---------|--------------|--------------|
| Mumbai | 30% | ₹6,000-8,000 | High (floods, AQI) |
| Delhi | 20% | ₹5,000-7,000 | High (AQI, heat) |
| Bangalore | 15% | ₹7,000-10,000 | Low |
| Kolkata | 15% | ₹4,000-6,000 | Critical (floods) |
| Chennai | 10% | ₹5,000-7,000 | Medium |
| Other | 10% | Variable | Mixed |

### **Policy Conversion Rates**

- **Overall conversion:** 60% of registered workers buy policies
- **Tier distribution:**
  - Base (₹30/week): 30% of policyholders
  - Pro (₹48/week): 50% of policyholders
  - Elite (₹72/week): 20% of policyholders

### **Claim Rates**

- **Overall claim rate:** 20% of active policies
- **Status distribution:**
  - Approved: 70%
  - Pending Review: 20%
  - Rejected: 10%

### **Pricing Multipliers by Risk Tier**

| Zone Type | Multiplier | Example |
|-----------|-----------|---------|
| Low risk (Bangalore) | 0.9x | ₹27/week for Base |
| Medium risk (Chennai) | 1.1x | ₹33/week for Base |
| High risk (Mumbai, Delhi) | 1.3x | ₹39/week for Base |
| **Critical risk** (Kolkata) | **1.5x** | **₹45/week for Base** |

---

## Admin Portal Data API Endpoints

### **1. Quick Preview (No DB insertion)**

```bash
# Get mock data structure
GET http://localhost:8000/admin/mock-summary

# Get specific mock workers
GET http://localhost:8000/admin/mock-workers/50

# Get pool metrics and fraud alerts
GET http://localhost:8000/admin/mock-metrics
```

### **2. Bulk Injection (Inserts into DB)**

```bash
# Inject 100 workers + policies + claims
POST http://localhost:8000/admin/inject-mock-data?worker_count=100

# Inject 200 workers
POST http://localhost:8000/admin/inject-mock-data?worker_count=200
```

### **3. Analytics & KPIs**

```bash
# Already in ControlCenter - fetches from backend
GET http://localhost:8000/admin/analytics/overview
GET http://localhost:8000/admin/analytics/premium
GET http://localhost:8000/admin/analytics/fraud
GET http://localhost:8000/admin/analytics/liquidity
```

---

## Demo Mode: Instant Trigger Events

### **Trigger a Scenario (Live Demonstration)**

Use the **"Inject Scenario"** buttons in the Admin Portal:

1. **Flash Flood Scenario**
   - Sets weather to "Heavy Rain (>50mm/hr)"
   - AQI: 95, Traffic: Severe Congestion
   - All active workers in Mumbai get claims

2. **Civic Strike Scenario**
   - Sets weather to "Clear" but traffic to "City Lockdown/Curfew"
   - NLP model (DistilBERT) parses local news
   - Workers in East Industrial zone get claims

3. **Syndicate Attack Scenario**
   - GPS spatial anomalies: 15km in 3 seconds
   - Multiple claims on same BSSID
   - Fraud detection flags workers

**Watch in real-time:**
- Trigger engine locks open
- Fraud model scores spike
- Claims process in <10 seconds
- UPI payouts initiated

---

## Recommended Demo Sequence

### **5-Minute Demo:**

```
1. [0:00] Show login screen
   ↓
2. [0:30] Click "Admin / Insurer"
   ↓
3. [1:00] Inject 50 mock workers (POST /admin/inject-mock-data?worker_count=50)
   ↓
4. [1:30] Refresh Admin Dashboard → Show KPIs, loss ratio, liquidity
   ↓
5. [2:00] Click "Overview" tab → Show live feeds
   ↓
6. [3:00] Click "Inject Scenario" → Select "Flash Flood"
   ↓
7. [3:30] Watch claims auto-trigger in real-time
   ↓
8. [4:00] Click "Claims & Payouts" → Show approved payouts
   ↓
9. [4:30] Click "Fraud Intelligence" → Show zero false positives
   ↓
10. [5:00] End preview with "Weeks of Runway" calculation
```

---

## Government & Third-Party Data Sources

For **production deployment**, integrate these APIs:

### **Weather Data**
- **Open-Meteo** (Free): Historical + 7-day forecast
- **WAQI** (Free): Real-time AQI from monitoring stations
- **IMD** (Indian Meteorological Dept): Monsoon bulletins

### **Traffic & Civic Data**
- **Google Traffic API**: Real-time congestion levels
- **Twitter/News APIs**: Civic strike detection via NLP

### **Risk Data**
- **Guidewire HazardHub**: Historical flood/insurance data by pincode
- **Satellite Imagery**: Flood-affected zone detection (NASA FIRMS, Copernicus)

### **Network Data**
- **Google Play Integrity API**: Device attestation (rooted device detection)
- **Telecom operator APIs**: Cell tower/network outage detection

### **Bank Data**
- **NPCI Open API**: UPI transaction status & retry logic
- **Bank settlement APIs**: Real-time fund reconciliation

---

## Troubleshooting

### **Issue: Mock data endpoint returns 500 error**

```bash
# Check backend logs
tail -100 backend.log

# Verify mock_data_generator.py is imported
grep "from mock_data_generator" backend/main.py

# Restart backend
pkill -f uvicorn
cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000
```

### **Issue: Admin dashboard shows "No Data"**

```bash
# 1. Verify workers exist in database
curl http://localhost:8000/worker/1001

# 2. Inject mock data
curl -X POST http://localhost:8000/admin/inject-mock-data?worker_count=50

# 3. Refresh admin dashboard (hard refresh: Ctrl+Shift+R)
```

### **Issue: Claims not displaying in admin portal**

```bash
# Check if claims table has records
sqlite3 backend/aegis.db "SELECT COUNT(*) FROM claim;"

# If 0, inject data with claims
curl -X POST http://localhost:8000/admin/inject-mock-data?worker_count=100
```

---

## Phase 2 Submission Checklist

- [x] Admin Portal Functional
- [x] Mock Data Generation (50-500 workers)
- [x] Automated Claims Processing
- [x] Dynamic Premium Pricing
- [x] Fraud Detection Engine
- [x] Liquidity Pool Management
- [x] Loss Ratio Tracking
- [x] Zero-Touch Settlement Simulation
- [x] Demo Mode for Judges
- [x] Public Deployment Ready

---

**Next Steps:**
1. Run `POST /admin/inject-mock-data?worker_count=100`
2. Open http://localhost:5174 and click "Admin / Insurer"
3. Explore all 13 admin tabs
4. Click "Inject Scenario" for live demo
5. Monitor claims processing in real-time

