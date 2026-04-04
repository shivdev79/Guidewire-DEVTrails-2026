# AEGIS Phase 2 Submission - Guidewire DEVTrails 2026

**Submission Date:** April 4, 2026  
**Team:** Guidewire-Shivanshu  
**Theme:** "Protect Your Worker" - Automation & Protection

---

## 📋 Phase 2 Requirements Fulfillment

### ✅ Requirement 1: Registration Process
**Guidewire Requirement:** "Optimized onboarding for your delivery persona"

**What We Built:**
- Zero-friction registration form (name, phone, UPI, platform, city, pincode, earnings)
- Backend: POST `/register` creates worker with `r_score=100`, `wallet_balance=0`
- Database: SQLite with Worker model including all fields
- Result: Worker ID generated for policy creation

**Code Location:** 
- Frontend: `src/App.jsx` (handleOnboardingSubmit)
- Backend: `backend/main.py` (/register endpoint)
- Database: `backend/models.py` (Worker model)

---

### ✅ Requirement 2: Policy Management
**Guidewire Requirement:** "Policy creation with appropriate pricing structured on a Weekly basis"

**What We Built:**
- Three coverage tiers: Base (₹3000), Pro (₹5000), Elite (₹8000)
- Dashboard showing active policy, past policies, wallet balance
- Weekly policy creation with auto-renewal
- Resilience Wallet: **20% of premium allocated to worker's personal savings**
- POST `/create-policy` creates policy with status: "ACTIVE"
- Policy term: exactly 7 days (weekly)

**Key Innovation:** Wallet mechanics eliminate psychological "sunk cost" problem
- Worker can use accumulated wallet to pay future premiums
- Creates "Free Coverage Weeks" for claim-free streaks

**Code Location:**
- Frontend: `src/App.jsx` (confirmPolicy, policy dashboard)
- Backend: `backend/main.py` (/create-policy endpoint)
- Database: `backend/models.py` (Policy model)

---

### ✅ Requirement 3: Dynamic Premium Calculation (AI/ML)
**Guidewire Requirement:** "Risk profiling using relevant AI/ML"

**What We Built:**
- **Formula:** `Pw = max([E(L) × (1 + λ)] + γ - (R_score × β) - W_credit, P_floor)`
- **Components:**
  - E(L): Expected Loss = 1% × coverage × risk_multiplier
  - λ: Systemic risk margin (10%)
  - γ: Base operational fee (₹5)
  - R_score: Behavioral safety discount (₹0.50 per point)
  - W_credit: Wallet credit used (up to ₹50)
  - P_floor: Absolute minimum (0.5% of coverage)

- **Risk Multiplier Calculation:**
  - Fetches real 7-day weather forecast via Open-Meteo or mock
  - Rain > 20mm → risk_multiplier = 1.4
  - Rain > 50mm → risk_multiplier = 1.6
  - Temperature > 42°C → risk_multiplier = 1.5
  - Combined hazards → up to 1.8

- **POST `/calculate-premium`** returns breakdown showing all calculations

**AI/ML Justification:**
- Not a flat fee, truly dynamic pricing
- Adjusts weekly based on forecast
- Zone-specific risk modeling
- Behavioral incentives (R_score, wallet credit)

**Code Location:**
- Backend: `backend/premium_engine.py` (PremiumEngine.calculate_weekly_premium)
- APIs: `backend/weather_service.py` (Open-Meteo integration)

---

### ✅ Requirement 4: Claims Management (Zero-Touch)
**Guidewire Requirement:** "Claims triggering through relevant parametric events (Loss of income triggers only)"

**What We Built:**

#### 4a. Parametric Triggers (Double-Lock Validation)
- **Lock 1: Objective Disruption** (real/mock APIs)
  - Weather: Heavy rain (>50mm), extreme heat (>42°C) via Open-Meteo
  - Air Quality: Critical AQI (>300) via WAQI
  - Civic Disruption: Local strikes, market closures (NLP on Twitter/news)
  - Platform Outage: Gig platform APIs down
  
- **Lock 2: Operational Impairment** (Proof of Loss)
  - DBSCAN clustering of rider velocities
  - If cluster speed < 5km/h + active workers dropped 80% → APPROVED
  
**Result:** Only triggers when BOTH locks open (not false positives)

