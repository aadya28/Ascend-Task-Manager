#!/bin/bash

# ============================================
# ASCEND - Shutdown Script
# ============================================
# This script stops the MySQL container
# (Flask is stopped with Ctrl+C)
# ============================================

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

echo -e "${BLUE}🛑 Stopping ASCEND Task Manager...${NC}\n"

# Check if container exists and is running
if [ "$(docker ps -q -f name=^${CONTAINER_NAME}$)" ]; then
    echo -e "${YELLOW}⏸️  Stopping MySQL container...${NC}"
    docker stop ${CONTAINER_NAME}
    echo -e "${GREEN}✅ MySQL container stopped!${NC}"
else
    echo -e "${YELLOW}ℹ️  MySQL container is not running.${NC}"
fi

echo -e "\n${GREEN}✅ Shutdown complete!${NC}"
echo -e "${BLUE}💡 To start again: ./start.sh${NC}"
