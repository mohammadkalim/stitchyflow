-- =====================================================
-- StitchyFlow Tailor Services Table Setup
-- Version: 1.0
-- Date: April 11, 2026
-- Author: Muhammad Kalim, LogixInventor (PVT) Ltd.
-- =====================================================

USE stitchyflow;

-- =====================================================
-- DROP EXISTING TABLE IF EXISTS
-- =====================================================

DROP TABLE IF EXISTS tailor_services;

-- =====================================================
-- CREATE tailor_services TABLE
-- =====================================================

CREATE TABLE tailor_services (
    service_id INT PRIMARY KEY AUTO_INCREMENT,
    service_name VARCHAR(255) NOT NULL,
    service_description TEXT,
    category VARCHAR(100) NOT NULL,
    link_path VARCHAR(500) NULL COMMENT 'Site route for header mega menu',
    base_price DECIMAL(10,2) NOT NULL,
    price_range_min DECIMAL(10,2),
    price_range_max DECIMAL(10,2),
    estimated_duration_hours DECIMAL(5,2),
    difficulty_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500),
    accent_color VARCHAR(32) NULL COMMENT 'Hex UI tint e.g. #2563eb',
    tags JSON,
    materials_included JSON,
    size_options JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_service_name (service_name),
    INDEX idx_category (category),
    INDEX idx_price (base_price),
    INDEX idx_popular (is_popular),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

INSERT INTO tailor_services (service_name, service_description, category, base_price, price_range_min, price_range_max, estimated_duration_hours, difficulty_level, is_popular, is_active, image_url, tags, materials_included, size_options) VALUES
('Men\'s Shirt Stitching', 'Custom tailored men\'s shirts with perfect fit and finish', 'Men\'s Wear', 1500.00, 1200.00, 3000.00, 3.00, 'intermediate', TRUE, TRUE, '/images/services/mens-shirt.jpg', JSON_ARRAY('shirt', 'formal', 'casual', 'custom'), JSON_ARRAY('fabric', 'buttons', 'thread', 'interfacing'), JSON_ARRAY('S', 'M', 'L', 'XL', 'XXL', 'Custom')),

('Men\'s Suit Stitching', 'Premium custom suits with expert tailoring', 'Men\'s Wear', 8000.00, 6000.00, 15000.00, 15.00, 'expert', TRUE, TRUE, '/images/services/mens-suit.jpg', JSON_ARRAY('suit', 'formal', 'wedding', 'business'), JSON_ARRAY('fabric', 'lining', 'buttons', 'thread', 'padding'), JSON_ARRAY('S', 'M', 'L', 'XL', 'XXL', 'Custom')),

('Women\'s Kurti Stitching', 'Stylish kurtis with various designs and patterns', 'Women\'s Wear', 1200.00, 800.00, 2500.00, 2.50, 'beginner', TRUE, TRUE, '/images/services/womens-kurti.jpg', JSON_ARRAY('kurti', 'casual', 'formal', 'traditional'), JSON_ARRAY('fabric', 'buttons', 'thread', 'lace'), JSON_ARRAY('XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom')),

('Women\'s Lehenga Choli', 'Traditional lehenga choli for special occasions', 'Women\'s Wear', 5000.00, 3000.00, 12000.00, 10.00, 'expert', TRUE, TRUE, '/images/services/lehenga-choli.jpg', JSON_ARRAY('lehenga', 'wedding', 'bridal', 'traditional'), JSON_ARRAY('fabric', 'embroidery', 'dupatta', 'lining'), JSON_ARRAY('S', 'M', 'L', 'XL', 'Custom')),

('Pants/Trouser Stitching', 'Custom fitted pants and trousers', 'Bottom Wear', 1000.00, 800.00, 2000.00, 2.00, 'beginner', TRUE, TRUE, '/images/services/pants.jpg', JSON_ARRAY('pants', 'trousers', 'formal', 'casual'), JSON_ARRAY('fabric', 'zipper', 'buttons', 'thread'), JSON_ARRAY('28', '30', '32', '34', '36', '38', '40', 'Custom')),

('Jeans Alteration', 'Professional jeans alteration and fitting', 'Alterations', 500.00, 300.00, 800.00, 1.00, 'beginner', FALSE, TRUE, '/images/services/jeans-alteration.jpg', JSON_ARRAY('jeans', 'alteration', 'hemming', 'resizing'), JSON_ARRAY('thread', 'matching fabric'), JSON_ARRAY('All Sizes')),

