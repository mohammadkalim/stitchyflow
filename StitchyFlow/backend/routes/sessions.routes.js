/**
 * Sessions Management Routes
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

// Helper: build search WHERE clause
const searchWhere = (status, search) => {
  let where = `WHERE s.status = '${status}'`;
  if (search) {
    const s = db.escape(`%${search}%`);
    where += ` AND (u.email LIKE ${s} OR CONCAT(u.first_name,' ',u.last_name) LIKE ${s} OR s.ip_address LIKE ${s} OR s.browser LIKE ${s} OR s.device_type LIKE ${s})`;
  }
  return where;
};

const sessionSelect = `
  SELECT s.*, CONCAT(u.first_name,' ',u.last_name) AS user_name, u.email AS user_email, u.role AS user_role
  FROM user_sessions s
  LEFT JOIN users u ON s.user_id = u.user_id
`;

// GET /api/v1/sessions/stats — summary counts
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const [[stats]] = await db.query(`
      SELECT
        SUM(status = 'active')   AS active,
        SUM(status = 'inactive') AS inactive,
        SUM(status = 'deleted')  AS deleted,
        SUM(status = 'pending')  AS pending,
        COUNT(*)                 AS total
      FROM user_sessions
    `);
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// GET /api/v1/sessions/active
router.get('/active', authenticateToken, async (req, res) => {
  try {
    const { search = '' } = req.query;
    const [rows] = await db.query(
      `${sessionSelect} ${searchWhere('active', search)} ORDER BY s.last_activity DESC LIMIT 500`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// GET /api/v1/sessions/inactive
router.get('/inactive', authenticateToken, async (req, res) => {
  try {
    const { search = '' } = req.query;
    const [rows] = await db.query(
      `${sessionSelect} ${searchWhere('inactive', search)} ORDER BY s.updated_at DESC LIMIT 500`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// GET /api/v1/sessions/deleted
router.get('/deleted', authenticateToken, async (req, res) => {
  try {
    const { search = '' } = req.query;
    const [rows] = await db.query(
      `${sessionSelect} ${searchWhere('deleted', search)} ORDER BY s.deleted_at DESC LIMIT 500`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// GET /api/v1/sessions/pending
router.get('/pending', authenticateToken, async (req, res) => {
  try {
    const { search = '' } = req.query;
    const [rows] = await db.query(
      `${sessionSelect} ${searchWhere('pending', search)} ORDER BY s.created_at DESC LIMIT 500`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// GET /api/v1/sessions/logs
router.get('/logs', authenticateToken, async (req, res) => {
  try {
    const { search = '' } = req.query;
    let where = '';
    if (search) {
      const s = db.escape(`%${search}%`);
      where = `WHERE sl.action LIKE ${s} OR sl.ip_address LIKE ${s} OR sl.details LIKE ${s} OR CONCAT(u.first_name,' ',u.last_name) LIKE ${s}`;
    }
    const [rows] = await db.query(`
      SELECT sl.*, CONCAT(u.first_name,' ',u.last_name) AS user_name, u.email AS user_email
      FROM session_logs sl
      LEFT JOIN users u ON sl.user_id = u.user_id
      ${where}
      ORDER BY sl.created_at DESC LIMIT 500
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// DELETE /api/v1/sessions/:id — terminate a session
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(
      `UPDATE user_sessions SET status='deleted', deleted_at=NOW(), updated_at=NOW() WHERE session_id=?`,
      [id]
    );
    await db.query(
      `INSERT INTO session_logs (session_id, action, details) VALUES (?, 'TERMINATED', 'Terminated by admin')`,
      [id]
    );
    res.json({ success: true, message: 'Session terminated' });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// PATCH /api/v1/sessions/:id/status — update session status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['active', 'inactive', 'deleted', 'pending'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, error: { message: 'Invalid status' } });
    }
    await db.query(
      `UPDATE user_sessions SET status=?, updated_at=NOW() WHERE session_id=?`,
      [status, id]
    );
    await db.query(
      `INSERT INTO session_logs (session_id, action, details) VALUES (?, ?, ?)`,
      [id, `STATUS_CHANGED`, `Status changed to ${status} by admin`]
    );
    res.json({ success: true, message: `Session status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;
