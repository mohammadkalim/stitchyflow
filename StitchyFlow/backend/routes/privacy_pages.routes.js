/**
 * Privacy Pages Routes (About, Privacy, Terms, Sitemap)
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const VALID_KEYS = ['about', 'privacy', 'terms', 'sitemap'];

// ── Ensure table exists (auto-create on first use) ────────────────────────────
async function ensureTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS \`privacy_pages\` (
      \`id\`          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
      \`page_key\`    VARCHAR(50)     NOT NULL UNIQUE,
      \`title\`       VARCHAR(255)    NOT NULL,
      \`content\`     LONGTEXT        NOT NULL,
      \`meta_title\`  VARCHAR(255)    DEFAULT NULL,
      \`meta_desc\`   VARCHAR(500)    DEFAULT NULL,
      \`is_active\`   TINYINT(1)      NOT NULL DEFAULT 1,
      \`created_at\`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`uq_page_key\` (\`page_key\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Seed defaults if empty
  const [rows] = await db.query('SELECT COUNT(*) AS cnt FROM privacy_pages');
  if (rows[0].cnt === 0) {
    await db.query(`
      INSERT IGNORE INTO privacy_pages (page_key, title, content, meta_title, meta_desc, is_active) VALUES
      ('about',   'About StitchyFlow', '<h2>About StitchyFlow</h2><p>StitchyFlow is a professional tailoring marketplace connecting customers with skilled tailors across Pakistan.</p>', 'About StitchyFlow', 'Learn about StitchyFlow.', 1),
      ('privacy', 'Privacy Policy',    '<h2>Privacy Policy</h2><p>At StitchyFlow, we are committed to protecting your personal information.</p>', 'Privacy Policy - StitchyFlow', 'Read our privacy policy.', 1),
      ('terms',   'Terms & Conditions','<h2>Terms & Conditions</h2><p>By using StitchyFlow you agree to these terms.</p>', 'Terms & Conditions - StitchyFlow', 'Read our terms and conditions.', 1),
      ('sitemap', 'Sitemap',           '<h2>Sitemap</h2><p>Find all pages of StitchyFlow below.</p>', 'Sitemap - StitchyFlow', 'Browse the StitchyFlow sitemap.', 1)
    `);
  }
}

// ── GET ALL pages (public — used by frontend) ─────────────────────────────────
// GET /api/v1/privacy-pages
router.get('/', async (req, res) => {
  try {
    await ensureTable();
    const [rows] = await db.query('SELECT * FROM privacy_pages ORDER BY id ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── GET SINGLE by page_key (public) ──────────────────────────────────────────
// GET /api/v1/privacy-pages/:key
router.get('/:key', async (req, res) => {
  try {
    await ensureTable();
    const key = req.params.key;
    if (!VALID_KEYS.includes(key)) {
      return res.status(400).json({ success: false, error: { message: 'Invalid page key' } });
    }
    const [rows] = await db.query('SELECT * FROM privacy_pages WHERE page_key = ?', [key]);
    if (!rows.length) {
      return res.status(404).json({ success: false, error: { message: 'Page not found' } });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── UPDATE page by page_key (admin only) ──────────────────────────────────────
// PUT /api/v1/privacy-pages/:key
router.put('/:key', authenticateToken, async (req, res) => {
  try {
    await ensureTable();
    const key = req.params.key;
    if (!VALID_KEYS.includes(key)) {
      return res.status(400).json({ success: false, error: { message: 'Invalid page key' } });
    }

    const { title, content, meta_title, meta_desc, is_active } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, error: { message: 'title and content are required' } });
    }

    // Upsert — insert if not exists, update if exists
    await db.query(`
      INSERT INTO privacy_pages (page_key, title, content, meta_title, meta_desc, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title      = VALUES(title),
        content    = VALUES(content),
        meta_title = VALUES(meta_title),
        meta_desc  = VALUES(meta_desc),
        is_active  = VALUES(is_active),
        updated_at = NOW()
    `, [
      key,
      title.trim(),
      content,
      meta_title || null,
      meta_desc  || null,
      is_active !== false ? 1 : 0
    ]);

    res.json({ success: true, message: 'Page updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;
