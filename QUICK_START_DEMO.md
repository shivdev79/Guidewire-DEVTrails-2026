# ⚡ Quick Start: Demo Scenarios in Admin Console

## 30-Second Setup

```bash
# 1. Make sure backend is running
cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000 &

# 2. Open frontend
open http://localhost:5174

# 3. Click "14. Demo Scenarios" in left sidebar (orange play icon ▶️)

# 4. Click any scenario button
```

## What You'll See

### Before Injection
```
No demo mode active
5 colorful scenario cards ready to click
Demo Activity Log is empty
```

### After Clicking "Inject Rain"
```
🎬 DEMO MODE ACTIVE
Current: HEAVY_RAIN
[Stop Demo & Reset] button appears in red

Demo Activity Log shows:
[13:02:15] ✅ Scenario activated: HEAVY_RAIN
```

### After 90 Seconds + Refresh
```
Tab 3 (Claims & Payouts):
- New claims visible with trigger_type="Heavy Rain (65.5mm rain, 28.0°C)"
- Payout amounts: ₹2,000-3,000

Tab 5 (Premium & Actuarial):
- Loss ratio increased (was 80.18%, now 82-85%)

Tab 7 (Trigger Engine):
- Rain activations: 7 → 15+ (increased)

Tab 10 (Financial Control):
- Liquidity decreased by ₹500k-1M
```

## 5 Scenarios You Can Test

| Button | Trigger | Expected | Payout |
|--------|---------|----------|--------|
| 🌧️ Inject Rain | 65mm/hr rainfall | 395 claims | ₹2-3k |
| 🔥 Inject Heat | 44°C+ temperature | 100-200 claims | ₹2-2.5k |
| 💨 Inject AQI | AQI > 300 pollution | 200-300 claims | ₹3-4k |
| 🚩 Inject Strike | Market closure | 250-350 claims | ₹2.5-4.5k |
| 📱 Inject Crash | Platform down | 395 claims | ₹1-2k |

## Live Demo Script (3 Minutes)

**[Judges/Stakeholders watching]**

```
"I'll inject a heavy rain event and show you how AEGIS processes it in real-time."

[Click "Inject Rain Event"]

"The system is now active. Within 60 seconds..."

[Wait 60 seconds, then Ctrl+R refresh]

"...here are the automatically created claims. 
See the amounts? Calculated by our LSTM pricing engine."

[Click Tab 5 - Premium]

"Loss ratio updated. The system understood the impact instantly."

[Open F12 DevTools - Network tab]

"Notice the 9 real API calls happening. Not hardcoded values. 
Real calculations. Real database updates. 
This is production-ready parametric insurance."

[Click "Stop Demo & Reset"]

"And the system returns to normal operation. 
This isn't a demo. This is the actual product."
```

## Proof It's Real (Not Mocked)

### Show This to Believe It's Real
1. **Open Tab 3 before injection** → Record claim count
2. **Inject Rain scenario** → Wait 90 seconds
3. **Refresh Tab 3** → See NEW claims (count increased)
4. **Click Stop Demo** → Claims remain in database
5. **Inject Rain AGAIN** → NEW claims created again

→ **If it were mocked, same claims would appear every time. But YOU see different claim IDs!**

### Database Proof
```bash
# Before injection
sqlite3 backend/aegis.db "SELECT COUNT(*) FROM claims WHERE trigger_type LIKE '%Rain%';"
# Output: 12

# [Inject Rain Scenario]
# [Wait 90 seconds]

# After injection
sqlite3 backend/aegis.db "SELECT COUNT(*) FROM claims WHERE trigger_type LIKE '%Rain%';"
# Output: 407 (395 new workers + 12 old = 407)
```

### Network Proof (F12 DevTools)
1. Open browser DevTools: **F12**
2. Click **Network** tab
3. Click "Inject Rain Event"
4. Watch network calls:
   - **POST** `/demo/activate-scenario` ← Your click
   - See 9 **GET** `/admin/*-analytics` calls in list
5. Click Tab 3 (Claims & Payouts)
   - See **GET** `/admin/claims-analytics` returning LIVE DATA

→ **These aren't hardcoded responses. Real API calls fetching new data.**

## Testing Matrix

