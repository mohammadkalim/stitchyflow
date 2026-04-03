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
  const [settings] = await db.query('SELECT * FROM smtp_settings WHERE is_active = TRUE LIMIT 1');
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

// Send approval/rejection email
async function sendApprovalEmail(email, firstName, approved, note) {
  try {
    const transporter = await getSMTPTransporter();
    const subject = approved ? '🎉 Your StitchyFlow Shop is Approved!' : 'StitchyFlow Account Update';
    const html = approved ? `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f8fafc;">
        <div style="background:#fff;border-radius:12px;padding:30px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#2563eb;margin:0;font-size:28px;">StitchyFlow</h1>
          </div>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px;text-align:center;margin-bottom:24px;">
            <div style="font-size:48px;margin-bottom:8px;">✅</div>
            <h2 style="color:#15803d;margin:0 0 8px 0;">Congratulations, ${firstName}!</h2>
            <p style="color:#166534;margin:0;">Your Tailor Shop has been <strong>approved</strong> by our admin team.</p>
          </div>
          <p style="color:#334155;font-size:15px;line-height:1.6;">You can now log in to your dashboard and start accepting orders from customers.</p>
          ${note ? `<p style="color:#64748b;font-size:14px;background:#f8fafc;padding:12px;border-radius:8px;border-left:3px solid #2563eb;"><strong>Admin Note:</strong> ${note}</p>` : ''}
          <div style="text-align:center;margin-top:24px;">
            <a href="${process.env.FRONTEND_URL}/login" style="background:#2563eb;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">Login to Dashboard</a>
          </div>
          <div style="border-top:1px solid #e2e8f0;margin-top:30px;padding-top:20px;">
            <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">&copy; 2026 StitchyFlow. All rights reserved.</p>
          </div>
        </div>
      </div>
    ` : `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f8fafc;">
        <div style="background:#fff;border-radius:12px;padding:30px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#2563eb;margin:0;font-size:28px;">StitchyFlow</h1>
          </div>
          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:20px;text-align:center;margin-bottom:24px;">
            <div style="font-size:48px;margin-bottom:8px;">❌</div>
            <h2 style="color:#dc2626;margin:0 0 8px 0;">Application Not Approved</h2>
            <p style="color:#7f1d1d;margin:0;">Hi ${firstName}, your Tailor Shop application was not approved at this time.</p>
          </div>
          ${note ? `<p style="color:#64748b;font-size:14px;background:#f8fafc;padding:12px;border-radius:8px;border-left:3px solid #ef4444;"><strong>Reason:</strong> ${note}</p>` : ''}
          <p style="color:#334155;font-size:15px;line-height:1.6;">If you believe this is a mistake or would like to appeal, please contact our support team.</p>
          <div style="border-top:1px solid #e2e8f0;margin-top:30px;padding-top:20px;">
            <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">&copy; 2026 StitchyFlow. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
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
