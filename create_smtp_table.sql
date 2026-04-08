-- Create smtp_settings table
USE stitchyflow;

CREATE TABLE IF NOT EXISTS smtp_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    server_address VARCHAR(255) NOT NULL DEFAULT 'smtp.gmail.com',
    username VARCHAR(255) NOT NULL DEFAULT 'mkbytecoder14@gmail.com',
    password VARCHAR(255) NOT NULL DEFAULT 'rmxd crjy kiqj ulfs',
    port INT DEFAULT 465,
    encryption VARCHAR(10) DEFAULT 'SSL',
    authentication_required BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default SMTP settings
INSERT INTO smtp_settings (server_address, username, password, port, encryption, is_active, is_default)
VALUES ('smtp.gmail.com', 'mkbytecoder14@gmail.com', 'rmxd crjy kiqj ulfs', 465, 'SSL', TRUE, TRUE)
ON DUPLICATE KEY UPDATE id=id;

SELECT 'SMTP settings table created successfully!' AS message;
