/**
 * Sessions Management System - Database Schema
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */

USE stitchyflow;

-- Sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  session_id     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        INT UNSIGNED NOT NULL,
  session_token  VARCHAR(512) NOT NULL,
  ip_address     VARCHAR(64)  DEFAULT NULL,
  user_agent     TEXT         DEFAULT NULL,
  device_type    VARCHAR(50)  DEFAULT 'unknown',
  browser        VARCHAR(100) DEFAULT NULL,
  os             VARCHAR(100) DEFAULT NULL,
  location       VARCHAR(255) DEFAULT NULL,
  status         ENUM('active','inactive','deleted','pending') NOT NULL DEFAULT 'active',
  last_activity  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  expires_at     DATETIME     DEFAULT NULL,
  created_at     DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at     DATETIME     DEFAULT NULL,
  INDEX idx_user_id  (user_id),
  INDEX idx_status   (status),
  INDEX idx_token    (session_token(64)),
  INDEX idx_created  (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Session logs table
CREATE TABLE IF NOT EXISTS session_logs (
  log_id       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id   BIGINT UNSIGNED DEFAULT NULL,
  user_id      INT UNSIGNED    DEFAULT NULL,
  action       VARCHAR(100)    NOT NULL,
  ip_address   VARCHAR(64)     DEFAULT NULL,
  user_agent   TEXT            DEFAULT NULL,
  details      TEXT            DEFAULT NULL,
  created_at   DATETIME        DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_session_id (session_id),
  INDEX idx_user_id    (user_id),
  INDEX idx_action     (action),
  INDEX idx_created    (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- View: active sessions with user info
CREATE OR REPLACE VIEW v_active_sessions AS
SELECT
  s.session_id, s.user_id, s.ip_address, s.device_type, s.browser, s.os,
  s.location, s.last_activity, s.expires_at, s.created_at,
  CONCAT(u.first_name, ' ', u.last_name) AS user_name,
  u.email AS user_email
FROM user_sessions s
LEFT JOIN users u ON s.user_id = u.user_id
WHERE s.status = 'active';

-- View: inactive sessions
CREATE OR REPLACE VIEW v_inactive_sessions AS
SELECT
  s.session_id, s.user_id, s.ip_address, s.device_type, s.browser, s.os,
  s.location, s.last_activity, s.expires_at, s.created_at, s.updated_at,
  CONCAT(u.first_name, ' ', u.last_name) AS user_name,
  u.email AS user_email
FROM user_sessions s
LEFT JOIN users u ON s.user_id = u.user_id
WHERE s.status = 'inactive';

-- View: deleted sessions
CREATE OR REPLACE VIEW v_deleted_sessions AS
SELECT
  s.session_id, s.user_id, s.ip_address, s.device_type, s.browser, s.os,
  s.location, s.last_activity, s.deleted_at, s.created_at,
  CONCAT(u.first_name, ' ', u.last_name) AS user_name,
  u.email AS user_email
FROM user_sessions s
LEFT JOIN users u ON s.user_id = u.user_id
WHERE s.status = 'deleted';

-- View: pending sessions
CREATE OR REPLACE VIEW v_pending_sessions AS
SELECT
  s.session_id, s.user_id, s.ip_address, s.device_type, s.browser, s.os,
  s.location, s.last_activity, s.expires_at, s.created_at,
  CONCAT(u.first_name, ' ', u.last_name) AS user_name,
  u.email AS user_email
FROM user_sessions s
LEFT JOIN users u ON s.user_id = u.user_id
WHERE s.status = 'pending';

-- Stored procedure: terminate a session
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS sp_terminate_session(IN p_session_id BIGINT, IN p_admin_note VARCHAR(255))
BEGIN
  UPDATE user_sessions
  SET status = 'deleted', deleted_at = NOW(), updated_at = NOW()
  WHERE session_id = p_session_id;

  INSERT INTO session_logs (session_id, action, details, created_at)
  VALUES (p_session_id, 'TERMINATED', p_admin_note, NOW());
END$$
DELIMITER ;

-- Mock seed data
INSERT INTO user_sessions (user_id, session_token, ip_address, device_type, browser, os, location, status, last_activity, expires_at)
VALUES
  (1, 'tok_active_001', '192.168.1.10', 'desktop', 'Chrome 120', 'Windows 11', 'Karachi, PK', 'active',   NOW(), DATE_ADD(NOW(), INTERVAL 8 HOUR)),
  (1, 'tok_inactive_001', '192.168.1.11', 'mobile', 'Safari 17', 'iOS 17', 'Lahore, PK', 'inactive', DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR)),
  (1, 'tok_pending_001', '10.0.0.5', 'tablet', 'Firefox 121', 'Android 14', 'Islamabad, PK', 'pending', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)),
  (1, 'tok_deleted_001', '172.16.0.1', 'desktop', 'Edge 120', 'Windows 10', 'Rawalpindi, PK', 'deleted', DATE_SUB(NOW(), INTERVAL 5 HOUR), NULL);

INSERT INTO session_logs (session_id, user_id, action, ip_address, details)
VALUES
  (1, 1, 'LOGIN',      '192.168.1.10', 'User logged in successfully'),
  (2, 1, 'LOGOUT',     '192.168.1.11', 'User logged out'),
  (3, 1, 'CREATED',    '10.0.0.5',     'New session created, awaiting verification'),
  (4, 1, 'TERMINATED', '172.16.0.1',   'Session terminated by admin');
