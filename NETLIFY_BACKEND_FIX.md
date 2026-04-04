# 🚀 Netlify Backend Configuration - DEPLOYMENT FIX

## ❌ Problem
Frontend on Netlify cannot reach backend API:
- Deploy preview shows: "Deploy failed" for Header/Redirect rules
- Admin console shows: API 404/CORS errors
- Backend URL is hardcoded or missing environment variable

## ✅ Solution

### Step 1: Deploy Backend to Production

Choose ONE platform and follow instructions:

---

#### **OPTION A: Railway (RECOMMENDED - Easiest)**

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy Backend:**
   ```bash
   cd /Users/marthanda/Downloads/Guidewire_Shivanshu/Guidewire-DEVTrails-2026/backend
   railway init
   railway deploy
   ```

3. **Get Backend URL:**
   ```bash
   railway status
   # Copy the URL shown (e.g., https://your-app.railway.app)
   ```

---

#### **OPTION B: Heroku**

1. **Create Heroku Account & Install CLI:**
   ```bash
   # Go to https://www.heroku.com
   # Create account
   brew tap heroku/brew && brew install heroku
   heroku login
   ```

2. **Deploy:**
   ```bash
   cd /Users/marthanda/Downloads/Guidewire_Shivanshu/Guidewire-DEVTrails-2026
   heroku create guidewire-backend
   git subtree push --prefix backend heroku main
   ```

3. **Get Backend URL:**
   ```bash
   heroku apps:info guidewire-backend
   # Copy the URL (e.g., https://guidewire-backend.herokuapp.com)
   ```

---

#### **OPTION C: Render (FREE TIER)**

1. **Go to:** https://render.com/dashboard
2. **Click:** "New +" → "Web Service"
3. **Connect Repository:** Select `Guidewire-DEVTrails-2026`
4. **Configure:**
   - **Name:** `guidewire-backend`
   - **Environment:** `Python 3`
   - **Build Command:** 
     ```
     pip install -r backend/requirements.txt
     ```
   - **Start Command:**
     ```
     cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
5. **Deploy:** Click "Create Web Service"
6. **Get Backend URL:** Shows on dashboard (e.g., https://guidewire-backend.onrender.com)

---

### Step 2: Configure Netlify Environment Variables

1. **Go to:** https://app.netlify.com/sites/aegisfct/settings/deploys

2. **Click:** "Environment" → "Edit variables"

3. **Add Variable:**
   ```
   Key: VITE_API_BASE_URL
   Value: https://your-backend-url.com
   ```
   (Replace with YOUR actual backend URL from Step 1)

4. **Save & Deploy:**
   - Click "Trigger deploy" or push to main branch
   - Wait for build to complete

---

### Step 3: Verify Deployment

1. **Visit Production Site:**
   ```
   https://aegisfct.netlify.app
   ```

2. **Test Admin Console:**
   - Click "Admin Dashboard"
   - Navigate to "Trigger Engine" tab
   - Select city + click trigger button
   - Should show: "✅ X workers affected, ₹Y total payout"

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Console tab
   - Should have NO 404/CORS errors

---

## 📋 Environment Variables Guide

### Local Development (.env.local)
```
VITE_API_BASE_URL=http://localhost:8000
```

### Production (.env.production)
```
VITE_API_BASE_URL=https://your-production-backend.com
```

### Netlify UI
**Site Settings → Environment Variables:**
```
VITE_API_BASE_URL = https://your-production-backend.com
```

---

## 🔧 Troubleshooting

### Issue: Still getting 404 errors
**Solution:** 
- Verify backend URL is correct and accessible
- Test: `curl https://your-backend-url/admin/ledger`
- Should return JSON with worker data

### Issue: CORS errors
**Solution:**
- Backend must have CORS enabled (already configured in main.py)
- Check browser console for exact error
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: Deploy still failing
**Solution:**
1. Clear Netlify cache:
   - Go to Site Settings → Deploys → Build & deploy
   - Click "Trigger deploy" with "Clear cache"

2. Rebuild assets locally:
   ```bash
   npm run build
   npm run build:preview
   ```

3. Check build logs on Netlify dashboard

---

## 📊 Deployed Architecture

```
┌─────────────────────────────────────────┐
│   User Browser                           │
│   https://aegisfct.netlify.app          │
└──────────────┬──────────────────────────┘
               │
               │ (API calls via VITE_API_BASE_URL)
               ▼
    ┌──────────────────────────┐
    │  FastAPI Backend          │
    │  https://your-url.com     │
    │  - /admin/trigger-event   │
    │  - /admin/ledger          │
    │  - /worker/{id}/dashboard │
    └──────────────────────────┘
               │
               ▼
        ┌─────────────┐
        │  Database   │
        │  test.db    │
        └─────────────┘
```

---

## 📝 Files Modified

1. **netlify.toml** - Added CORS headers, API environment variable
2. **public/_redirects** - Already correct
3. **.env.local** - Local development URL
4. **.env.production** - Production template
5. **src/ControlCenter.jsx** - Fixed to use env variable

---

## ✅ Deployment Checklist

- [ ] Backend deployed to production platform
- [ ] Backend URL working (curl test passes)
- [ ] VITE_API_BASE_URL set in Netlify environment
- [ ] Frontend re-deployed (manual trigger or push to main)
- [ ] Admin dashboard loads without errors
- [ ] Trigger engine buttons work and create claims
- [ ] Worker dashboards show new claims
- [ ] Wallet balances updated correctly

---

## 📞 Getting Backend URL

### Railway
```bash
railway status | grep "URL:"
```

### Heroku
```bash
heroku apps:info guidewire-backend | grep "Web URL"
```

### Render
Check dashboard at https://render.com/dashboard

---

## 🎯 Quick Start Command

After deploying backend, run this to test:

```bash
# Test backend is working
curl https://your-backend-url/admin/available-triggers

# Should return: {available_locations: [...], available_triggers: [...]}
```

---

**Status:** Ready to deploy! 🚀

Follow the steps above and your backend will be connected to Netlify.
