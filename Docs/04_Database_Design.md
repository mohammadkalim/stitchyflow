# Database Design Document

**Project Name:** StitchyFlow  
**Version:** 1.0  
**Date:** March 30, 2026  
**Prepared by:** Muhammad Kalim, LogixInventor (PVT) Ltd.

---

## 1. Introduction

### 1.1 Purpose
This document provides comprehensive database design specifications for StitchyFlow, including schema design, relationships, stored procedures, functions, views, and triggers.

### 1.2 Database System
- **RDBMS:** MySQL 8.0+
- **Port:** 3306
- **Character Set:** utf8mb4
- **Collation:** utf8mb4_unicode_ci
- **Storage Engine:** InnoDB

### 1.3 Design Principles
- Highly normalized (3NF minimum)
- Referential integrity through foreign keys
- Optimized indexing strategy
- Stored procedures for business logic
- Functions for reusable calculations
- Views for complex queries
- Triggers for data consistency

---

## 2. Database Schema

### 2.1 Entity Relationship Overview

**Core Entities:**
- Users (Admin, Business Owner, Tailor, Customer)
- Businesses
- Orders
- Measurements
- Payments
- Reviews
- Notifications
- Audit Logs

---

## 3. Table Definitions

### 3.1 users Table

```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'business_owner', 'tailor', 'customer') NOT NULL,
    status ENUM('pending', 'active', 'suspended', 'inactive') DEFAULT 'pending',
    email_verified BOOLEAN DEFAULT FALSE,
    profile_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.2 businesses Table

```sql
CREATE TABLE businesses (
    business_id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Pakistan',
    phone VARCHAR(20),
    email VARCHAR(255),
    logo VARCHAR(500),
    status ENUM('pending', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_owner (owner_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.3 tailors Table

```sql
CREATE TABLE tailors (
    tailor_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    business_id INT,
    specialization TEXT,
    experience_years INT,
    hourly_rate DECIMAL(10,2),
    availability_status ENUM('available', 'busy', 'unavailable') DEFAULT 'available',
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_orders INT DEFAULT 0,
    completed_orders INT DEFAULT 0,
    bio TEXT,
    skills JSON,
    portfolio_images JSON,
    status ENUM('pending', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES businesses(business_id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_business (business_id),
    INDEX idx_status (status),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```



### 3.4 customers Table

```sql
CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    preferred_contact ENUM('email', 'phone', 'both') DEFAULT 'both',
    total_orders INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.5 orders Table

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT NOT NULL,
    tailor_id INT,
    business_id INT,
    garment_type VARCHAR(100) NOT NULL,
    description TEXT,
    special_instructions TEXT,
    reference_images JSON,
    status ENUM('pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    estimated_price DECIMAL(10,2),
    final_price DECIMAL(10,2),
    estimated_completion_date DATE,
    actual_completion_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (tailor_id) REFERENCES tailors(tailor_id) ON DELETE SET NULL,
    FOREIGN KEY (business_id) REFERENCES businesses(business_id) ON DELETE SET NULL,
    INDEX idx_customer (customer_id),
    INDEX idx_tailor (tailor_id),
    INDEX idx_business (business_id),
    INDEX idx_status (status),
    INDEX idx_order_number (order_number),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.6 measurements Table

```sql
CREATE TABLE measurements (
    measurement_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    customer_id INT NOT NULL,
    measurement_type VARCHAR(50),
    chest DECIMAL(5,2),
    waist DECIMAL(5,2),
    hips DECIMAL(5,2),
    shoulder_width DECIMAL(5,2),
    sleeve_length DECIMAL(5,2),
    shirt_length DECIMAL(5,2),
    neck DECIMAL(5,2),
    inseam DECIMAL(5,2),
    additional_measurements JSON,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_customer (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.7 payments Table

```sql
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    customer_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'card', 'online', 'bank_transfer') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP NULL,
    refund_amount DECIMAL(10,2) DEFAULT 0.00,
    refund_date TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_customer (customer_id),
    INDEX idx_status (payment_status),
    INDEX idx_transaction (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.8 reviews Table

```sql
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    customer_id INT NOT NULL,
    tailor_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    images JSON,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (tailor_id) REFERENCES tailors(tailor_id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_tailor (tailor_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.9 notifications Table

```sql
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    related_entity_type VARCHAR(50),
    related_entity_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.10 order_status_history Table

```sql
CREATE TABLE order_status_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```



### 3.11 audit_logs Table

```sql
CREATE TABLE audit_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.12 refresh_tokens Table

```sql
CREATE TABLE refresh_tokens (
    token_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_token (token),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 4. Stored Procedures

### 4.1 User Management Procedures

#### 4.1.1 sp_create_user
```sql
DELIMITER $$

CREATE PROCEDURE sp_create_user(
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
    
    -- Create role-specific record
    IF p_role = 'customer' THEN
        INSERT INTO customers (user_id) VALUES (p_user_id);
    ELSEIF p_role = 'tailor' THEN
        INSERT INTO tailors (user_id) VALUES (p_user_id);
    END IF;
    
    COMMIT;
END$$

DELIMITER ;
```

#### 4.1.2 sp_authenticate_user
```sql
DELIMITER $$

CREATE PROCEDURE sp_authenticate_user(
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
    
    -- Update last login
    UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = p_email;
END$$

DELIMITER ;
```

### 4.2 Order Management Procedures

#### 4.2.1 sp_create_order
```sql
DELIMITER $$

CREATE PROCEDURE sp_create_order(
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
    
    -- Generate unique order number
    SET p_order_number = CONCAT('ORD-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 10000), 4, '0'));
    
    INSERT INTO orders (
        order_number, customer_id, tailor_id, business_id,
        garment_type, description, special_instructions, estimated_price
    ) VALUES (
        p_order_number, p_customer_id, p_tailor_id, p_business_id,
        p_garment_type, p_description, p_special_instructions, p_estimated_price
    );
    
    SET p_order_id = LAST_INSERT_ID();
    
    -- Update customer total orders
    UPDATE customers SET total_orders = total_orders + 1 WHERE customer_id = p_customer_id;
    
    -- Update tailor total orders
    IF p_tailor_id IS NOT NULL THEN
        UPDATE tailors SET total_orders = total_orders + 1 WHERE tailor_id = p_tailor_id;
    END IF;
    
    COMMIT;
END$$

DELIMITER ;
```

#### 4.2.2 sp_update_order_status
```sql
DELIMITER $$

CREATE PROCEDURE sp_update_order_status(
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
    
    -- Get current status
    SELECT status INTO v_old_status FROM orders WHERE order_id = p_order_id;
    
    -- Update order status
    UPDATE orders SET status = p_new_status WHERE order_id = p_order_id;
    
    -- Log status change
    INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, notes)
    VALUES (p_order_id, v_old_status, p_new_status, p_changed_by, p_notes);
    
    -- If completed, update tailor completed orders
    IF p_new_status = 'completed' THEN
        UPDATE tailors t
        INNER JOIN orders o ON t.tailor_id = o.tailor_id
        SET t.completed_orders = t.completed_orders + 1
        WHERE o.order_id = p_order_id;
    END IF;
    
    COMMIT;
END$$

DELIMITER ;
```

### 4.3 Review Management Procedures

#### 4.3.1 sp_add_review
```sql
DELIMITER $$

CREATE PROCEDURE sp_add_review(
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
    
    -- Update tailor rating
    UPDATE tailors
    SET rating = (
        SELECT AVG(rating)
        FROM reviews
        WHERE tailor_id = p_tailor_id AND status = 'approved'
    )
    WHERE tailor_id = p_tailor_id;
    
    COMMIT;
END$$

DELIMITER ;
```

---

## 5. Database Functions

### 5.1 fn_calculate_order_total
```sql
DELIMITER $$

CREATE FUNCTION fn_calculate_order_total(p_order_id INT)
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

DELIMITER ;
```

### 5.2 fn_get_tailor_rating
```sql
DELIMITER $$

CREATE FUNCTION fn_get_tailor_rating(p_tailor_id INT)
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

DELIMITER ;
```

### 5.3 fn_generate_order_number
```sql
DELIMITER $$

CREATE FUNCTION fn_generate_order_number()
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

DELIMITER ;
```



---

## 6. Database Views

### 6.1 vw_order_details
```sql
CREATE VIEW vw_order_details AS
SELECT 
    o.order_id,
    o.order_number,
    o.status,
    o.garment_type,
    o.estimated_price,
    o.final_price,
    o.created_at,
    o.estimated_completion_date,
    CONCAT(cu.first_name, ' ', cu.last_name) AS customer_name,
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
```

### 6.2 vw_tailor_statistics
```sql
CREATE VIEW vw_tailor_statistics AS
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
GROUP BY t.tailor_id;
```

### 6.3 vw_business_dashboard
```sql
CREATE VIEW vw_business_dashboard AS
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
GROUP BY b.business_id;
```

### 6.4 vw_admin_analytics
```sql
CREATE VIEW vw_admin_analytics AS
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
```

---

## 7. Database Triggers

### 7.1 trg_after_review_insert
```sql
DELIMITER $$

CREATE TRIGGER trg_after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    -- Update tailor rating
    UPDATE tailors
    SET rating = (
        SELECT AVG(rating)
        FROM reviews
        WHERE tailor_id = NEW.tailor_id AND status = 'approved'
    )
    WHERE tailor_id = NEW.tailor_id;
END$$

DELIMITER ;
```

### 7.2 trg_after_order_status_update
```sql
DELIMITER $$

CREATE TRIGGER trg_after_order_status_update
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    -- Create notification for customer
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
    
    -- Update completion date if status is completed
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE orders SET actual_completion_date = CURRENT_DATE WHERE order_id = NEW.order_id;
    END IF;
END$$

DELIMITER ;
```

### 7.3 trg_before_user_delete
```sql
DELIMITER $$

CREATE TRIGGER trg_before_user_delete
BEFORE DELETE ON users
FOR EACH ROW
BEGIN
    -- Log user deletion
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

DELIMITER ;
```

### 7.4 trg_after_payment_insert
```sql
DELIMITER $$

CREATE TRIGGER trg_after_payment_insert
AFTER INSERT ON payments
FOR EACH ROW
BEGIN
    -- Create notification for customer
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
```

---

## 8. Indexing Strategy

### 8.1 Primary Indexes
- All tables have primary key indexes (AUTO_INCREMENT)

### 8.2 Foreign Key Indexes
- Automatically created for all foreign key relationships

### 8.3 Performance Indexes

```sql
-- Users table
CREATE INDEX idx_users_email_status ON users(email, status);
CREATE INDEX idx_users_role_status ON users(role, status);

-- Orders table
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);
CREATE INDEX idx_orders_tailor_status ON orders(tailor_id, status);
CREATE INDEX idx_orders_created_status ON orders(created_at, status);

-- Payments table
CREATE INDEX idx_payments_order_status ON payments(order_id, payment_status);

-- Reviews table
CREATE INDEX idx_reviews_tailor_status ON reviews(tailor_id, status);

-- Notifications table
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
```

---

## 9. Data Integrity Rules

### 9.1 Referential Integrity
- All foreign keys enforce referential integrity
- CASCADE deletes for dependent records
- SET NULL for optional relationships

### 9.2 Check Constraints
```sql
ALTER TABLE reviews ADD CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5);
ALTER TABLE businesses ADD CONSTRAINT chk_commission CHECK (commission_rate BETWEEN 0 AND 100);
ALTER TABLE payments ADD CONSTRAINT chk_amount CHECK (amount >= 0);
```

### 9.3 Unique Constraints
```sql
ALTER TABLE users ADD CONSTRAINT uq_email UNIQUE (email);
ALTER TABLE orders ADD CONSTRAINT uq_order_number UNIQUE (order_number);
```

---

## 10. Database Optimization

### 10.1 Query Optimization Guidelines
- Use stored procedures for complex operations
- Implement proper indexing
- Avoid SELECT * queries
- Use LIMIT for large result sets
- Implement pagination
- Use JOIN instead of subqueries where possible

### 10.2 Maintenance Tasks
```sql
-- Analyze tables
ANALYZE TABLE users, orders, payments, reviews;

-- Optimize tables
OPTIMIZE TABLE users, orders, payments, reviews;

-- Check table integrity
CHECK TABLE users, orders, payments, reviews;
```

### 10.3 Performance Monitoring
```sql
-- Slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- Monitor table sizes
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES
WHERE table_schema = 'stitchyflow'
ORDER BY (data_length + index_length) DESC;
```

---

## 11. Backup and Recovery

### 11.1 Backup Strategy
```bash
# Full backup
mysqldump -u root -p stitchyflow > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup with stored procedures and triggers
mysqldump -u root -p --routines --triggers stitchyflow > full_backup.sql

# Backup specific tables
mysqldump -u root -p stitchyflow users orders payments > critical_tables.sql
```

### 11.2 Recovery
```bash
# Restore database
mysql -u root -p stitchyflow < backup_file.sql

# Restore specific tables
mysql -u root -p stitchyflow < critical_tables.sql
```

---

## 12. Security Considerations

### 12.1 User Privileges
```sql
-- Create application user with limited privileges
CREATE USER 'stitchyflow_app'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON stitchyflow.* TO 'stitchyflow_app'@'localhost';
GRANT EXECUTE ON stitchyflow.* TO 'stitchyflow_app'@'localhost';
FLUSH PRIVILEGES;
```

### 12.2 Data Protection
- Passwords stored as hashed values (bcrypt)
- Sensitive data encrypted
- Audit logging for critical operations
- Regular security audits

---

**Document Version:** 1.0  
**Last Updated:** March 30, 2026  
**Author:** Muhammad Kalim  
**Company:** LogixInventor (PVT) Ltd.  
**Contact:** info@logixinventor.com | +92 333 3836851
