-- Fix All Definer Issues in stitchyflow database
-- Drop and recreate all procedures, functions, views, and triggers with root@localhost definer

USE stitchyflow;

-- =====================================================
-- DROP ALL EXISTING PROCEDURES, FUNCTIONS, VIEWS, TRIGGERS
-- =====================================================

-- Drop all stored procedures
DROP PROCEDURE IF EXISTS sp_create_user;
DROP PROCEDURE IF EXISTS sp_authenticate_user;
DROP PROCEDURE IF EXISTS sp_create_order;
DROP PROCEDURE IF EXISTS sp_update_order_status;
DROP PROCEDURE IF EXISTS sp_add_review;
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

-- Drop all functions
DROP FUNCTION IF EXISTS fn_calculate_order_total;
DROP FUNCTION IF EXISTS fn_get_tailor_rating;
DROP FUNCTION IF EXISTS fn_generate_order_number;
DROP FUNCTION IF EXISTS fn_get_verification_expire_minutes;

-- Drop all views
DROP VIEW IF EXISTS vw_order_details;
DROP VIEW IF EXISTS vw_tailor_statistics;
DROP VIEW IF EXISTS vw_business_dashboard;
DROP VIEW IF EXISTS vw_admin_analytics;

-- Drop all triggers
DROP TRIGGER IF EXISTS trg_after_review_insert;
DROP TRIGGER IF EXISTS trg_after_order_status_update;
DROP TRIGGER IF EXISTS trg_before_user_delete;
DROP TRIGGER IF EXISTS trg_after_payment_insert;

-- =====================================================
-- RECREATE STORED PROCEDURES WITH CORRECT DEFINER
-- =====================================================

DELIMITER $$

