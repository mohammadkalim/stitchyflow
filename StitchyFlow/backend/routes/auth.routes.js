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
      "SELECT user_id, email, password_hash, first_name, last_name, role, status FROM users WHERE email = ? AND status = 'active'",
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
    
    // Update last login
    await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?', [user.user_id]);

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
      { expiresIn: process.env.JWT_REFRESH_EXPIRE }
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
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: { message: error.message, code: error.code } });
  }
});

module.exports = router;