('Dress Alteration', 'Expert dress alteration and resizing', 'Alterations', 800.00, 500.00, 1500.00, 1.50, 'intermediate', TRUE, TRUE, '/images/services/dress-alteration.jpg', JSON_ARRAY('dress', 'alteration', 'resizing', 'fitting'), JSON_ARRAY('thread', 'matching fabric', 'zipper'), JSON_ARRAY('All Sizes')),

('Blouse Stitching', 'Custom blouse for sarees and lehengas', 'Women\'s Wear', 800.00, 500.00, 2000.00, 2.00, 'intermediate', TRUE, TRUE, '/images/services/blouse.jpg', JSON_ARRAY('blouse', 'saree', 'lehenga', 'traditional'), JSON_ARRAY('fabric', 'hooks', 'padding', 'thread'), JSON_ARRAY('30', '32', '34', '36', '38', '40', 'Custom')),

('Sherwani Stitching', 'Traditional sherwani for grooms and special occasions', 'Men\'s Wear', 10000.00, 8000.00, 20000.00, 20.00, 'expert', TRUE, TRUE, '/images/services/sherwani.jpg', JSON_ARRAY('sherwani', 'wedding', 'groom', 'traditional'), JSON_ARRAY('fabric', 'embroidery', 'buttons', 'lining'), JSON_ARRAY('S', 'M', 'L', 'XL', 'XXL', 'Custom')),

('Kids Wear Stitching', 'Custom clothing for children of all ages', 'Kids Wear', 800.00, 500.00, 1500.00, 1.50, 'beginner', FALSE, TRUE, '/images/services/kids-wear.jpg', JSON_ARRAY('kids', 'children', 'casual', 'party'), JSON_ARRAY('fabric', 'buttons', 'elastic', 'thread'), JSON_ARRAY('2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-12Y', 'Custom')),

('Waistcoat Stitching', 'Stylish waistcoats for formal and casual wear', 'Men\'s Wear', 2000.00, 1500.00, 4000.00, 4.00, 'intermediate', FALSE, TRUE, '/images/services/waistcoat.jpg', JSON_ARRAY('waistcoat', 'formal', 'wedding', 'party'), JSON_ARRAY('fabric', 'lining', 'buttons', 'thread'), JSON_ARRAY('S', 'M', 'L', 'XL', 'XXL', 'Custom')),

('Salwar Kameez Stitching', 'Traditional salwar kameez suits', 'Women\'s Wear', 1500.00, 1000.00, 3000.00, 3.00, 'intermediate', TRUE, TRUE, '/images/services/salwar-kameez.jpg', JSON_ARRAY('salwar', 'kameez', 'traditional', 'casual'), JSON_ARRAY('fabric', 'buttons', 'elastic', 'thread'), JSON_ARRAY('XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom')),

('Anarkali Suit Stitching', 'Elegant anarkali suits for special occasions', 'Women\'s Wear', 2500.00, 1800.00, 5000.00, 5.00, 'advanced', TRUE, TRUE, '/images/services/anarkali.jpg', JSON_ARRAY('anarkali', 'party', 'wedding', 'traditional'), JSON_ARRAY('fabric', 'lining', 'dupatta', 'embellishments'), JSON_ARRAY('XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom')),

('Jacket/Blazer Stitching', 'Custom jackets and blazers', 'Men\'s Wear', 4000.00, 3000.00, 8000.00, 8.00, 'advanced', FALSE, TRUE, '/images/services/jacket.jpg', JSON_ARRAY('jacket', 'blazer', 'formal', 'casual'), JSON_ARRAY('fabric', 'lining', 'buttons', 'padding'), JSON_ARRAY('S', 'M', 'L', 'XL', 'XXL', 'Custom')),

('Skirt Stitching', 'Custom skirts in various styles', 'Women\'s Wear', 1000.00, 700.00, 2000.00, 2.00, 'beginner', FALSE, TRUE, '/images/services/skirt.jpg', JSON_ARRAY('skirt', 'casual', 'formal', 'party'), JSON_ARRAY('fabric', 'zipper', 'buttons', 'thread'), JSON_ARRAY('XS', 'S', 'M', 'L', 'XL', 'Custom')),

('Pallu/Dupatta Work', 'Embroidery and decorative work on pallu/dupatta', 'Embroidery', 1500.00, 1000.00, 4000.00, 5.00, 'expert', FALSE, TRUE, '/images/services/pallu-work.jpg', JSON_ARRAY('pallu', 'dupatta', 'embroidery', 'decorative'), JSON_ARRAY('thread', 'beads', 'sequins', 'fabric'), JSON_ARRAY('All Sizes')),

