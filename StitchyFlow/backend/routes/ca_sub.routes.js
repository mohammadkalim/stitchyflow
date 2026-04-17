const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { ensureCASubTables } = require('../utils/caSubTables');
const { WHERE_CATEGORY_NAME_PUBLIC, WHERE_CATEGORY_NAME_PUBLIC_ALIAS_C } = require('../utils/catalogPublicFilters');

/** Public list for homepage / marketplace (active categories only, no auth). */
router.get('/categories/public', async (req, res) => {
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

/** Public subcategories for a category (active only). Query: ?category_id= */
router.get('/subcategories/public', async (req, res) => {
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

router.get('/categories', authenticateToken, async (req, res) => {
  try {
    await ensureCASubTables();
    const [rows] = await db.query('SELECT * FROM categories ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.post('/categories', authenticateToken, async (req, res) => {
  try {
    await ensureCASubTables();
    const { name, description, is_active } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: { message: 'Category name is required' } });
    }
    const [result] = await db.query(
      'INSERT INTO categories (name, description, is_active) VALUES (?, ?, ?)',
      [name.trim(), description || null, is_active !== false]
    );
    res.status(201).json({ success: true, message: 'Category created successfully', data: { id: result.insertId } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

/** Register before any `/categories/:id` route so `all` is never bound to `:id` (MySQL DOUBLE error). */
async function purgeAllCategories(req, res) {
  const conn = await db.getConnection();
  try {
    await ensureCASubTables();
    await conn.beginTransaction();
    try {
      await conn.query(
        'UPDATE business_tailor_shops SET category_id = NULL, subcategory_id = NULL'
      );
    } catch (e) {
      if (!/Unknown table|doesn't exist|ER_NO_SUCH_TABLE/i.test(String(e.message || ''))) {
        throw e;
      }
    }
    const [subRes] = await conn.query('DELETE FROM subcategories');
    const [catRes] = await conn.query('DELETE FROM categories');
    await conn.commit();
    res.json({
      success: true,
      message: `Removed all categories and subcategories. Shop catalogue links were cleared.`,
      data: {
        categoriesDeleted: catRes.affectedRows || 0,
        subcategoriesDeleted: subRes.affectedRows || 0
      }
    });
  } catch (error) {
    try {
      await conn.rollback();
    } catch (_) {
      /* ignore */
    }
    res.status(500).json({ success: false, error: { message: error.message } });
  } finally {
    conn.release();
  }
}

router.post('/categories/delete-all', authenticateToken, purgeAllCategories);
router.delete('/categories/all', authenticateToken, purgeAllCategories);

/** `:id(\\d+)` so only numeric ids match (never the word `all`). */
router.put('/categories/:id(\\d+)', authenticateToken, async (req, res) => {
  try {
    await ensureCASubTables();
    const { id } = req.params;
    const { name, description, is_active } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: { message: 'Category name is required' } });
    }
    await db.query(
      'UPDATE categories SET name = ?, description = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name.trim(), description || null, is_active !== false, id]
    );
    res.json({ success: true, message: 'Category updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.delete('/categories/:id(\\d+)', authenticateToken, async (req, res) => {
  try {
    await ensureCASubTables();
    await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.get('/subcategories', authenticateToken, async (req, res) => {
  try {
    await ensureCASubTables();
    const [rows] = await db.query(`
      SELECT s.*, c.name AS category_name
      FROM subcategories s
      INNER JOIN categories c ON c.id = s.category_id
      ORDER BY s.created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.post('/subcategories', authenticateToken, async (req, res) => {
  try {
    await ensureCASubTables();
    const { category_id, name, description, is_active } = req.body;
    if (!category_id || !name || !name.trim()) {
      return res.status(400).json({ success: false, error: { message: 'Category and subcategory name are required' } });
    }
    const [result] = await db.query(
      'INSERT INTO subcategories (category_id, name, description, is_active) VALUES (?, ?, ?, ?)',
      [category_id, name.trim(), description || null, is_active !== false]
    );
    res.status(201).json({ success: true, message: 'Subcategory created successfully', data: { id: result.insertId } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.put('/subcategories/:id', authenticateToken, async (req, res) => {
  try {
    await ensureCASubTables();
    const { id } = req.params;
    const { category_id, name, description, is_active } = req.body;
    if (!category_id || !name || !name.trim()) {
      return res.status(400).json({ success: false, error: { message: 'Category and subcategory name are required' } });
    }
    await db.query(
      `UPDATE subcategories
       SET category_id = ?, name = ?, description = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [category_id, name.trim(), description || null, is_active !== false, id]
    );
    res.json({ success: true, message: 'Subcategory updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.delete('/subcategories/:id', authenticateToken, async (req, res) => {
  try {
    await ensureCASubTables();
    await db.query('DELETE FROM subcategories WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

/** Inserts 90 demo categories + 90 subcategories (1 sub per seeded category). Idempotent via INSERT IGNORE. */
const SEED_CAT_PREFIX = 'StitchyDemoCat';
const SEED_SUB_PREFIX = 'StitchyDemoSub';

router.post('/seed-demo', authenticateToken, async (req, res) => {
  const conn = await db.getConnection();
  try {
    await ensureCASubTables();
    await conn.beginTransaction();

    for (let i = 1; i <= 90; i++) {
      const pad = String(i).padStart(3, '0');
      await conn.query(
        'INSERT IGNORE INTO categories (name, description, is_active) VALUES (?, ?, ?)',
        [`${SEED_CAT_PREFIX}${pad}`, `Seeded sample category ${pad}`, true]
      );
    }

    const ids = [];
    for (let i = 1; i <= 90; i++) {
      const pad = String(i).padStart(3, '0');
      const [rows] = await conn.query('SELECT id FROM categories WHERE name = ?', [`${SEED_CAT_PREFIX}${pad}`]);
      if (rows && rows[0]) ids.push(rows[0].id);
    }

    if (ids.length < 90) {
      await conn.rollback();
      return res.status(500).json({
        success: false,
        error: { message: `Expected 90 seeded categories (StitchyDemoCat001–090), found ${ids.length}.` }
      });
    }

    let subInserted = 0;
    for (let i = 0; i < 90; i++) {
      const pad = String(i + 1).padStart(3, '0');
      const [result] = await conn.query(
        'INSERT IGNORE INTO subcategories (category_id, name, description, is_active) VALUES (?, ?, ?, ?)',
        [ids[i], `${SEED_SUB_PREFIX}${pad}`, `Seeded sample subcategory ${pad}`, true]
      );
      subInserted += result.affectedRows || 0;
    }

    await conn.commit();
    res.json({
      success: true,
      message: 'Demo data added: 90 categories and 90 subcategories (existing StitchyDemo* rows were skipped).',
      data: { categoriesTarget: 90, subcategoriesInsertedThisRun: subInserted }
    });
  } catch (error) {
    try {
      await conn.rollback();
    } catch (_) {
      /* ignore */
    }
    res.status(500).json({ success: false, error: { message: error.message } });
  } finally {
    conn.release();
  }
});

// Email templates CRUD (same handlers as /api/v1/email-templates). Use a fresh router instance;
// reusing one Express Router in two mounts breaks the nested /ca-sub path.
router.use('/email-templates', require('./email_templates.routes')());

// Splash ads (same as /api/v1/ads) — fallback mount if top-level /ads is missing on a running process.
router.use('/ads', require('./ads.routes')());

module.exports = router;
