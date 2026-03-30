#!/bin/bash

################################################################################
# StitchyFlow - Professional Shutdown Script
# 
# Developer by: Muhammad Kalim
# Phone/WhatsApp: +92 333 3836851
# Product of LogixInventor (PVT) Ltd.
# Email: info@logixinventor.com
# Website: www.logixinventor.com
#
# Version: 1.0
# Date: March 30, 2026
################################################################################

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Clear screen for clean output
clear

# Print header
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${WHITE}${BOLD}                    StitchyFlow - System Shutdown                          ${CYAN}║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print status messages
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Function to check if port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Function to kill process on port
kill_port() {
    local port=$1
    local service_name=$2
    
    if check_port $port; then
        print_info "Stopping ${service_name} on port ${port}..."
        
        # Get PID and kill
        PID=$(lsof -ti :$port)
        if [ ! -z "$PID" ]; then
            kill -9 $PID 2>/dev/null
            sleep 2
            
            # Verify it's stopped
            if check_port $port; then
                print_error "Failed to stop ${service_name}"
                return 1
            else
                print_status "${service_name} stopped successfully"
                return 0
            fi
        fi
    else
        print_warning "${service_name} is not running on port ${port}"
        return 0
    fi
}

# Start shutdown process
echo -e "${MAGENTA}${BOLD}[1/4] Initiating Shutdown Sequence${NC}"
print_info "Preparing to stop all StitchyFlow services..."
sleep 1
echo ""

# Stop Frontend
echo -e "${MAGENTA}${BOLD}[2/4] Stopping Frontend Services${NC}"
kill_port 3000 "Frontend Application"
sleep 1
echo ""

# Stop Admin Panel
echo -e "${MAGENTA}${BOLD}[3/4] Stopping Admin Panel${NC}"
kill_port 4000 "Admin Panel"
sleep 1
echo ""

# Stop Backend API
echo -e "${MAGENTA}${BOLD}[4/4] Stopping Backend Services${NC}"
kill_port 5000 "Backend API"
sleep 1
echo ""

# Additional cleanup - kill any remaining Node processes related to StitchyFlow
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${WHITE}${BOLD}Performing Additional Cleanup...${NC}"
echo ""

# Find and kill any remaining node processes in StitchyFlow directory
STITCHY_PIDS=$(ps aux | grep -i "stitchyflow" | grep -i "node" | grep -v "grep" | awk '{print $2}')
if [ ! -z "$STITCHY_PIDS" ]; then
    print_info "Cleaning up remaining processes..."
    echo "$STITCHY_PIDS" | xargs kill -9 2>/dev/null
    print_status "Cleanup completed"
else
    print_status "No additional processes to clean up"
fi

echo ""

# Display final status
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${WHITE}${BOLD}                    Final System Status                                    ${CYAN}║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${WHITE}${BOLD}🌐 Port Status:${NC}"

# Check all ports
if check_port 3000; then
    echo -e "${RED}   ✗ Port 3000      ${WHITE}Frontend (Still Running)${NC}"
else
    echo -e "${GREEN}   ✓ Port 3000      ${WHITE}Frontend (Stopped)${NC}"
fi

if check_port 4000; then
    echo -e "${RED}   ✗ Port 4000      ${WHITE}Admin Panel (Still Running)${NC}"
else
    echo -e "${GREEN}   ✓ Port 4000      ${WHITE}Admin Panel (Stopped)${NC}"
fi

if check_port 5000; then
    echo -e "${RED}   ✗ Port 5000      ${WHITE}Backend API (Still Running)${NC}"
else
    echo -e "${GREEN}   ✓ Port 5000      ${WHITE}Backend API (Stopped)${NC}"
fi

if check_port 3306; then
    echo -e "${BLUE}   ℹ Port 3306      ${WHITE}MySQL (Running - Not managed by this script)${NC}"
else
    echo -e "${YELLOW}   ⚠ Port 3306      ${WHITE}MySQL (Not Running)${NC}"
fi

if check_port 8080; then
    echo -e "${BLUE}   ℹ Port 8080      ${WHITE}phpMyAdmin (Running - Not managed by this script)${NC}"
else
    echo -e "${YELLOW}   ⚠ Port 8080      ${WHITE}phpMyAdmin (Not Running)${NC}"
fi

echo ""

# Check if all services are stopped
ALL_STOPPED=true
if check_port 3000 || check_port 4000 || check_port 5000; then
    ALL_STOPPED=false
fi

if [ "$ALL_STOPPED" = true ]; then
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${GREEN}${BOLD}                  ✓ All StitchyFlow Services Stopped Successfully          ${CYAN}║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════════════════╝${NC}"
else
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${YELLOW}${BOLD}                  ⚠ Some Services May Still Be Running                     ${CYAN}║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    print_warning "Please check the port status above and manually stop any remaining services"
fi

echo ""

# Footer
echo -e "${WHITE}${BOLD}Developer by:${NC} Muhammad Kalim | ${WHITE}${BOLD}Phone:${NC} +92 333 3836851"
echo -e "${WHITE}${BOLD}Product of:${NC} LogixInventor (PVT) Ltd."
echo -e "${WHITE}${BOLD}Email:${NC} info@logixinventor.com | ${WHITE}${BOLD}Website:${NC} www.logixinventor.com"
echo ""
echo -e "${YELLOW}${BOLD}Note:${NC} To start all services again, run: ${GREEN}./start.StitchyFlow.sh${NC}"
echo -e "${YELLOW}${BOLD}Info:${NC} MySQL and phpMyAdmin are not stopped by this script"
echo ""
