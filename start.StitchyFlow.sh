#!/bin/bash

################################################################################
# StitchyFlow - Professional Startup Script
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
echo -e "${CYAN}║${WHITE}${BOLD}                    StitchyFlow - System Startup                           ${CYAN}║${NC}"
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

# Function to get PID listening on a port
get_port_pid() {
    lsof -ti :$1 -sTCP:LISTEN 2>/dev/null | head -n 1
}

# Function to get process working directory from PID
get_pid_cwd() {
    lsof -a -p "$1" -d cwd 2>/dev/null | awk 'NR==2 {print $NF}'
}

# Function to check if port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Function to start service
start_service() {
    local service_name=$1
    local port=$2
    local directory=$3
    local command=$4
    local expected_dir
    expected_dir="$(cd "$directory" 2>/dev/null && pwd)"
    
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${WHITE}${BOLD}Starting ${service_name}...${NC}"
    
    if check_port $port; then
        local port_pid
        local port_cwd
        port_pid="$(get_port_pid "$port")"
        port_cwd="$(get_pid_cwd "$port_pid")"

        # If the process is from a deleted/wrong path, stop and restart it from current workspace.
        if [[ -z "$port_cwd" || "$port_cwd" == *"/.Trash/"* || "$port_cwd" != "$expected_dir" ]]; then
            print_warning "${service_name} is running from unexpected path. Restarting..."
            if [[ -n "$port_pid" ]]; then
                kill "$port_pid" > /dev/null 2>&1
                sleep 1
            fi
        else
            # Same workspace already bound this port — must restart so new API routes (e.g. /email-templates) load.
            print_warning "${service_name} is already running on port ${port}"
            print_info "Restarting to load the latest code from this workspace..."
            if [[ -n "$port_pid" ]]; then
                kill "$port_pid" > /dev/null 2>&1
                sleep 1
            fi
        fi
    else
        if [ ! -d "$directory" ]; then
            print_error "Directory not found: ${directory}"
            return 1
        fi
    fi

    if [ ! -d "$directory" ]; then
        print_error "Directory not found: ${directory}"
        return 1
    fi

    # Start the service in background from the directory
    (cd "$directory" && eval "$command" > /dev/null 2>&1 &)

    # Wait for service to start (React apps need more time)
    local max_wait=60
    local waited=0
    print_info "Waiting for ${service_name} to start..."
    while ! check_port $port && [ $waited -lt $max_wait ]; do
        sleep 2
        waited=$((waited + 2))
    done

    if check_port $port; then
        print_status "${service_name} started successfully on port ${port}"
        return 0
    else
        print_error "Failed to start ${service_name}"
        return 1
    fi
}

# Start system initialization
echo -e "${MAGENTA}${BOLD}[1/5] System Initialization${NC}"
print_info "Checking system requirements..."
sleep 1

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js detected: ${NODE_VERSION}"
else
    print_error "Node.js is not installed"
    exit 1
fi

# Check MySQL
if command -v mysql &> /dev/null; then
    print_status "MySQL detected"
else
    print_warning "MySQL command not found in PATH"
fi

echo ""
echo -e "${MAGENTA}${BOLD}[2/5] Starting Database Services${NC}"
print_info "Initializing MySQL database..."

# Check if MySQL is running
if pgrep -x "mysqld" > /dev/null; then
    print_status "MySQL is running"
else
    print_warning "MySQL may not be running. Please start MySQL manually if needed."
fi

# Check phpMyAdmin
if check_port 8080; then
    print_status "phpMyAdmin is accessible on port 8080"
else
    print_warning "phpMyAdmin is not running on port 8080"
fi

sleep 1
echo ""

# Track service start status
BACKEND_STARTED=false
FRONTEND_STARTED=false
ADMIN_STARTED=false

# Start Backend API
echo -e "${MAGENTA}${BOLD}[3/5] Starting Backend Services${NC}"
if start_service "Backend API" 5000 "./StitchyFlow/backend" "npm start"; then
    BACKEND_STARTED=true
fi
sleep 2
echo ""

# Start Frontend
echo -e "${MAGENTA}${BOLD}[4/5] Starting Frontend Services${NC}"
if start_service "Frontend Application" 3000 "./StitchyFlow/frontend" "npm start"; then
    FRONTEND_STARTED=true
fi
sleep 2
echo ""

# Start Admin Panel
echo -e "${MAGENTA}${BOLD}[5/5] Starting Admin Panel${NC}"
if start_service "Admin Panel" 4000 "./StitchyFlow/admin" "npm start"; then
    ADMIN_STARTED=true
fi
sleep 2
echo ""

# Display system information
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${WHITE}${BOLD}                    StitchyFlow - System Information                       ${CYAN}║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Application URLs
echo -e "${WHITE}${BOLD}📱 Application URLs:${NC}"
echo -e "${GREEN}   Frontend:        ${WHITE}http://localhost:3000${NC}"
echo -e "${GREEN}   Admin Panel:     ${WHITE}http://localhost:4000${NC}"
echo -e "${GREEN}   Backend API:     ${WHITE}http://localhost:5000${NC}"
echo -e "${GREEN}   phpMyAdmin:      ${WHITE}http://localhost:8080/phpmyadmin${NC}"
echo ""

