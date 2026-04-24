/**
 * Admin shop media (business_shop_media) — shared handlers for router + app-level routes.
 * Developer by: Muhammad Kalim · LogixInventor (PVT) Ltd.
 */
const db = require('../config/database');

async function listShopMedia(req, res) {
  try {
    const role = String(req.user?.role || '').toLowerCase();
    if (role !== 'admin') {
      return res.status(403).json({ success: false, error: { message: 'Admin access required' } });
    }
    const [rows] = await db.query(
      `SELECT
         m.media_id,
         m.shop_id,
         m.owner_user_id,
         m.title,
         m.caption,
         m.image_url,
         m.sort_order,
         m.is_active,
         m.created_at,
         m.updated_at,
         s.shop_name,
         s.owner_name AS shop_owner_name,
         TRIM(CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, ''))) AS owner_display_name,
         u.email AS owner_email
       FROM business_shop_media m
       INNER JOIN business_tailor_shops s ON s.shop_id = m.shop_id
       LEFT JOIN users u ON u.user_id = m.owner_user_id
       ORDER BY m.updated_at DESC, m.media_id DESC`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.json({
        success: true,
        data: [],
        meta: { note: 'Table business_shop_media not created yet; restart API or run Database/create_business_shop_media.sql' },
      });
    }
    res.status(500).json({ success: false, error: { message: error.message } });
  }
}

async function patchShopMedia(req, res) {
  try {
    const role = String(req.user?.role || '').toLowerCase();
    if (role !== 'admin') {
      return res.status(403).json({ success: false, error: { message: 'Admin access required' } });
    }
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id < 1) {
      return res.status(400).json({ success: false, error: { message: 'Invalid id' } });
    }
    if (req.body.is_active === undefined) {
      return res.status(400).json({ success: false, error: { message: 'is_active required' } });
    }
    const active = req.body.is_active === true || req.body.is_active === 1 || req.body.is_active === '1';
    const [result] = await db.query('UPDATE business_shop_media SET is_active = ? WHERE media_id = ?', [active ? 1 : 0, id]);
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, error: { message: 'Not found' } });
    }
    res.json({ success: true, message: 'Updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
}

async function deleteShopMedia(req, res) {
  try {
    const role = String(req.user?.role || '').toLowerCase();
    if (role !== 'admin') {
      return res.status(403).json({ success: false, error: { message: 'Admin access required' } });
    }
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id < 1) {
      return res.status(400).json({ success: false, error: { message: 'Invalid id' } });
    }
    const [result] = await db.query('DELETE FROM business_shop_media WHERE media_id = ?', [id]);
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, error: { message: 'Not found' } });
    }
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
}

module.exports = { listShopMedia, patchShopMedia, deleteShopMedia };
