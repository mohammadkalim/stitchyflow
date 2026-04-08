const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: { message: 'Access token required' } });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // Enforce live account status on every protected API call.
    // This ensures suspended users lose access immediately even if JWT is still valid.
    const [rows] = await db.query(
      'SELECT status FROM users WHERE user_id = ? LIMIT 1',
      [user.userId]
    );

    if (!rows.length) {
      return res.status(401).json({ success: false, error: { message: 'User not found' } });
    }

    const status = rows[0].status;
    if (status === 'suspended') {
      return res.status(403).json({
        success: false,
        code: 'ACCOUNT_SUSPENDED',
        error: { message: 'Your account has been suspended. Please contact support.' }
      });
    }

    if (status !== 'active' && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        code: 'ACCOUNT_INACTIVE',
        error: { message: 'Your account is inactive. Please contact support.' }
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: { message: 'Invalid or expired token' } });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: { message: 'Access denied' } });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };
