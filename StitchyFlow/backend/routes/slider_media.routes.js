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

const sliderUploadDir = path.join(__dirname, '..', 'uploads', 'slider');
fs.mkdirSync(sliderUploadDir, { recursive: true });

const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const ALLOWED_PAGES = new Set(['/about', '/promotions', '/blog', '/tailor-shops']);
const PAGE_DEFAULTS = {
  '/about': { label: 'About', bg_color: '#ffffff', text_color: '#000000' },
  '/promotions': { label: 'Promotions', bg_color: '#ffffff', text_color: '#000000' },
  '/blog': { label: 'Insights', bg_color: '#ffffff', text_color: '#000000' },
  '/tailor-shops': { label: 'Tailor Shops', bg_color: '#1310ca', text_color: '#ffffff' }
};
const ALLOWED_ANIMATIONS = new Set(['fade', 'slide', 'zoom', 'bounce']);
const ALLOWED_STATUS = new Set(['active', 'inactive']);
const HEX_COLOR_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

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

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeColor(value, fallback) {
  const normalized = normalizeText(value);
  if (!normalized) return fallback;
  if (!HEX_COLOR_REGEX.test(normalized)) {
    const error = new Error('bg_color and text_color must be valid hex colors');
    error.statusCode = 400;
    throw error;
  }
  return normalized.toLowerCase();
}

function validatePage(page) {
  const normalizedPage = normalizeText(page);
  if (!normalizedPage) {
    const error = new Error('page is required');
    error.statusCode = 400;
    throw error;
  }
  if (!ALLOWED_PAGES.has(normalizedPage)) {
    const error = new Error('Invalid page value');
    error.statusCode = 400;
    throw error;
  }
  return normalizedPage;
}

function normalizeAnimation(animation, fallback = 'fade') {
  const normalized = normalizeText(animation) || fallback;
  if (!ALLOWED_ANIMATIONS.has(normalized)) {
    const error = new Error('Invalid animation value');
    error.statusCode = 400;
    throw error;
  }
  return normalized;
}

function normalizeStatus(status, fallback = 'active') {
  const normalized = normalizeText(status) || fallback;
  if (!ALLOWED_STATUS.has(normalized)) {
    const error = new Error('Invalid status value');
    error.statusCode = 400;
    throw error;
  }
  return normalized;
}

function normalizeSortOrder(sortOrder, fallback = 0) {
  if (sortOrder === undefined || sortOrder === null || sortOrder === '') return fallback;
  const parsed = Number(sortOrder);
  if (!Number.isInteger(parsed)) {
    const error = new Error('sort_order must be an integer');
    error.statusCode = 400;
    throw error;
  }
  return parsed;
}

function buildSliderPayload(input, existing = null) {
  const page = validatePage(input.page || existing?.page);
  const pageDefaults = PAGE_DEFAULTS[page];

  const imageUrl = normalizeText(input.image_url) || existing?.image_url;
  const imagePath = normalizeText(input.image_path) || existing?.image_path;

  if (!imageUrl || !imagePath) {
    const error = new Error('page, image_url and image_path are required');
    error.statusCode = 400;
    throw error;
  }

  return {
    page,
    page_label: normalizeText(input.page_label) || existing?.page_label || pageDefaults.label || page,
    title: input.title === undefined ? existing?.title ?? null : normalizeText(input.title) || null,
    description: input.description === undefined ? existing?.description ?? null : normalizeText(input.description) || null,
    image_url: imageUrl,
    image_path: imagePath,
    bg_color: normalizeColor(input.bg_color, existing?.bg_color || pageDefaults.bg_color || '#ffffff'),
    text_color: normalizeColor(input.text_color, existing?.text_color || pageDefaults.text_color || '#000000'),
    animation: normalizeAnimation(input.animation, existing?.animation || 'fade'),
    sort_order: normalizeSortOrder(input.sort_order, existing?.sort_order ?? 0),
    status: normalizeStatus(input.status, existing?.status || 'active')
  };
}

function sendError(res, error) {
  res.status(error.statusCode || 500).json({ success: false, error: { message: error.message } });
}

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
      sendError(res, e);
    }
  }
);

router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page } = req.query;
    let sql = 'SELECT * FROM slider_media';
    const params = [];
    if (page) {
      const validatedPage = validatePage(page);
      sql += ' WHERE page = ?';
      params.push(validatedPage);
    }
    sql += ' ORDER BY page, sort_order, id';
    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (e) {
    sendError(res, e);
  }
});

router.get('/public', async (req, res) => {
  try {
    const page = validatePage(req.query.page);
    const [rows] = await db.query(
      'SELECT * FROM slider_media WHERE page = ? AND status = "active" ORDER BY sort_order, id',
      [page]
    );
    res.json({ success: true, data: rows });
  } catch (e) {
    sendError(res, e);
  }
});

router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const payload = buildSliderPayload(req.body);
    const [result] = await db.query(
      `INSERT INTO slider_media (page, page_label, title, description, image_url, image_path, bg_color, text_color, animation, sort_order, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.page,
        payload.page_label,
        payload.title,
        payload.description,
        payload.image_url,
        payload.image_path,
        payload.bg_color,
        payload.text_color,
        payload.animation,
        payload.sort_order,
        payload.status
      ]
    );
    const [rows] = await db.query('SELECT * FROM slider_media WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (e) {
    sendError(res, e);
  }
});

router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT * FROM slider_media WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, error: { message: 'Slider not found' } });
    }

    const payload = buildSliderPayload(req.body, existing[0]);

    await db.query(
      `UPDATE slider_media SET page=?, page_label=?, title=?, description=?, image_url=?, image_path=?,
       bg_color=?, text_color=?, animation=?, sort_order=?, status=? WHERE id=?`,
      [
        payload.page,
        payload.page_label,
        payload.title,
        payload.description,
        payload.image_url,
        payload.image_path,
        payload.bg_color,
        payload.text_color,
        payload.animation,
        payload.sort_order,
        payload.status,
        id
      ]
    );
    const [rows] = await db.query('SELECT * FROM slider_media WHERE id = ?', [id]);
    res.json({ success: true, data: rows[0] });
  } catch (e) {
    sendError(res, e);
  }
});

router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [existing] = await db.query('SELECT * FROM slider_media WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, error: { message: 'Slider not found' } });

    const imagePath = existing[0].image_path || '';
    const normalizedRelativePath = imagePath.replace(/^\/+/, '');
    const filePath = path.join(__dirname, '..', normalizedRelativePath);
    if (normalizedRelativePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await db.query('DELETE FROM slider_media WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (e) {
    sendError(res, e);
  }
});

module.exports = router;