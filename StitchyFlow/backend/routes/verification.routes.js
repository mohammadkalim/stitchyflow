/**
 * Email Verification Routes
 * Developer: Muhammad Kalim
 * Product of LogixInventor (PVT) Ltd.
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const nodemailer = require('nodemailer');

// Generate 6-digit verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Get SMTP transporter
async function getSMTPTransporter() {
  const [settings] = await db.query('SELECT * FROM smtp_settings WHERE is_active = TRUE LIMIT 1');
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

// Get verification expire time from settings
async function getVerificationExpireMinutes() {
  const [settings] = await db.query(
    "SELECT setting_value FROM system_settings WHERE setting_key = 'verification_code_expire_minutes'"
  );
  if (settings.length > 0) {
    return parseInt(settings[0].setting_value) || 10;
  }
  return 10; // Default 10 minutes
}

// Send verification email
async function sendVerificationEmail(email, code, firstName) {
  const transporter = await getSMTPTransporter();
  const expireMinutes = await getVerificationExpireMinutes();
  
  const mailOptions = {
    from: '"StitchyFlow" <mkbytecoder14@gmail.com>',
    to: email,
    subject: 'Your StitchyFlow Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
        <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">StitchyFlow</h1>
            <p style="color: #64748b; margin: 10px 0 0 0;">Your Verification Code</p>
          </div>
          
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Hi ${firstName || 'There'},
          </p>
          
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Thank you for creating an account with StitchyFlow. Please use the verification code below to complete your registration:
          </p>
          
          <div style="background: #eff6ff; border: 2px dashed #2563eb; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
            <span style="font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 8px;">${code}</span>
          </div>
          
          <p style="color: #64748b; font-size: 14px; text-align: center;">
            This code will expire in <strong>${expireMinutes} minutes</strong>.
          </p>
          
          <div style="border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 20px;">
            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
              If you didn't request this code, please ignore this email.<br>
              &copy; 2026 StitchyFlow. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
}

// Register and send verification code
router.post('/register/send-code', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role, customerType } = req.body;
    
    // Check if email already exists
    const [existing] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email already registered. Please sign in or use a different email.' }
      });
    }
    
    // Generate verification code
    const code = generateVerificationCode();
    const expireMinutes = await getVerificationExpireMinutes();
    
    // Store user data with code (pass object directly, mysql2 handles JSON)
    const userData = {
      email,
      password,
      firstName,
      lastName,
      phone,
      role: role || 'customer',
      customerType: customerType || 'standard'
    };
    
    // Save verification code
    await db.query(
      `INSERT INTO email_verification_codes (email, verification_code, user_data, expires_at)
       VALUES (?, ?, ?, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? MINUTE))`,
      [email, code, JSON.stringify(userData), expireMinutes]
    );
    
    // Send email
    await sendVerificationEmail(email, code, firstName);
    
    res.json({
      success: true,
      message: 'Verification code sent to your email',
      data: { 
        email,
        expiresIn: expireMinutes * 60 // seconds
      }
    });
    
  } catch (error) {
    console.error('Send verification code error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to send verification code' }
    });
  }
});

// Verify code and create account
router.post('/register/verify', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    // Get the latest verification code for this email
    const [codes] = await db.query(
      `SELECT * FROM email_verification_codes 
       WHERE email = ? AND is_used = FALSE
       ORDER BY created_at DESC LIMIT 1`,
      [email]
    );
    
    if (codes.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'No verification code found. Please request a new code.' }
      });
    }
    
    const verification = codes[0];
    
    // Check if code is expired
    if (new Date(verification.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        error: { 
          code: 'CODE_EXPIRED',
          message: 'Verification code has expired. Please request a new code.' 
        }
      });
    }
    
    // Check if code matches
    if (verification.verification_code !== code) {
      // Increment attempt count
      await db.query(
        'UPDATE email_verification_codes SET attempt_count = attempt_count + 1 WHERE id = ?',
        [verification.id]
      );
      
      return res.status(400).json({
        success: false,
        error: { 
          code: 'INVALID_CODE',
          message: 'Invalid verification code. Please try again.' 
        }
      });
    }
    
    // Code is valid - mark as used
    await db.query(
      'UPDATE email_verification_codes SET is_used = TRUE WHERE id = ?',
      [verification.id]
    );
    
    // Parse user data (mysql2 may auto-parse JSON, so check if it's already an object)
    let userData = verification.user_data;
    if (typeof userData === 'string') {
      userData = JSON.parse(userData);
    }
    
    // Hash password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create user in database
    const [result] = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status, email_verified, customer_type, approval_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE, ?, ?)`,
      [
        userData.email,
        hashedPassword,
        userData.firstName,
        userData.lastName,
        userData.phone,
        userData.role || 'customer',
        userData.role === 'tailor' ? 'pending' : 'active',
        userData.customerType || 'standard',
        userData.role === 'tailor' ? 'pending' : null
      ]
    );
    
    const userId = result.insertId;
    
    // Create customer record if role is customer
    if (userData.role === 'customer' || !userData.role) {
      await db.query('INSERT INTO customers (user_id) VALUES (?)', [userId]);
    }

    // Create tailor verification request if role is tailor
    if (userData.role === 'tailor') {
      await db.query(
        `INSERT INTO business_tailor_verifications 
         (tailor_name, shop_name, contact_number, verification_status, user_id)
         VALUES (?, ?, ?, 'pending', ?)`,
        [
          `${userData.firstName} ${userData.lastName}`,
          `${userData.firstName}'s Tailor Shop`,
          userData.phone || '',
          userId
        ]
      ).catch(() => {
        // If user_id column doesn't exist yet, insert without it
        return db.query(
          `INSERT INTO business_tailor_verifications 
           (tailor_name, shop_name, contact_number, verification_status)
           VALUES (?, ?, ?, 'pending')`,
          [
            `${userData.firstName} ${userData.lastName}`,
            `${userData.firstName}'s Tailor Shop`,
            userData.phone || ''
          ]
        );
      });
    }
    
    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const accessToken = jwt.sign(
      { userId, email: userData.email, role: userData.role || 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
    
    res.json({
      success: true,
      message: userData.role === 'tailor' ? 'Account created! Awaiting admin approval.' : 'Account created successfully!',
      data: {
        accessToken,
        user: {
          userId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role || 'customer',
          customerType: userData.customerType || 'standard',
          approvalStatus: userData.role === 'tailor' ? 'pending' : null,
          status: userData.role === 'tailor' ? 'pending' : 'active'
        }
      }
    });
    
  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to verify code' }
    });
  }
});

// Resend verification code
router.post('/register/resend-code', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Get the latest unused code data
    const [codes] = await db.query(
      `SELECT user_data FROM email_verification_codes 
       WHERE email = ? AND is_used = FALSE
       ORDER BY created_at DESC LIMIT 1`,
      [email]
    );
    
    if (codes.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'No pending registration found. Please start over.' }
      });
    }
    
    let userData = codes[0].user_data;
    if (typeof userData === 'string') {
      userData = JSON.parse(userData);
    }
    const code = generateVerificationCode();
    const expireMinutes = await getVerificationExpireMinutes();
    
    // Mark old code as used
    await db.query(
      'UPDATE email_verification_codes SET is_used = TRUE WHERE email = ? AND is_used = FALSE',
      [email]
    );
    
    // Create new code - re-stringify the user data properly
    await db.query(
      `INSERT INTO email_verification_codes (email, verification_code, user_data, expires_at)
       VALUES (?, ?, ?, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? MINUTE))`,
      [email, code, JSON.stringify(userData), expireMinutes]
    );
    
    // Send email
    await sendVerificationEmail(email, code, userData.firstName);
    
    res.json({
      success: true,
      message: 'New verification code sent to your email',
      data: { 
        email,
        expiresIn: expireMinutes * 60
      }
    });
    
  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to resend code' }
    });
  }
});

// Get verification expire time (for frontend display)
router.get('/settings/verification-expire', async (req, res) => {
  try {
    const minutes = await getVerificationExpireMinutes();
    res.json({
      success: true,
      data: { expireMinutes: minutes }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
});

module.exports = router;
