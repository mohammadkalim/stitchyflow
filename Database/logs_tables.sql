-- =====================================================
-- StitchyFlow - Logs Management Tables
-- Version: 1.0
-- Date: April 2, 2026
-- Developer by: Muhammad Kalim
-- Phone/WhatsApp: +92 333 3836851
-- Product of LogixInventor (PVT) Ltd.
-- Email: info@logixinventor.com
-- Website: www.logixinventor.com
-- =====================================================

USE stitchyflow;

-- =====================================================
-- system_logs Table
-- =====================================================
CREATE TABLE IF NOT EXISTS system_logs (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    level       ENUM('info', 'warn', 'error', 'debug') NOT NULL DEFAULT 'info',
    message     TEXT NOT NULL,
    source      VARCHAR(255) DEFAULT NULL,
    meta        JSON DEFAULT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_level      (level),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- audit_logs Table
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id           INT PRIMARY KEY AUTO_INCREMENT,
    user_id      INT DEFAULT NULL,
    user_name    VARCHAR(255) DEFAULT NULL,
    action       ENUM('create', 'update', 'delete', 'login', 'logout', 'view') NOT NULL,
    table_name   VARCHAR(100) DEFAULT NULL,
    record_id    INT DEFAULT NULL,
    description  TEXT DEFAULT NULL,
    ip_address   VARCHAR(45) DEFAULT NULL,
    user_agent   VARCHAR(500) DEFAULT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_user_id    (user_id),
    INDEX idx_action     (action),
    INDEX idx_created_at (created_at),

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Sample seed data for system_logs
-- =====================================================
INSERT INTO system_logs (level, message, source) VALUES
('info',  'Server started successfully on port 5000',         'server.js'),
('info',  'Database connection established',                   'config/database.js'),
('warn',  'JWT token expiry is set to less than 1 hour',       'middleware/auth.js'),
('error', 'Failed to send email: SMTP connection timeout',     'utils/mailer.js'),
('info',  'Admin user logged in',                              'routes/auth.routes.js'),
('debug', 'Order #ORD-0001 status updated to completed',       'routes/orders.routes.js'),
('warn',  'High memory usage detected: 85%',                   'system'),
('info',  'Business verification approved for ID 3',           'routes/verification.routes.js'),
('error', 'Unhandled promise rejection in payments route',     'routes/payments.routes.js'),
('info',  'SMTP settings updated by admin',                    'routes/smtp.routes.js');

-- =====================================================
-- Sample seed data for audit_logs
-- =====================================================
INSERT INTO audit_logs (user_id, user_name, action, table_name, record_id, description, ip_address) VALUES
(1, 'Admin',        'login',  'users',     1,    'Admin logged into the system',              '127.0.0.1'),
(1, 'Admin',        'create', 'users',     5,    'New customer account created',              '127.0.0.1'),
(1, 'Admin',        'update', 'orders',    3,    'Order status changed to completed',         '127.0.0.1'),
(1, 'Admin',        'delete', 'users',     7,    'User account deleted',                      '127.0.0.1'),
(2, 'Muhammad Kalim','login', 'users',     2,    'Business owner logged in',                  '192.168.1.10'),
(2, 'Muhammad Kalim','create','businesses',1,    'New business registered',                   '192.168.1.10'),
(2, 'Muhammad Kalim','update','businesses',1,    'Business profile updated',                  '192.168.1.10'),
(1, 'Admin',        'update', 'users',     2,    'User status changed to active',             '127.0.0.1'),
(1, 'Admin',        'logout', 'users',     1,    'Admin logged out',                          '127.0.0.1'),
(3, 'Tailor User',  'login',  'users',     3,    'Tailor logged in',                          '10.0.0.5');
