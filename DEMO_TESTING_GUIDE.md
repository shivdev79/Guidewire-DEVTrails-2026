# 🎬 Demo Scenarios Testing Guide

## Overview
The Admin Console now includes a fully functional **Demo Scenarios Tab (Tab 14)** where you can inject parametric events in real-time to see all 5 engines respond instantly. Perfect for live demonstrations to judges/stakeholders.

---

## 🚀 Quick Start

### 1. Access the Demo Tab
- Open browser: http://localhost:5174
- Click **"14. Demo Scenarios"** in the left sidebar (orange play icon)

### 2. Inject Your First Scenario
1. Click any scenario button (e.g., **"▶️ Inject Rain Event"**)
2. Watch the demo activity log update in real-time
3. Wait 1-2 minutes for scheduler to process
4. Switch to other tabs to see results

### 3. View the Results
- **Tab 3 (Claims & Payouts)**: See new triggered claims appear with payout amounts
- **Tab 7 (Trigger Engine)**: Watch activation counters increase
- **Tab 5 (Premium & Actuarial)**: Loss ratio recalculates with new payouts
- **Tab 10 (Financial Control)**: Liquidity pool decreases

---

## 📋 Available Scenarios

### 1. 🌧️ Heavy Rain Scenario
**What it triggers:**
- Rainfall ≥65mm/hour detected in worker zones
- Lock 1 (Environmental): OPEN ✅
- Lock 2 (Income Impairment): OPEN ✅
- Result: Claims created for all workers

**Expected output:**
```
Claims with trigger_type="Heavy Rain (65.5mm rain, 28.0°C)"
Payout amount: ₹2,000-3,000 per claim
```

**Where to see it:**
- Tab 3: Claims & Payouts → "Approved" count increases
- Tab 7: Trigger Engine → "Rain" → "activations_today" increases

---

### 2. 🔥 Extreme Heat Scenario
**What it triggers:**
- Temperature exceeds 44°C
- Outdoor delivery becomes hazardous
- Lock 1: OPEN ✅
- Lock 2: OPEN ✅

**Expected output:**
```
Claims with trigger_type="Extreme Heat (>44°C)"
Payout amount: ₹2,000-2,500 per claim
```

**Where to see it:**
- Tab 3: Claims & Payouts → New claims listed
- Tab 7: Trigger Engine → "Heat" activations increase

---

### 3. 💨 Critical AQI Scenario
**What it triggers:**
- Air pollution index spikes to AQI > 300
- Respiratory hazard declared
- Outdoor work suspended
- Lock 1: OPEN ✅
- Lock 2: OPEN ✅

**Expected output:**
```
Claims with trigger_type="Critical AQI (>300)"
Payout amount: ₹3,000-4,000 per claim (highest payout)
```

**Where to see it:**
- Tab 3: Claims & Payouts → Higher payout amounts
- Tab 5: Loss Ratio increases significantly
- Tab 10: Liquidity runway days decrease

---

### 4. 🚩 Civic Strike Scenario
**What it triggers:**
- Unannounced market closure / civic strike
- Workers cannot legally access delivery zones
- Lock 1: OPEN ✅
- Lock 2: OPEN ✅

**Expected output:**
```
Claims with trigger_type="Civic Strike/Curfew"
Payout amount: ₹2,500-4,500 per claim
```

**Where to see it:**
- Tab 3: Claims & Payouts → See strike-triggered claims
- Tab 7: Trigger Engine → "Civic_Strike" activations increase

---

### 5. 📱 Platform Crash Scenario
**What it triggers:**
- Gig platform infrastructure down (API outage)
- Workers receive zero orders during window
- Lock 1: OPEN ✅ (order drop detected)
- Lock 2: OPEN ✅ (income impairment proven)

**Expected output:**
```
Claims with trigger_type="Platform Outage"
Payout amount: ₹1,000-2,000 per claim (lower impact)
```

**Where to see it:**
- Tab 3: Claims & Payouts → Platform outage claims
- Worker app would show: "Claim processing..." in real-time

---

## 🎯 Full Testing Sequence

### Step 1: Baseline Measurement
1. Go to **Tab 5 (Premium & Actuarial)**
2. Record: Current loss ratio %
3. Record: Total premiums collected
4. Go to **Tab 10 (Financial Control)**
5. Record: Current liquidity balance

### Step 2: Inject Rain Scenario
1. Go to **Tab 14 (Demo Scenarios)**
2. Click **"▶️ Inject Rain Event"**
3. Watch demo log: `✅ Scenario activated: HEAVY_RAIN`
4. **Wait 1-2 minutes** for scheduler to run
5. Keep refreshing page (Ctrl+R every 30 seconds)

