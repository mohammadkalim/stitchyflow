/**
 * Splash Ads & Analytics — export factory so the same routes can mount at
 * /api/v1/ads, /api/v1/admin/ads, and /api/v1/ca-sub/ads (avoids 404 on stale or partial deploys).
 */
const express = require('express');
const db = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { ensureAdsTables } = require('../utils/adsDb');

function sqlDateTime(v) {
  if (v == null || v === '') return null;
  const s = String(v).trim();
  if (!s) return null;
  if (s.includes('T')) return s.replace('T', ' ').slice(0, 19);
  return s;
}

function normalizePages(pages) {
  if (Array.isArray(pages)) {
    return pages.filter((p) => typeof p === 'string').map((p) => p.trim()).filter(Boolean);
  }
  if (typeof pages === 'string') {
    try {
      const parsed = JSON.parse(pages);
      if (Array.isArray(parsed)) {
        return parsed.filter((p) => typeof p === 'string').map((p) => p.trim()).filter(Boolean);
      }
    } catch (_) {
      return pages.split(',').map((p) => p.trim()).filter(Boolean);
    }
  }
  return [];
}

function normalizeImageUrls(imageUrls, fallbackImageUrl) {
  let urls = [];
  if (Array.isArray(imageUrls)) {
    urls = imageUrls;
  } else if (typeof imageUrls === 'string') {
    try {
      const parsed = JSON.parse(imageUrls);
      urls = Array.isArray(parsed) ? parsed : [imageUrls];
    } catch (_) {
      urls = imageUrls
        .split(/\r?\n|,/)
        .map((x) => x.trim())
        .filter(Boolean);
    }
  }
  urls = urls
    .filter((x) => typeof x === 'string')
    .map((x) => x.trim())
    .filter(Boolean);
  if (!urls.length && typeof fallbackImageUrl === 'string' && fallbackImageUrl.trim()) {
    urls = [fallbackImageUrl.trim()];
  }
  // unique while preserving order
  return [...new Set(urls)];
}

function hydrateRow(row) {
  const pages = typeof row.pages === 'string' ? JSON.parse(row.pages || '[]') : row.pages;
  const image_urls = normalizeImageUrls(row.image_urls, row.image_url);
  return {
    ...row,
    pages,
    image_urls,
    image_url: image_urls[0] || row.image_url || ''
  };
}

