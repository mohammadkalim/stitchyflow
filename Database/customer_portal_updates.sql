-- =====================================================
-- StitchyFlow Database Updates for Customer Portal Features
-- Version: 2.0
-- Date: April 1, 2026
-- Author: Muhammad Kalim, LogixInventor (PVT) Ltd.
-- =====================================================

USE stitchyflow;

-- =====================================================
-- NEW TABLES FOR EMAIL VERIFICATION AND PASSWORD RESET
-- =====================================================

-- Email Verification Codes Table
CREATE TABLE IF NOT EXISTS email_verification_codes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    verification_code VARCHAR(6) NOT NULL,
    user_data JSON NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    attempt_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_code (verification_code),
    INDEX idx_expires (expires_at),
    INDEX idx_is_used (is_used)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Password Reset Tokens Table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255) NOT NULL,
    old_password_hash VARCHAR(255),
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_token (reset_token),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'integer', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default verification code expire time (10 minutes = 600 seconds)
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) 
VALUES ('verification_code_expire_minutes', '10', 'integer', 'Email verification code expiration time in minutes')
ON DUPLICATE KEY UPDATE setting_value = '10';

-- Insert default password reset expire time (30 minutes)
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) 
VALUES ('password_reset_expire_minutes', '30', 'integer', 'Password reset token expiration time in minutes')
ON DUPLICATE KEY UPDATE setting_value = '30';

-- Update users table to add customer_type (ignore error if column already exists)
-- Note: MySQL doesn't support IF NOT EXISTS for ADD COLUMN, so we use a different approach
ALTER TABLE users ADD COLUMN customer_type ENUM('standard', 'professional', 'corporate', 'new_style') DEFAULT 'standard' AFTER role;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER $$

-- Create verification code
CREATE PROCEDURE IF NOT EXISTS sp_create_verification_code(
    IN p_email VARCHAR(255),
    IN p_code VARCHAR(6),
    IN p_user_data JSON,
    IN p_expire_minutes INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error creating verification code';
    END;
    
    START TRANSACTION;
    
    -- Invalidate old codes for this email
    UPDATE email_verification_codes 
    SET is_used = TRUE 
    WHERE email = p_email AND is_used = FALSE;
    
    -- Create new code
    INSERT INTO email_verification_codes (email, verification_code, user_data, expires_at)
    VALUES (p_email, p_code, p_user_data, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL p_expire_minutes MINUTE));
    
    COMMIT;
END$$

-- Verify code
CREATE PROCEDURE IF NOT EXISTS sp_verify_code(
    IN p_email VARCHAR(255),
    IN p_code VARCHAR(6)
)
BEGIN
    SELECT 
        id,
        email,
        verification_code,
        user_data,
        expires_at,
        is_used,
        attempt_count,
        CASE 
            WHEN is_used = TRUE THEN 'already_used'
            WHEN expires_at < CURRENT_TIMESTAMP THEN 'expired'
            WHEN verification_code != p_code THEN 'invalid'
            ELSE 'valid'
        END AS verification_status
    FROM email_verification_codes
    WHERE email = p_email
    ORDER BY created_at DESC
    LIMIT 1;
END$$

-- Mark code as used
CREATE PROCEDURE IF NOT EXISTS sp_mark_code_used(
    IN p_code_id INT
)
BEGIN
    UPDATE email_verification_codes 
    SET is_used = TRUE, attempt_count = attempt_count + 1
    WHERE id = p_code_id;
END$$

-- Increment attempt count
CREATE PROCEDURE IF NOT EXISTS sp_increment_attempt(
    IN p_code_id INT
)
BEGIN
    UPDATE email_verification_codes 
    SET attempt_count = attempt_count + 1
    WHERE id = p_code_id;
END$$

-- Create password reset token
CREATE PROCEDURE IF NOT EXISTS sp_create_password_reset(
    IN p_email VARCHAR(255),
    IN p_token VARCHAR(255),
    IN p_old_password_hash VARCHAR(255),
    IN p_expire_minutes INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error creating password reset';
    END;
    
    START TRANSACTION;
    
    -- Invalidate old tokens for this email
    UPDATE password_reset_tokens 
    SET is_used = TRUE 
    WHERE email = p_email AND is_used = FALSE;
    
    -- Create new token
    INSERT INTO password_reset_tokens (email, reset_token, old_password_hash, expires_at)
    VALUES (p_email, p_token, p_old_password_hash, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL p_expire_minutes MINUTE));
    
    COMMIT;
END$$

-- Verify password reset token
CREATE PROCEDURE IF NOT EXISTS sp_verify_reset_token(
    IN p_email VARCHAR(255),
    IN p_token VARCHAR(255)
)
BEGIN
    SELECT 
        id,
        email,
        reset_token,
        old_password_hash,
        expires_at,
        is_used,
        CASE 
            WHEN is_used = TRUE THEN 'already_used'
            WHEN expires_at < CURRENT_TIMESTAMP THEN 'expired'
            WHEN reset_token != p_token THEN 'invalid'
            ELSE 'valid'
        END AS token_status
    FROM password_reset_tokens
    WHERE email = p_email
    ORDER BY created_at DESC
    LIMIT 1;
END$$

-- Mark reset token as used
CREATE PROCEDURE IF NOT EXISTS sp_mark_reset_used(
    IN p_token_id INT
)
BEGIN
    UPDATE password_reset_tokens 
    SET is_used = TRUE
    WHERE id = p_token_id;
END$$

-- Get system setting
CREATE PROCEDURE IF NOT EXISTS sp_get_setting(
    IN p_key VARCHAR(100)
)
BEGIN
    SELECT setting_value, setting_type, description
    FROM system_settings
    WHERE setting_key = p_key;
END$$

-- Update system setting
CREATE PROCEDURE IF NOT EXISTS sp_update_setting(
    IN p_key VARCHAR(100),
    IN p_value TEXT,
    IN p_type VARCHAR(20)
)
BEGIN
    INSERT INTO system_settings (setting_key, setting_value, setting_type)
    VALUES (p_key, p_value, p_type)
    ON DUPLICATE KEY UPDATE 
        setting_value = p_value,
        setting_type = p_type,
        updated_at = CURRENT_TIMESTAMP;
END$$

-- Clean expired codes (can be run periodically)
CREATE PROCEDURE IF NOT EXISTS sp_clean_expired_codes()
BEGIN
    DELETE FROM email_verification_codes 
    WHERE expires_at < DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 24 HOUR);
    
    DELETE FROM password_reset_tokens 
    WHERE expires_at < DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 24 HOUR);
END$$

DELIMITER ;

-- =====================================================
-- FUNCTION TO GET VERIFICATION EXPIRE TIME
-- =====================================================

DELIMITER $$

CREATE FUNCTION IF NOT EXISTS fn_get_verification_expire_minutes()
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_minutes INT;
    
    SELECT COALESCE(CAST(setting_value AS UNSIGNED), 10)
    INTO v_minutes
    FROM system_settings
    WHERE setting_key = 'verification_code_expire_minutes';
    
    IF v_minutes IS NULL THEN
        SET v_minutes = 10;
    END IF;
    
    RETURN v_minutes;
END$$

DELIMITER ;

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Add some sample customer types to existing users if any
-- UPDATE users SET customer_type = 'standard' WHERE role = 'customer' AND customer_type IS NULL;

SELECT 'Database updates completed successfully!' AS message;
SELECT 'New tables created: email_verification_codes, password_reset_tokens, system_settings' AS info;
SELECT 'New stored procedures created for verification and password reset' AS info;
SELECT 'Default verification code expire time: 10 minutes' AS info;