('Embroidery Services', 'Custom embroidery work on garments', 'Embroidery', 2000.00, 1000.00, 5000.00, 6.00, 'expert', FALSE, TRUE, '/images/services/embroidery.jpg', JSON_ARRAY('embroidery', 'custom', 'decorative', 'traditional'), JSON_ARRAY('thread', 'beads', 'sequins', 'fabric'), JSON_ARRAY('All Sizes')),

('Curtain Stitching', 'Custom curtains and window treatments', 'Home Decor', 2500.00, 1500.00, 5000.00, 4.00, 'intermediate', FALSE, TRUE, '/images/services/curtain.jpg', JSON_ARRAY('curtain', 'home', 'decor', 'window'), JSON_ARRAY('fabric', 'lining', 'rings', 'thread'), JSON_ARRAY('Custom')),

('Bedspread Stitching', 'Custom bedspreads and bed linens', 'Home Decor', 3000.00, 2000.00, 6000.00, 5.00, 'intermediate', FALSE, TRUE, '/images/services/bedspread.jpg', JSON_ARRAY('bedspread', 'bedding', 'home', 'decor'), JSON_ARRAY('fabric', 'lining', 'embroidery', 'thread'), JSON_ARRAY('Single', 'Double', 'King', 'Queen', 'Custom')),

('Uniform Stitching', 'School, corporate, and institutional uniforms', 'Uniforms', 1200.00, 800.00, 2500.00, 3.00, 'intermediate', FALSE, TRUE, '/images/services/uniform.jpg', JSON_ARRAY('uniform', 'school', 'corporate', 'institutional'), JSON_ARRAY('fabric', 'buttons', 'zipper', 'thread', 'patches'), JSON_ARRAY('XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom')),

('Gown Stitching', 'Evening gowns and party dresses', 'Women\'s Wear', 6000.00, 4000.00, 15000.00, 12.00, 'expert', TRUE, TRUE, '/images/services/gown.jpg', JSON_ARRAY('gown', 'evening', 'party', 'formal'), JSON_ARRAY('fabric', 'lining', 'beads', 'embellishments'), JSON_ARRAY('XS', 'S', 'M', 'L', 'XL', 'Custom')),

('Tuxedo Stitching', 'Formal tuxedos for special occasions', 'Men\'s Wear', 12000.00, 10000.00, 25000.00, 18.00, 'expert', FALSE, TRUE, '/images/services/tuxedo.jpg', JSON_ARRAY('tuxedo', 'formal', 'wedding', 'black-tie'), JSON_ARRAY('fabric', 'lining', 'buttons', 'bow-tie'), JSON_ARRAY('S', 'M', 'L', 'XL', 'XXL', 'Custom')),

('Shirt Alteration', 'Professional shirt fitting and alteration', 'Alterations', 400.00, 300.00, 700.00, 0.75, 'beginner', FALSE, TRUE, '/images/services/shirt-alteration.jpg', JSON_ARRAY('shirt', 'alteration', 'fitting', 'resizing'), JSON_ARRAY('thread', 'buttons'), JSON_ARRAY('All Sizes')),

('Zipper Replacement', 'Professional zipper replacement service', 'Alterations', 300.00, 200.00, 500.00, 0.50, 'beginner', FALSE, TRUE, '/images/services/zipper.jpg', JSON_ARRAY('zipper', 'replacement', 'repair', 'alteration'), JSON_ARRAY('zipper', 'thread'), JSON_ARRAY('All Sizes')),

('Hemming Service', 'Professional hemming for all garments', 'Alterations', 200.00, 150.00, 400.00, 0.25, 'beginner', FALSE, TRUE, '/images/services/hemming.jpg', JSON_ARRAY('hemming', 'alteration', 'shortening', 'finishing'), JSON_ARRAY('thread', 'matching fabric'), JSON_ARRAY('All Sizes'));

-- =====================================================
-- CREATE VIEW FOR SERVICE LISTINGS
-- =====================================================

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

-- =====================================================
-- VERIFICATION
-- =====================================================

SELECT 'Tailor Services table created successfully!' AS message;
SELECT COUNT(*) AS total_services FROM tailor_services;
SELECT * FROM vw_tailor_services_list LIMIT 5;
