-- ============================================================
-- Social Media Links Table
-- Developer by: Muhammad Kalim
-- Phone/WhatsApp: +92 333 3836851
-- Product of LogixInventor (PVT) Ltd.
-- Email: info@logixinventor.com
-- Website: www.logixinventor.com
-- ============================================================

CREATE TABLE IF NOT EXISTS `social_media_links` (
  `id`           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `platform`     VARCHAR(50)     NOT NULL COMMENT 'e.g. facebook, instagram, twitter, youtube, tiktok, linkedin, pinterest, snapchat',
  `label`        VARCHAR(100)    NOT NULL COMMENT 'Display label shown in UI',
  `url`          VARCHAR(500)    NOT NULL COMMENT 'Full social media profile URL',
  `icon`         VARCHAR(100)    NOT NULL DEFAULT '' COMMENT 'Icon identifier (platform name used for icon mapping)',
  `color`        VARCHAR(20)     NOT NULL DEFAULT '#1976d2' COMMENT 'Brand hex color for the icon',
  `show_header`  TINYINT(1)      NOT NULL DEFAULT 0 COMMENT '1 = show in website header',
  `show_footer`  TINYINT(1)      NOT NULL DEFAULT 1 COMMENT '1 = show in website footer',
  `footer_position` ENUM('left','right') NOT NULL DEFAULT 'left' COMMENT 'Footer alignment: left or right',
  `is_active`    TINYINT(1)      NOT NULL DEFAULT 1 COMMENT '1 = active / visible',
  `sort_order`   INT             NOT NULL DEFAULT 0 COMMENT 'Display order (lower = first)',
  `created_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_active_order` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Social media platform links for website header and footer';

-- Seed default platforms
INSERT INTO `social_media_links` (`platform`, `label`, `url`, `icon`, `color`, `show_header`, `show_footer`, `footer_position`, `is_active`, `sort_order`) VALUES
('facebook',  'Facebook',  'https://facebook.com',  'facebook',  '#1877F2', 0, 1, 'left', 1, 1),
('instagram', 'Instagram', 'https://instagram.com', 'instagram', '#E4405F', 0, 1, 'left', 1, 2),
('twitter',   'Twitter/X', 'https://twitter.com',   'twitter',   '#1DA1F2', 0, 1, 'left', 1, 3),
('youtube',   'YouTube',   'https://youtube.com',   'youtube',   '#FF0000', 0, 1, 'right', 1, 4),
('linkedin',  'LinkedIn',  'https://linkedin.com',  'linkedin',  '#0A66C2', 0, 1, 'right', 1, 5),
('tiktok',    'TikTok',    'https://tiktok.com',    'tiktok',    '#010101', 0, 1, 'right', 1, 6);
