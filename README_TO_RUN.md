# 🚀 AEGIS Parametric Insurance MVP - Local Deployment Guide

This guide provides exactly what you need to start the AEGIS platform locally. You have two options to run this project: Using **Docker (Recommended)** or running it **Manually**.

---

## 🐳 Option 1: Run with Docker Compose (Recommended)

This is the easiest way to spin up the entire application stack (React + Python FastAPI) seamlessly without installing Python or Node.js manually.

### Prerequisites:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Steps:
1. Open up your terminal or command prompt inside the root project directory (`Guidewire-DEVTrails-2026`).
2. Run the following single command:
   ```bash
   docker-compose up --build
   ```
3. Docker will automatically install dependencies, hydrate the SQLite database, and launch both application servers.

**Access the Applications:**
* **Frontend Portal:** [http://localhost:5173](http://localhost:5173)
* **Backend API Docs (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)

*To cleanly shut down the app, press `Ctrl+C` in your terminal and then run `docker-compose down`.*

---

## 💻 Option 2: Run Manually (Local Development)

If you prefer to run the components independently or make active code changes, follow these manual steps.

### Prerequisites:
* Node.js (v18+)
* Python (3.10+)

### Step 1: Start the Backend (FastAPI)
1. Open a new terminal instance and cleanly navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install the required Python backend packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the `uvicorn` development server:
   ```bash
   python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
   *Your backend API is now running locally on port 8000.*

### Step 2: Start the Frontend (React + Vite)
1. Keep the backend terminal running. Open a **second** terminal instance and stay in the root directory.
2. Install the necessary JavaScript packages:
   ```bash
   npm install
   ```
3. Spin up the Vite development server:
   ```bash
   npm run dev
   ```
   *Your UI is now hot-loaded and available at [http://localhost:5173](http://localhost:5173).*

---

## 🎯 How to Use & Test the Live Platform

1. **Worker Registration:** 
   * Navigate to `http://localhost:5173` and click **"Be Insured Now"**.
   * Fill out the automated form to create a worker account.
   * Add money to your wallet via the **Mock Razorpay Top-Up**.
   * Head to **"Explore Plans"** to activate a parametric insurance policy.

2. **Admin Real-Time Simulation:**
   * In a new tab, navigate to the **Live Feeds Admin Portal** (Accessible via hovering on the top navigation UI or `/dashboard` triggers if manually built).
   * Notice your Worker Node active in the live status monitor.
   * Click the **"Simulate"** button on **Heavy Rain**, **Severe AQI**, or **Extreme Heat**.
   * Instantly switch back (or look side-by-side) to your Worker Portal tab to see the **Real-Time Razorpay Settlement UI popup** successfully deposit the automated parametric claim.

---

### Troubleshooting
* **Address Binding Errors (`port already in use`):** Verify that no other background process is using port `8000` (FastAPI) or `5173` (Vite).
* **Database Reset:** If you need to forcefully recreate demo workers, run `python backend/seed_database.py` while inside the backend folder to refresh your mock SQLite node instances.
