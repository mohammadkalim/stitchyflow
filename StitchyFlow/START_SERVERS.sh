#!/bin/bash
# ============================================================
# StitchyFlow - Start All Servers
# Run this in your Mac Terminal:
#   cd /Users/NextGenMac/Downloads/Webapp/StitchyFlow/StitchyFlow
#   bash START_SERVERS.sh
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║         StitchyFlow - Starting All Servers               ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Kill existing
pkill -f "node server.js" 2>/dev/null
pkill -f "serve-admin.js" 2>/dev/null
sleep 1

# 1. Start Backend
echo "🚀 Starting Backend on port 5000..."
cd "$SCRIPT_DIR/backend"
node server.js &
BACKEND_PID=$!
sleep 3

if curl -s http://localhost:5000/health > /dev/null 2>&1; then
  echo "   ✅ Backend running: http://localhost:5000"
else
  echo "   ❌ Backend failed!"
fi

# 2. Start Admin Panel (production build)
echo "🚀 Starting Admin Panel on port 4000..."
cd "$SCRIPT_DIR/admin"
node serve-admin.js &
ADMIN_PID=$!
sleep 2

if curl -s -o /dev/null -w "%{http_code}" http://localhost:4000 2>/dev/null | grep -q "200"; then
  echo "   ✅ Admin Panel running: http://localhost:4000"
else
  echo "   ❌ Admin Panel failed!"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅ ALL SERVERS RUNNING                                  ║"
echo "║                                                          ║"
echo "║  Admin Panel:  http://localhost:4000                     ║"
echo "║  Backend API:  http://localhost:5000                     ║"
echo "║                                                          ║"
echo "║  Admin Login:                                            ║"
echo "║  Email:    admin@stitchyflow.com                         ║"
echo "║  Password: admin123                                      ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

wait $BACKEND_PID $ADMIN_PID
