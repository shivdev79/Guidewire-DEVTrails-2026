#!/bin/bash
# AEGIS Quick Start Script for Judges/Demo

echo "🛡️  AEGIS - Guidewire DEVTrails 2026"
echo "Starting platform for live demonstration..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if this is first run
if [ ! -d "backend" ]; then
    echo "${YELLOW}Setting up project...${NC}"
    echo "This appears to be your first run. Let me help you get started."
fi

echo ""
echo "${GREEN}Starting Backend on http://localhost:8000${NC}"
echo "Starting Frontend on http://localhost:5173"
echo ""
echo "Opening terminals..."

# Start backend in background
cd backend
pip install -r requirements.txt > /dev/null 2>&1
rm -f aegis.db  # Fresh start for demo
python main.py &
BACKEND_PID=$!
echo "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

sleep 2

# Start frontend in new terminal
cd ../
npm install > /dev/null 2>&1
npm run dev &
FRONTEND_PID=$!
echo "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

sleep 3

echo ""
echo "${GREEN}=== AEGIS IS READY ===${NC}"
echo ""
echo "Browser: http://localhost:5173"
echo "Backend: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Quick Actions:"
echo "  1. Register a worker (use pincode: 400002)"
echo "  2. View premium calculation"
echo "  3. Create a policy"
echo "  4. Wait ~1 min for claim to auto-trigger"
echo "  5. Check admin dashboard"
echo ""
echo "Demo Mode (instant triggers):"
echo "  curl -X POST http://localhost:8000/demo/activate-scenario -H 'Content-Type: application/json' -d '{\"scenario\": \"heavy_rain\"}'"
echo ""
echo "Press Ctrl+C to stop both servers..."
wait
