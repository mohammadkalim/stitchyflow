-- Splash Ads Management Tables
-- Developer by: Muhammad Kalim
-- Phone/WhatsApp: +92 333 3836851
-- Product of LogixInventor (PVT) Ltd.

CREATE TABLE IF NOT EXISTS ads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url VARCHAR(1024) NOT NULL,
  redirect_url VARCHAR(1024) NOT NULL,
  start_date DATETIME DEFAULT NULL,
  end_date DATETIME DEFAULT NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  pages JSON NOT NULL DEFAULT (JSON_ARRAY()),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ads_analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ad_id INT NOT NULL,
  page VARCHAR(255) NOT NULL,
  impressions INT NOT NULL DEFAULT 0,
  clicks INT NOT NULL DEFAULT 0,
  last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE,
  UNIQUE KEY ads_page_unique (ad_id, page)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_ads_status_date ON ads (status, start_date, end_date);
CREATE INDEX idx_ads_analytics_ad_page ON ads_analytics (ad_id, page);