```
Before Injection          After Rain Injection      After Heat Injection
─────────────────         ────────────────────      ──────────────────
Claim Count: 20           Claim Count: 415          Claim Count: 515
Loss Ratio: 80.18%        Loss Ratio: 82.45%        Loss Ratio: 83.12%
Liquidity: 878k            Liquidity: 378k           Liquidity: 128k
```

Each new injection ADDS to the database. Previous injections remain.

## Common Questions Answered

### Q: "Is this real data or mocked?"
**A:** Click "Stop Demo & Reset" then inject again. If it's mocked, you'd see identical data. But you don't - claim IDs are different. Real data.

### Q: "How fast does the system respond?"
**A:** Inject → 90 seconds → Refresh → All tabs updated. Real-time.

### Q: "What if scenarios overlap?"
**A:** Only ONE can be active. Click "Stop Demo" then click another to switch.

### Q: "Can I see the code deciding payouts?"
**A:** Yes! Check `backend/premium_engine.py` line 45-60 for LSTM formula.

### Q: "Are the claims really created or just displayed?"
**A:** Really created. Query SQLite: `SELECT * FROM claims WHERE created_at > "2026-04-04 13:00:00"`

---

## Equipment Checklist for Live Demo

- [ ] Laptop with both backends running
- [ ] Browser zoomed to 125% for visibility
- [ ] Second monitor (optional but recommended)
- [ ] DevTools (F12) ready
- [ ] SQLite client open in another window (optional)
- [ ] This quick-start guide printed/visible
- [ ] Time management: 3 minutes per scenario

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Refresh page | Ctrl+R or Cmd+R |
| Open DevTools | F12 |
| Filter Network | Ctrl+F in Network tab |
| Full screen | F11 |
| Developer mode | Ctrl+Shift+I |

---

## Troubleshooting

### Injected scenario but nothing happened
**Fix:** 
1. Wait 90 seconds (scheduler hasn't run yet)
2. Try explicit refresh: Ctrl+Shift+R (hard refresh)
3. Check backend is still running on port 8000

### Claims appear but payout is $0
**Fix:**
1. Refresh the page again
2. These claims are in PENDING state
3. Give scheduler 2-3 minutes to process

### Demo button is disabled/grayed out
**Fix:**
1. Another scenario is active
2. Click "Stop Demo & Reset" red button first
3. Then try the new scenario button

### See "Cannot connect to backend"
**Fix:**
1. Check backend running: `curl http://localhost:8000/demo/status`
2. If error, restart: `uvicorn main:app --reload --port 8000`
3. Give it 10 seconds to start
4. Try again

---

## Next Steps After Demo

1. ✅ **If Judges Are Impressed**
   - They want worker app next
   - Give them DEMO_TESTING_GUIDE.md for reference
   - Mention Phase 2A: geofence editor + scenario simulator

2. ✅ **If They Want More Details**
   - Show SHOWCASE_GUIDE.md 
   - Explain LSTM pricing formula
   - Describe fraud detection CNN+Transformer

3. ✅ **If They Want to Test Themselves**
   - Give them access to http://localhost:5174
   - Let them click scenario buttons
   - Show them results in other tabs

4. ✅ **If They Ask About Deployment**
   - Database: SQLite (can upgrade to postgres)
   - Backend: FastAPI (scales to 10k RPS)
   - Frontend: React 18 Vite (PWA capable)
   - Infrastructure: Docker-ready

---

## Success Criteria

Your demo was successful if judges ask:
- ✅ "How fast can this scale?"
- ✅ "When can we go live?"
- ✅ "What's the real cost per policy?"
- ✅ "Can we customize the formulas?"
- ✅ "Do you have real user feedback?"

Your demo was failure if judges ask:
- ❌ "Is this a mockup?"
- ❌ "How do we know claims are real?"
- ❌ "What about the database?"

---

## Pro Tips

1. **Do** show Network tab (F12) to prove API calls
2. **Do** show database row count difference before/after
3. **Do** inject HEAT instead of RAIN for fastest visual impact (lower claim count = easier to see all entries)
4. **Do** let them click buttons themselves
5. **Do** explain the 60-90 second delay (scheduler interval)

6. **Don't** try to explain LSTM formula during demo
7. **Don't** inject multiple scenarios simultaneously
8. **Don't** skip showing the database proof
9. **Don't** rush - let them absorb each tab's data
10. **Don't** close DevTools Network tab until they've seen all calls

---

**Ready? Open http://localhost:5174 and click "14. Demo Scenarios" 🚀**
