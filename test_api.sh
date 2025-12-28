#!/bin/bash

# Test script for Twin Health Chat Session Tracking API
# This script demonstrates how to use the session tracking endpoints

API_BASE_URL="http://localhost:8000/api/chat"

echo "=========================================="
echo "Twin Health Chat Session Tracking API Test"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Create a new session
echo -e "\n${BLUE}1. Creating a new chat session...${NC}"
SESSION_RESPONSE=$(curl -s -X POST "$API_BASE_URL/sessions/create_session/" \
  -H "Content-Type: application/json" \
  -d '{
    "user_details": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "9876543210"
    }
  }')

SESSION_ID=$(echo "$SESSION_RESPONSE" | grep -o '"session_id":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}✓ Session created${NC}"
echo "Session ID: $SESSION_ID"
echo "Response: $SESSION_RESPONSE"

# Test 2: Update user details
echo -e "\n${BLUE}2. Updating user details...${NC}"
UPDATE_RESPONSE=$(curl -s -X POST "$API_BASE_URL/sessions/update_user_details/" \
  -H "Content-Type: application/json" \
  -d "{
    \"session_id\": \"$SESSION_ID\",
    \"user_details\": {
      \"name\": \"Updated User Name\",
      \"email\": \"updated@example.com\",
      \"phone\": \"8765432109\"
    }
  }")

echo -e "${GREEN}✓ User details updated${NC}"
echo "Response: $UPDATE_RESPONSE"

# Test 3: Send a message
echo -e "\n${BLUE}3. Sending a message...${NC}"
MESSAGE_RESPONSE=$(curl -s -X POST "$API_BASE_URL/message/" \
  -H "Content-Type: application/json" \
  -d "{
    \"session_id\": \"$SESSION_ID\",
    \"message\": \"What is metabolism?\",
    \"user_details\": {
      \"name\": \"Test User\",
      \"email\": \"test@example.com\",
      \"phone\": \"9876543210\"
    }
  }")

echo -e "${GREEN}✓ Message sent${NC}"
echo "Response: $MESSAGE_RESPONSE"

# Test 4: Get all sessions with details
echo -e "\n${BLUE}4. Retrieving all sessions with details...${NC}"
SESSIONS_RESPONSE=$(curl -s "$API_BASE_URL/sessions/all_sessions/")

echo -e "${GREEN}✓ Sessions retrieved${NC}"
echo "Response:"
echo "$SESSIONS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SESSIONS_RESPONSE"

# Test 5: Get specific session
echo -e "\n${BLUE}5. Getting specific session...${NC}"
GET_SESSION=$(curl -s "$API_BASE_URL/sessions/get_session/?session_id=$SESSION_ID")

echo -e "${GREEN}✓ Session retrieved${NC}"
echo "Response:"
echo "$GET_SESSION" | python3 -m json.tool 2>/dev/null || echo "$GET_SESSION"

echo -e "\n${GREEN}=========================================="
echo "All tests completed!"
echo "==========================================${NC}"
