-- ============================================================
-- Privacy Pages Table
-- Developer by: Muhammad Kalim
-- Phone/WhatsApp: +92 333 3836851
-- Product of LogixInventor (PVT) Ltd.
-- Email: info@logixinventor.com
-- Website: www.logixinventor.com
-- ============================================================

CREATE TABLE IF NOT EXISTS `privacy_pages` (
  `id`          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `page_key`    VARCHAR(50)     NOT NULL UNIQUE COMMENT 'Unique identifier: about | privacy | terms | sitemap',
  `title`       VARCHAR(255)    NOT NULL,
  `content`     LONGTEXT        NOT NULL,
  `meta_title`  VARCHAR(255)    DEFAULT NULL,
  `meta_desc`   VARCHAR(500)    DEFAULT NULL,
  `is_active`   TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_page_key` (`page_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default pages
INSERT IGNORE INTO `privacy_pages` (`page_key`, `title`, `content`, `meta_title`, `meta_desc`, `is_active`) VALUES
(
  'about',
  'About StitchyFlow',
  '<h2>About StitchyFlow</h2><p>StitchyFlow is a professional tailoring marketplace that connects customers with skilled tailors across Pakistan. Our platform makes it easy to find, book, and manage custom tailoring services from the comfort of your home.</p><p>Founded with a vision to modernize the tailoring industry, StitchyFlow brings together technology and craftsmanship to deliver a seamless experience for both customers and tailors.</p><h3>Our Mission</h3><p>To empower tailors with digital tools and connect them with customers who value quality craftsmanship.</p><h3>Our Vision</h3><p>To become the leading tailoring marketplace in South Asia, making custom clothing accessible to everyone.</p>',
  'About StitchyFlow - Professional Tailoring Marketplace',
  'Learn about StitchyFlow, the professional tailoring marketplace connecting customers with skilled tailors.',
  1
),
(
  'privacy',
  'Privacy Policy',
  '<h2>Privacy Policy</h2><p>Last updated: January 1, 2026</p><p>At StitchyFlow, we are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.</p><h3>Information We Collect</h3><p>We collect information you provide directly to us, such as your name, email address, phone number, and measurements when you create an account or place an order.</p><h3>How We Use Your Information</h3><p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p><h3>Data Security</h3><p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p><h3>Contact Us</h3><p>If you have any questions about this Privacy Policy, please contact us at info@stitchyflow.com.</p>',
  'Privacy Policy - StitchyFlow',
  'Read StitchyFlow privacy policy to understand how we collect, use, and protect your personal information.',
  1
),
(
  'terms',
  'Terms & Conditions',
  '<h2>Terms &amp; Conditions</h2><p>Last updated: January 1, 2026</p><p>Welcome to StitchyFlow. By accessing or using our platform, you agree to be bound by these Terms and Conditions.</p><h3>Use of Service</h3><p>You must be at least 18 years old to use StitchyFlow. You are responsible for maintaining the confidentiality of your account credentials.</p><h3>Orders and Payments</h3><p>All orders placed through StitchyFlow are subject to acceptance by the tailor. Payment is processed securely through our payment gateway.</p><h3>Cancellation Policy</h3><p>Orders may be cancelled within 24 hours of placement. After this period, cancellations are subject to the tailor\'s individual policy.</p><h3>Limitation of Liability</h3><p>StitchyFlow shall not be liable for any indirect, incidental, or consequential damages arising from your use of our platform.</p>',
  'Terms & Conditions - StitchyFlow',
  'Read StitchyFlow terms and conditions governing the use of our tailoring marketplace platform.',
  1
),
(
  'sitemap',
  'Sitemap',
  '<h2>Sitemap</h2><p>Find all pages and sections of StitchyFlow below.</p><h3>Main Pages</h3><ul><li><a href="/">Home</a></li><li><a href="/about">About Us</a></li><li><a href="/privacy">Privacy Policy</a></li><li><a href="/terms">Terms &amp; Conditions</a></li><li><a href="/contact">Contact Us</a></li></ul><h3>Services</h3><ul><li><a href="/tailors">Find Tailors</a></li><li><a href="/orders">My Orders</a></li><li><a href="/measurements">My Measurements</a></li></ul><h3>Account</h3><ul><li><a href="/login">Login</a></li><li><a href="/register">Register</a></li><li><a href="/profile">My Profile</a></li></ul>',
  'Sitemap - StitchyFlow',
  'Browse the complete sitemap of StitchyFlow to find all pages and sections of our platform.',
  1
);
