/**
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */

const express = require('express');
const router  = express.Router();
const db      = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// GET /api/v1/logs/system — System logs
router.get('/system', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 500'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/v1/logs/audit — Audit logs
router.get('/audit', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT al.*, CONCAT(u.first_name, ' ', u.last_name) AS user_name
       FROM audit_logs al
       LEFT JOIN users u ON al.user_id = u.user_id
       ORDER BY al.created_at DESC LIMIT 500`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

module.exports = router;
