#!/bin/bash

# ============================================
# ASCEND - Database Reset Script
# ============================================
# WARNING: This deletes your MySQL container
# and all data! Use for fresh starts only.
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

echo -e "${RED}⚠️  WARNING: DATABASE RESET${NC}"
echo -e "${YELLOW}This will delete the MySQL container and ALL data!${NC}\n"

# Confirmation prompt
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${BLUE}✅ Operation cancelled.${NC}"
    exit 0
fi

echo -e "\n${BLUE}🗑️  Removing MySQL container...${NC}"

# Stop and remove container
if [ "$(docker ps -a -q -f name=^${CONTAINER_NAME}$)" ]; then
    docker rm -f ${CONTAINER_NAME}
    echo -e "${GREEN}✅ Container removed successfully!${NC}"
else
    echo -e "${YELLOW}ℹ️  Container doesn't exist.${NC}"
fi

echo -e "\n${GREEN}✅ Database reset complete!${NC}"
echo -e "${BLUE}💡 Run ./start.sh to create a fresh database${NC}"
