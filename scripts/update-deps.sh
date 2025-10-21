#!/bin/bash

# Script to update dependencies across the monorepo
# Usage: npm run update-deps [mode]
# Modes: interactive (default), minor, latest

set -e

MODE=${1:-interactive}

echo "🚀 Updating dependencies across the monorepo..."
echo "Mode: $MODE"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to update dependencies
update_dependencies() {
    local dir=$1
    local name=$2

    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}📦 Updating: ${name}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    cd "$dir"

    if [ -f "package.json" ]; then
        case $MODE in
            interactive)
                echo -e "${YELLOW}Interactive mode - Choose which packages to update${NC}"
                npx npm-check-updates --interactive --format group
                ;;
            minor)
                echo -e "${YELLOW}Updating minor and patch versions only${NC}"
                npx npm-check-updates -u --target minor
                ;;
            latest)
                echo -e "${RED}⚠️  Updating to LATEST versions (may include breaking changes!)${NC}"
                npx npm-check-updates -u
                ;;
            *)
                echo -e "${RED}Invalid mode: $MODE${NC}"
                exit 1
                ;;
        esac

        # Install updated dependencies
        if [ -f "package-lock.json" ] || [ -f "package.json" ]; then
            echo ""
            echo -e "${GREEN}Installing updated dependencies...${NC}"
            npm install
        fi
    else
        echo -e "${YELLOW}⚠️  No package.json found${NC}"
    fi

    cd - > /dev/null
}

echo -e "${GREEN}Starting dependency update...${NC}"
echo ""

# Backup package-lock.json files
echo -e "${YELLOW}Creating backup of package-lock.json files...${NC}"
find . -name "package-lock.json" -exec cp {} {}.backup \;

# Update root
update_dependencies "." "Root Workspace"

# Update frontend
update_dependencies "./apps/frontend" "Frontend App"

# Update backend
update_dependencies "./apps/backend" "Backend App"

echo ""
echo -e "${GREEN}✅ Dependencies updated!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. ${BLUE}npm run lint${NC}           # Check for linting errors"
echo -e "  2. ${BLUE}npm run build${NC}          # Verify builds work"
echo -e "  3. ${BLUE}npm run test${NC}           # Run tests"
echo -e "  4. ${BLUE}npm run dev${NC}            # Manual testing"
echo -e "  5. ${BLUE}git add . && git commit${NC} # Commit changes"
echo ""
echo -e "${YELLOW}Backups created with .backup extension if you need to rollback${NC}"
echo ""
