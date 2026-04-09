/**
 * Splash ad image upload — mounted directly from server.js on
 * /api/v1/ads, /api/v1/admin/ads, /api/v1/ca-sub/ads (before broader routers)
 * so POST …/upload-image always resolves (avoids 404 from mount/order issues).
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const adsUploadDir = path.join(__dirname, '..', 'uploads', 'ads');
fs.mkdirSync(adsUploadDir, { recursive: true });

const ALLOWED_IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

const adsImageUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, adsUploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname || '').toLowerCase();
      const safeExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext) ? ext : '.jpg';
      cb(null, `ad-${Date.now()}-${crypto.randomBytes(6).toString('hex')}${safeExt}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_MIMES.has(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG, PNG, GIF, or WebP images are allowed'));
  }
});

function publicUploadUrl(req, relativePath) {
  const base = (process.env.PUBLIC_API_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
  const rel = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return `${base}${rel}`;
}

const router = express.Router();

router.post(
  '/upload-image',
  authenticateToken,
  authorizeRoles('admin'),
  (req, res, next) => {
    adsImageUpload.single('image')(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: { message: err.message || 'Upload failed' }
        });
      }
      next();
    });
  },
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: { message: 'No image file provided' } });
      }
      const relative = `/uploads/ads/${req.file.filename}`;
      const url = publicUploadUrl(req, relative);
      res.json({ success: true, data: { url, path: relative } });
    } catch (error) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }
);

module.exports = router;
