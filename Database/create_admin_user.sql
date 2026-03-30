-- =====================================================
-- Create Admin User for StitchyFlow
-- Developer by: Muhammad Kalim
-- Phone/WhatsApp: +92 333 3836851
-- Product of LogixInventor (PVT) Ltd.
-- Email: info@logixinventor.com
-- Website: www.logixinventor.com
-- =====================================================

USE stitchyflow;

-- Delete existing admin user if exists
DELETE FROM users WHERE email = 'admin@stitchyflow.com';

-- Insert admin user
-- Email: admin@stitchyflow.com
-- Password: Admin@123
-- Password hash generated with bcrypt (10 rounds)
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

SELECT 'Admin user created successfully!' AS message;
SELECT 'Email: admin@stitchyflow.com' AS credentials;
SELECT 'Password: Admin@123' AS credentials;
SELECT 'Please change the password after first login' AS note;
