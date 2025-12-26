#!/bin/bash
# Backend startup script

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Twin Health Django Backend...${NC}"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo -e "${YELLOW}Please create .env file with GEMINI_API_KEY${NC}"
    exit 1
fi

# Install dependencies if needed
echo -e "${YELLOW}Installing dependencies...${NC}"
pip install -q -r requirements.txt

# Run migrations
echo -e "${YELLOW}Running migrations...${NC}"
python manage.py migrate

# Start the server
echo -e "${GREEN}Starting development server...${NC}"
echo -e "${GREEN}Server running at http://localhost:8000${NC}"
echo -e "${GREEN}Admin panel at http://localhost:8000/admin${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"

python manage.py runserver 0.0.0.0:8000
