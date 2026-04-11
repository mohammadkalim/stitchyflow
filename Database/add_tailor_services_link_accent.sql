-- Add navigation fields for header mega-menu (run once on existing stitchyflow DB)
-- Developer by: Muhammad Kalim, LogixInventor (PVT) Ltd.
-- Date: 2026-04-11

USE stitchyflow;

ALTER TABLE tailor_services
  ADD COLUMN link_path VARCHAR(500) NULL DEFAULT NULL COMMENT 'Site route e.g. /marketplace/alterations' AFTER category;

ALTER TABLE tailor_services
  ADD COLUMN accent_color VARCHAR(32) NULL DEFAULT NULL COMMENT 'Hex tint for UI e.g. #2563eb' AFTER image_url;

CREATE OR REPLACE VIEW vw_tailor_services_list AS
SELECT
    service_id,
    service_name,
    service_description,
    category,
    link_path,
    base_price,
    price_range_min,
    price_range_max,
    estimated_duration_hours,
    difficulty_level,
    is_popular,
    is_active,
    image_url,
    accent_color,
    tags,
    created_at,
    updated_at
FROM tailor_services
WHERE is_active = TRUE
ORDER BY
    is_popular DESC,
    service_name ASC;
