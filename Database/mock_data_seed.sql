-- ============================================================
-- StitchyFlow Mock Data Seed
-- Developer by: Muhammad Kalim | LogixInventor (PVT) Ltd.
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ── 1. USERS ─────────────────────────────────────────────────
INSERT IGNORE INTO users (email, password_hash, first_name, last_name, phone, role, status, email_verified, last_login, created_at) VALUES
('ahmed.khan@gmail.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ahmed',    'Khan',     '+92-300-1111001', 'customer',       'active',    1, NOW() - INTERVAL 1 HOUR,  NOW() - INTERVAL 30 DAY),
('sara.ali@gmail.com',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sara',     'Ali',      '+92-301-1111002', 'customer',       'active',    1, NOW() - INTERVAL 2 HOUR,  NOW() - INTERVAL 28 DAY),
('usman.malik@gmail.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Usman',    'Malik',    '+92-302-1111003', 'customer',       'active',    1, NOW() - INTERVAL 5 HOUR,  NOW() - INTERVAL 25 DAY),
('fatima.noor@gmail.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Fatima',   'Noor',     '+92-303-1111004', 'customer',       'active',    1, NOW() - INTERVAL 1 DAY,   NOW() - INTERVAL 22 DAY),
('bilal.hussain@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bilal',    'Hussain',  '+92-304-1111005', 'customer',       'active',    1, NOW() - INTERVAL 2 DAY,   NOW() - INTERVAL 20 DAY),
('zara.sheikh@gmail.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Zara',     'Sheikh',   '+92-305-1111006', 'customer',       'suspended', 1, NOW() - INTERVAL 10 DAY,  NOW() - INTERVAL 18 DAY),
('omar.farooq@gmail.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Omar',     'Farooq',   '+92-306-1111007', 'customer',       'inactive',  0, NULL,                     NOW() - INTERVAL 15 DAY),
('hina.baig@gmail.com',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Hina',     'Baig',     '+92-307-1111008', 'customer',       'active',    1, NOW() - INTERVAL 3 HOUR,  NOW() - INTERVAL 12 DAY),
('tariq.mehmood@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Tariq',    'Mehmood',  '+92-308-1111009', 'tailor',         'active',    1, NOW() - INTERVAL 30 MINUTE,  NOW() - INTERVAL 40 DAY),
('nadia.iqbal@gmail.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nadia',    'Iqbal',    '+92-309-1111010', 'tailor',         'active',    1, NOW() - INTERVAL 1 HOUR,  NOW() - INTERVAL 35 DAY),
('asif.raza@gmail.com',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Asif',     'Raza',     '+92-310-1111011', 'tailor',         'active',    1, NOW() - INTERVAL 4 HOUR,  NOW() - INTERVAL 50 DAY),
('sana.mirza@gmail.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sana',     'Mirza',    '+92-311-1111012', 'tailor',         'active',    1, NOW() - INTERVAL 6 HOUR,  NOW() - INTERVAL 45 DAY),
('kamran.butt@gmail.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kamran',   'Butt',     '+92-312-1111013', 'business_owner', 'active',    1, NOW() - INTERVAL 2 HOUR,  NOW() - INTERVAL 60 DAY),
('rabia.qureshi@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Rabia',    'Qureshi',  '+92-313-1111014', 'business_owner', 'active',    1, NOW() - INTERVAL 3 HOUR,  NOW() - INTERVAL 55 DAY),
('danish.ahmed@gmail.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Danish',   'Ahmed',    '+92-314-1111015', 'customer',       'active',    1, NOW() - INTERVAL 8 HOUR,  NOW() - INTERVAL 8 DAY);

-- ── 2. BUSINESS TYPE MANAGEMENT ──────────────────────────────
INSERT IGNORE INTO business_type_management (type_name, type_code, description, is_active, created_at) VALUES
('Boutique',          'BOUTIQUE',      'High-end fashion boutique specializing in designer wear',        1, NOW() - INTERVAL 60 DAY),
('Tailor Shop',       'TAILOR_SHOP',   'Traditional tailor shop offering custom stitching services',     1, NOW() - INTERVAL 58 DAY),
('Alterations Studio','ALTERATIONS',   'Professional garment alteration and repair services',            1, NOW() - INTERVAL 55 DAY),
('Bridal Studio',     'BRIDAL',        'Specialized studio for bridal and wedding wear',                 1, NOW() - INTERVAL 50 DAY),
('Uniform Maker',     'UNIFORM',       'Corporate and school uniform manufacturing',                     1, NOW() - INTERVAL 45 DAY),
('Embroidery House',  'EMBROIDERY',    'Custom embroidery and fabric decoration services',               1, NOW() - INTERVAL 40 DAY),
('Fashion Designer',  'FASHION_DESIGN','Independent fashion designer studio',                            1, NOW() - INTERVAL 35 DAY),
('Fabric Store',      'FABRIC_STORE',  'Retail fabric and accessories store with stitching services',    0, NOW() - INTERVAL 30 DAY);

-- ── 3. SPECIALIZATION MANAGEMENT ─────────────────────────────
INSERT IGNORE INTO specialization_management (specialization_name, specialization_code, business_type_id, description, is_active, created_at) VALUES
('Bridal Wear',       'BRIDAL_WEAR',   4, 'Wedding dresses, lehenga, and bridal accessories',           1, NOW() - INTERVAL 55 DAY),
('Men\'s Suits',      'MENS_SUITS',    2, 'Custom tailored suits, sherwanis, and formal wear for men',  1, NOW() - INTERVAL 53 DAY),
('Ladies Dresses',    'LADIES_DRESS',  1, 'Casual and formal dresses for women',                        1, NOW() - INTERVAL 50 DAY),
('School Uniforms',   'SCHOOL_UNIF',   5, 'School and college uniform stitching',                       1, NOW() - INTERVAL 48 DAY),
('Corporate Uniforms','CORP_UNIF',     5, 'Office and corporate uniform manufacturing',                  1, NOW() - INTERVAL 45 DAY),
('Kurta Shalwar',     'KURTA_SHALWAR', 2, 'Traditional Pakistani kurta shalwar stitching',              1, NOW() - INTERVAL 42 DAY),
('Embroidery Work',   'EMBROIDERY_W',  6, 'Hand and machine embroidery on garments',                    1, NOW() - INTERVAL 40 DAY),
('Alterations',       'ALTERATIONS_S', 3, 'Garment alterations, repairs, and resizing',                 1, NOW() - INTERVAL 38 DAY),
('Party Wear',        'PARTY_WEAR',    1, 'Designer party and event wear',                               1, NOW() - INTERVAL 35 DAY),
('Children Wear',     'CHILDREN_WEAR', 2, 'Custom stitching for children\'s clothing',                  1, NOW() - INTERVAL 30 DAY);

-- ── 4. TAILORS (linked to tailor users) ──────────────────────
INSERT IGNORE INTO tailors (user_id, specialization, experience_years, hourly_rate, availability_status, rating, total_orders, completed_orders, bio, skills, status, created_at) VALUES
((SELECT user_id FROM users WHERE email='tariq.mehmood@gmail.com'), 'Men\'s Suits, Kurta Shalwar', 12, 850.00, 'available',   4.8, 145, 138, 'Expert tailor with 12 years experience in men\'s formal wear.',  '["Suits","Sherwanis","Kurta Shalwar","Alterations"]', 'approved', NOW() - INTERVAL 40 DAY),
((SELECT user_id FROM users WHERE email='nadia.iqbal@gmail.com'),   'Bridal Wear, Ladies Dresses', 8,  1200.00,'available',   4.9, 98,  95,  'Specialist in bridal and ladies fashion with 8 years experience.','["Bridal","Lehenga","Party Wear","Embroidery"]',     'approved', NOW() - INTERVAL 35 DAY),
((SELECT user_id FROM users WHERE email='asif.raza@gmail.com'),     'Alterations, Uniforms',       15, 600.00, 'busy',        4.6, 210, 200, 'Highly experienced in alterations and uniform manufacturing.',    '["Alterations","Uniforms","Repairs","Resizing"]',    'approved', NOW() - INTERVAL 50 DAY),
((SELECT user_id FROM users WHERE email='sana.mirza@gmail.com'),    'Embroidery, Party Wear',      6,  950.00, 'available',   4.7, 67,  63,  'Creative designer specializing in embroidery and party wear.',    '["Embroidery","Party Wear","Beadwork","Zardozi"]',   'approved', NOW() - INTERVAL 45 DAY);

-- ── 5. BUSINESS TAILOR SHOPS ─────────────────────────────────
INSERT IGNORE INTO business_tailor_shops (shop_name, owner_name, city, address, contact_number, business_type_id, specialization_id, shop_status, created_at) VALUES
('Royal Stitch Boutique',    'Kamran Butt',      'Lahore',     'Shop 12, Liberty Market, Lahore',              '+92-42-3571001', 1, 3,  'active',    NOW() - INTERVAL 60 DAY),
('Al-Noor Tailor House',     'Tariq Mehmood',    'Karachi',    'Block 5, Gulshan-e-Iqbal, Karachi',            '+92-21-3481002', 2, 2,  'active',    NOW() - INTERVAL 55 DAY),
('Bridal Dreams Studio',     'Nadia Iqbal',      'Islamabad',  'F-7 Markaz, Blue Area, Islamabad',             '+92-51-2801003', 4, 1,  'active',    NOW() - INTERVAL 50 DAY),
('Smart Uniforms Co.',       'Asif Raza',        'Faisalabad', 'D-Ground, Faisalabad',                         '+92-41-2601004', 5, 4,  'active',    NOW() - INTERVAL 45 DAY),
('Zara Fashion House',       'Rabia Qureshi',    'Multan',     'Hussain Agahi, Multan',                        '+92-61-4501005', 1, 9,  'active',    NOW() - INTERVAL 40 DAY),
('Classic Alterations',      'Sana Mirza',       'Rawalpindi', 'Saddar Bazaar, Rawalpindi',                    '+92-51-5501006', 3, 8,  'active',    NOW() - INTERVAL 35 DAY),
('Embroidery Palace',        'Danish Ahmed',     'Peshawar',   'Qissa Khwani Bazaar, Peshawar',                '+92-91-2701007', 6, 7,  'active',    NOW() - INTERVAL 30 DAY),
('Kids Fashion Studio',      'Hina Baig',        'Lahore',     'MM Alam Road, Gulberg, Lahore',                '+92-42-3571008', 2, 10, 'active',    NOW() - INTERVAL 25 DAY),
('Elite Menswear',           'Omar Farooq',      'Karachi',    'Tariq Road, Karachi',                          '+92-21-3481009', 2, 2,  'inactive',  NOW() - INTERVAL 20 DAY),
('Sunshine Boutique',        'Fatima Noor',      'Lahore',     'DHA Phase 5, Lahore',                          '+92-42-3571010', 1, 3,  'active',    NOW() - INTERVAL 15 DAY);

-- ── 6. BUSINESS TAILOR VERIFICATIONS ─────────────────────────
INSERT IGNORE INTO business_tailor_verifications (tailor_name, shop_name, cnic_number, contact_number, verification_status, review_notes, created_at) VALUES
('Tariq Mehmood',  'Al-Noor Tailor House',  '35202-1234567-1', '+92-308-1111009', 'approved', 'All documents verified. CNIC and business license confirmed.',  NOW() - INTERVAL 50 DAY),
('Nadia Iqbal',    'Bridal Dreams Studio',  '61101-2345678-2', '+92-309-1111010', 'approved', 'Verified. Portfolio reviewed and approved.',                     NOW() - INTERVAL 45 DAY),
('Asif Raza',      'Smart Uniforms Co.',    '33100-3456789-3', '+92-310-1111011', 'approved', 'Business registration and CNIC verified.',                       NOW() - INTERVAL 40 DAY),
('Sana Mirza',     'Classic Alterations',   '42201-4567890-4', '+92-311-1111012', 'approved', 'All credentials verified successfully.',                         NOW() - INTERVAL 35 DAY),
('Danish Ahmed',   'Embroidery Palace',     '17301-5678901-5', '+92-314-1111015', 'pending',  'Documents submitted. Awaiting CNIC verification.',               NOW() - INTERVAL 5 DAY),
('Hina Baig',      'Kids Fashion Studio',   '35202-6789012-6', '+92-307-1111008', 'pending',  'Portfolio under review.',                                        NOW() - INTERVAL 3 DAY),
('Omar Farooq',    'Elite Menswear',        '42301-7890123-7', '+92-306-1111007', 'rejected', 'CNIC mismatch. Business license expired.',                       NOW() - INTERVAL 10 DAY),
('Bilal Hussain',  'Bilal Tailor Works',    '35202-8901234-8', '+92-304-1111005', 'pending',  'New application. Documents under review.',                       NOW() - INTERVAL 1 DAY);

-- ── 7. ORDERS ─────────────────────────────────────────────────
INSERT IGNORE INTO orders (order_number, customer_id, tailor_id, garment_type, description, status, priority, estimated_price, final_price, estimated_completion_date, actual_completion_date, created_at) VALUES
('ORD-2026-001', (SELECT user_id FROM users WHERE email='ahmed.khan@gmail.com'),    (SELECT tailor_id FROM tailors WHERE user_id=(SELECT user_id FROM users WHERE email='tariq.mehmood@gmail.com')), 'Sherwani',      'Wedding sherwani with golden embroidery',          'completed',   'high',   8500.00,  8500.00,  '2026-02-15', '2026-02-14', NOW() - INTERVAL 45 DAY),
('ORD-2026-002', (SELECT user_id FROM users WHERE email='sara.ali@gmail.com'),      (SELECT tailor_id FROM tailors WHERE user_id=(SELECT user_id FROM users WHERE email='nadia.iqbal@gmail.com')),   'Bridal Dress',  'Full bridal lehenga with heavy embroidery',        'completed',   'urgent', 25000.00, 24500.00, '2026-02-20', '2026-02-19', NOW() - INTERVAL 40 DAY),
('ORD-2026-003', (SELECT user_id FROM users WHERE email='usman.malik@gmail.com'),   (SELECT tailor_id FROM tailors WHERE user_id=(SELECT user_id FROM users WHERE email='tariq.mehmood@gmail.com')), 'Suit',          '3-piece formal suit for office',                   'completed',   'medium', 6500.00,  6500.00,  '2026-02-25', '2026-02-24', NOW() - INTERVAL 35 DAY),
('ORD-2026-004', (SELECT user_id FROM users WHERE email='fatima.noor@gmail.com'),   (SELECT tailor_id FROM tailors WHERE user_id=(SELECT user_id FROM users WHERE email='sana.mirza@gmail.com')),    'Party Dress',   'Designer party wear with embroidery',               'in_progress', 'high',   12000.00, NULL,     '2026-04-10', NULL,         NOW() - INTERVAL 10 DAY),
('ORD-2026-005', (SELECT user_id FROM users WHERE email='bilal.hussain@gmail.com'), (SELECT tailor_id FROM tailors WHERE user_id=(SELECT user_id FROM users WHERE email='asif.raza@gmail.com')),     'Uniform',       '5 sets of school uniforms',                        'in_progress', 'medium', 4500.00,  NULL,     '2026-04-08', NULL,         NOW() - INTERVAL 8 DAY),
('ORD-2026-006', (SELECT user_id FROM users WHERE email='hina.baig@gmail.com'),     (SELECT tailor_id FROM tailors WHERE user_id=(SELECT user_id FROM users WHERE email='nadia.iqbal@gmail.com')),   'Kurta',         'Casual kurta shalwar set',                         'pending',     'low',    2800.00,  NULL,     '2026-04-15', NULL,         NOW() - INTERVAL 5 DAY),
('ORD-2026-007', (SELECT user_id FROM users WHERE email='danish.ahmed@gmail.com'),  (SELECT tailor_id FROM tailors WHERE user_id=(SELECT user_id FROM users WHERE email='tariq.mehmood@gmail.com')), 'Waistcoat',     'Embroidered waistcoat for Eid',                     'pending',     'medium', 3500.00,  NULL,     '2026-04-20', NULL,         NOW() - INTERVAL 3 DAY),
('ORD-2026-008', (SELECT user_id FROM users WHERE email='ahmed.khan@gmail.com'),    (SELECT tailor_id FROM tailors WHERE user_id=(SELECT user_id FROM users WHERE email='sana.mirza@gmail.com')),    'Ladies Suit',   'Formal ladies suit for office',                    'accepted',    'medium', 5500.00,  NULL,     '2026-04-12', NULL,         NOW() - INTERVAL 2 DAY),
('ORD-2026-009', (SELECT user_id FROM users WHERE email='sara.ali@gmail.com'),      (SELECT tailor_id FROM tailors WHERE user_id=(SELECT user_id FROM users WHERE email='asif.raza@gmail.com')),     'Alteration',    'Resize wedding dress - take in 2 inches',           'completed',   'urgent', 1500.00,  1500.00,  '2026-03-01', '2026-03-01', NOW() - INTERVAL 30 DAY),
('ORD-2026-010', (SELECT user_id FROM users WHERE email='usman.malik@gmail.com'),   (SELECT tailor_id FROM tailors WHERE user_id=(SELECT user_id FROM users WHERE email='nadia.iqbal@gmail.com')),   'Shalwar Kameez','Traditional shalwar kameez with embroidery',        'cancelled',   'low',    3200.00,  NULL,     '2026-03-15', NULL,         NOW() - INTERVAL 25 DAY);

-- ── 8. PAYMENTS ───────────────────────────────────────────────
INSERT IGNORE INTO payments (order_id, customer_id, amount, payment_method, payment_status, transaction_id, payment_date, created_at) VALUES
((SELECT order_id FROM orders WHERE order_number='ORD-2026-001'), (SELECT user_id FROM users WHERE email='ahmed.khan@gmail.com'),    8500.00,  'cash',          'completed', 'TXN-2026-001', NOW() - INTERVAL 44 DAY, NOW() - INTERVAL 44 DAY),
((SELECT order_id FROM orders WHERE order_number='ORD-2026-002'), (SELECT user_id FROM users WHERE email='sara.ali@gmail.com'),      24500.00, 'bank_transfer', 'completed', 'TXN-2026-002', NOW() - INTERVAL 39 DAY, NOW() - INTERVAL 39 DAY),
((SELECT order_id FROM orders WHERE order_number='ORD-2026-003'), (SELECT user_id FROM users WHERE email='usman.malik@gmail.com'),   6500.00,  'card',          'completed', 'TXN-2026-003', NOW() - INTERVAL 34 DAY, NOW() - INTERVAL 34 DAY),
((SELECT order_id FROM orders WHERE order_number='ORD-2026-004'), (SELECT user_id FROM users WHERE email='fatima.noor@gmail.com'),   6000.00,  'online',        'completed', 'TXN-2026-004', NOW() - INTERVAL 9 DAY,  NOW() - INTERVAL 9 DAY),
((SELECT order_id FROM orders WHERE order_number='ORD-2026-005'), (SELECT user_id FROM users WHERE email='bilal.hussain@gmail.com'), 2250.00,  'cash',          'completed', 'TXN-2026-005', NOW() - INTERVAL 7 DAY,  NOW() - INTERVAL 7 DAY),
((SELECT order_id FROM orders WHERE order_number='ORD-2026-009'), (SELECT user_id FROM users WHERE email='sara.ali@gmail.com'),      1500.00,  'cash',          'completed', 'TXN-2026-006', NOW() - INTERVAL 29 DAY, NOW() - INTERVAL 29 DAY),
((SELECT order_id FROM orders WHERE order_number='ORD-2026-008'), (SELECT user_id FROM users WHERE email='ahmed.khan@gmail.com'),    2750.00,  'online',        'completed', 'TXN-2026-007', NOW() - INTERVAL 1 DAY,  NOW() - INTERVAL 1 DAY);

-- ── 9. MEASUREMENTS ──────────────────────────────────────────
INSERT IGNORE INTO measurements (order_id, customer_id, measurement_type, chest, waist, hips, shoulder_width, sleeve_length, shirt_length, neck, inseam, notes, created_at) VALUES
((SELECT order_id FROM orders WHERE order_number='ORD-2026-001'), (SELECT user_id FROM users WHERE email='ahmed.khan@gmail.com'),    'sherwani',     42.0, 36.0, NULL, 18.5, 25.0, 44.0, 15.5, 40.0, 'Slim fit preferred',          NOW() - INTERVAL 45 DAY),
((SELECT order_id FROM orders WHERE order_number='ORD-2026-002'), (SELECT user_id FROM users WHERE email='sara.ali@gmail.com'),      'bridal_dress', 36.0, 28.0, 38.0, 14.5, 22.0, 42.0, NULL, NULL, 'Extra flare at bottom',       NOW() - INTERVAL 40 DAY),
((SELECT order_id FROM orders WHERE order_number='ORD-2026-003'), (SELECT user_id FROM users WHERE email='usman.malik@gmail.com'),   'suit',         40.0, 34.0, NULL, 17.5, 24.5, 30.0, 15.0, 32.0, 'Regular fit',                 NOW() - INTERVAL 35 DAY),
((SELECT order_id FROM orders WHERE order_number='ORD-2026-004'), (SELECT user_id FROM users WHERE email='fatima.noor@gmail.com'),   'party_dress',  34.0, 26.0, 36.0, 13.5, 21.0, 40.0, NULL, NULL, 'Fitted at waist',             NOW() - INTERVAL 10 DAY),
((SELECT order_id FROM orders WHERE order_number='ORD-2026-005'), (SELECT user_id FROM users WHERE email='bilal.hussain@gmail.com'), 'uniform',      38.0, 32.0, NULL, 16.5, 23.0, 28.0, 14.5, 30.0, '5 sets same measurements',    NOW() - INTERVAL 8 DAY),
((SELECT order_id FROM orders WHERE order_number='ORD-2026-006'), (SELECT user_id FROM users WHERE email='hina.baig@gmail.com'),     'kurta',        36.0, 30.0, NULL, 15.0, 22.5, 42.0, 14.0, NULL, 'Loose fit kurta',             NOW() - INTERVAL 5 DAY),
((SELECT order_id FROM orders WHERE order_number='ORD-2026-008'), (SELECT user_id FROM users WHERE email='ahmed.khan@gmail.com'),    'ladies_suit',  38.0, 30.0, 40.0, 15.5, 22.0, 38.0, NULL, NULL, 'Formal cut, no embroidery',   NOW() - INTERVAL 2 DAY);

-- ── 10. BUSINESS TAILOR ORDERS ────────────────────────────────
INSERT IGNORE INTO business_tailor_orders (order_number, tailor_name, customer_name, garment_type, order_status, total_amount, due_date, created_at) VALUES
('BTO-001', 'Tariq Mehmood', 'Ahmed Khan',     'Sherwani',      'completed',   8500.00,  '2026-02-14', NOW() - INTERVAL 45 DAY),
('BTO-002', 'Nadia Iqbal',   'Sara Ali',       'Bridal Dress',  'completed',   24500.00, '2026-02-19', NOW() - INTERVAL 40 DAY),
('BTO-003', 'Tariq Mehmood', 'Usman Malik',    'Suit',          'completed',   6500.00,  '2026-02-24', NOW() - INTERVAL 35 DAY),
('BTO-004', 'Sana Mirza',    'Fatima Noor',    'Party Dress',   'in_progress', 12000.00, '2026-04-10', NOW() - INTERVAL 10 DAY),
('BTO-005', 'Asif Raza',     'Bilal Hussain',  'Uniform',       'in_progress', 4500.00,  '2026-04-08', NOW() - INTERVAL 8 DAY),
('BTO-006', 'Nadia Iqbal',   'Hina Baig',      'Kurta',         'pending',     2800.00,  '2026-04-15', NOW() - INTERVAL 5 DAY),
('BTO-007', 'Tariq Mehmood', 'Danish Ahmed',   'Waistcoat',     'pending',     3500.00,  '2026-04-20', NOW() - INTERVAL 3 DAY),
('BTO-008', 'Sana Mirza',    'Ahmed Khan',     'Ladies Suit',   'pending',     5500.00,  '2026-04-12', NOW() - INTERVAL 2 DAY),
('BTO-009', 'Asif Raza',     'Sara Ali',       'Alteration',    'completed',   1500.00,  '2026-03-01', NOW() - INTERVAL 30 DAY),
('BTO-010', 'Nadia Iqbal',   'Usman Malik',    'Shalwar Kameez','cancelled',   3200.00,  '2026-03-15', NOW() - INTERVAL 25 DAY);

-- ── 11. BUSINESS TAILOR STATUS ────────────────────────────────
INSERT IGNORE INTO business_tailor_status (tailor_name, availability_status, current_workload, last_seen_at, created_at) VALUES
('Tariq Mehmood', 'available', 3, NOW() - INTERVAL 30 MINUTE, NOW() - INTERVAL 40 DAY),
('Nadia Iqbal',   'available', 2, NOW() - INTERVAL 1 HOUR,    NOW() - INTERVAL 35 DAY),
('Asif Raza',     'busy',      8, NOW() - INTERVAL 15 MINUTE, NOW() - INTERVAL 50 DAY),
('Sana Mirza',    'available', 1, NOW() - INTERVAL 2 HOUR,    NOW() - INTERVAL 45 DAY),
('Danish Ahmed',  'offline',   0, NOW() - INTERVAL 1 DAY,     NOW() - INTERVAL 20 DAY),
('Hina Baig',     'available', 4, NOW() - INTERVAL 45 MINUTE, NOW() - INTERVAL 15 DAY);

-- ── 12. BUSINESS TAILOR INFORMATION / IP ─────────────────────
INSERT IGNORE INTO business_tailor_information_ip (tailor_name, ip_address, device_name, device_type, browser, notes, created_at) VALUES
('Tariq Mehmood', '192.168.1.101', 'Tariq-iPhone',    'Mobile',  'Safari 17',       'Primary device',          NOW() - INTERVAL 2 DAY),
('Tariq Mehmood', '192.168.1.102', 'Tariq-MacBook',   'Desktop', 'Chrome 122',      'Work laptop',             NOW() - INTERVAL 1 DAY),
('Nadia Iqbal',   '192.168.1.103', 'Nadia-Samsung',   'Mobile',  'Chrome Mobile',   'Personal phone',          NOW() - INTERVAL 3 DAY),
('Asif Raza',     '192.168.1.104', 'Asif-Windows-PC', 'Desktop', 'Firefox 123',     'Shop computer',           NOW() - INTERVAL 5 DAY),
('Sana Mirza',    '192.168.1.105', 'Sana-iPad',       'Tablet',  'Safari 17',       'Design tablet',           NOW() - INTERVAL 4 DAY),
('Danish Ahmed',  '10.0.0.201',    'Danish-Laptop',   'Desktop', 'Edge 122',        'Home laptop',             NOW() - INTERVAL 7 DAY),
('Hina Baig',     '10.0.0.202',    'Hina-iPhone',     'Mobile',  'Safari 16',       'Personal device',         NOW() - INTERVAL 6 DAY);

-- ── 13. BUSINESS SETTINGS ─────────────────────────────────────
INSERT IGNORE INTO business_settings (setting_key, setting_value, setting_group, is_active, created_at) VALUES
('max_orders_per_tailor',    '10',                    'operations', 1, NOW() - INTERVAL 60 DAY),
('order_auto_assign',        'false',                 'operations', 1, NOW() - INTERVAL 60 DAY),
('commission_rate',          '10',                    'finance',    1, NOW() - INTERVAL 60 DAY),
('min_order_amount',         '500',                   'finance',    1, NOW() - INTERVAL 60 DAY),
('business_hours_start',     '09:00',                 'schedule',   1, NOW() - INTERVAL 60 DAY),
('business_hours_end',       '21:00',                 'schedule',   1, NOW() - INTERVAL 60 DAY),
('allow_weekend_orders',     'true',                  'schedule',   1, NOW() - INTERVAL 60 DAY),
('notification_email',       'ops@stitchyflow.com',   'contact',    1, NOW() - INTERVAL 60 DAY),
('support_phone',            '+92-300-0000000',       'contact',    1, NOW() - INTERVAL 60 DAY),
('currency',                 'PKR',                   'finance',    1, NOW() - INTERVAL 60 DAY);

-- ── 14. AI ERROR LOGS (sample) ────────────────────────────────
INSERT IGNORE INTO ai_error_logs (source, error_type, message, url, ip_address, status_code, category, severity, ai_suggestion, fix_steps, auto_fixable, is_resolved, occurrence_count, created_at) VALUES
('frontend', 'TypeError',       'Cannot read properties of undefined (reading map)',         'http://localhost:4000/users',          '127.0.0.1', 0,   'Frontend - Null Reference', 'medium',   'Add null checks or optional chaining.',                                    '["Use optional chaining: obj?.property","Add conditional rendering","Initialize state with safe defaults"]', 0, 1, 3,  NOW() - INTERVAL 5 DAY),
('backend',  'Error',           'ER_NO_SUCH_TABLE: Table stitchyflow.old_table does not exist', 'http://localhost:5000/api/v1/admin', '127.0.0.1', 500, 'Database - Missing Table',  'critical', 'Run CREATE TABLE IF NOT EXISTS migration.',                                '["Run migration script","Restart backend","Check DB_NAME in .env"]',                                         1, 1, 1,  NOW() - INTERVAL 3 DAY),
('frontend', 'AxiosError',      'GET http://localhost:5000/api/v1/admin/users 403 (Forbidden)', 'http://localhost:4000/users',       '127.0.0.1', 403, 'Authorization',             'high',     'JWT token expired. User needs to re-authenticate.',                        '["Clear localStorage adminToken","Redirect to /login","Issue fresh JWT"]',                                   1, 1, 5,  NOW() - INTERVAL 2 DAY),
('frontend', 'NetworkError',    'Network Error - CORS policy blocked request',               'http://localhost:4000/dashboard',      '127.0.0.1', 0,   'CORS / Network',            'high',     'Add frontend origin to CORS config in server.js.',                        '["Add http://localhost:4000 to CORS origins","Check ADMIN_URL in .env","Restart backend"]',                  0, 0, 2,  NOW() - INTERVAL 1 DAY),
('backend',  'SyntaxError',     'Unexpected token in JSON at position 0',                    'http://localhost:5000/api/v1/orders',  '127.0.0.1', 400, 'Parse Error',               'medium',   'Backend returning invalid JSON. Check response format.',                  '["Verify Content-Type header","Check API response structure","Validate JSON output"]',                       0, 0, 1,  NOW() - INTERVAL 12 HOUR);

SET FOREIGN_KEY_CHECKS = 1;
