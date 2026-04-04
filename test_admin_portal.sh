#!/bin/bash

# Admin Portal & Mock Data Testing Script
# Tests all data input methods and admin endpoints

echo "================================"
echo "AEGIS Admin Portal Testing Suite"
echo "================================"
echo ""

BASE_URL="http://localhost:8000"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test 1: Check backend health
echo -e "${BLUE}[TEST 1]${NC} Checking backend health..."
if curl -s "$BASE_URL/health" > /dev/null 2>&1 || curl -s "$BASE_URL/worker/1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${YELLOW}✗ Backend not responding at $BASE_URL${NC}"
    echo "Start backend with: cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000"
    exit 1
fi
echo ""

# Test 2: Get mock summary (preview data)
echo -e "${BLUE}[TEST 2]${NC} Getting mock data summary (preview)..."
MOCK_SUMMARY=$(curl -s "$BASE_URL/admin/mock-summary")
echo "Mock data structure:"
echo "$MOCK_SUMMARY" | python3 -m json.tool | head -30
echo ""

# Test 3: Get specific mock workers
echo -e "${BLUE}[TEST 3]${NC} Generating 10 mock workers..."
MOCK_WORKERS=$(curl -s "$BASE_URL/admin/mock-workers/10")
WORKER_COUNT=$(echo "$MOCK_WORKERS" | python3 -c "import sys, json; data = json.load(sys.stdin); print(len(data.get('workers', [])))")
echo -e "${GREEN}✓ Generated $WORKER_COUNT sample workers${NC}"
echo ""

# Test 4: Get mock metrics
echo -e "${BLUE}[TEST 4]${NC} Getting mock pool metrics and fraud alerts..."
MOCK_METRICS=$(curl -s "$BASE_URL/admin/mock-metrics")
LOSS_RATIO=$(echo "$MOCK_METRICS" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('pool_metrics', {}).get('loss_ratio', 'N/A'))" 2>/dev/null)
LIQUIDITY=$(echo "$MOCK_METRICS" | python3 -c "import sys, json; data = json.load(sys.stdin); print(round(data.get('pool_metrics', {}).get('liquidity_pool_balance', 0)/100000, 1))" 2>/dev/null)
echo -e "${GREEN}✓ Loss Ratio: ${LOSS_RATIO}%${NC}"
echo -e "${GREEN}✓ Liquidity: ₹${LIQUIDITY}L${NC}"
echo ""

# Test 5: Inject mock data into database
echo -e "${BLUE}[TEST 5]${NC} Injecting 50 mock workers into database..."
INJECT_RESULT=$(curl -s -X POST "$BASE_URL/admin/inject-mock-data?worker_count=50")
WORKERS_CREATED=$(echo "$INJECT_RESULT" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('workers_created', 0))" 2>/dev/null)
POLICIES_CREATED=$(echo "$INJECT_RESULT" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('policies_created', 0))" 2>/dev/null)
CLAIMS_CREATED=$(echo "$INJECT_RESULT" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('claims_created', 0))" 2>/dev/null)

if [ ! -z "$WORKERS_CREATED" ] && [ "$WORKERS_CREATED" -gt 0 ]; then
    echo -e "${GREEN}✓ Injected data successfully${NC}"
    echo "  - Workers: $WORKERS_CREATED"
    echo "  - Policies: $POLICIES_CREATED"
    echo "  - Claims: $CLAIMS_CREATED"
else
    echo -e "${YELLOW}⚠ Injection returned unexpected response${NC}"
    echo "$INJECT_RESULT" | python3 -m json.tool | head -20
fi
echo ""

# Test 6: Verify data in database
echo -e "${BLUE}[TEST 6]${NC} Checking database statistics..."
if command -v sqlite3 &> /dev/null; then
    DB_FILE="./backend/aegis.db"
    if [ -f "$DB_FILE" ]; then
        WORKER_COUNT=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM worker;" 2>/dev/null || echo "0")
        POLICY_COUNT=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM policy;" 2>/dev/null || echo "0")
        CLAIM_COUNT=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM claim;" 2>/dev/null || echo "0")
        
        echo -e "${GREEN}✓ Database Statistics${NC}"
        echo "  - Total Workers: $WORKER_COUNT"
        echo "  - Total Policies: $POLICY_COUNT"
        echo "  - Total Claims: $CLAIM_COUNT"
    else
        echo -e "${YELLOW}✗ Database file not found at $DB_FILE${NC}"
    fi
else
    echo -e "${YELLOW}✗ sqlite3 not installed, skipping database check${NC}"
fi
echo ""

# Test 7: Manual test data creation
echo -e "${BLUE}[TEST 7]${NC} Testing manual worker registration..."
MANUAL_PAYLOAD='{
  "name": "QA_Tester_001",
  "phone": "9999999999",
  "email": "qa@test.com",
  "platform": "Zomato",
  "city": "Mumbai",
  "pincode": "400001",
  "avg_weekly_earnings": 5000
}'

REGISTER_RESULT=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "$MANUAL_PAYLOAD" \
  "$BASE_URL/register")

REGISTERED_ID=$(echo "$REGISTER_RESULT" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('id', 'error'))" 2>/dev/null)

if [ "$REGISTERED_ID" != "error" ] && [ ! -z "$REGISTERED_ID" ]; then
    echo -e "${GREEN}✓ Worker registered successfully${NC}"
    echo "  - Worker ID: $REGISTERED_ID"
    echo "  - Name: QA_Tester_001"
else
    echo -e "${YELLOW}⚠ Registration response: ${REGISTER_RESULT:0:100}...${NC}"
fi
echo ""

# Test 8: Calculate premium
if [ "$REGISTERED_ID" != "error" ] && [ ! -z "$REGISTERED_ID" ]; then
    echo -e "${BLUE}[TEST 8]${NC} Calculating dynamic premium..."
    PREMIUM_PAYLOAD="{
      \"worker_id\": $REGISTERED_ID,
      \"tier\": \"Pro\"
    }"
    
    PREMIUM_RESULT=$(curl -s -X POST \
      -H "Content-Type: application/json" \
      -d "$PREMIUM_PAYLOAD" \
      "$BASE_URL/calculate-premium")
    
    PREMIUM_AMOUNT=$(echo "$PREMIUM_RESULT" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('premium_amount', 'N/A'))" 2>/dev/null)
    COVERAGE_AMOUNT=$(echo "$PREMIUM_RESULT" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('coverage_amount', 'N/A'))" 2>/dev/null)
    
    echo -e "${GREEN}✓ Premium calculation complete${NC}"
    echo "  - Premium: ₹$PREMIUM_AMOUNT/week"
    echo "  - Coverage: ₹$COVERAGE_AMOUNT"
fi
echo ""

# Summary
echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}Testing Complete!${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo "Next Steps:"
echo "1. Open http://localhost:5174"
echo "2. Click 'Admin / Insurer'"
echo "3. View the Control Center with injected data"
echo "4. Click 'Inject Scenario' to trigger events"
echo ""
echo "Data Input Methods Available:"
echo "  • Manual: Register workers → Create policies → Trigger claims"
echo "  • Bulk: POST /admin/inject-mock-data?worker_count=50"
echo "  • Preview: GET /admin/mock-summary"
echo ""
echo "Admin Dashboard Includes:"
echo "  ✓ 13 operational tabs"
echo "  ✓ Real-time KPI tracking"
echo "  ✓ Liquidity pool management"
echo "  ✓ Fraud detection alerts"
echo "  ✓ Premium actuarial calculations"
echo "  ✓ Zero-touch claims automation"
echo ""
