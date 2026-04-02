/**
 * Developer by: Muhammad Kalim
 * Product of LogixInventor (PVT) Ltd.
 */
const express  = require('express');
const router   = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt  = require('jsonwebtoken');
const db   = require('../config/database');
require('dotenv').config();

// Configure Google Strategy
passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email     = profile.emails?.[0]?.value;
    const firstName = profile.name?.givenName  || profile.displayName || '';
    const lastName  = profile.name?.familyName || '';
    const avatar    = profile.photos?.[0]?.value || null;

    // Check if user exists
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    let user;
    if (rows.length > 0) {
      user = rows[0];
      // Update last login
      await db.query('UPDATE users SET last_login = NOW() WHERE user_id = ?', [user.user_id]);
    } else {
      // Auto-register
      const [result] = await db.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role, status, email_verified, profile_image)
         VALUES (?, '', ?, ?, 'customer', 'active', 1, ?)`,
        [email, firstName, lastName, avatar]
      );
      const [newUser] = await db.query('SELECT * FROM users WHERE user_id = ?', [result.insertId]);
      user = newUser[0];
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Initiate Google login
router.get('/', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
}));

// Google callback
router.get('/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed` }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    const userData = encodeURIComponent(JSON.stringify({
      userId: user.user_id,
      email:  user.email,
      firstName: user.first_name,
      lastName:  user.last_name,
      role:   user.role,
    }));

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/success?token=${token}&user=${userData}`);
  }
);

module.exports = router;
