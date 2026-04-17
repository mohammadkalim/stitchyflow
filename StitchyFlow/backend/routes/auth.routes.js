const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { auditLog, systemLog } = require('../utils/logger');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Direct query instead of stored procedure
    const [result] = await db.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName, phone, role || 'customer', 'active']
    );
    
    const userId = result.insertId;
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { userId }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Direct query instead of stored procedure
    const [users] = await db.query(
      "SELECT user_id, email, password_hash, first_name, last_name, role, status, approval_status FROM users WHERE email = ?",
      [email]
    );
    
    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
    }

    // Check if account is suspended
    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        error: { message: 'Your account has been suspended. Please contact support.' },
        code: 'ACCOUNT_SUSPENDED'
      });
    }

    // Check if account is inactive
    if (user.status === 'inactive') {
      return res.status(403).json({
        success: false,
        error: { message: 'Your account is inactive. Please contact support.' },
        code: 'ACCOUNT_INACTIVE'
      });
    }
    
    // Update last login
    await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?', [user.user_id]);

    // Create session record
    const ua = req.headers['user-agent'] || '';
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;
    const deviceType = /mobile/i.test(ua) ? 'mobile' : /tablet|ipad/i.test(ua) ? 'tablet' : 'desktop';
    const browser = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/)?.[0]?.split('/')[0] || 'Unknown';
    const os = ua.match(/(Windows NT|Mac OS X|Linux|Android|iOS)/)?.[0] || 'Unknown';
    const sessionToken = require('crypto').randomBytes(32).toString('hex');
    await db.query(
      `INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, device_type, browser, os, status, last_activity, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active', NOW(), DATE_ADD(NOW(), INTERVAL 8 HOUR))`,
      [user.user_id, sessionToken, ip, ua.substring(0, 500), deviceType, browser, os]
    );
    await db.query(
      `INSERT INTO session_logs (user_id, action, ip_address, user_agent, details) VALUES (?, 'LOGIN', ?, ?, ?)`,
      [user.user_id, ip, ua.substring(0, 500), `${user.first_name} ${user.last_name} logged in`]
    );

    // Audit log
    await auditLog({
      userId: user.user_id,
      userName: `${user.first_name} ${user.last_name}`,
      action: 'login',
      tableName: 'users',
      recordId: user.user_id,
      description: `${user.role} logged in`,
      ipAddress: req.ip || req.headers['x-forwarded-for'],
      userAgent: req.headers['user-agent'],
    });
    
    const accessToken = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    const refreshToken = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );
    
    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          userId: user.user_id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          status: user.status,
          approvalStatus: user.approval_status || null
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: { message: error.message, code: error.code } });
  }
});

/**
 * Issue a new access token from a valid refresh token (keeps users signed in past JWT_EXPIRE).
 * Developer by: Muhammad Kalim — Product of LogixInventor (PVT) Ltd.
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) {
      return res.status(400).json({ success: false, error: { message: 'Refresh token required' } });
    }
    if (!process.env.JWT_REFRESH_SECRET) {
      return res.status(500).json({ success: false, error: { message: 'Refresh token not configured' } });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ success: false, error: { message: 'Invalid or expired refresh token' } });
    }

    const [users] = await db.query(
      'SELECT user_id, email, role, status, approval_status FROM users WHERE user_id = ? LIMIT 1',
      [decoded.userId]
    );
    if (!users.length) {
      return res.status(401).json({ success: false, error: { message: 'User not found' } });
    }

    const row = users[0];
    if (row.status === 'suspended') {
      return res.status(403).json({
        success: false,
        code: 'ACCOUNT_SUSPENDED',
        error: { message: 'Your account has been suspended. Please contact support.' }
      });
    }
    if (row.status !== 'active' && row.role !== 'admin') {
      return res.status(403).json({
        success: false,
        code: 'ACCOUNT_INACTIVE',
        error: { message: 'Your account is inactive. Please contact support.' }
      });
    }

    const accessToken = jwt.sign(
      { userId: row.user_id, email: row.email, role: row.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      data: {
        accessToken,
        user: {
          userId: row.user_id,
          email: row.email,
          role: row.role,
          status: row.status,
          approvalStatus: row.approval_status || null
        }
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Logout — marks session as inactive
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      let decoded;
      try { decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET); } catch (_) {}
      if (decoded?.userId) {
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;
        // Mark most recent active session as inactive
        await db.query(
          `UPDATE user_sessions SET status='inactive', updated_at=NOW()
           WHERE user_id=? AND status='active' ORDER BY created_at DESC LIMIT 1`,
          [decoded.userId]
        );
        await db.query(
          `INSERT INTO session_logs (user_id, action, ip_address, details) VALUES (?, 'LOGOUT', ?, 'User logged out')`,
          [decoded.userId, ip]
        );
      }
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    res.json({ success: true, message: 'Logged out' });
  }
});

// Change password (authenticated)
router.post('/change-password', async (req, res) => {
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

    const [users] = await db.query('SELECT password_hash FROM users WHERE user_id = ?', [decoded.userId]);
    if (!users.length) return res.status(404).json({ success: false, error: { message: 'User not found' } });

    const valid = await bcrypt.compare(currentPassword, users[0].password_hash);
    if (!valid) return res.status(400).json({ success: false, error: { message: 'Current password is incorrect' } });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [hashed, decoded.userId]);

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

module.exports = router;
