#!/bin/bash
# =============================================================
# AEGIS - Guidewire DEVTrails 2026 Phase 2 Demo Quickstart
# =============================================================
# This script sets up and runs the complete demo environment
# Perfect for showing Guidewire judges how the system works
# =============================================================

set -e  # Exit on error

echo "🚀 Starting AEGIS Demo Environment..."
echo "================================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Ensure we're in the right directory
echo -e "${BLUE}[SETUP]${NC} Checking directory structure..."
if [ ! -d "backend" ]; then
    echo -e "${RED}[ERROR]${NC} backend/ directory not found. Please run from project root."
    exit 1
fi
if [ ! -d "src" ]; then
    echo -e "${RED}[ERROR]${NC} src/ directory not found. Please run from project root."
    exit 1
fi

# Step 2: Install backend dependencies
echo -e "${BLUE}[SETUP]${NC} Installing backend dependencies..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}[✓]${NC} Virtual environment created"
fi

source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null || true
pip install --upgrade pip > /dev/null 2>&1
pip install -q -r requirements.txt
echo -e "${GREEN}[✓]${NC} Backend dependencies installed"

# Step 3: Clean database (fresh start for demo)
echo -e "${BLUE}[SETUP]${NC} Preparing fresh database..."
rm -f aegis.db
echo -e "${GREEN}[✓]${NC} Database cleaned (fresh start)"

# Step 4: Start backend server
echo ""
echo -e "${GREEN}[✓]${NC} Backend setup complete!"
echo -e "${BLUE}[LAUNCHING]${NC} Starting FastAPI server on port 8000..."
echo ""
echo "================================================"
echo "📡 BACKEND SERVER READY"
echo "================================================"
echo -e "🔗 API Documentation: ${YELLOW}http://localhost:8000/docs${NC}"
echo -e "🔗 API Health Check: ${YELLOW}http://localhost:8000/docs${NC}"
echo ""
echo -e "${YELLOW}IMPORTANT: Keep this terminal open while using the frontend.${NC}"
echo ""

# Launch backend in background
python main.py &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 3

# Step 5: In a new terminal, start frontend
echo ""
echo "================================================"
echo "🎨 FRONTEND SETUP"
echo "================================================"
echo ""
echo -e "${YELLOW}In a NEW terminal, run:${NC}"
echo ""
echo "  cd frontend"
echo "  npm install"
echo "  npm run dev"
echo ""
echo -e "${YELLOW}Then open:${NC} ${GREEN}http://localhost:5173${NC}"
echo ""
echo "================================================"
echo "🎬 DEMO FLOW"
echo "================================================"
echo ""
echo "1️⃣  Frontend loads at http://localhost:5173"
echo ""
echo "2️⃣  Register a new worker (use pincode: 400002)"
echo "   - Name: 'Demo Worker'"
echo "   - Phone: '9876543210'"
echo "   - Platform: 'Zepto'"
echo "   - Earnings: '2500'"
echo ""
echo "3️⃣  Calculate Premium & Create Policy"
echo "   - See AI formula in action"
echo "   - View 20% Resilience Wallet allocation"
echo ""
echo "4️⃣  Trigger Demo Disruptions (INSTANT)"
echo "   - Use one of these CURL commands:"
echo ""
echo -e "   ${YELLOW}Heavy Rain:${NC}"
echo "   curl -X POST http://localhost:8000/demo/trigger-heavy-rain/1"
echo ""
echo -e "   ${YELLOW}Extreme Heat:${NC}"
echo "   curl -X POST http://localhost:8000/demo/trigger-extreme-heat/1"
echo ""
echo -e "   ${YELLOW}Civic Strike:${NC}"
echo "   curl -X POST http://localhost:8000/demo/trigger-civic-strike/1"
echo ""
echo -e "   ${YELLOW}Show Fraud Detection:${NC}"
echo "   curl -X POST http://localhost:8000/demo/trigger-fraud-rejection/1"
echo ""
echo "5️⃣  Watch Claims Auto-Generate"
echo "   - Admin Dashboard at http://localhost:5173 shows live claims"
echo "   - Fraud scores calculated instantly"
echo "   - Payouts show in ledger"
echo ""
echo "6️⃣  Simulate UPI Payout"
echo "   curl -X POST http://localhost:8000/demo/simulate-upi-payout/1"
echo ""
echo "================================================"
echo "🌐 QUICK API LINKS"
echo "================================================"
echo ""
echo -e "${BLUE}Admin Ledger:${NC}"
echo "curl http://localhost:8000/admin/ledger | jq"
echo ""
echo -e "${BLUE}Worker Dashboard:${NC}"
echo "curl http://localhost:8000/worker/1/dashboard | jq"
echo ""
echo -e "${BLUE}Quick Demo Status:${NC}"
echo "curl http://localhost:8000/demo/quick-test/1 | jq"
echo ""
echo "================================================"
echo "📱 KEY FEATURES TO DEMO"
echo "================================================"
echo ""
echo "✅ AI-Powered Premium Calculation (Formula working)"
echo "✅ Worker Resilience Wallet (20% allocation)"
echo "✅ Zero-Touch Parametric Claims (Auto-trigger)"
echo "✅ Fraud Detection Engine (Blocks bad actors)"
echo "✅ Instant UPI Paymentsouts (Simulated)"
echo "✅ Admin Dashboard (Full ledger visibility)"
echo "✅ Weekly Pricing Model (Aligned with gig cycle)"
echo ""
echo "================================================"
echo "💡 DEMO TIPS FOR JUDGES"
echo "================================================"
echo ""
echo "1. Start with worker registration"
echo "   → Shows zero-friction onboarding"
echo ""
echo "2. Show premium calculation breakdown"
echo "   → Highlight AI formula in action"
echo "   → Explain Pw = max([E(L)×(1+λ)]+γ-[R×β]-W_credit, P_floor)"
echo ""
echo "3. Create a policy"
echo "   → Show Resilience Wallet allocation"
echo "   → Show weekly renewal mechanics"
echo ""
echo "4. Trigger a disruption (INSTANT)"
echo "   → Run: curl -X POST http://localhost:8000/demo/trigger-heavy-rain/1"
echo "   → Watch claim appear in admin dashboard"
echo "   → Fraud detection shows it's legitimate (low fraud score)"
echo ""
echo "5. Show fraud rejection demo"
echo "   → Run: curl -X POST http://localhost:8000/demo/trigger-fraud-rejection/1"
echo "   → Explain zero-trust validation blocks GPS spoofing"
echo ""
echo "6. Simulate UPI payout"
echo "   → Show payment reaches worker in seconds"
echo ""
echo "================================================"
echo "🛑 TO STOP DEMO"
echo "================================================"
echo ""
echo "Kill the backend with: kill $BACKEND_PID"
echo ""
echo "Or press Ctrl+C to stop"
echo ""
echo "================================================"

# Wait for interrupt
trap "echo ''; echo 'Stopping AEGIS Demo...'; kill $BACKEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM

wait $BACKEND_PID
