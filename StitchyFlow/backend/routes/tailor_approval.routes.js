/**
 * Tailor Shop Approval Routes
 * Developer: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { getRenderedEmail } = require('../utils/emailTemplateDb');

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: { message: 'Token required' } });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ success: false, error: { message: 'Invalid token' } });
  }
}

// Get SMTP transporter
async function getSMTPTransporter() {
  const [settings] = await db.query('SELECT * FROM smtp_settings WHERE is_default = TRUE OR is_active = TRUE ORDER BY is_default DESC, updated_at DESC, id DESC LIMIT 1');
  if (!settings.length) throw new Error('SMTP not configured');
  const smtp = settings[0];
  return nodemailer.createTransport({
    host: smtp.server_address,
    port: parseInt(smtp.port) || 465,
    secure: smtp.encryption === 'SSL' || parseInt(smtp.port) === 465,
    auth: { user: smtp.username, pass: smtp.password },
    tls: { rejectUnauthorized: false }
  });
}

// Send approval/rejection email (templates: tailor_approval_approved / tailor_approval_rejected)
async function sendApprovalEmail(email, firstName, approved, note) {
  try {
    const transporter = await getSMTPTransporter();
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`;
    const slug = approved ? 'tailor_approval_approved' : 'tailor_approval_rejected';
    const noteBlock = note
      ? (approved
        ? `<p style="color:#64748b;font-size:14px;background:#f8fafc;padding:12px;border-radius:8px;border-left:3px solid #2563eb;"><strong>Admin Note:</strong> ${note}</p>`
        : `<p style="color:#64748b;font-size:14px;background:#f8fafc;padding:12px;border-radius:8px;border-left:3px solid #ef4444;"><strong>Reason:</strong> ${note}</p>`)
      : '';

    const fallbackSubject = approved ? '🎉 Your StitchyFlow Shop is Approved!' : 'StitchyFlow Account Update';
    const fallbackHtml = approved
      ? `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;"><div style="background:#fff;border-radius:12px;padding:30px;"><h1 style="color:#2563eb;text-align:center;">StitchyFlow</h1><h2 style="color:#15803d;">Congratulations, ${firstName}!</h2><p>Your shop has been approved.</p>${noteBlock}<p style="text-align:center;"><a href="${loginUrl}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">Login</a></p></div></div>`
      : `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;"><div style="background:#fff;border-radius:12px;padding:30px;"><h1 style="color:#2563eb;text-align:center;">StitchyFlow</h1><p>Hi ${firstName}, your application was not approved.</p>${noteBlock}</div></div>`;

    let subject = fallbackSubject;
    let html = fallbackHtml;

    const custom = await getRenderedEmail(slug, {
      firstName: firstName || 'There',
      note: noteBlock || '',
      loginUrl
    });
    if (custom) {
      subject = custom.subject;
      html = custom.html;
    }

    await transporter.sendMail({ from: '"StitchyFlow" <noreply@stitchyflow.com>', to: email, subject, html });
  } catch (e) {
    console.error('Approval email error:', e.message);
  }
}

// GET /api/v1/tailor-approval/status — tailor checks own approval status
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT approval_status, approval_note, status FROM users WHERE user_id = ?',
      [req.user.userId]
    );
    if (!rows.length) return res.status(404).json({ success: false, error: { message: 'User not found' } });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// GET /api/v1/tailor-approval/pending — admin gets all pending tailor verifications
router.get('/pending', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        v.verification_id, v.tailor_name, v.shop_name, v.contact_number,
        v.verification_status, v.review_notes, v.created_at, v.user_id,
        u.email, u.first_name, u.last_name, u.phone, u.approval_status, u.status
      FROM business_tailor_verifications v
      LEFT JOIN users u ON v.user_id = u.user_id
      ORDER BY v.created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// POST /api/v1/tailor-approval/approve/:userId — admin approves tailor
router.post('/approve/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { note } = req.body;

    const [users] = await db.query(
      'SELECT email, first_name FROM users WHERE user_id = ? AND role = ?',
      [userId, 'tailor']
    );
    if (!users.length) return res.status(404).json({ success: false, error: { message: 'Tailor not found' } });

    // Approve: set status active + approval_status approved
    await db.query(
      "UPDATE users SET status = 'active', approval_status = 'approved', approval_note = ? WHERE user_id = ?",
      [note || null, userId]
    );

    // Update verification table
    await db.query(
      "UPDATE business_tailor_verifications SET verification_status = 'approved', review_notes = ? WHERE user_id = ?",
      [note || null, userId]
    );

    // Send approval email
    await sendApprovalEmail(users[0].email, users[0].first_name, true, note);

    res.json({ success: true, message: 'Tailor approved successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// POST /api/v1/tailor-approval/reject/:userId — admin rejects tailor
router.post('/reject/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { note } = req.body;

    const [users] = await db.query(
      'SELECT email, first_name FROM users WHERE user_id = ? AND role = ?',
      [userId, 'tailor']
    );
    if (!users.length) return res.status(404).json({ success: false, error: { message: 'Tailor not found' } });

    // Reject: keep status pending, set approval_status rejected
    await db.query(
      "UPDATE users SET approval_status = 'rejected', approval_note = ? WHERE user_id = ?",
      [note || null, userId]
    );

    // Update verification table
    await db.query(
      "UPDATE business_tailor_verifications SET verification_status = 'rejected', review_notes = ? WHERE user_id = ?",
      [note || null, userId]
    );

    // Send rejection email
    await sendApprovalEmail(users[0].email, users[0].first_name, false, note);

    res.json({ success: true, message: 'Tailor rejected.' });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;
