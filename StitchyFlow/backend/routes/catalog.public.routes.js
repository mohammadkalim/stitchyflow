/**
 * Public catalog for the marketing site (no auth).
 * Mounted at /api/v1/catalog — routes: GET /categories, GET /subcategories?category_id=
 */
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { ensureCASubTables } = require('../utils/caSubTables');

router.get('/categories', async (req, res) => {
  try {
    await ensureCASubTables();
    const [rows] = await db.query(
      'SELECT id, name, description FROM categories WHERE is_active = TRUE ORDER BY name ASC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.get('/subcategories', async (req, res) => {
  try {
    await ensureCASubTables();
    const categoryId = req.query.category_id;
    if (!categoryId) {
      return res.status(400).json({ success: false, error: { message: 'category_id query is required' } });
    }
    const [rows] = await db.query(
      `SELECT id, name, description FROM subcategories
       WHERE category_id = ? AND is_active = TRUE
       ORDER BY name ASC`,
      [categoryId]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

module.exports = router;
