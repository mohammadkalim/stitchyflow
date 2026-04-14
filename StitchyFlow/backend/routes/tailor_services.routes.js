/**
 * Tailor Services Routes
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const emptyJsonArray = () => '[]';

async function migrateLegacyAllTailorsLinkPath() {
  try {
    await db.query(
      `UPDATE tailor_services
       SET link_path = '/All-tailers'
       WHERE link_path = '/marketplace/custom-dresses'`
    );
  } catch (err) {
    console.warn('tailor_services link_path migration skipped:', err.message);
  }
}

migrateLegacyAllTailorsLinkPath();

// ── FULL LIST FOR ADMIN UI (auth) — before "/" and "/:id" ─────────────────────
// GET /api/v1/tailor-services/mgmt/list
router.get('/mgmt/list', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM tailor_services ORDER BY is_popular DESC, service_name ASC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── GET ALL ACTIVE (public — header / marketplace) ────────────────────────────
// GET /api/v1/tailor-services
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM tailor_services 
       WHERE is_active = TRUE 
       ORDER BY is_popular DESC, service_name ASC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── LIST ALL ROWS (admin — includes inactive) ────────────────────────────────
// GET /api/v1/tailor-services/admin/all  (must be before /:id)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM tailor_services ORDER BY is_popular DESC, service_name ASC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── META: CATEGORIES (public) — before /:id ──────────────────────────────────
// GET /api/v1/tailor-services/meta/categories
router.get('/meta/categories', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT DISTINCT category FROM tailor_services WHERE is_active = TRUE ORDER BY category ASC'
    );
    const categories = rows.map((row) => row.category);
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── GET BY CATEGORY (public) ─────────────────────────────────────────────────
// GET /api/v1/tailor-services/category/:category
router.get('/category/:category', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM tailor_services 
       WHERE category = ? AND is_active = TRUE 
       ORDER BY is_popular DESC, service_name ASC`,
      [req.params.category]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── GET SINGLE (public) ─────────────────────────────────────────────────────
// GET /api/v1/tailor-services/:id
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id < 1) {
      return res.status(404).json({ success: false, error: { message: 'Service not found' } });
    }
    const [rows] = await db.query(
      'SELECT * FROM tailor_services WHERE service_id = ?',
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, error: { message: 'Service not found' } });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── CREATE NEW SERVICE (admin only) ───────────────────────────────────────────
// POST /api/v1/tailor-services
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const {
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
      materials_included,
      size_options,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO tailor_services (
        service_name, service_description, category, link_path, base_price,
        price_range_min, price_range_max, estimated_duration_hours,
        difficulty_level, is_popular, is_active, image_url, accent_color,
        tags, materials_included, size_options
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        service_name,
        service_description,
        category,
        link_path || null,
        base_price,
        price_range_min ?? null,
        price_range_max ?? null,
        estimated_duration_hours ?? null,
        difficulty_level || 'intermediate',
        is_popular || false,
        is_active !== undefined ? is_active : true,
        image_url || null,
        accent_color || null,
        tags ? JSON.stringify(tags) : emptyJsonArray(),
        materials_included ? JSON.stringify(materials_included) : emptyJsonArray(),
        size_options ? JSON.stringify(size_options) : emptyJsonArray(),
      ]
    );

    res.json({
      success: true,
      message: 'Tailor service created successfully',
      data: { service_id: result.insertId },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── UPDATE SERVICE (admin only) ───────────────────────────────────────────────
// PUT /api/v1/tailor-services/:id
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const {
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
      materials_included,
      size_options,
    } = req.body;

    const [existing] = await db.query(
      'SELECT service_id FROM tailor_services WHERE service_id = ?',
      [req.params.id]
    );
    if (!existing.length) {
      return res.status(404).json({ success: false, error: { message: 'Service not found' } });
    }

    await db.query(
      `UPDATE tailor_services SET
        service_name = ?,
        service_description = ?,
        category = ?,
        link_path = ?,
        base_price = ?,
        price_range_min = ?,
        price_range_max = ?,
        estimated_duration_hours = ?,
        difficulty_level = ?,
        is_popular = ?,
        is_active = ?,
        image_url = ?,
        accent_color = ?,
        tags = ?,
        materials_included = ?,
        size_options = ?,
        updated_at = NOW()
       WHERE service_id = ?`,
      [
        service_name,
        service_description,
        category,
        link_path || null,
        base_price,
        price_range_min ?? null,
        price_range_max ?? null,
        estimated_duration_hours ?? null,
        difficulty_level || 'intermediate',
        is_popular || false,
        is_active !== undefined ? is_active : true,
        image_url || null,
        accent_color || null,
        tags ? JSON.stringify(tags) : emptyJsonArray(),
        materials_included ? JSON.stringify(materials_included) : emptyJsonArray(),
        size_options ? JSON.stringify(size_options) : emptyJsonArray(),
        req.params.id,
      ]
    );

    res.json({ success: true, message: 'Tailor service updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── DELETE SERVICE (admin only) ───────────────────────────────────────────────
// DELETE /api/v1/tailor-services/:id
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [existing] = await db.query(
      'SELECT service_id FROM tailor_services WHERE service_id = ?',
      [req.params.id]
    );
    if (!existing.length) {
      return res.status(404).json({ success: false, error: { message: 'Service not found' } });
    }

    await db.query('DELETE FROM tailor_services WHERE service_id = ?', [req.params.id]);

    res.json({ success: true, message: 'Tailor service deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── TOGGLE POPULAR STATUS (admin only) ──────────────────────────────────────
// PATCH /api/v1/tailor-services/:id/toggle-popular
router.patch('/:id/toggle-popular', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT service_id, is_popular FROM tailor_services WHERE service_id = ?',
      [req.params.id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, error: { message: 'Service not found' } });
    }
    const newStatus = rows[0].is_popular ? 0 : 1;
    await db.query(
      'UPDATE tailor_services SET is_popular = ?, updated_at = NOW() WHERE service_id = ?',
      [newStatus, req.params.id]
    );
    res.json({
      success: true,
      message: `Service ${newStatus ? 'marked as popular' : 'unmarked as popular'}`,
      data: { is_popular: newStatus },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── TOGGLE ACTIVE STATUS (admin only) ───────────────────────────────────────
// PATCH /api/v1/tailor-services/:id/toggle-active
router.patch('/:id/toggle-active', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT service_id, is_active FROM tailor_services WHERE service_id = ?',
      [req.params.id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, error: { message: 'Service not found' } });
    }
    const newStatus = rows[0].is_active ? 0 : 1;
    await db.query(
      'UPDATE tailor_services SET is_active = ?, updated_at = NOW() WHERE service_id = ?',
      [newStatus, req.params.id]
    );
    res.json({
      success: true,
      message: `Service ${newStatus ? 'activated' : 'deactivated'}`,
      data: { is_active: newStatus },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;