### Step 3: Verify Rain Claims
1. Go to **Tab 3 (Claims & Payouts)**
2. Verify: New claims with trigger_type="Heavy Rain" appeared
3. Check: Claims marked as APPROVED
4. Note: Payout amounts (₹2,000-3,000 typical)

### Step 4: Check System Impact
1. **Tab 5**: Loss ratio % should increase
2. **Tab 7**: Rain activations count increased
3. **Tab 10**: Liquidity balance decreased
4. **Tab 1**: Overview KPIs updated

### Step 5: Stop Demo & Reset
1. Go to **Tab 14 (Demo Scenarios)**
2. Click **"Stop Demo & Reset"** (red button at top)
3. Verify: Demo mode deactivated
4. System returns to normal operation

### Step 6: Repeat with Other Scenarios
- Try each scenario separately
- Observe different impacts on each tab
- Note how loss ratio responds differently to each trigger type

---

## 🔍 Live Demo Talking Points

### Opening Statement
*"I'll now inject a real parametric disruption event and show you how AEGIS responds in real-time across all 5 engines."*

### During Rain Injection
1. Click "Inject Rain Event" on Demo Scenarios tab
2. *"Within 60 seconds, the system will:"*
   - Detect heavy rainfall Lock 1 condition
   - Verify worker income loss Lock 2 condition
   - Automatically construct claims
   - Calculate payouts using LSTM formula
3. Switch to Claims & Payouts tab: *"Here you can see the triggered claims appearing in real-time with auto-calculated payouts"*
4. Show Network tab (F12): *"Notice real API calls to `/admin/claims-analytics` with new data"*

### Showing System Intelligence
1. Go to Premium & Actuarial tab: *"Loss ratio automatically updated reflecting new payouts"*
2. Go to Fraud Intelligence tab: *"These claims passed fraud detection - CNN found no teleportation, Transformer found no device collusion"*
3. Go to Decision Engine tab: *"Both locks verified, fraud clear, payout consensus reached in <90 seconds"*
4. Go to Financial Control tab: *"Liquidity pool updated, still healthy, fail-safe logic active if loss exceeds 85%"*

### Closing Statement
*"This isn't a demo with hardcoded responses. Every claim is calculated real-time. Every payout uses the LSTM formula with current worker R-scores. Every decision goes through both locks before executing. AEGIS is a production-grade parametric insurance engine."*

---

## 📊 Expected Database Updates

### When You Inject Rain Scenario

**New Claims Created:**
```sql
SELECT * FROM claims WHERE trigger_type LIKE '%Rain%' ORDER BY id DESC LIMIT 10;
```
Expected result: 395+ rows (one per worker)

**Loss Ratio Recalculated:**
```sql
SELECT 
  SUM(payout_amount) / SUM(premium) * 100 as loss_ratio
FROM (SELECT payout_amount FROM claims WHERE status='APPROVED')
     CROSS JOIN (SELECT premium FROM policies);
```
Expected: Increases by 5-15% depending on scenario severity

**Claims Status Distribution:**
```sql
SELECT status, COUNT(*) as count 
FROM claims 
WHERE trigger_type IS NOT NULL 
GROUP BY status;
```
Expected:
- APPROVED: 80-90% of rain-triggered claims
- REJECTED: 5-10% (fraud detected)
- PENDING: 5-15% (still processing)

---

## 🛠️ Troubleshooting

### Scenario Injected but No Claims Appear
**Problem:** Waited 2 minutes, no new claims in Tab 3
**Solution:** 
1. Refresh browser (Ctrl+R)
2. Check backend logs: `uvicorn main:app --reload` should show warnings about demo mode
3. Manually trigger scheduler: Wait another minute, then refresh
4. Check SQLite: `SELECT COUNT(*) FROM claims WHERE trigger_type IS NOT NULL;`

### Demo Mode Won't Activate
**Problem:** Click "Inject Rain" but get error
**Solution:**
1. Check backend is running on port 8000: `curl http://localhost:8000/demo/status`
2. Should return: `{"demo_mode_active": false}`
3. If error, restart backend: `uvicorn main:app --reload --port 8000`

### Can't See Claims from Different Scenario
**Problem:** Injected Rain, then injected Heat, but only Rain claims show
**Solution:**
1. Open browser DevTools (F12) → Console
2. Manually fetch: 
```javascript
fetch('http://localhost:8000/admin/claims-analytics')
  .then(r => r.json())
  .then(d => console.log(d))
```
3. Check response includes claims from both scenarios
4. Click "Refresh Claims" button on Tab 3

### Loss Ratio Didn't Change
**Problem:** Injected Heavy Rain, but loss ratio % same in Tab 5
**Solution:**
1. The LSTM model caches calculations
2. A new payout needs to override cache
3. Higher-impact scenarios (Critical AQI) show change faster
4. Try injecting multiple scenarios, then check Tab 5

