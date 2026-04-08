# StitchyFlow Admin Credentials

**Developer by:** Muhammad Kalim  
**Phone/WhatsApp:** +92 333 3836851  
**Product of:** LogixInventor (PVT) Ltd.  
**Email:** info@logixinventor.com  
**Website:** www.logixinventor.com

---

## Admin Panel Access

### URL
```
http://localhost:4000
```

### Admin Credentials

**Email:**
```
admin@stitchyflow.com
```

**Password:**
```
Admin@123
```

---

## Setup Instructions

### 1. Database Setup

If you haven't set up the database yet, run:

```bash
mysql -u root -p12345 < Database/database_setup.sql
```

### 2. Create Admin User

Run the admin user creation script:

```bash
mysql -u root -p12345 < Database/create_admin_user.sql
```

Or manually execute in MySQL:

```sql
USE stitchyflow;

DELETE FROM users WHERE email = 'admin@stitchyflow.com';

INSERT INTO users (
    email, 
    password_hash, 
    first_name, 
    last_name, 
    phone,
    role, 
    status, 
    email_verified
) VALUES (
    'admin@stitchyflow.com',
    '$2b$10$MfOVb6DbgAJOOYRwexleU.lzqzHMrCnChkfIHqQ1QcjUhVY2zc.Cm',
    'Admin',
    'StitchyFlow',
    '+92 333 3836851',
    'admin',
    'active',
    TRUE
);
```

### 3. Start the Application

```bash
./start.StitchyFlow.sh
```

### 4. Access Admin Panel

1. Open your browser
2. Navigate to: http://localhost:4000
3. Enter the credentials above
4. Click "LOGIN"

---

## Security Notes

⚠️ **IMPORTANT SECURITY RECOMMENDATIONS:**

1. **Change the default password immediately after first login**
2. Use a strong password with:
   - At least 12 characters
   - Mix of uppercase and lowercase letters
   - Numbers and special characters
3. **Never share admin credentials**
4. **Enable two-factor authentication** (if available)
5. **Regularly update passwords**
6. **Monitor admin activity logs**

---

## Troubleshooting

### Cannot Login

1. **Check if backend is running:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Verify database connection:**
   ```bash
   mysql -u root -p12345 -e "USE stitchyflow; SELECT * FROM users WHERE email='admin@stitchyflow.com';"
   ```

3. **Check admin user exists:**
   ```sql
   USE stitchyflow;
   SELECT user_id, email, role, status FROM users WHERE email = 'admin@stitchyflow.com';
   ```

4. **Verify user is active:**
   - Status should be 'active'
   - email_verified should be TRUE

### Reset Admin Password

If you need to reset the admin password:

```bash
# Generate new hash
cd StitchyFlow/backend
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YourNewPassword', 10, (err, hash) => { console.log('New Hash:', hash); });"

# Update in database
mysql -u root -p12345 -e "USE stitchyflow; UPDATE users SET password_hash='NEW_HASH_HERE' WHERE email='admin@stitchyflow.com';"
```

---

## Additional Admin Accounts

To create additional admin accounts:

```sql
USE stitchyflow;

INSERT INTO users (
    email, 
    password_hash, 
    first_name, 
    last_name, 
    phone,
    role, 
    status, 
    email_verified
) VALUES (
    'newadmin@stitchyflow.com',
    'BCRYPT_HASH_HERE',
    'First Name',
    'Last Name',
    'Phone Number',
    'admin',
    'active',
    TRUE
);
```

---

## System Information

- **Admin Panel Port:** 4000
- **Backend API Port:** 5000
- **Frontend Port:** 3000
- **Database Port:** 3306
- **phpMyAdmin:** http://localhost:8080/phpmyadmin

---

## Support

For technical support or issues:

- **Developer:** Muhammad Kalim
- **Email:** info@logixinventor.com
- **Phone/WhatsApp:** +92 333 3836851
- **Company:** LogixInventor (PVT) Ltd.
- **Website:** www.logixinventor.com

---

**Last Updated:** March 30, 2026  
**Version:** 1.1.0
