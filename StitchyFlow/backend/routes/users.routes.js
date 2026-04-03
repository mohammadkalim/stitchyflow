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

// Public: get tailors list (no auth required — used by customer dashboard)
// Admin: get all users (requires auth + admin role)
router.get('/', async (req, res) => {
  const { role } = req.query;

  // No auth needed for tailor listing
  if (role === 'tailor') {
    try {
      const [users] = await db.query(
        'SELECT user_id, first_name, last_name, role, status FROM users WHERE role = ? AND status = "active" ORDER BY created_at DESC',
        ['tailor']
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
