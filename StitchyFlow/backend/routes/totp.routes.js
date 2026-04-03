const express = require('express');
const router = express.Router();
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/database');

/**
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 */

// Middleware: verify JWT
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

// Generate 8 backup codes (6 chars each, uppercase alphanumeric)
function generateBackupCodes() {
  return Array.from({ length: 8 }, () =>
    crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6)
  );
}

// GET /api/v1/totp/setup — generate secret + QR code
router.get('/setup', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT email, first_name, last_name FROM users WHERE user_id = ?',
      [req.user.userId]
    );
    if (!rows.length) return res.status(404).json({ success: false, error: { message: 'User not found' } });

    const user = rows[0];
    const secret = speakeasy.generateSecret({
      name: `StitchyFlow (${user.email})`,
      issuer: 'StitchyFlow',
      length: 20,
    });

    // Save temp secret (not verified yet)
    await db.query(
      'UPDATE users SET totp_secret_temp = ? WHERE user_id = ?',
      [secret.base32, req.user.userId]
    );

    const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCode: qrDataUrl,
        otpauthUrl: secret.otpauth_url,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// POST /api/v1/totp/verify — verify token, enable TOTP, return backup codes
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, error: { message: 'Token required' } });

    const [rows] = await db.query(
      'SELECT totp_secret_temp FROM users WHERE user_id = ?',
      [req.user.userId]
    );
    if (!rows.length || !rows[0].totp_secret_temp) {
      return res.status(400).json({ success: false, error: { message: 'No pending TOTP setup found' } });
    }

    const verified = speakeasy.totp.verify({
      secret: rows[0].totp_secret_temp,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!verified) {
      return res.status(400).json({ success: false, error: { message: 'Invalid code. Please try again.' } });
    }

    // Generate backup codes
    const backupCodes = generateBackupCodes();
    const backupCodesJson = JSON.stringify(backupCodes);

    // Activate TOTP + save backup codes
    await db.query(
      'UPDATE users SET totp_secret = totp_secret_temp, totp_secret_temp = NULL, totp_enabled = 1, totp_backup_codes = ? WHERE user_id = ?',
      [backupCodesJson, req.user.userId]
    );

    res.json({
      success: true,
      message: 'TOTP 2FA enabled successfully.',
      data: { backupCodes },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// POST /api/v1/totp/disable — disable TOTP
router.post('/disable', authMiddleware, async (req, res) => {
  try {
    await db.query(
      'UPDATE users SET totp_secret = NULL, totp_secret_temp = NULL, totp_enabled = 0, totp_backup_codes = NULL WHERE user_id = ?',
      [req.user.userId]
    );
    res.json({ success: true, message: 'TOTP 2FA disabled.' });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// GET /api/v1/totp/status — check if TOTP is enabled
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT totp_enabled FROM users WHERE user_id = ?',
      [req.user.userId]
    );
    res.json({
      success: true,
      data: { totpEnabled: rows[0]?.totp_enabled == 1 },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;
