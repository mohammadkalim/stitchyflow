const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;

const uploadsRoot = path.join(__dirname, 'uploads');
fs.mkdirSync(path.join(uploadsRoot, 'ads'), { recursive: true });
app.use('/uploads', express.static(uploadsRoot));

// Middleware
app.use(helmet());
app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:4000', process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(Boolean),
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(passport.initialize());

// Splash ad image upload — register before /api/v1/admin and /api/v1/ca-sub so
// POST …/admin/ads/upload-image and …/ca-sub/ads/upload-image hit this handler (not 404).
const adsUploadRouter = require('./routes/ads_upload.routes');
app.use('/api/v1/ads', adsUploadRouter);
app.use('/api/v1/admin/ads', adsUploadRouter);
app.use('/api/v1/ca-sub/ads', adsUploadRouter);

// Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/users', require('./routes/users.routes'));
app.use('/api/v1/orders', require('./routes/orders.routes'));
app.use('/api/v1/admin', require('./routes/admin.routes'));
app.use('/api/v1/smtp', require('./routes/smtp.routes'));
app.use('/api/v1/business', require('./routes/business.routes'));
app.use('/api/v1/ai-errors', require('./routes/ai_errors.routes'));
app.use('/api/v1/verification', require('./routes/verification.routes'));
app.use('/api/v1/password', require('./routes/password.routes'));
app.use('/api/v1/logs',    require('./routes/logs.routes'));
app.use('/api/v1/auth/google', require('./routes/google.auth.routes'));
app.use('/api/v1/totp',   require('./routes/totp.routes'));
app.use('/api/v1/tailor-approval', require('./routes/tailor_approval.routes'));
app.use('/api/v1/sessions',      require('./routes/sessions.routes'));
app.use('/api/v1/catalog', require('./routes/catalog.public.routes'));
app.use('/api/v1/email-templates', require('./routes/email_templates.routes')());
app.use('/api/v1/ads', require('./routes/ads.routes')());
app.use('/api/v1/ca-sub', require('./routes/ca_sub.routes'));

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
  console.log(`✓ Splash ad upload routes: POST …/upload-image on /api/v1/ads, /api/v1/admin/ads, /api/v1/ca-sub/ads`);
});