function createAdsRouter() {
  const router = express.Router();

  /** Public: active ads for optional ?page= */
  router.get('/', async (req, res) => {
    try {
      await ensureAdsTables();
      const page = (req.query.page || '').trim();
      const conditions = [
        "status = 'active'",
        '(start_date IS NULL OR start_date <= NOW())',
        '(end_date IS NULL OR end_date >= NOW())'
      ];
      const values = [];

      if (page) {
        conditions.push('JSON_CONTAINS(pages, JSON_QUOTE(?))');
        values.push(page);
      }

      const [ads] = await db.query(
        `SELECT id, title, image_url, image_urls, redirect_url, start_date, end_date, status, pages, created_at
         FROM ads
         WHERE ${conditions.join(' AND ')}
         ORDER BY created_at DESC`,
        values
      );
      const rows = ads.map(hydrateRow);

      res.json({ success: true, data: rows });
    } catch (error) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  });

  router.post('/impression', async (req, res) => {
    try {
      await ensureAdsTables();
      const { ad_id, page } = req.body || {};
      if (!ad_id || !page) {
        return res.status(400).json({ success: false, error: { message: 'ad_id and page are required' } });
      }

      await db.query(
        `INSERT INTO ads_analytics (ad_id, page, impressions, clicks)
         VALUES (?, ?, 1, 0)
         ON DUPLICATE KEY UPDATE impressions = impressions + 1, updated_at = CURRENT_TIMESTAMP`,
        [ad_id, String(page).slice(0, 512)]
      );

      res.json({ success: true, message: 'Impression tracked' });
    } catch (error) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  });

  router.post('/click', async (req, res) => {
    try {
      await ensureAdsTables();
      const { ad_id, page } = req.body || {};
      if (!ad_id || !page) {
        return res.status(400).json({ success: false, error: { message: 'ad_id and page are required' } });
      }

      await db.query(
        `INSERT INTO ads_analytics (ad_id, page, impressions, clicks)
         VALUES (?, ?, 0, 1)
         ON DUPLICATE KEY UPDATE clicks = clicks + 1, updated_at = CURRENT_TIMESTAMP`,
        [ad_id, String(page).slice(0, 512)]
      );

      res.json({ success: true, message: 'Click tracked' });
    } catch (error) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  });

  router.get('/admin', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
      await ensureAdsTables();
      const [ads] = await db.query(
        `SELECT id, title, image_url, image_urls, redirect_url, start_date, end_date, status, pages, created_at
         FROM ads ORDER BY created_at DESC`
      );
      const rows = ads.map(hydrateRow);
      res.json({ success: true, data: rows });
    } catch (error) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  });

  router.get('/analytics', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
      await ensureAdsTables();
      const [rows] = await db.query(
        `SELECT aa.ad_id, a.title, aa.page, aa.impressions, aa.clicks,
                ROUND(CASE WHEN aa.impressions = 0 THEN 0 ELSE (aa.clicks / aa.impressions) * 100 END, 2) AS ctr
         FROM ads_analytics aa
         JOIN ads a ON a.id = aa.ad_id
         ORDER BY aa.impressions DESC`
      );
      res.json({ success: true, data: rows });
    } catch (error) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  });

  router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
      await ensureAdsTables();
      const { title, image_url, image_urls, redirect_url, start_date, end_date, status, pages } = req.body;
      const normalizedImageUrls = normalizeImageUrls(image_urls, image_url);
      if (!title || !normalizedImageUrls.length || !redirect_url) {
        return res.status(400).json({ success: false, error: { message: 'Title, at least one image URL, and redirect URL are required' } });
      }

      const normalizedPages = normalizePages(pages);
      const [result] = await db.query(
        `INSERT INTO ads (title, image_url, image_urls, redirect_url, start_date, end_date, status, pages)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          normalizedImageUrls[0],
          JSON.stringify(normalizedImageUrls),
          redirect_url,
          sqlDateTime(start_date),
          sqlDateTime(end_date),
          status === 'inactive' ? 'inactive' : 'active',
          JSON.stringify(normalizedPages)
        ]
      );

      res.status(201).json({ success: true, message: 'Ad created successfully', data: { id: result.insertId } });
    } catch (error) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  });

  router.get('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
      await ensureAdsTables();
      const [ads] = await db.query(
        'SELECT id, title, image_url, image_urls, redirect_url, start_date, end_date, status, pages, created_at FROM ads WHERE id = ?',
        [req.params.id]
      );
      if (!ads.length) {
        return res.status(404).json({ success: false, error: { message: 'Ad not found' } });
      }
      const row = hydrateRow(ads[0]);
      res.json({ success: true, data: row });
    } catch (error) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  });

  router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
      await ensureAdsTables();
      const { title, image_url, image_urls, redirect_url, start_date, end_date, status, pages } = req.body;
      const [ads] = await db.query('SELECT id, title, image_url, image_urls, redirect_url, start_date, end_date, status, pages FROM ads WHERE id = ?', [req.params.id]);
      if (!ads.length) {
        return res.status(404).json({ success: false, error: { message: 'Ad not found' } });
      }

      const prev = ads[0];
      const normalizedImageUrls = normalizeImageUrls(
        image_urls,
        image_url != null ? image_url : prev.image_url
      );
      const normalizedPages = normalizePages(pages);
      const pagesJson =
        normalizedPages.length > 0
          ? JSON.stringify(normalizedPages)
          : typeof prev.pages === 'string'
            ? prev.pages
            : JSON.stringify(prev.pages || []);

      await db.query(
        `UPDATE ads SET title = ?, image_url = ?, image_urls = ?, redirect_url = ?, start_date = ?, end_date = ?, status = ?, pages = ? WHERE id = ?`,
        [
          title != null ? title : prev.title,
          normalizedImageUrls[0] || prev.image_url,
          JSON.stringify(normalizedImageUrls.length ? normalizedImageUrls : normalizeImageUrls(prev.image_urls, prev.image_url)),
          redirect_url != null ? redirect_url : prev.redirect_url,
        start_date !== undefined ? sqlDateTime(start_date) : prev.start_date,
        end_date !== undefined ? sqlDateTime(end_date) : prev.end_date,
          status === 'inactive' ? 'inactive' : 'active',
          pagesJson,
          req.params.id
        ]
      );

      res.json({ success: true, message: 'Ad updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  });

  router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
      await ensureAdsTables();
      const [result] = await db.query('DELETE FROM ads WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: { message: 'Ad not found' } });
      }
      res.json({ success: true, message: 'Ad deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  });

  return router;
}

module.exports = createAdsRouter;