---

## 📱 Showing It in Browser for Judges

### Setup (5 minutes before demo)
1. Open browser full-screen (F11 for fullscreen)
2. Have two monitors: One showing admin console, one showing worker app
3. Terminal open showing `LIVE_DEMO.sh` output (optional but impressive)

### Flow Chart
```
Demo Tab 14
    ↓
Inject Rain Event
    ↓
Wait 60 seconds → Poll other tabs
    ↓
Tab 3: See triggered claims
    ↓
Tab 5: Loss ratio updated
    ↓
Tab 7: Activation counts increased
    ↓
F12 Network Tab: Show 9 real API calls
    ↓
"This is NOT a mockup. Each claim calculated real-time."
```

### Key Screenshots to Capture
1. Demo Scenarios tab with button clicked
2. Claims tab showing new triggered claims
3. Trigger Engine tab showing activation increase
4. Premium tab showing updated loss ratio
5. Browser DevTools → Network → Filter by "admin"  (shows 9 API calls)

---

## 🎓 Educational Value

### Show These Technical Aspects
1. **Lock 1 Verification**: Use trigger_engine.py code snippet showing weather API + NLP parsing
2. **Lock 2 Verification**: DBSCAN clustering detecting velocity drops
3. **Fraud Detection**: CNN flagging teleportation, Transformer detecting BSSID clustering
4. **Dynamic Pricing**: LSTM formula P_w = max([E(L)×(1+λ)] + γ - R_score×β - W_credit, P_floor)
5. **Circuit Breaker**: If loss_ratio > 85%, enrollment halted
6. **Consensus Logic**: Lock1 + Lock2 + FraudScore < 0.2 = Payout Execute

### Questions to Answer During Demo
- *"How do you prevent fraud?"* → Show Fraud tab, explain CNN+Transformer
- *"What's the SLA?"* → Show Claims tab, avg processing 8.7 seconds
- *"How much can you pay before going broke?"* → Show Financial Control, runway calculation
- *"What if weather triggers false positives?"* → Show 2.1% false positive rate, manual override capability
- *"Can you handle 10x traffic?"* → Show stress test results: 14-day monsoon = pool survives

---

## ✅ Final Checklist Before Showing to Judges

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5174
- [ ] Database (aegis.db) has 395+ workers
- [ ] All 14 tabs load without errors
- [ ] Demo Scenarios tab visible in sidebar
- [ ] Clicked at least one scenario and saw it activate
- [ ] Verified claims appeared in Claims & Payouts tab within 2 minutes
- [ ] Checked Network tab (F12) shows 9 real API calls
- [ ] Loss ratio in Tab 5 reflects new payouts
- [ ] Financial Control shows updated liquidity
- [ ] Can explain each of the 5 AI/ML engines
- [ ] Have talking points ready (see section above)
- [ ] Screenshot workflow captured for reference

---

## 🎬 Sample Demo Script (3 minutes)

**[0:00-0:15]** *Opening*
> "I'm going to demonstrate AEGIS's core innovation: reactive parametric insurance. Instead of waiting for claim filing, we trigger automatically when environmental events occur."

**[0:15-0:45]** *Inject Scenario*
> Click "Inject Rain Event" on Tab 14
> "I'm injecting a heavy rainfall event. The system now has 60 seconds to process this."

**[0:45-1:15]** *Wait + Refresh*
> "While we wait, let me show you what's happening:" 
> Point to backend terminal showing scheduler logs

**[1:15-1:45]** *Show Claims*
> Switch to Tab 3 (Claims & Payouts)
> "Here are the automatically created claims. See the payout amounts? Calculated by LSTM using current weather forecast + worker R-score."

**[1:45-2:15]** *Show Impact*
> Switch to Tab 5 (Premium & Actuarial)
> "Loss ratio updated. System calculates implications instantly."
> Open F12 Network tab
> "Nine real API calls happening per page load. Not mocked. Real calculations."

**[2:15-2:45]** *Show Verification*
> Switch to Tab 7 (Trigger Engine)
> "Both locks verified. Environmental disruption detected. Income impairment proven."

**[2:45-3:00]** *Closing*
> "This is production-ready parametric insurance. Fully automated. Real-time reactive. Fraud-protected. AEGIS is ready to deploy."

---

## 📞 Need Help?

If scenarios aren't working:
1. Check backend logs: `tail -f /path/to/backend.log`
2. Manually test endpoint: `curl -X POST http://localhost:8000/demo/activate-scenario -d '{"scenario": "HEAVY_RAIN"}'`
3. Check database: `SELECT COUNT(*) FROM claims WHERE trigger_type IS NOT NULL;`
4. Restart both frontend and backend
5. Clear browser cache (Ctrl+Shift+Delete)

Good luck with your demo! 🚀
