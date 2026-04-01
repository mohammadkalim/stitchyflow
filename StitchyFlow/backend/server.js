const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:4000', process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(Boolean),
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/users', require('./routes/users.routes'));
app.use('/api/v1/orders', require('./routes/orders.routes'));
app.use('/api/v1/admin', require('./routes/admin.routes'));
app.use('/api/v1/smtp', require('./routes/smtp.routes'));
app.use('/api/v1/business', require('./routes/business.routes'));
app.use('/api/v1/ai-errors', require('./routes/ai_errors.routes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'StitchyFlow API is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'StitchyFlow API',
    version: '1.0.0',
    developer: 'Muhammad Kalim - LogixInventor (PVT) Ltd.'
  });
});

// Global error handler — auto-captures backend errors into AI Error System
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Auto-capture into AI error log (fire-and-forget)
  try {
    const db = require('./config/database');
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;
    db.query(
      `INSERT INTO ai_error_logs
        (source, error_type, message, stack_trace, url, user_agent, ip_address, status_code,
         category, severity, ai_suggestion, fix_steps, auto_fixable)
       VALUES ('backend', ?, ?, ?, ?, ?, ?, 500, 'Server Error', 'critical',
         'Unhandled backend exception. Check stack trace and fix the root cause.',
         '["Review stack trace","Fix the throwing function","Restart backend after fix"]', 0)`,
      [
        err.name || 'Error',
        err.message || 'Unknown error',
        err.stack || null,
        req.originalUrl || null,
        req.headers['user-agent'] || null,
        ip
      ]
    ).catch(() => {}); // never block the response
  } catch (_) {}

  res.status(500).json({ success: false, error: { message: 'Internal server error' } });
});

app.listen(PORT, () => {
  console.log(`✓ StitchyFlow Backend API running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV}`);
});
