/**
 * Slider Media Routes
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const db = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// ── Upload directory ──────────────────────────────────────────────────────────
const sliderUploadDir = path.join(__dirname, '..', 'uploads', 'slider');
fs.mkdirSync(sliderUploadDir, { recursive: true });

const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, sliderUploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || '').toLowerCase();
      const safeExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext) ? ext : '.jpg';
      cb(null, `slider-${Date.now()}-${crypto.randomBytes(6).toString('hex')}${safeExt}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.has(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG, PNG, GIF, or WebP images are allowed'));
  }
});

function publicUrl(req, relativePath) {
  const base = (process.env.PUBLIC_API_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
  return `${base}${relativePath.startsWith('/') ? relativePath : '/' + relativePath}`;
}

// ── POST /upload-image ────────────────────────────────────────────────────────
router.post(
  '/upload-image',
  authenticateToken,
  authorizeRoles('admin'),
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) return res.status(400).json({ success: false, error: { message: err.message } });
      next();
    });
  },
  (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ success: false, error: { message: 'No image provided' } });
      const relative = `/uploads/slider/${req.file.filename}`;
      res.json({ success: true, data: { url: publicUrl(req, relative), path: relative } });
    } catch (e) {
      res.status(500).json({ success: false, error: { message: e.message } });
    }
  }
);

// ── GET / — list all (optionally filter by ?page=) ────────────────────────────
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page } = req.query;
    let sql = 'SELECT * FROM slider_media';
    const params = [];
    if (page) { sql += ' WHERE page = ?'; params.push(page); }
    sql += ' ORDER BY page, sort_order, id';
    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (e) {
    res.status(500).json({ success: false, error: { message: e.message } });
  }
});

// ── GET /public?page= — public endpoint for frontend ─────────────────────────
router.get('/public', async (req, res) => {
  try {
    const { page } = req.query;
    if (!page) return res.status(400).json({ success: false, error: { message: 'page param required' } });
    const [rows] = await db.query(
      'SELECT * FROM slider_media WHERE page = ? AND status = "active" ORDER BY sort_order, id',
      [page]
    );
    res.json({ success: true, data: rows });
  } catch (e) {
    res.status(500).json({ success: false, error: { message: e.message } });
  }
});

// ── POST / — create ───────────────────────────────────────────────────────────
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page, page_label, title, description, image_url, image_path, bg_color, text_color, animation, sort_order, status } = req.body;
    if (!page || !image_url || !image_path) {
      return res.status(400).json({ success: false, error: { message: 'page, image_url and image_path are required' } });
    }
    const [result] = await db.query(
      `INSERT INTO slider_media (page, page_label, title, description, image_url, image_path, bg_color, text_color, animation, sort_order, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [page, page_label || page, title || null, description || null, image_url, image_path,
       bg_color || '#ffffff', text_color || '#000000', animation || 'fade', sort_order || 0, status || 'active']
    );
    const [rows] = await db.query('SELECT * FROM slider_media WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, error: { message: e.message } });
  }
});

// ── PUT /:id — update ─────────────────────────────────────────────────────────
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { page, page_label, title, description, image_url, image_path, bg_color, text_color, animation, sort_order, status } = req.body;
    const [existing] = await db.query('SELECT * FROM slider_media WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ success: false, error: { message: 'Slider not found' } });

    await db.query(
      `UPDATE slider_media SET page=?, page_label=?, title=?, description=?, image_url=?, image_path=?,
       bg_color=?, text_color=?, animation=?, sort_order=?, status=? WHERE id=?`,
      [page || existing[0].page, page_label || existing[0].page_label, title ?? existing[0].title,
       description ?? existing[0].description, image_url || existing[0].image_url,
       image_path || existing[0].image_path, bg_color || existing[0].bg_color,
       text_color || existing[0].text_color, animation || existing[0].animation,
       sort_order ?? existing[0].sort_order, status || existing[0].status, id]
    );
    const [rows] = await db.query('SELECT * FROM slider_media WHERE id = ?', [id]);
    res.json({ success: true, data: rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, error: { message: e.message } });
  }
});

// ── DELETE /:id ───────────────────────────────────────────────────────────────
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [existing] = await db.query('SELECT * FROM slider_media WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, error: { message: 'Slider not found' } });

    // Remove physical file
    const filePath = path.join(__dirname, '..', existing[0].image_path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await db.query('DELETE FROM slider_media WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (e) {
    res.status(500).json({ success: false, error: { message: e.message } });
  }
});

module.exports = router;