# Admin Panel Credentials
echo -e "${WHITE}${BOLD}🔐 Admin Panel Credentials:${NC}"
echo -e "${GREEN}   Username:        ${WHITE}admin${NC}"
echo -e "${GREEN}   Password:        ${WHITE}admin123${NC}"
echo -e "${GREEN}   Email:           ${WHITE}Testestaeoiu123!${NC}"
echo ""

# Database Credentials
echo -e "${WHITE}${BOLD}🗄️  Database Credentials:${NC}"
echo -e "${GREEN}   Host:            ${WHITE}localhost${NC}"
echo -e "${GREEN}   Port:            ${WHITE}3306${NC}"
echo -e "${GREEN}   Database:        ${WHITE}stitchyflow${NC}"
echo -e "${GREEN}   Username:        ${WHITE}root${NC}"
echo -e "${GREEN}   Password:        ${WHITE}12345${NC}"
echo ""

# System Information
echo -e "${WHITE}${BOLD}💻 System Information:${NC}"
echo -e "${GREEN}   OS:              ${WHITE}$(uname -s)${NC}"
echo -e "${GREEN}   Hostname:        ${WHITE}$(hostname)${NC}"
echo -e "${GREEN}   User:            ${WHITE}$(whoami)${NC}"
echo -e "${GREEN}   Node Version:    ${WHITE}${NODE_VERSION}${NC}"
echo ""

# Active Ports
echo -e "${WHITE}${BOLD}🌐 Active Ports:${NC}"
if check_port 3000; then
    echo -e "${GREEN}   ✓ Port 3000      ${WHITE}Frontend (Running)${NC}"
else
    echo -e "${RED}   ✗ Port 3000      ${WHITE}Frontend (Not Running)${NC}"
fi

if check_port 4000; then
    echo -e "${GREEN}   ✓ Port 4000      ${WHITE}Admin Panel (Running)${NC}"
else
    echo -e "${RED}   ✗ Port 4000      ${WHITE}Admin Panel (Not Running)${NC}"
fi

if check_port 5000; then
    echo -e "${GREEN}   ✓ Port 5000      ${WHITE}Backend API (Running)${NC}"
else
    echo -e "${RED}   ✗ Port 5000      ${WHITE}Backend API (Not Running)${NC}"
fi

if check_port 3306; then
    echo -e "${GREEN}   ✓ Port 3306      ${WHITE}MySQL (Running)${NC}"
else
    echo -e "${RED}   ✗ Port 3306      ${WHITE}MySQL (Not Running)${NC}"
fi

if check_port 8080; then
    echo -e "${GREEN}   ✓ Port 8080      ${WHITE}phpMyAdmin (Running)${NC}"
else
    echo -e "${RED}   ✗ Port 8080      ${WHITE}phpMyAdmin (Not Running)${NC}"
fi

echo ""

# Determine overall status
if [ "$BACKEND_STARTED" = true ] && [ "$FRONTEND_STARTED" = true ] && [ "$ADMIN_STARTED" = true ]; then
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${GREEN}${BOLD}                    ✓ StitchyFlow Started Successfully                     ${CYAN}║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════════════════╝${NC}"
elif [ "$BACKEND_STARTED" = false ] && [ "$FRONTEND_STARTED" = false ] && [ "$ADMIN_STARTED" = false ]; then
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${RED}${BOLD}                    ✗ All Services Failed to Start                         ${CYAN}║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}${BOLD}⚠ Troubleshooting:${NC}"
    echo -e "  - Ensure dependencies are installed: ${GREEN}npm install${NC} in each service folder"
    echo -e "  - Check MySQL is running on port 3306"
    echo -e "  - Review logs in ${GREEN}./StitchyFlow/backend/server.log${NC}"
    echo ""
else
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${YELLOW}${BOLD}                    ⚠ Partial Startup - Some Services Failed              ${CYAN}║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════════════════╝${NC}"
fi
echo ""

# Footer
echo -e "${WHITE}${BOLD}Developer by:${NC} Muhammad Kalim | ${WHITE}${BOLD}Phone:${NC} +92 333 3836851"
echo -e "${WHITE}${BOLD}Product of:${NC} LogixInventor (PVT) Ltd."
echo -e "${WHITE}${BOLD}Email:${NC} info@logixinventor.com | ${WHITE}${BOLD}Website:${NC} www.logixinventor.com"
echo ""
echo -e "${YELLOW}${BOLD}Note:${NC} To stop all services, run: ${GREEN}./stop.StitchyFlow.sh${NC}"
echo -e "${YELLOW}${BOLD}Tip:${NC} Keep this terminal open to view live logs"
echo ""

# Keep script running to show logs
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${WHITE}${BOLD}📋 Live Application Logs (Press Ctrl+C to exit logs, services will continue)${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Only show logs if backend actually started
if [ "$BACKEND_STARTED" = true ]; then
    tail -f ./StitchyFlow/backend/logs/*.log 2>/dev/null || echo -e "${YELLOW}No log files found yet. Services are running in background.${NC}"
else
    echo -e "${YELLOW}Application services not running. Only MySQL and phpMyAdmin are available.${NC}"
    echo ""
fi
