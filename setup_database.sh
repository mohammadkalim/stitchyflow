#!/bin/bash

# StitchyFlow Database Setup Script
# Developer by: Muhammad Kalim
# Phone/WhatsApp: +92 333 3836851
# Product of LogixInventor (PVT) Ltd.
# Email: info@logixinventor.com
# Website: www.logixinventor.com

echo "=========================================="
echo "StitchyFlow Database Setup"
echo "=========================================="
echo ""

# Database credentials
DB_USER="root"
DB_PASS="12345"

echo "Setting up database..."
mysql -u $DB_USER -p$DB_PASS < Database/database_setup.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Database setup completed successfully!"
    echo ""
    echo "=========================================="
    echo "Admin Credentials"
    echo "=========================================="
    echo "Email: admin@stitchyflow.com"
    echo "Password: Admin@123"
    echo "=========================================="
    echo ""
    echo "Admin Panel: http://localhost:4000"
    echo ""
else
    echo ""
    echo "✗ Database setup failed!"
    echo "Please check your MySQL credentials and try again."
    echo ""
fi