-- Original procedures from database_setup.sql
CREATE DEFINER=`root`@`localhost` PROCEDURE sp_create_user(
    IN p_email VARCHAR(255),
    IN p_password_hash VARCHAR(255),
    IN p_first_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
    IN p_phone VARCHAR(20),
    IN p_role ENUM('admin', 'business_owner', 'tailor', 'customer'),
    OUT p_user_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error creating user';
    END;
    
    START TRANSACTION;
    
    INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
    VALUES (p_email, p_password_hash, p_first_name, p_last_name, p_phone, p_role);
    
    SET p_user_id = LAST_INSERT_ID();
    
    IF p_role = 'customer' THEN
        INSERT INTO customers (user_id) VALUES (p_user_id);
    ELSEIF p_role = 'tailor' THEN
        INSERT INTO tailors (user_id) VALUES (p_user_id);
    END IF;
    
    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE sp_authenticate_user(
    IN p_email VARCHAR(255)
)
BEGIN
    SELECT 
        user_id,
        email,
        password_hash,
        first_name,
        last_name,
        role,
        status
    FROM users
    WHERE email = p_email AND status = 'active';
    
    UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = p_email;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE sp_create_order(
    IN p_customer_id INT,
    IN p_tailor_id INT,
    IN p_business_id INT,
    IN p_garment_type VARCHAR(100),
    IN p_description TEXT,
    IN p_special_instructions TEXT,
    IN p_estimated_price DECIMAL(10,2),
    OUT p_order_id INT,
    OUT p_order_number VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error creating order';
    END;
    
    START TRANSACTION;
    
    SET p_order_number = CONCAT('ORD-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 10000), 4, '0'));
    
    INSERT INTO orders (
        order_number, customer_id, tailor_id, business_id,
        garment_type, description, special_instructions, estimated_price
    ) VALUES (
        p_order_number, p_customer_id, p_tailor_id, p_business_id,
        p_garment_type, p_description, p_special_instructions, p_estimated_price
    );
    
    SET p_order_id = LAST_INSERT_ID();
    
    UPDATE customers SET total_orders = total_orders + 1 WHERE customer_id = p_customer_id;
    
    IF p_tailor_id IS NOT NULL THEN
        UPDATE tailors SET total_orders = total_orders + 1 WHERE tailor_id = p_tailor_id;
    END IF;
    
    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE sp_update_order_status(
    IN p_order_id INT,
    IN p_new_status VARCHAR(50),
    IN p_changed_by INT,
    IN p_notes TEXT
)
BEGIN
    DECLARE v_old_status VARCHAR(50);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error updating order status';
    END;
    
    START TRANSACTION;
    
    SELECT status INTO v_old_status FROM orders WHERE order_id = p_order_id;
    
    UPDATE orders SET status = p_new_status WHERE order_id = p_order_id;
    
    INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, notes)
    VALUES (p_order_id, v_old_status, p_new_status, p_changed_by, p_notes);
    
    IF p_new_status = 'completed' THEN
        UPDATE tailors t
        INNER JOIN orders o ON t.tailor_id = o.tailor_id
        SET t.completed_orders = t.completed_orders + 1
        WHERE o.order_id = p_order_id;
    END IF;
    
    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE sp_add_review(
    IN p_order_id INT,
    IN p_customer_id INT,
    IN p_tailor_id INT,
    IN p_rating INT,
    IN p_comment TEXT,
    OUT p_review_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error adding review';
    END;
    
    START TRANSACTION;
    
    INSERT INTO reviews (order_id, customer_id, tailor_id, rating, comment)
    VALUES (p_order_id, p_customer_id, p_tailor_id, p_rating, p_comment);
    
    SET p_review_id = LAST_INSERT_ID();
    
    UPDATE tailors
    SET rating = (
        SELECT AVG(rating)
        FROM reviews
        WHERE tailor_id = p_tailor_id AND status = 'approved'
    )
    WHERE tailor_id = p_tailor_id;
    
    COMMIT;
END$$

-- New procedures from customer_portal_updates.sql
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

-- =====================================================
-- RECREATE FUNCTIONS WITH CORRECT DEFINER
-- =====================================================

CREATE DEFINER=`root`@`localhost` FUNCTION fn_calculate_order_total(p_order_id INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_total DECIMAL(10,2);
    
    SELECT COALESCE(final_price, estimated_price, 0.00)
    INTO v_total
    FROM orders
    WHERE order_id = p_order_id;
    
    RETURN v_total;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION fn_get_tailor_rating(p_tailor_id INT)
RETURNS DECIMAL(3,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_rating DECIMAL(3,2);
    
    SELECT COALESCE(AVG(rating), 0.00)
    INTO v_rating
    FROM reviews
    WHERE tailor_id = p_tailor_id AND status = 'approved';
    
    RETURN v_rating;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION fn_generate_order_number()
RETURNS VARCHAR(50)
NOT DETERMINISTIC
BEGIN
    DECLARE v_order_number VARCHAR(50);
    DECLARE v_count INT;
    
    REPEAT
        SET v_order_number = CONCAT(
            'ORD-',
            DATE_FORMAT(NOW(), '%Y%m%d'),
            '-',
            LPAD(FLOOR(RAND() * 10000), 4, '0')
        );
        
        SELECT COUNT(*) INTO v_count
        FROM orders
        WHERE order_number = v_order_number;
    UNTIL v_count = 0
    END REPEAT;
    
    RETURN v_order_number;
END$$

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

-- =====================================================
-- RECREATE VIEWS WITH CORRECT DEFINER
-- =====================================================

CREATE DEFINER=`root`@`localhost` VIEW vw_order_details AS
SELECT 
    o.order_id,
    o.order_number,
    o.status,
    o.garment_type,
    o.estimated_price,
    o.final_price,
    o.created_at,
    o.estimated_completion_date,
    CONCAT(cu_user.first_name, ' ', cu_user.last_name) AS customer_name,
    cu_user.email AS customer_email,
    cu_user.phone AS customer_phone,
    CONCAT(t_user.first_name, ' ', t_user.last_name) AS tailor_name,
    t.rating AS tailor_rating,
    b.business_name,
    p.payment_status,
    p.amount AS payment_amount
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN users cu_user ON c.user_id = cu_user.user_id
LEFT JOIN tailors t ON o.tailor_id = t.tailor_id
LEFT JOIN users t_user ON t.user_id = t_user.user_id
LEFT JOIN businesses b ON o.business_id = b.business_id
LEFT JOIN payments p ON o.order_id = p.order_id;

CREATE DEFINER=`root`@`localhost` VIEW vw_tailor_statistics AS
SELECT 
    t.tailor_id,
    CONCAT(u.first_name, ' ', u.last_name) AS tailor_name,
    u.email,
    t.rating,
    t.total_orders,
    t.completed_orders,
    t.availability_status,
    ROUND((t.completed_orders / NULLIF(t.total_orders, 0)) * 100, 2) AS completion_rate,
    COUNT(DISTINCT r.review_id) AS total_reviews,
    b.business_name
FROM tailors t
INNER JOIN users u ON t.user_id = u.user_id
LEFT JOIN reviews r ON t.tailor_id = r.tailor_id
LEFT JOIN businesses b ON t.business_id = b.business_id
GROUP BY t.tailor_id, u.first_name, u.last_name, u.email, t.rating, 
         t.total_orders, t.completed_orders, t.availability_status, b.business_name;

CREATE DEFINER=`root`@`localhost` VIEW vw_business_dashboard AS
SELECT 
    b.business_id,
    b.business_name,
    COUNT(DISTINCT t.tailor_id) AS total_tailors,
    COUNT(DISTINCT o.order_id) AS total_orders,
    SUM(CASE WHEN o.status = 'completed' THEN 1 ELSE 0 END) AS completed_orders,
    SUM(CASE WHEN o.status = 'in_progress' THEN 1 ELSE 0 END) AS active_orders,
    SUM(CASE WHEN p.payment_status = 'completed' THEN p.amount ELSE 0 END) AS total_revenue,
    AVG(t.rating) AS average_tailor_rating
FROM businesses b
LEFT JOIN tailors t ON b.business_id = t.business_id
LEFT JOIN orders o ON b.business_id = o.business_id
LEFT JOIN payments p ON o.order_id = p.order_id
GROUP BY b.business_id, b.business_name;

CREATE DEFINER=`root`@`localhost` VIEW vw_admin_analytics AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'customer') AS total_customers,
    (SELECT COUNT(*) FROM users WHERE role = 'tailor') AS total_tailors,
    (SELECT COUNT(*) FROM users WHERE role = 'business_owner') AS total_business_owners,
    (SELECT COUNT(*) FROM businesses WHERE status = 'approved') AS active_businesses,
    (SELECT COUNT(*) FROM orders) AS total_orders,
    (SELECT COUNT(*) FROM orders WHERE status = 'completed') AS completed_orders,
    (SELECT COUNT(*) FROM orders WHERE status = 'in_progress') AS active_orders,
    (SELECT SUM(amount) FROM payments WHERE payment_status = 'completed') AS total_revenue,
    (SELECT AVG(rating) FROM tailors) AS average_platform_rating;

-- =====================================================
-- RECREATE TRIGGERS WITH CORRECT DEFINER
-- =====================================================

DELIMITER $$

CREATE DEFINER=`root`@`localhost` TRIGGER trg_after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE tailors
    SET rating = (
        SELECT AVG(rating)
        FROM reviews
        WHERE tailor_id = NEW.tailor_id AND status = 'approved'
    )
    WHERE tailor_id = NEW.tailor_id;
END$$

CREATE DEFINER=`root`@`localhost` TRIGGER trg_after_order_status_update
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.status != OLD.status THEN
        INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id)
        SELECT 
            u.user_id,
            'Order Status Updated',
            CONCAT('Your order ', NEW.order_number, ' status changed to ', NEW.status),
            'info',
            'order',
            NEW.order_id
        FROM customers c
        INNER JOIN users u ON c.user_id = u.user_id
        WHERE c.customer_id = NEW.customer_id;
    END IF;
    
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE orders SET actual_completion_date = CURRENT_DATE WHERE order_id = NEW.order_id;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` TRIGGER trg_before_user_delete
BEFORE DELETE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values)
    VALUES (
        OLD.user_id,
        'DELETE',
        'user',
        OLD.user_id,
        JSON_OBJECT(
            'email', OLD.email,
            'role', OLD.role,
            'status', OLD.status
        )
    );
END$$

CREATE DEFINER=`root`@`localhost` TRIGGER trg_after_payment_insert
AFTER INSERT ON payments
FOR EACH ROW
BEGIN
    INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id)
    SELECT 
        u.user_id,
        'Payment Received',
        CONCAT('Payment of ', NEW.amount, ' received for order'),
        'success',
        'payment',
        NEW.payment_id
    FROM customers c
    INNER JOIN users u ON c.user_id = u.user_id
    WHERE c.customer_id = NEW.customer_id;
END$$

DELIMITER ;

SELECT 'All definer issues fixed successfully!' AS message;
