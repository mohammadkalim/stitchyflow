-- ============================================================
-- Slider Media Table
-- Developer by: Muhammad Kalim
-- Phone/WhatsApp: +92 333 3836851
-- Product of LogixInventor (PVT) Ltd.
-- Email: info@logixinventor.com
-- Website: www.logixinventor.com
-- Created: 2026-04-10
-- ============================================================

CREATE TABLE IF NOT EXISTS `slider_media` (
  `id`            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `page`          VARCHAR(100)    NOT NULL COMMENT 'Frontend route e.g. /about',
  `page_label`    VARCHAR(150)    NOT NULL COMMENT 'Human-readable page name',
  `title`         VARCHAR(255)    DEFAULT NULL,
  `description`   TEXT            DEFAULT NULL,
  `image_url`     VARCHAR(500)    NOT NULL,
  `image_path`    VARCHAR(500)    NOT NULL,
  `bg_color`      VARCHAR(20)     DEFAULT '#ffffff' COMMENT 'Hex background colour',
  `text_color`    VARCHAR(20)     DEFAULT '#000000' COMMENT 'Hex text colour',
  `animation`     VARCHAR(50)     DEFAULT 'fade' COMMENT 'fade | slide | zoom | bounce',
  `sort_order`    SMALLINT        DEFAULT 0,
  `status`        ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_page`   (`page`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Slider images per page for the main website';
