#!/bin/bash

# ============================================
# ASCEND - One-Command Startup Script
# ============================================
# This script:
# 1. Checks/creates/starts MySQL container
# 2. Waits for MySQL to be ready
# 3. Activates virtual environment
# 4. Starts Flask application
# ============================================

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Load configuration
if [ ! -f "config.env" ]; then
    echo -e "${RED}❌ Error: config.env file not found!${NC}"
    exit 1
fi

source config.env

echo -e "${BLUE}🚀 Starting ASCEND Task Manager...${NC}\n"

# ============================================
# Step 1: Check/Create/Start MySQL Container
# ============================================
echo -e "${BLUE}🔍 Checking for MySQL container '${CONTAINER_NAME}'...${NC}"

if [ "$(docker ps -a -q -f name=^${CONTAINER_NAME}$)" ]; then
    # Container exists
    if [ "$(docker ps -q -f name=^${CONTAINER_NAME}$)" ]; then
        echo -e "${GREEN}✅ Container is already running!${NC}"
    else
        echo -e "${YELLOW}⚡ Container exists but is stopped. Starting it...${NC}"
        docker start ${CONTAINER_NAME}
        echo -e "${GREEN}✅ Container started successfully!${NC}"
    fi
else
    # Container doesn't exist, create it
    echo -e "${YELLOW}❌ Container not found. Creating new container...${NC}"
    docker run -d \
        --name ${CONTAINER_NAME} \
        -e MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} \
        -e MYSQL_DATABASE=${MYSQL_DATABASE} \
        -e MYSQL_USER=${MYSQL_USER} \
        -e MYSQL_PASSWORD=${MYSQL_PASSWORD} \
        -p ${MYSQL_PORT}:3306 \
        ${MYSQL_IMAGE}
    
    echo -e "${GREEN}✅ MySQL container created successfully!${NC}"
fi

# ============================================
# Step 2: Wait for MySQL to be Ready
# ============================================
echo -e "\n${BLUE}⏳ Waiting for MySQL to be ready...${NC}"

MAX_TRIES=60
TRIES=0
READY=false

while [ $TRIES -lt $MAX_TRIES ]; do
    # Check if MySQL is accepting connections by trying to connect
    if docker exec ${CONTAINER_NAME} mysql -u${MYSQL_USER} -p${MYSQL_PASSWORD} -e "SELECT 1" ${MYSQL_DATABASE} >/dev/null 2>&1; then
        echo -e "${GREEN}✅ MySQL is ready and accepting connections!${NC}"
        READY=true
        break
    fi
    
    TRIES=$((TRIES+1))
    if [ $TRIES -eq $MAX_TRIES ]; then
        echo -e "${RED}❌ MySQL failed to start after ${MAX_TRIES} seconds${NC}"
        echo -e "${YELLOW}💡 Check logs: docker logs ${CONTAINER_NAME}${NC}"
        exit 1
    fi
    
    # Show progress every 5 attempts
    if [ $((TRIES % 5)) -eq 0 ]; then
        echo -e "${YELLOW}   Still waiting... ($TRIES/$MAX_TRIES seconds)${NC}"
    fi
    sleep 1
done

# Extra safety: wait 2 more seconds after MySQL is ready
if [ "$READY" = true ]; then
    echo -e "${BLUE}⏳ Giving MySQL 2 more seconds to stabilize...${NC}"
    sleep 2
fi

# ============================================
# Step 3: Activate Virtual Environment
# ============================================
echo -e "\n${BLUE}🐍 Activating virtual environment...${NC}"

if [ ! -d "${VENV_PATH}" ]; then
    echo -e "${RED}❌ Virtual environment not found at '${VENV_PATH}'${NC}"
    echo -e "${YELLOW}💡 Create it with: python3 -m venv ${VENV_PATH}${NC}"
    exit 1
fi

source ${VENV_PATH}/bin/activate
echo -e "${GREEN}✅ Virtual environment activated!${NC}"

# ============================================
# Step 4: Start Flask Application
# ============================================
echo -e "\n${BLUE}🚀 Starting Flask application...${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Run Flask app
python app.py
