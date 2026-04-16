const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const db = require('./config/database');
const { authenticateToken } = require('./middleware/auth');
const { ensureCASubTables } = require('./utils/caSubTables');
const { fetchTailorShopsForCatalogCategory } = require('./utils/tailorsByCatalogCategory');
const app = express();
const PORT = process.env.PORT || 5000;

const uploadsRoot = path.join(__dirname, 'uploads');
fs.mkdirSync(path.join(uploadsRoot, 'ads'), { recursive: true });
fs.mkdirSync(path.join(uploadsRoot, 'chat'), { recursive: true });
fs.mkdirSync(path.join(uploadsRoot, 'slider'), { recursive: true });
fs.mkdirSync(path.join(uploadsRoot, 'privacy'), { recursive: true });
app.use('/uploads', express.static(uploadsRoot));

// Marketing/service images referenced as /images/... in DB (e.g. tailor_services.image_url)
const publicImagesRoot = path.join(__dirname, 'public', 'images');
fs.mkdirSync(path.join(publicImagesRoot, 'services'), { recursive: true });
fs.mkdirSync(path.join(publicImagesRoot, 'business'), { recursive: true });
app.use('/images', express.static(publicImagesRoot));

// Middleware — allow admin (4000) / frontend (3000) to embed images from this API (5000)
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
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

// Admin tailor services list — explicit app-level route (must register before app.use('/api/v1/admin', …))
// so GET /api/v1/admin/tailor-services is never missed by nested router ordering.
app.get('/api/v1/admin/tailor-services', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM tailor_services ORDER BY is_popular DESC, service_name ASC`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/users', require('./routes/users.routes'));
app.use('/api/v1/orders', require('./routes/orders.routes'));
app.use('/api/v1/admin', require('./routes/admin.routes'));
app.use('/api/v1/smtp', require('./routes/smtp.routes'));
// Public tailor shop detail — app-level route so GET always hits before any nested auth (fixes 404 from proxy/clients).
const businessRoutes = require('./routes/business.routes');
app.get('/api/v1/business/public/shops/:shopId', businessRoutes.getPublicShopById);
app.get(
  '/api/v1/business/public/tailors-for-catalog-category/:categoryId',
  businessRoutes.getTailorsForCatalogCategory
);

app.use('/api/v1/business', businessRoutes);
app.use('/api/v1/ai-errors', require('./routes/ai_errors.routes'));
app.use('/api/v1/verification', require('./routes/verification.routes'));
app.use('/api/v1/password', require('./routes/password.routes'));
app.use('/api/v1/logs',    require('./routes/logs.routes'));
app.use('/api/v1/auth/google', require('./routes/google.auth.routes'));
app.use('/api/v1/totp',   require('./routes/totp.routes'));
app.use('/api/v1/tailor-approval', require('./routes/tailor_approval.routes'));
app.use('/api/v1/sessions',      require('./routes/sessions.routes'));
const catalogPublicRoutes = require('./routes/catalog.public.routes');
app.get('/api/v1/catalog/tailors-by-category/:categoryId', async (req, res) => {
  try {
    await ensureCASubTables();
    await businessRoutes.initPromise;
    const catId = parseInt(req.params.categoryId, 10);
    if (!Number.isFinite(catId) || catId < 1) {
      return res.status(400).json({ success: false, error: { message: 'Invalid category id' } });
    }
    const rows = await fetchTailorShopsForCatalogCategory(db, catId);
    res.set('Cache-Control', 'private, no-cache, must-revalidate');
    res.json({ success: true, data: rows });
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({
        success: false,
        error: { message: 'Catalog or shop tables not available.' },
      });
    }
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});
app.use('/api/v1/catalog', catalogPublicRoutes);
app.use('/api/v1/email-templates', require('./routes/email_templates.routes')());
app.use('/api/v1/ads', require('./routes/ads.routes')());
app.use('/api/v1/ca-sub', require('./routes/ca_sub.routes'));
app.use('/api/v1/chat', require('./routes/chat.routes'));
app.use('/api/v1/slider-media', require('./routes/slider_media.routes'));
app.use('/api/v1/social-media', require('./routes/social_media.routes'));
app.use('/api/v1/privacy-pages', require('./routes/privacy_pages.routes'));
app.use('/api/v1/tailor-services', require('./routes/tailor_services.routes'));

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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:4000', process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(Boolean),
    credentials: true
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  socket.on('join_conversation', ({ conversationId }) => {
    if (conversationId) {
      socket.join(`conversation_${conversationId}`);
    }
  });

  socket.on('leave_conversation', ({ conversationId }) => {
    if (conversationId) {
      socket.leave(`conversation_${conversationId}`);
    }
  });

  socket.on('disconnect', () => {
    // Socket disconnected
  });
});

async function cleanupExpiredRefreshTokens() {
  try {
    const [result] = await db.query(
      'DELETE FROM refresh_tokens WHERE expires_at <= NOW()'
    );
    if (result && result.affectedRows > 0) {
      console.log(`✓ Cleaned ${result.affectedRows} expired refresh token(s)`);
    }
  } catch (error) {
    console.error('Failed to clean expired refresh tokens:', error.message);
  }
}

function scheduleRefreshTokenCleanup(intervalMs = 1000 * 60 * 60) {
  cleanupExpiredRefreshTokens();
  setInterval(cleanupExpiredRefreshTokens, intervalMs);
}

server.listen(PORT, async () => {
  console.log(`✓ StitchyFlow Backend API running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV}`);
  console.log(`✓ Splash ad upload routes: POST …/upload-image on /api/v1/ads, /api/v1/admin/ads, /api/v1/ca-sub/ads`);
  scheduleRefreshTokenCleanup();
  try {
    const { seedTailorShopsIfEmpty } = require('./seed/tailorShopsSeed');
    await seedTailorShopsIfEmpty();
  } catch (e) {
    console.warn('Tailor shops seed:', e.message);
  }
});
