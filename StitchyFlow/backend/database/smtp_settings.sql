-- SMTP Settings Table
-- Developer by: Muhammad Kalim
-- Phone/WhatsApp: +92 333 3836851
-- Product of LogixInventor (PVT) Ltd.
-- Email: info@logixinventor.com
-- Website: www.logixinventor.com

CREATE TABLE IF NOT EXISTS smtp_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    server_address VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    port INT NOT NULL DEFAULT 465,
    encryption VARCHAR(50) NOT NULL DEFAULT 'SSL',
    authentication_required BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default SMTP settings
INSERT INTO smtp_settings (server_address, username, password, port, encryption, authentication_required, is_active) 
VALUES (
    'smtp.gmail.com',
    'mkbytecoder14@gmail.com',
    'rmxdcrjykiqjulfs',
    465,
    'SSL',
    TRUE,
    TRUE
)
ON DUPLICATE KEY UPDATE
    server_address = VALUES(server_address),
    username = VALUES(username),
    password = VALUES(password),
    port = VALUES(port),
    encryption = VALUES(encryption),
    authentication_required = VALUES(authentication_required),
    is_active = VALUES(is_active),
    updated_at = CURRENT_TIMESTAMP;
