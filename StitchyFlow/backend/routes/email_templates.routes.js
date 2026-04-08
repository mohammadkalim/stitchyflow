const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const {
  ensureEmailTemplatesTable,
  seedDefaultEmailTemplates
} = require('../utils/emailTemplateDb');

const SLUG_RE = /^[a-z][a-z0-9_]{2,63}$/i;

/**
 * Fresh router per mount. Mounting the same Express Router instance twice breaks nested routes
 * (e.g. under /ca-sub) while the top-level mount may still work — use a factory.
 */
function createEmailTemplatesRouter() {
  const router = express.Router();

  router.get('/', authenticateToken, async (req, res) => {
    try {
      await ensureEmailTemplatesTable();
      await seedDefaultEmailTemplates();
      const [rows] = await db.query('SELECT * FROM email_templates ORDER BY name ASC');
      res.json({ success: true, data: rows });
    } catch (error) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  });

  router.post('/', authenticateToken, async (req, res) => {
    try {
      await ensureEmailTemplatesTable();
      const { slug, name, description, subject, body_html, is_active } = req.body;
      if (!slug || !name || !subject || body_html === undefined || body_html === null) {
        return res.status(400).json({
          success: false,
          error: { message: 'slug, name, subject, and body_html are required' }
        });
      }
      const s = String(slug).trim();
      if (!SLUG_RE.test(s)) {
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid slug (letters, numbers, underscore; 3–64 chars)' }
        });
      }
      const [result] = await db.query(
        `INSERT INTO email_templates (slug, name, description, subject, body_html, is_active)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [s, name.trim(), description || null, String(subject).trim(), String(body_html), is_active !== false]
      );
      res.status(201).json({
        success: true,
        message: 'Email template created',
        data: { id: result.insertId }
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, error: { message: 'Slug already exists' } });
      }
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  });

  router.put('/:id', authenticateToken, async (req, res) => {
    try {
      await ensureEmailTemplatesTable();
      const { id } = req.params;
      const { name, description, subject, body_html, is_active, slug } = req.body;
      const [existing] = await db.query('SELECT id, slug FROM email_templates WHERE id = ?', [id]);
      if (!existing.length) {
        return res.status(404).json({ success: false, error: { message: 'Template not found' } });
      }
      if (name === undefined || subject === undefined || body_html === undefined) {
        return res.status(400).json({
          success: false,
          error: { message: 'name, subject, and body_html are required' }
        });
      }
      let finalSlug = existing[0].slug;
      if (slug !== undefined && slug !== null && String(slug).trim() !== '') {
        finalSlug = String(slug).trim();
        if (!SLUG_RE.test(finalSlug)) {
          return res.status(400).json({
            success: false,
            error: { message: 'Invalid slug' }
          });
        }
      }
      await db.query(
        `UPDATE email_templates SET
          slug = ?,
          name = ?,
          description = ?,
          subject = ?,
          body_html = ?,
          is_active = ?,
          updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          finalSlug,
          String(name).trim(),
          description || null,
          String(subject).trim(),
          String(body_html),
          is_active !== false,
          id
        ]
      );
      res.json({ success: true, message: 'Email template updated' });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, error: { message: 'Slug already exists' } });
      }
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  });

  router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      await ensureEmailTemplatesTable();
      const [r] = await db.query('DELETE FROM email_templates WHERE id = ?', [req.params.id]);
      if (!r.affectedRows) {
        return res.status(404).json({ success: false, error: { message: 'Template not found' } });
      }
      res.json({ success: true, message: 'Email template deleted' });
    } catch (error) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  });

  return router;
}

module.exports = createEmailTemplatesRouter;
