/**
 * Social Media Links Routes
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

// ── GET ALL (public — used by frontend header/footer) ─────────────────────────
// GET /api/v1/social-media
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM social_media_links ORDER BY sort_order ASC, id ASC'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── GET SINGLE ────────────────────────────────────────────────────────────────
// GET /api/v1/social-media/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM social_media_links WHERE id = ?',
      [req.params.id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, error: { message: 'Social media link not found' } });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── CREATE ────────────────────────────────────────────────────────────────────
// POST /api/v1/social-media
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      platform, label, url, icon, color,
      show_header, show_footer, footer_position, is_active, sort_order
    } = req.body;

    if (!platform || !label || !url) {
      return res.status(400).json({
        success: false,
        error: { message: 'platform, label, and url are required' }
      });
    }

    const [result] = await db.query(
      `INSERT INTO social_media_links
         (platform, label, url, icon, color, show_header, show_footer, footer_position, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        platform,
        label,
        url,
        icon || platform,
        color || '#1976d2',
        show_header ? 1 : 0,
        show_footer !== false ? 1 : 0,
        footer_position || 'left',
        is_active !== false ? 1 : 0,
        sort_order || 0
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Social media link created successfully',
      data: { id: result.insertId }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── UPDATE ────────────────────────────────────────────────────────────────────
// PUT /api/v1/social-media/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const {
      platform, label, url, icon, color,
      show_header, show_footer, footer_position, is_active, sort_order
    } = req.body;

    const [existing] = await db.query(
      'SELECT id FROM social_media_links WHERE id = ?',
      [req.params.id]
    );
    if (!existing.length) {
      return res.status(404).json({ success: false, error: { message: 'Social media link not found' } });
    }

    await db.query(
      `UPDATE social_media_links SET
         platform = ?, label = ?, url = ?, icon = ?, color = ?,
         show_header = ?, show_footer = ?, footer_position = ?,
         is_active = ?, sort_order = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        platform,
        label,
        url,
        icon || platform,
        color || '#1976d2',
        show_header ? 1 : 0,
        show_footer ? 1 : 0,
        footer_position || 'left',
        is_active ? 1 : 0,
        sort_order || 0,
        req.params.id
      ]
    );

    res.json({ success: true, message: 'Social media link updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── DELETE ────────────────────────────────────────────────────────────────────
// DELETE /api/v1/social-media/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [existing] = await db.query(
      'SELECT id FROM social_media_links WHERE id = ?',
      [req.params.id]
    );
    if (!existing.length) {
      return res.status(404).json({ success: false, error: { message: 'Social media link not found' } });
    }

    await db.query('DELETE FROM social_media_links WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Social media link deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── TOGGLE ACTIVE ─────────────────────────────────────────────────────────────
// PATCH /api/v1/social-media/:id/toggle
router.patch('/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, is_active FROM social_media_links WHERE id = ?',
      [req.params.id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, error: { message: 'Not found' } });
    }
    const newStatus = rows[0].is_active ? 0 : 1;
    await db.query(
      'UPDATE social_media_links SET is_active = ?, updated_at = NOW() WHERE id = ?',
      [newStatus, req.params.id]
    );
    res.json({ success: true, message: `Link ${newStatus ? 'activated' : 'deactivated'}`, data: { is_active: newStatus } });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;
