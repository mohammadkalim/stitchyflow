# StitchyFlow Database Setup Guide

## Database Credentials
- **Username:** root
- **Password:** 12345
- **Database Name:** stitchyflow
- **Host:** localhost
- **Port:** 3306

## Quick Setup Instructions

### Option 1: Using MySQL Command Line

1. Open your terminal/command prompt
2. Navigate to the StitchyFlow directory
3. Run the following command:

```bash
mysql -u root -p12345 < database_setup.sql
```

### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server (localhost, root, 12345)
3. Go to File → Open SQL Script
4. Select `database_setup.sql`
5. Click the Execute button (lightning bolt icon)

### Option 3: Using phpMyAdmin

1. Open phpMyAdmin in your browser
2. Login with username: root, password: 12345
3. Click on "Import" tab
4. Choose the `database_setup.sql` file
5. Click "Go" button

## What Gets Created

### Tables (12 total)
1. users - User accounts (admin, business owner, tailor, customer)
2. businesses - Business/shop information
3. tailors - Tailor profiles and statistics
4. customers - Customer profiles
5. orders - Order management
6. measurements - Customer measurements for orders
7. payments - Payment transactions
8. reviews - Customer reviews and ratings
9. notifications - System notifications
10. order_status_history - Order status tracking
11. audit_logs - System audit trail
12. refresh_tokens - JWT refresh tokens

### Stored Procedures (5 total)
- sp_create_user - Create new user with role-specific records
- sp_authenticate_user - User authentication
- sp_create_order - Create new order with automatic numbering
- sp_update_order_status - Update order status with history tracking
- sp_add_review - Add review and update tailor rating

### Functions (3 total)
- fn_calculate_order_total - Calculate order total amount
- fn_get_tailor_rating - Get tailor's average rating
- fn_generate_order_number - Generate unique order number

### Views (4 total)
- vw_order_details - Complete order information with joins
- vw_tailor_statistics - Tailor performance metrics
- vw_business_dashboard - Business analytics
- vw_admin_analytics - Platform-wide statistics

### Triggers (4 total)
- trg_after_review_insert - Auto-update tailor rating
- trg_after_order_status_update - Create notifications on status change
- trg_before_user_delete - Log user deletions
- trg_after_payment_insert - Create payment notifications

## Verification

After running the setup, verify the installation:

```sql
-- Check database exists
SHOW DATABASES LIKE 'stitchyflow';

-- Use the database
USE stitchyflow;

-- Check all tables
SHOW TABLES;

-- Check stored procedures
SHOW PROCEDURE STATUS WHERE Db = 'stitchyflow';

-- Check functions
SHOW FUNCTION STATUS WHERE Db = 'stitchyflow';

-- Check triggers
SHOW TRIGGERS;

-- View admin analytics
SELECT * FROM vw_admin_analytics;
```

## Default Admin Account

A default admin account is created:
- **Email:** admin@stitchyflow.com
- **Password:** admin123 (You should change this immediately!)

Note: The password hash in the SQL file is a placeholder. You'll need to generate a proper bcrypt hash for production use.

## Troubleshooting

### Error: Access denied
- Verify your MySQL credentials (root/12345)
- Check if MySQL service is running

### Error: Database already exists
- The script automatically drops and recreates the database
- If you want to preserve data, backup first

### Error: Function/Procedure already exists
- The script handles this automatically
- If issues persist, manually drop procedures/functions first

## Next Steps

1. Update the default admin password
2. Configure your application's database connection
3. Test the stored procedures and functions
4. Set up regular database backups
5. Configure proper user privileges for production

## Security Recommendations

For production environments:
1. Change the root password
2. Create a dedicated database user with limited privileges
3. Use environment variables for credentials
4. Enable SSL for database connections
5. Implement regular backup schedules
6. Use proper password hashing (bcrypt with salt)

## Support

For issues or questions:
- **Company:** LogixInventor (PVT) Ltd.
- **Contact:** info@logixinventor.com
- **Phone:** +92 333 3836851
