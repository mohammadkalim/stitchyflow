/**
 * Password Reset Routes
 * Developer: Muhammad Kalim
 * Product of LogixInventor (PVT) Ltd.
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { getRenderedEmail } = require('../utils/emailTemplateDb');

// Get SMTP transporter
async function getSMTPTransporter() {
  const [settings] = await db.query('SELECT * FROM smtp_settings WHERE is_default = TRUE OR is_active = TRUE ORDER BY is_default DESC, updated_at DESC, id DESC LIMIT 1');
  if (settings.length === 0) {
    throw new Error('SMTP settings not configured');
  }
  
  const smtp = settings[0];
  return nodemailer.createTransport({
    host: smtp.server_address,
    port: parseInt(smtp.port) || 465,
    secure: smtp.encryption === 'SSL' || (parseInt(smtp.port) === 465),
    auth: {
      user: smtp.username,
      pass: smtp.password
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

// Get password reset expire time
async function getPasswordResetExpireMinutes() {
  const [settings] = await db.query(
    "SELECT setting_value FROM system_settings WHERE setting_key = 'password_reset_expire_minutes'"
  );
  if (settings.length > 0) {
    return parseInt(settings[0].setting_value) || 30;
  }
  return 30; // Default 30 minutes
}

// Send password changed notification (template slug: password_changed)
async function sendPasswordChangedEmail(email, firstName) {
  const transporter = await getSMTPTransporter();

  const fallbackHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
        <div style="background: white; border-radius: 12px; padding: 30px;">
          <h1 style="color: #2563eb; text-align: center;">StitchyFlow</h1>
          <p style="color: #334155; font-size: 16px;">Hi ${firstName || 'There'},</p>
          <p style="color: #334155; font-size: 16px;">This is to confirm that your StitchyFlow account password has been successfully changed.</p>
          <p style="color: #334155; font-size: 16px;">If you did not make this change, please contact support immediately.</p>
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">&copy; 2026 StitchyFlow.</p>
        </div>
      </div>`;

  let subject = 'Your StitchyFlow Password Has Been Changed';
  let html = fallbackHtml;

  const custom = await getRenderedEmail('password_changed', {
    firstName: firstName || 'There'
  });
  if (custom) {
    subject = custom.subject;
    html = custom.html;
  }

  await transporter.sendMail({
    from: '"StitchyFlow" <mkbytecoder14@gmail.com>',
    to: email,
    subject,
    html
  });
}

// Validate user and old password
router.post('/validate', async (req, res) => {
  try {
    const { email, oldPassword } = req.body;
    
    // Check if user exists
    const [users] = await db.query(
      "SELECT user_id, email, password_hash, first_name, last_name, role FROM users WHERE email = ? AND status = 'active'",
      [email]
    );
    
    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'User not found' }
      });
    }
    
    const user = users[0];
    
    // Validate old password
    const validPassword = await bcrypt.compare(oldPassword, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        error: { message: 'Old password is incorrect' }
      });
    }
    
    res.json({
      success: true,
      message: 'Password validated successfully',
      data: {
        userId: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Validate password error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Validation failed' }
    });
  }
});

// Update password
router.post('/update', async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    
    // Check if user exists
    const [users] = await db.query(
      "SELECT user_id, email, password_hash, first_name, last_name, role FROM users WHERE email = ? AND status = 'active'",
      [email]
    );
    
    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'User not found' }
      });
    }
    
    const user = users[0];
    
    // Validate old password
    const validPassword = await bcrypt.compare(oldPassword, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        error: { message: 'Old password is incorrect' }
      });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await db.query(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [hashedPassword, user.user_id]
    );
    
    // Send notification email
    try {
      await sendPasswordChangedEmail(email, user.first_name);
    } catch (emailError) {
      console.error('Failed to send password change notification:', emailError);
      // Continue even if email fails
    }
    
    res.json({
      success: true,
      message: 'Password updated successfully'
    });
    
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to update password' }
    });
  }
});

// Check if user exists by email
router.get('/check-user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const [users] = await db.query(
      "SELECT user_id, email, first_name, last_name, role FROM users WHERE email = ? AND status = 'active'",
      [email]
    );
    
    if (users.length === 0) {
      return res.json({
        success: true,
        data: { exists: false }
      });
    }
    
    res.json({
      success: true,
      data: { 
        exists: true,
        user: {
          userId: users[0].user_id,
          email: users[0].email,
          firstName: users[0].first_name,
          lastName: users[0].last_name,
          role: users[0].role
        }
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
});

// Change password (authenticated user — called from Security page)
router.post('/change', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: { message: 'Access token required' } });

    const jwt = require('jsonwebtoken');
    let decoded;
    try { decoded = jwt.verify(token, process.env.JWT_SECRET); }
    catch { return res.status(403).json({ success: false, error: { message: 'Invalid or expired token' } }); }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, error: { message: 'Both current and new password are required' } });
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, error: { message: 'Password must be at least 6 characters' } });

    const [users] = await db.query('SELECT password_hash, first_name, email FROM users WHERE user_id = ?', [decoded.userId]);
    if (!users.length) return res.status(404).json({ success: false, error: { message: 'User not found' } });

    const valid = await bcrypt.compare(currentPassword, users[0].password_hash);
    if (!valid) return res.status(400).json({ success: false, error: { message: 'Current password is incorrect' } });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?', [hashed, decoded.userId]);

    // Send notification email (fire and forget)
    sendPasswordChangedEmail(users[0].email, users[0].first_name).catch(() => {});

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

module.exports = router;
