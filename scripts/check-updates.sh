#!/bin/bash

# Script to check for available dependency updates across the monorepo
# Usage: npm run check-updates

set -e

echo "🔍 Checking for dependency updates across the monorepo..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check updates for a package
check_package_updates() {
    local dir=$1
    local name=$2

    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}📦 Checking: ${name}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    cd "$dir"

    if [ -f "package.json" ]; then
        # Check for outdated packages
        echo ""
        npx npm-check-updates --color
        echo ""
    else
        echo -e "${YELLOW}⚠️  No package.json found${NC}"
    fi

    cd - > /dev/null
}

# Check if npm-check-updates is available
if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ npx not found. Please install Node.js${NC}"
    exit 1
fi

echo -e "${GREEN}Starting dependency check...${NC}"
echo ""

# Check root
check_package_updates "." "Root Workspace"

# Check frontend
check_package_updates "./apps/frontend" "Frontend App"

# Check backend
check_package_updates "./apps/backend" "Backend App"

echo ""
echo -e "${GREEN}✅ Dependency check complete!${NC}"
echo ""
echo -e "${YELLOW}To update dependencies:${NC}"
echo -e "  ${BLUE}npm run update-deps${NC}         # Interactive update"
echo -e "  ${BLUE}npm run update-deps:minor${NC}   # Update minor & patch only"
echo -e "  ${BLUE}npm run update-deps:latest${NC}  # Update to latest (⚠️  careful!)"
echo ""
