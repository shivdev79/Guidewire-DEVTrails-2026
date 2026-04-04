# ⚙️ NETLIFY ENVIRONMENT VARIABLES - SETUP GUIDE

## 🎯 Problem You're Trying to Solve
- Frontend on Netlify deployed ✅
- Backend API deployed separately ✅
- BUT Frontend can't find Backend ❌

**Solution:** Set `VITE_API_BASE_URL` environment variable in Netlify

---

## 📋 Step-by-Step: Netlify Environment Setup

### 1️⃣ Go to Netlify Site Settings

```
https://app.netlify.com/sites/aegisfct/settings/general
```

Or:
1. Open https://netlify.com
2. Go to your site "aegisfct"
3. Click **"Site settings"** button

---

### 2️⃣ Navigate to Environment Variables

**Left Sidebar:**
1. Look for **"Build & deploy"**
2. Click **"Environment"**

**Or Direct Link:**
```
https://app.netlify.com/sites/aegisfct/settings/deploys#environment
```

---

### 3️⃣ Add New Environment Variable

Click **"Add environment variable"** or **"Edit variables"**

**Form:**
```
Key: VITE_API_BASE_URL
Value: https://your-backend-url.com
```

⚠️ **IMPORTANT:** Replace `https://your-backend-url.com` with YOUR actual backend URL!

### Examples:
- Railway: `https://guidewire-backend-prod.railway.app`
- Heroku: `https://guidewire-backend.herokuapp.com`
- Render: `https://guidewire-backend.onrender.com`

---

### 4️⃣ Save & Trigger Deploy

1. Click **"Save"**
2. Go to **"Deploys"** tab
3. Click **"Trigger deploy"** → **"Deploy site"**

Wait for build to complete (usually 2-3 minutes)

---

## 📊 Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_BASE_URL` | Backend API endpoint | `https://api.yourdomain.com` |
| `NODE_ENV` | Build mode | `production` |
| `NODE_VERSION` | Node.js version | `18` |

---

## ✅ Verify It's Working

### Test 1: Check Build Logs
1. Go to **Deploys** tab
2. Click latest deploy
3. Scroll down to **Build log**
4. Search for "VITE_API_BASE_URL"
5. Should show: `VITE_API_BASE_URL = https://your-backend-url.com`

### Test 2: Visit Deployed Site
```
https://aegisfct.netlify.app
```

Open Developer Tools (F12):
- **Application** tab
- Check **"Environment Variables"** section
- Should show `VITE_API_BASE_URL` with your backend URL

### Test 3: Try Admin Console
1. Click **"Admin Dashboard"** button
2. Navigate to **"Trigger Engine"** tab
3. Try clicking a trigger button
4. Should work without 404 errors

### Test 4: Check Network Requests
1. Open DevTools (F12)
2. Go to **Network** tab
3. Click trigger button
4. Look for API call to `/admin/trigger-event`
5. Should show **Status 200** (not 404)

---

## ❌ Troubleshooting

### Problem: Still showing localhost in site
**Solution:**
- Clear Netlify cache:
  - Go to **Deploys** → **Trigger deploy** → Check **"Clear cache"**
  - Click **"Deploy site"**
  - Wait 3 minutes for rebuild

### Problem: 404 on API calls
**Solution:**
- Verify backend URL is correct:
  ```bash
  # Test from terminal
  curl https://your-backend-url/admin/ledger
  
  # Should return JSON, not 404
  ```
- If 404, your backend URL is wrong or backend isn't running

### Problem: CORS errors
**Solution:**
- This is usually fixed by having backend deployed properly
- Check that backend has CORS enabled (it does by default)
- Try in incognito/private mode browser

### Problem: Environment variable not showing
**Solution:**
- Make sure you **clicked "Save"**
- Trigger a new deploy **after** saving
- Wait for build to complete
- The variable only applies to that deploy onwards

---

## 🔍 Environment Variable Deep Dive

### What Is VITE_API_BASE_URL?

When you build your React app with Vite, it looks for environment variables:

`src/ControlCenter.jsx`
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:8000`;
```

This means:
1. **Try to use** `VITE_API_BASE_URL` if it's set
2. **Otherwise fallback** to `http://current-domain:8000`

### How It Works

**Development:**
- `.env.local` sets: `VITE_API_BASE_URL=http://localhost:8000`
- Frontend talks to: `http://localhost:8000` ✅

**Production:**
- Netlify environment sets: `VITE_API_BASE_URL=https://your-backend.com`
- Frontend talks to: `https://your-backend.com` ✅

---

## 📝 Quick Reference

### Find Your Backend URL

**Railway:**
```bash
railway status
```
Look for "URL:" line

**Heroku:**
```bash
heroku apps:info guidewire-backend
```
Look for "Web URL"

**Render:**
Visit https://render.com/dashboard and check your service

---

## 🎯 Complete Workflow

1. ✅ Deploy backend to production platform
2. ✅ Copy backend URL
3. ✅ Open Netlify → Environment settings
4. ✅ Add `VITE_API_BASE_URL = your-backend-url`
5. ✅ Trigger deploy
6. ✅ Wait 3-5 minutes
7. ✅ Visit https://aegisfct.netlify.app
8. ✅ Test admin console trigger engine
9. ✅ 🎉 Celebrate!

---

## 📞 Need Help?

If it's still not working:

1. **Check backend is running:**
   ```bash
   curl https://your-backend-url/admin/ledger
   ```

2. **Check Netlify has the variable:**
   - Go to Site settings → Environment
   - Verify `VITE_API_BASE_URL` is there

3. **Check browser console:**
   - F12 → Console tab
   - Look for API endpoint errors
   - Copy exact error message

4. **Rebuild everything:**
   - Clear Netlify cache
   - Redeploy backend
   - Trigger new Netlify deploy
   - Clear browser cache (Ctrl+Shift+Delete)

---

**Status:** You now have all the pieces to connect frontend to backend! 🚀