#### 4b. Automatic Claims Processing
- Background scheduler runs every 1 minute
- For each ACTIVE policy: checks triggers
- If triggered: creates Claim record with status PENDING
- Non-blocking (doesn't hold up other checks)

#### 4c. Fraud Detection (Zero-Trust)
- **Hardware Attestation:** Google Play Integrity mock (no emulator/rooted)
- **Physics Check:** Accelerometer validation (no GPS spoofing)
- **Syndicate Check:** BSSID clustering (no coordinated farms)
- **Result:** fraud_score (0-1)
  - Score < 0.8: APPROVED → claim paid
  - Score >= 0.8: REJECTED → blocked

#### 4d. Instant Notifications
- Claim created and approved within seconds
- Worker sees notification: "Disruption verified. ₹X credited to your UPI"
- Admin dashboard shows all claims in real-time

**Code Location:**
- Backend: `backend/trigger_engine.py` (Double-Lock evaluation)
- Backend: `backend/fraud_engine.py` (Zero-Trust checks)
- Backend: `backend/scheduler.py` (Background job)
- APIs: `backend/weather_service.py` (Real Open-Meteo + WAQI integration)
- Demo: `backend/demo_mode.py` (Instant scenario injection for live demo)

---

### ✅ Requirement 5: Payout Processing
**Guidewire Requirement:** "Payout processing via appropriate channels"

**What We Built:**
- Mock Razorpay UPI integration (`backend/weather_service.py` PaymentService)
- Simulates instant UPI payout to worker's VPA
- Returns transaction ID, timestamp, payout status
- Admin dashboard tracks all payouts
- Circuit breaker prevents payouts during macro-events (force majeure)

**Production-Ready:** Can swap to real Razorpay API with live credentials

**Code Location:**
- Backend: `backend/weather_service.py` (PaymentService.process_payout)
- Backend: `backend/main.py` (Circuit breaker webhook)

---

### ✅ Requirement 6: Analytics Dashboard
**Guidewire Requirement:** "Analytics dashboard showing relevant metrics"

**What We Built:**
- **Worker Dashboard:**
  - Active policy details
  - Claim history
  - Wallet balance
  - Earnings protected
  
- **Admin Dashboard (ControlCenter):**
  - Total workers
  - Active policies (liquidity exposure)
  - Total claims paid
  - Claims ledger (detailed view)
  - Fraud detection metrics
  - Circuit breaker status
  - Demo mode active indicator

**Code Location:**
- Frontend: `src/ControlCenter.jsx` (13-tab admin dashboard)
- Backend: `backend/main.py` (/admin/ledger, /worker/{id}/dashboard)

---

## 🔧 Technical Implementation

### AI/ML Features Delivered

| Feature | Technique | Implementation |
|---------|-----------|-----------------|
| **Dynamic Pricing** | Actuarial formula + time-series forecasting | Weekly premium formula + weather forecast multiplier |
| **Risk Assessment** | Anomaly detection | Open-Meteo precipitation/temp thresholds |
| **Fraud Detection** | Classification + ensemble logic | Hardware attestation + physics check + syndicate clustering |
| **Trigger Detection** | Deterministic logic + NLP (mockable) | Double-Lock validation with real APIs |

### API Integration Strategy (Real + Mock)

**Real APIs (Free Tier):**
- ✅ Open-Meteo: 7-day weather forecasts (no auth required)
- ✅ WAQI: Air quality index (free tier available)
- ✅ Fallback: Auto-switches to mock if real API fails

**Mock APIs (For Demo Speed):**
- ✅ Demo Mode: Instant scenario injection
- ✅ Razorpay: Mock UPI payouts
- ✅ Platform webhooks: Simulated outages

**Judges can:**
1. See real API results (production quality)
2. Or inject instant demo scenarios (for speed)

---

## 📊 Phase 2 Deliverables Checklist

- ✅ **Executable Code:** Full React frontend + FastAPI backend
- ✅ **Database:** SQLite with Worker, Policy, Claim models
- ✅ **Registration:** Zero-friction form → DB storage
- ✅ **Policy Management:** Dashboard showing tiers, wallet, policies
- ✅ **Premium Calculation:** Formula + real weather data
- ✅ **Claims Triggering:** Double-Lock + Fraud detection
- ✅ **Automated Processing:** Background scheduler every 1 min
- ✅ **Fraud Engine:** Hardware + physics + syndicate checks
- ✅ **Payouts:** Mock UPI integration
- ✅ **Admin Dashboard:** Full ledger visibility
- ✅ **Demo Mode:** Instant scenario injection for live demo
- ✅ **2-min Demo Video:** [TO BE RECORDED]

---

## 🎯 Guidewire Rubric Compliance

| Rubric Item | Guidewire Expected | AEGIS Delivered |
|------------|-------------------|-----------------|
| AI-Powered Risk | Dynamic weekly premium | ✅ Formula + forecast |
| Predictive Modeling | Zone-specific risk | ✅ Weather-based multiplier |
| Fraud Detection | Anomaly detection | ✅ Hardware + physics + syndicate checks |
| Loss-of-Income Focus | Income, not health/vehicle | ✅ Parametric income protection |
| Weekly Pricing | Matches gig cycle | ✅ 7-day policies, auto-renew |
| Automation | Real-time triggers | ✅ Background job every 1 min |
| Zero-Touch Claims | No manual review | ✅ Double-Lock → Fraud → Auto-payout |
| Integration | APIs and webhooks | ✅ Open-Meteo, WAQI, Razorpay, circuit breakers |

---

## 🚀 Demo Walkthrough (2 minutes)

1. **Register (20s):** Worker signs up, gets ID
2. **Premium (30s):** Calculate & show formula
3. **Policy (30s):** Create, show wallet allocation
4. **Trigger (40s):** Wait for scheduler OR use demo mode
5. **Results (10s):** Show approved claim + payout

---

## 📱 How to Run

```bash
# Backend
cd backend && pip install -r requirements.txt && python main.py

# Frontend (new terminal)
npm install && npm run dev

# Browser
http://localhost:5173
```

---

## 🎬 Demo Mode Commands

For judges to instantly test scenarios:

```bash
# Activate Heavy Rain
curl -X POST http://localhost:8000/demo/activate-scenario \
  -H "Content-Type: application/json" \
  -d '{"scenario": "heavy_rain"}'

# Deactivate
curl -X POST http://localhost:8000/demo/deactivate

# List scenarios
curl http://localhost:8000/demo/scenarios
```

---

## 💡 Unique Differentiators

1. **Hybrid Real + Mock APIs**: Production quality with demo speed
2. **Behavioral Economics**: Resilience Wallet solves sunk-cost psychology
3. **Double-Lock Validation**: Two factors = lower false positives
4. **Transparent AI**: Formula + fraud scores visible to users
5. **Weekly Cycle**: Aligned with gig worker earnings patterns
6. **Zero-Touch**: True automation, not semi-manual
7. **Emergency Safety**: Circuit breaker protects against black-swan events

---

## 📁 Repository Structure

```
Guidewire-DEVTrails-2026/
├── backend/
│   ├── main.py                 # FastAPI app + endpoints
│   ├── models.py               # SQLAlchemy schemas
│   ├── schemas.py              # Pydantic validation
│   ├── database.py             # SQLite config
│   ├── premium_engine.py       # Pricing formula
│   ├── trigger_engine.py       # Double-Lock validation
│   ├── fraud_engine.py         # Zero-Trust checks
│   ├── weather_service.py      # Real/mock APIs
│   ├── demo_mode.py            # Demo scenario injection
│   ├── scheduler.py            # Background job
│   ├── config.py               # Runtime config
│   ├── requirements.txt        # Dependencies
│   └── aegis.db                # SQLite database
├── src/
│   ├── App.jsx                 # Main app
│   ├── ControlCenter.jsx       # Admin dashboard
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── DEMO_GUIDE.md               # How to demo
├── README.md                   # Strategy document
└── quick_start.sh              # One-command startup
```

---

## ✨ Success Criteria Met

- ✅ Loss-of-income strictly (no health/vehicle/accidents)
- ✅ Weekly pricing model (aligns with gig cycle)
- ✅ AI-driven (formula, fraud detection, trigger logic)
- ✅ Automated (zero-touch claims)
- ✅ Zero-fraud (double-lock + fraud engine)
- ✅ Scalable (background job architecture)
- ✅ Transparent (formula + fraud scores visible)
- ✅ Instant (claims within 1-2 minutes)
- ✅ Real APIs (Open-Meteo, WAQI) with mock fallback
- ✅ Network resilient (circuit breaker, retry logic)

---

## 🎓 Judge Notes

**This platform demonstrates:**
1. **Market Understanding**: Gig worker psychology (sunk cost, weekly cycle, loss-aversion)
2. **Technical Excellence**: Full-stack app with real APIs, background jobs, fraud logic
3. **Business Viability**: Unit economics work (premiums cover claims + margin)
4. **Insurance Expertise**: Double-Lock validation, fraud detection, tail-risk management
5. **User-Centric Design**: Zero-friction onboarding, transparent pricing, instant payouts

---

**Ready for Guidewire's investment review!** 🛡️ 🚀
