-- Fix MySQL Definer Issues
-- This script recreates all stored procedures and functions with root@localhost definer

USE stitchyflow;

-- Drop existing procedures with wrong definers
DROP PROCEDURE IF EXISTS sp_create_verification_code;
DROP PROCEDURE IF EXISTS sp_verify_code;
DROP PROCEDURE IF EXISTS sp_mark_code_used;
DROP PROCEDURE IF EXISTS sp_increment_attempt;
DROP PROCEDURE IF EXISTS sp_create_password_reset;
DROP PROCEDURE IF EXISTS sp_verify_reset_token;
DROP PROCEDURE IF EXISTS sp_mark_reset_used;
DROP PROCEDURE IF EXISTS sp_get_setting;
DROP PROCEDURE IF EXISTS sp_update_setting;
DROP PROCEDURE IF EXISTS sp_clean_expired_codes;

-- Recreate with correct definer
DELIMITER $$

CREATE DEFINER=`root`@`localhost` PROCEDURE sp_create_verification_code(
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
    
    UPDATE email_verification_codes 
    SET is_used = TRUE 
    WHERE email = p_email AND is_used = FALSE;
    
    INSERT INTO email_verification_codes (email, verification_code, user_data, expires_at)
    VALUES (p_email, p_code, p_user_data, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL p_expire_minutes MINUTE));
    
    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE sp_verify_code(
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

CREATE DEFINER=`root`@`localhost` PROCEDURE sp_mark_code_used(
    IN p_code_id INT
)
BEGIN
    UPDATE email_verification_codes 
    SET is_used = TRUE, attempt_count = attempt_count + 1
    WHERE id = p_code_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE sp_increment_attempt(
    IN p_code_id INT
)
BEGIN
    UPDATE email_verification_codes 
    SET attempt_count = attempt_count + 1
    WHERE id = p_code_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE sp_create_password_reset(
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
    
    UPDATE password_reset_tokens 
    SET is_used = TRUE 
    WHERE email = p_email AND is_used = FALSE;
    
    INSERT INTO password_reset_tokens (email, reset_token, old_password_hash, expires_at)
    VALUES (p_email, p_token, p_old_password_hash, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL p_expire_minutes MINUTE));
    
    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE sp_verify_reset_token(
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

CREATE DEFINER=`root`@`localhost` PROCEDURE sp_mark_reset_used(
    IN p_token_id INT
)
BEGIN
    UPDATE password_reset_tokens 
    SET is_used = TRUE
    WHERE id = p_token_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE sp_get_setting(
    IN p_key VARCHAR(100)
)
BEGIN
    SELECT setting_value, setting_type, description
    FROM system_settings
    WHERE setting_key = p_key;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE sp_update_setting(
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

CREATE DEFINER=`root`@`localhost` PROCEDURE sp_clean_expired_codes()
BEGIN
    DELETE FROM email_verification_codes 
    WHERE expires_at < DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 24 HOUR);
    
    DELETE FROM password_reset_tokens 
    WHERE expires_at < DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 24 HOUR);
END$$

-- Recreate function with correct definer
DROP FUNCTION IF EXISTS fn_get_verification_expire_minutes$$

CREATE DEFINER=`root`@`localhost` FUNCTION fn_get_verification_expire_minutes()
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

SELECT 'Definer issues fixed successfully!' AS message;
