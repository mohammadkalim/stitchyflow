-- Shop Media gallery (tailor dashboard + public shop page)
-- Run on database `stitchyflow` (phpMyAdmin or: mysql -u root -p stitchyflow < create_business_shop_media.sql)
-- Developer by: Muhammad Kalim · LogixInventor (PVT) Ltd.

USE stitchyflow;

CREATE TABLE IF NOT EXISTS business_shop_media (
  media_id INT AUTO_INCREMENT PRIMARY KEY,
  shop_id INT NOT NULL,
  owner_user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  caption TEXT,
  image_url VARCHAR(500) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_shop_media_shop (shop_id),
  INDEX idx_shop_media_owner (owner_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
