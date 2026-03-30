const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.query(
      'CALL sp_create_user(?, ?, ?, ?, ?, ?, @user_id)',
      [email, hashedPassword, firstName, lastName, phone, role || 'customer']
    );
    
    const [[{ '@user_id': userId }]] = await db.query('SELECT @user_id');
    
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
    
    const [users] = await db.query('CALL sp_authenticate_user(?)', [email]);
    
    if (!users[0] || users[0].length === 0) {
      return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
    }
    
    const user = users[0][0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
    }
    
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
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

module.exports = router;
