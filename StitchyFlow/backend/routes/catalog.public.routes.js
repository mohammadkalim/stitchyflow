/**
 * Public catalog for the marketing site (no auth).
 * Mounted at /api/v1/catalog — routes: GET /categories, GET /subcategories?category_id=
 */
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { ensureCASubTables } = require('../utils/caSubTables');
const { fetchTailorShopsForCatalogCategory } = require('../utils/tailorsByCatalogCategory');
const { WHERE_CATEGORY_NAME_PUBLIC, WHERE_CATEGORY_NAME_PUBLIC_ALIAS_C } = require('../utils/catalogPublicFilters');
const businessRoutes = require('./business.routes');

router.get('/categories', async (req, res) => {
  try {
    await ensureCASubTables();
    const [rows] = await db.query(
      `SELECT id, name, description FROM categories WHERE is_active = TRUE AND ${WHERE_CATEGORY_NAME_PUBLIC} ORDER BY name ASC`
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
      `SELECT s.id, s.name, s.description FROM subcategories s
       INNER JOIN categories c ON c.id = s.category_id
       WHERE s.category_id = ? AND s.is_active = TRUE AND ${WHERE_CATEGORY_NAME_PUBLIC_ALIAS_C}
       ORDER BY s.name ASC`,
      [categoryId]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

/** Public: tailor shops linked to a catalogue category (live DB). Also mounted on `app` in server.js. */
async function getTailorsByCategoryPublic(req, res) {
  try {
    await ensureCASubTables();
    await businessRoutes.initPromise;
    const catId = parseInt(req.params.categoryId, 10);
    if (!Number.isFinite(catId) || catId < 1) {
      return res.status(400).json({ success: false, error: { message: 'Invalid category id' } });
    }
    const rows = await fetchTailorShopsForCatalogCategory(db, catId);
    res.set('Cache-Control', 'private, no-cache, must-revalidate');
    res.json({ success: true, data: rows });
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({
        success: false,
        error: { message: 'Catalog or shop tables not available.' },
      });
    }
    res.status(500).json({ success: false, error: { message: error.message } });
  }
}

router.get('/tailors-by-category/:categoryId', getTailorsByCategoryPublic);

module.exports = router;
module.exports.getTailorsByCategoryPublic = getTailorsByCategoryPublic;
