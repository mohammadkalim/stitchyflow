const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT user_id, email, first_name, last_name, phone, role, status, profile_image FROM users WHERE user_id = ?',
      [req.user.userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, error: { message: 'User not found' } });
    }
    
    res.json({ success: true, data: users[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Public: single tailor profile detail (no auth required)
router.get('/public/tailors/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!Number.isFinite(userId) || userId < 1) {
      return res.status(400).json({ success: false, error: { message: 'Invalid tailor id' } });
    }
    let [users] = await db.query(
      `SELECT
         u.user_id,
         u.first_name,
         u.last_name,
         u.email,
         u.phone,
         u.role,
         u.status,
         u.profile_image,
         u.created_at,
         bs.shop_id,
         bs.shop_name,
         bs.owner_name,
         bs.city,
         bs.country,
         bs.address,
         bs.contact_number,
         bs.whatsapp_number
       FROM users u
       LEFT JOIN (
        SELECT s.owner_user_id, s.shop_id, s.shop_name, s.owner_name, s.city, s.country, s.address, s.contact_number, s.whatsapp_number
         FROM business_tailor_shops s
         INNER JOIN (
           SELECT owner_user_id, MAX(shop_id) AS max_shop_id
           FROM business_tailor_shops
           GROUP BY owner_user_id
         ) latest ON latest.owner_user_id = s.owner_user_id AND latest.max_shop_id = s.shop_id
       ) bs ON bs.owner_user_id = u.user_id
       WHERE u.user_id = ? AND u.role IN ('tailor', 'business_owner')`,
      [userId]
    );

    // Backward-compatibility fallback: some old clients pass shop_id instead of user_id.
    if (users.length === 0) {
      const [shops] = await db.query(
        `SELECT owner_user_id
         FROM business_tailor_shops
         WHERE shop_id = ? OR owner_user_id = ?
         ORDER BY shop_id DESC
         LIMIT 1`,
        [userId, userId]
      );

      const ownerUserId = Number(shops?.[0]?.owner_user_id);
      if (Number.isFinite(ownerUserId) && ownerUserId > 0) {
        [users] = await db.query(
          `SELECT
             u.user_id,
             u.first_name,
             u.last_name,
             u.email,
             u.phone,
             u.role,
             u.status,
             u.profile_image,
             u.created_at,
             bs.shop_id,
             bs.shop_name,
             bs.owner_name,
             bs.city,
             bs.country,
             bs.address,
             bs.contact_number,
             bs.whatsapp_number
           FROM users u
           LEFT JOIN (
            SELECT s.owner_user_id, s.shop_id, s.shop_name, s.owner_name, s.city, s.country, s.address, s.contact_number, s.whatsapp_number
             FROM business_tailor_shops s
             INNER JOIN (
               SELECT owner_user_id, MAX(shop_id) AS max_shop_id
               FROM business_tailor_shops
               GROUP BY owner_user_id
             ) latest ON latest.owner_user_id = s.owner_user_id AND latest.max_shop_id = s.shop_id
           ) bs ON bs.owner_user_id = u.user_id
           WHERE u.user_id = ?`,
          [ownerUserId]
        );
      }
    }

    if (users.length === 0) {
      return res.status(404).json({ success: false, error: { message: 'Tailor not found' } });
    }

    return res.json({ success: true, data: users[0] });
  } catch (error) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Public: get tailors list (no auth required — used by customer dashboard)
// Admin: get all users (requires auth + admin role)
router.get('/', async (req, res) => {
  const { role } = req.query;

  // No auth needed for tailor listing
  if (role === 'tailor') {
    try {
      const [users] = await db.query(
        `SELECT
           u.user_id,
           u.first_name,
           u.last_name,
           u.role,
           u.status,
           bs.shop_id,
           bs.shop_name,
           bs.owner_name,
           bs.city,
           bs.country,
           bs.address,
           bs.contact_number,
           bs.whatsapp_number
         FROM users u
         LEFT JOIN (
           SELECT s.owner_user_id, s.shop_id, s.shop_name, s.owner_name, s.city, s.country, s.address, s.contact_number, s.whatsapp_number
           FROM business_tailor_shops s
           INNER JOIN (
             SELECT owner_user_id, MAX(shop_id) AS max_shop_id
             FROM business_tailor_shops
             GROUP BY owner_user_id
           ) latest ON latest.owner_user_id = s.owner_user_id AND latest.max_shop_id = s.shop_id
         ) bs ON bs.owner_user_id = u.user_id
         WHERE
           u.role IN ('tailor', 'business_owner')
           AND (u.status = "active" OR bs.shop_id IS NOT NULL)
         ORDER BY u.created_at DESC`,
        []
      );
      return res.json({ success: true, data: users });
    } catch (error) {
      return res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  // All other queries require admin auth
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: { message: 'Access token required' } });

  const jwt = require('jsonwebtoken');
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(403).json({ success: false, error: { message: 'Invalid or expired token' } });
  }

  if (decoded.role !== 'admin') {
    return res.status(403).json({ success: false, error: { message: 'Access denied' } });
  }

  try {
    const [users] = await db.query(
      'SELECT user_id, email, first_name, last_name, phone, role, status, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

module.exports = router;
