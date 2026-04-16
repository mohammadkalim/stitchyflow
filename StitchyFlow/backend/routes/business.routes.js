const express = require('express');
const router = express.Router();
const db = require('../config/database');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');
const { fetchTailorShopsForCatalogCategory } = require('../utils/tailorsByCatalogCategory');

const RESOURCES = {
  verifications: {
    table: 'business_tailor_verifications',
    id: 'verification_id',
    required: ['tailor_name', 'shop_name', 'verification_status'],
    allowed: ['tailor_name', 'shop_name', 'cnic_number', 'contact_number', 'verification_status', 'review_notes']
  },
  shops: {
    table: 'business_tailor_shops',
    id: 'shop_id',
    required: ['shop_name', 'owner_name'],
    allowed: [
      'shop_name', 'owner_name', 'city', 'country', 'address', 'contact_number', 'whatsapp_number',
      'business_type_id', 'specialization_id', 'category_id', 'subcategory_id',
      'shop_status', 'shop_image', 'logo_image', 'cover_image',
      'available_from', 'available_to', 'not_available_note'
    ]
  },
  settings: {
    table: 'business_settings',
    id: 'setting_id',
    required: ['setting_key', 'setting_value'],
    allowed: ['setting_key', 'setting_value', 'setting_group', 'is_active']
  },
  orders: {
    table: 'business_tailor_orders',
    id: 'business_order_id',
    required: ['order_number', 'tailor_name', 'order_status'],
    allowed: ['order_number', 'tailor_name', 'customer_name', 'garment_type', 'order_status', 'total_amount', 'due_date']
  },
  services: {
    table: 'business_tailor_services',
    id: 'business_service_id',
    required: ['shop_id', 'garment_type'],
    allowed: ['owner_user_id', 'shop_id', 'garment_type', 'description', 'price_min', 'price_max', 'delivery_time', 'service_status', 'is_active']
  },
  status: {
    table: 'business_tailor_status',
    id: 'status_id',
    required: ['tailor_name', 'availability_status'],
    allowed: ['tailor_name', 'availability_status', 'current_workload', 'last_seen_at']
  },
  informationIp: {
    table: 'business_tailor_information_ip',
    id: 'info_id',
    required: ['tailor_name', 'ip_address'],
    allowed: ['tailor_name', 'ip_address', 'device_name', 'device_type', 'browser', 'notes']
  },
  logs: {
    table: 'business_tailor_logs',
    id: 'log_id',
    required: [],
    allowed: ['page_name', 'action_type', 'entity_id', 'description', 'actor_user_id', 'actor_role', 'ip_address', 'user_agent']
  },
  businessTypes: {
    table: 'business_type_management',
    id: 'type_id',
    required: ['type_name'],
    allowed: ['type_name', 'type_code', 'description', 'is_active']
  },
  specializations: {
    table: 'specialization_management',
    id: 'specialization_id',
    required: ['specialization_name'],
    allowed: ['specialization_name', 'specialization_code', 'business_type_id', 'description', 'is_active']
  }
};

// Logo & cover: persist under public image assets (served as GET /images/business/...); paths stored in logo_image / cover_image.
// Developer by: Muhammad Kalim · LogixInventor (PVT) Ltd.
const businessPublicImagesDir = path.join(__dirname, '..', 'public', 'images', 'business');
fs.mkdirSync(businessPublicImagesDir, { recursive: true });
const businessImageUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, businessPublicImagesDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || '').toLowerCase();
      const safeExt = ['.png', '.jpg', '.jpeg', '.webp'].includes(ext) ? ext : '.jpg';
      cb(null, `business-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${safeExt}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(png|jpe?g|webp)$/i.test(file.mimetype)) return cb(null, true);
    return cb(new Error('Only PNG, JPG, JPEG, and WEBP images are allowed.'));
  },
});

async function initBusinessTables() {
  const tableQueries = [
    `CREATE TABLE IF NOT EXISTS business_tailor_verifications (
      verification_id INT AUTO_INCREMENT PRIMARY KEY,
      tailor_name VARCHAR(255) NOT NULL,
      shop_name VARCHAR(255) NOT NULL,
      cnic_number VARCHAR(50),
      contact_number VARCHAR(30),
      verification_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      review_notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS business_tailor_shops (
      shop_id INT AUTO_INCREMENT PRIMARY KEY,
      shop_name VARCHAR(255) NOT NULL,
      owner_name VARCHAR(255) NOT NULL,
      city VARCHAR(120),
      address TEXT,
      contact_number VARCHAR(30),
      shop_status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
      shop_image VARCHAR(500) DEFAULT NULL,
      business_type_id INT DEFAULT NULL,
      specialization_id INT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS business_settings (
      setting_id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(120) NOT NULL UNIQUE,
      setting_value TEXT NOT NULL,
      setting_group VARCHAR(120) DEFAULT 'general',
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS business_tailor_orders (
      business_order_id INT AUTO_INCREMENT PRIMARY KEY,
      order_number VARCHAR(100) NOT NULL UNIQUE,
      tailor_name VARCHAR(255) NOT NULL,
      customer_name VARCHAR(255),
      garment_type VARCHAR(120),
      order_status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
      total_amount DECIMAL(10,2) DEFAULT 0.00,
      due_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS business_tailor_services (
      business_service_id INT AUTO_INCREMENT PRIMARY KEY,
      owner_user_id INT NOT NULL,
      shop_id INT NOT NULL,
      garment_type VARCHAR(120) NOT NULL,
      description TEXT,
      price_min DECIMAL(10,2) DEFAULT 0.00,
      price_max DECIMAL(10,2) DEFAULT 0.00,
      delivery_time VARCHAR(80),
      service_status ENUM('available', 'unavailable') DEFAULT 'available',
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_services_owner (owner_user_id),
      INDEX idx_services_shop (shop_id)
    )`,
    `CREATE TABLE IF NOT EXISTS business_tailor_status (
      status_id INT AUTO_INCREMENT PRIMARY KEY,
      tailor_name VARCHAR(255) NOT NULL,
      availability_status ENUM('available', 'busy', 'offline') DEFAULT 'available',
      current_workload INT DEFAULT 0,
      last_seen_at DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS business_tailor_information_ip (
      info_id INT AUTO_INCREMENT PRIMARY KEY,
      tailor_name VARCHAR(255) NOT NULL,
      ip_address VARCHAR(45) NOT NULL,
      device_name VARCHAR(255),
      device_type VARCHAR(120),
      browser VARCHAR(120),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS business_tailor_logs (
      log_id INT AUTO_INCREMENT PRIMARY KEY,
      page_name VARCHAR(120) NOT NULL,
      action_type VARCHAR(60) NOT NULL,
      entity_id INT NULL,
      description TEXT,
      actor_user_id INT NULL,
      actor_role VARCHAR(60),
      ip_address VARCHAR(45),
      user_agent TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS business_type_management (
      type_id INT AUTO_INCREMENT PRIMARY KEY,
      type_name VARCHAR(255) NOT NULL,
      type_code VARCHAR(60) UNIQUE,
      description TEXT,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS specialization_management (
      specialization_id INT AUTO_INCREMENT PRIMARY KEY,
      specialization_name VARCHAR(255) NOT NULL,
      specialization_code VARCHAR(60) UNIQUE,
      business_type_id INT NULL,
      description TEXT,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_spec_business_type FOREIGN KEY (business_type_id)
        REFERENCES business_type_management(type_id) ON DELETE SET NULL ON UPDATE CASCADE
    )`
  ];

  for (const query of tableQueries) {
    await db.query(query);
  }

  await ensureShopHourColumns();
}

/** Add opening / closed copy columns for public shop cards (idempotent). */
async function ensureShopHourColumns() {
  const fragments = [
    'ADD COLUMN shop_image VARCHAR(500) NULL',
    'ADD COLUMN business_type_id INT NULL',
    'ADD COLUMN specialization_id INT NULL',
    'ADD COLUMN owner_user_id INT NULL',
    'ADD COLUMN country VARCHAR(120) NULL',
    'ADD COLUMN whatsapp_number VARCHAR(30) NULL',
    'ADD COLUMN category_id INT NULL',
    'ADD COLUMN subcategory_id INT NULL',
    'ADD COLUMN logo_image VARCHAR(500) NULL',
    'ADD COLUMN cover_image VARCHAR(500) NULL',
    'ADD COLUMN available_from VARCHAR(40) NULL',
    'ADD COLUMN available_to VARCHAR(40) NULL',
    'ADD COLUMN not_available_note VARCHAR(200) NULL',
  ];
  for (const f of fragments) {
    try {
      await db.query(`ALTER TABLE business_tailor_shops ${f}`);
    } catch (e) {
      if (e.errno !== 1060 && e.code !== 'ER_DUP_FIELDNAME') {
        console.warn('ensureShopHourColumns:', e.message);
      }
    }
  }
}

function isTailorUser(req) {
  return ['tailor', 'business_owner'].includes(String(req.user?.role || '').toLowerCase());
}

/** Default max tailor-owned shops when no per-email override applies. */
const DEFAULT_TAILOR_MAX_SHOPS = 1;

/**
 * Per-email max shop count (no hardcoded accounts in code).
 * Primary env: `TAILOR_MAX_BUSINESSES_OVERRIDES` — `email:max,email2:max2` (also `;` segments).
 * Alias: `TAILOR_SHOP_CAP_OVERRIDES` with `email=max` segments.
 * JSON object supported: `{"user@example.com":2}`
 * Email matching is case-insensitive.
 */
function parseTailorShopCapOverrides() {
  const raw = String(
    process.env.TAILOR_MAX_BUSINESSES_OVERRIDES || process.env.TAILOR_SHOP_CAP_OVERRIDES || ''
  ).trim();
  const map = new Map();
  if (!raw) return map;
  if (raw.startsWith('{')) {
    try {
      const obj = JSON.parse(raw);
      for (const [k, v] of Object.entries(obj)) {
        const email = String(k).trim().toLowerCase();
        const n = parseInt(v, 10);
        if (email && Number.isFinite(n) && n >= 1) map.set(email, n);
      }
    } catch (_) {
      /* ignore invalid JSON */
    }
    return map;
  }
  for (const part of raw.split(/[;,]/)) {
    const seg = part.trim();
    if (!seg) continue;
    const eq = seg.indexOf('=');
    const colon = seg.indexOf(':');
    let email;
    let n;
    if (colon !== -1 && (eq === -1 || colon < eq)) {
      email = seg.slice(0, colon).trim().toLowerCase();
      n = parseInt(seg.slice(colon + 1).trim(), 10);
    } else if (eq !== -1) {
      email = seg.slice(0, eq).trim().toLowerCase();
      n = parseInt(seg.slice(eq + 1).trim(), 10);
    } else continue;
    if (email && Number.isFinite(n) && n >= 1) map.set(email, n);
  }
  return map;
}

function getDefaultMaxShopsPerTailor() {
  const n = parseInt(
    process.env.TAILOR_MAX_BUSINESSES || process.env.TAILOR_DEFAULT_MAX_SHOPS,
    10
  );
  return Number.isFinite(n) && n >= 1 ? n : DEFAULT_TAILOR_MAX_SHOPS;
}

/** Max businesses a tailor user may own (create). Admins are not limited here. */
function getMaxShopsForTailorUser(req) {
  if (!isTailorUser(req)) return Number.MAX_SAFE_INTEGER;
  const base = getDefaultMaxShopsPerTailor();
  const email = String(req.user?.email || '').trim().toLowerCase();
  if (!email) return base;
  const cap = parseTailorShopCapOverrides().get(email);
  return cap != null ? cap : base;
}

/** Optional INT FKs: empty string breaks MySQL — omit on insert, NULL on update. */
const SHOP_OPTIONAL_INT_FIELDS = ['business_type_id', 'specialization_id', 'category_id', 'subcategory_id'];
const SHOP_STATUS_ENUM = new Set(['active', 'inactive', 'suspended']);

function normalizeShopIntFields(payload, mode) {
  for (const field of SHOP_OPTIONAL_INT_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(payload, field)) continue;
    const raw = payload[field];
    const empty =
      raw === '' ||
      raw === null ||
      raw === undefined ||
      (typeof raw === 'string' && String(raw).trim() === '');
    if (empty) {
      if (mode === 'update') payload[field] = null;
      else delete payload[field];
      continue;
    }
    const n = parseInt(raw, 10);
    if (Number.isNaN(n) || n < 1) {
      if (mode === 'update') payload[field] = null;
      else delete payload[field];
    } else {
      payload[field] = n;
    }
  }
}

function sanitizeShopStatus(payload, mode) {
  if (!Object.prototype.hasOwnProperty.call(payload, 'shop_status')) return;
  const s = String(payload.shop_status ?? '').trim().toLowerCase();
  if (!SHOP_STATUS_ENUM.has(s)) {
    if (mode === 'update') payload.shop_status = null;
    else delete payload.shop_status;
  } else {
    payload.shop_status = s;
  }
}

function sanitizeShopResourcePayload(payload, mode) {
  normalizeShopIntFields(payload, mode);
  sanitizeShopStatus(payload, mode);
}

/** Drop invalid business_type_id / specialization_id so FK insert does not 500. */
async function coerceShopForeignKeys(payload, mode) {
  const checks = [
    ['business_type_id', 'business_type_management', 'type_id'],
    ['specialization_id', 'specialization_management', 'specialization_id'],
  ];
  for (const [field, table, col] of checks) {
    if (!Object.prototype.hasOwnProperty.call(payload, field)) continue;
    const id = payload[field];
    if (id === null || id === undefined) continue;
    const [rows] = await db.query(`SELECT 1 FROM \`${table}\` WHERE \`${col}\` = ? LIMIT 1`, [id]);
    if (!rows.length) {
      if (mode === 'update') payload[field] = null;
      else delete payload[field];
    }
  }
}

const initPromise = initBusinessTables().catch((error) => {
  console.error('Business module table initialization failed:', error.message);
});

async function ensureInitialized(req, res, next) {
  try {
    await initPromise;
    next();
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Business module initialization failed' } });
  }
}

async function writeLog(req, { pageName, actionType, entityId = null, description }) {
  const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || null;
  await db.query(
    `INSERT INTO business_tailor_logs 
      (page_name, action_type, entity_id, description, actor_user_id, actor_role, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [pageName, actionType, entityId, description, req.user?.userId || null, req.user?.role || null, ipAddress, req.headers['user-agent'] || null]
  );
}

function getResourceConfig(resourceName) {
  return RESOURCES[resourceName];
}

async function ensureServiceShopOwnership(req, shopId) {
  if (!isTailorUser(req)) return true;
  const id = Number(shopId);
  if (!Number.isFinite(id) || id < 1) return false;
  const [rows] = await db.query(
    'SELECT shop_id FROM business_tailor_shops WHERE shop_id = ? AND owner_user_id = ? LIMIT 1',
    [id, req.user.userId]
  );
  return rows.length > 0;
}

// ── PUBLIC: Active shops for frontend slider (no auth required) ───────────────
router.get('/public/shops', async (req, res) => {
  try {
    await initPromise;
    const shopQuery = `
      SELECT shop_id, owner_user_id, shop_name, owner_name, city, country, address,
             s.category_id,
             s.subcategory_id,
             c.name AS category_name,
             sc.name AS subcategory_name,
             s.logo_image,
             s.cover_image,
             s.updated_at,
             COALESCE(NULLIF(TRIM(s.shop_image), ''), NULLIF(TRIM(s.cover_image), ''), NULLIF(TRIM(s.logo_image), '')) AS shop_image,
             s.available_from, s.available_to, s.not_available_note,
             bt.type_name AS business_type_name,
             sp.specialization_name AS specialization_name
      FROM business_tailor_shops s
      LEFT JOIN business_type_management bt ON s.business_type_id = bt.type_id
      LEFT JOIN specialization_management sp ON s.specialization_id = sp.specialization_id
      LEFT JOIN categories c ON s.category_id = c.id
      LEFT JOIN subcategories sc ON s.subcategory_id = sc.id
      WHERE s.shop_status = 'active'
      ORDER BY s.shop_id DESC
      LIMIT 500
    `;
    let [rows] = await db.query(shopQuery);
    if (!rows.length) {
      try {
        const { seedTailorShopsIfEmpty } = require('../seed/tailorShopsSeed');
        const seedResult = await seedTailorShopsIfEmpty();
        if (!seedResult.skipped) {
          [rows] = await db.query(shopQuery);
        }
      } catch (seedErr) {
        console.warn('GET /public/shops auto-seed:', seedErr.message);
      }
    }
    res.set('Cache-Control', 'private, no-cache, must-revalidate');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Alias endpoint for frontend route naming consistency.
router.get('/public/all-tailors', async (req, res) => {
  try {
    await initPromise;
    const shopQuery = `
      SELECT shop_id, owner_user_id, shop_name, owner_name, city, country, address,
             s.category_id,
             s.subcategory_id,
             c.name AS category_name,
             sc.name AS subcategory_name,
             s.logo_image,
             s.cover_image,
             s.updated_at,
             COALESCE(NULLIF(TRIM(s.shop_image), ''), NULLIF(TRIM(s.cover_image), ''), NULLIF(TRIM(s.logo_image), '')) AS shop_image,
             s.available_from, s.available_to, s.not_available_note,
             bt.type_name AS business_type_name,
             sp.specialization_name AS specialization_name
      FROM business_tailor_shops s
      LEFT JOIN business_type_management bt ON s.business_type_id = bt.type_id
      LEFT JOIN specialization_management sp ON s.specialization_id = sp.specialization_id
      LEFT JOIN categories c ON s.category_id = c.id
      LEFT JOIN subcategories sc ON s.subcategory_id = sc.id
      WHERE s.shop_status = 'active'
      ORDER BY s.shop_id DESC
      LIMIT 500
    `;
    let [rows] = await db.query(shopQuery);
    if (!rows.length) {
      try {
        const { seedTailorShopsIfEmpty } = require('../seed/tailorShopsSeed');
        const seedResult = await seedTailorShopsIfEmpty();
        if (!seedResult.skipped) {
          [rows] = await db.query(shopQuery);
        }
      } catch (seedErr) {
        console.warn('GET /public/all-tailors auto-seed:', seedErr.message);
      }
    }
    res.set('Cache-Control', 'private, no-cache, must-revalidate');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

/**
 * Public: shops for one admin CA/SUB catalogue category (live DB).
 * Matches shop.category_id, subcategory parent category_id, or business type name = category.name.
 * Also registered on `app` in server.js (avoids 404 from proxy/stale router ordering).
 */
async function getTailorsForCatalogCategory(req, res) {
  try {
    await initPromise;
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
        error: { message: 'Catalog tables not available.' },
      });
    }
    res.status(500).json({ success: false, error: { message: error.message } });
  }
}

router.get('/public/tailors-for-catalog-category/:categoryId', getTailorsForCatalogCategory);

// ── PUBLIC: Single active shop (detail page, no auth) ──────────────────────────
// Also registered on `app` in server.js so the path always resolves (avoids proxy/router 404).
async function getPublicShopById(req, res) {
  try {
    await initPromise;
    const shopId = parseInt(req.params.shopId, 10);
    if (!Number.isFinite(shopId) || shopId < 1) {
      return res.status(400).json({ success: false, error: { message: 'Invalid shop id' } });
    }
    const [rows] = await db.query(
      `
      SELECT
        s.shop_id,
        s.shop_name,
        s.owner_name,
        s.city,
        s.country,
        s.address,
        s.contact_number,
        s.whatsapp_number,
        s.shop_status,
        s.available_from,
        s.available_to,
        s.not_available_note,
        s.logo_image,
        s.cover_image,
        s.shop_image,
        s.updated_at,
        COALESCE(NULLIF(TRIM(s.shop_image), ''), NULLIF(TRIM(s.cover_image), ''), NULLIF(TRIM(s.logo_image), '')) AS hero_image,
        bt.type_name AS business_type_name,
        sp.specialization_name AS specialization_name,
        c.name AS category_name,
        sc.name AS subcategory_name
      FROM business_tailor_shops s
      LEFT JOIN business_type_management bt ON s.business_type_id = bt.type_id
      LEFT JOIN specialization_management sp ON s.specialization_id = sp.specialization_id
      LEFT JOIN categories c ON s.category_id = c.id
      LEFT JOIN subcategories sc ON s.subcategory_id = sc.id
      WHERE s.shop_id = ?
      LIMIT 1
      `,
      [shopId]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, error: { message: 'Shop not found.' } });
    }
    res.set('Cache-Control', 'private, no-cache, must-revalidate');
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      try {
        await initPromise;
        const shopId = parseInt(req.params.shopId, 10);
        const [rows] = await db.query(
          `
          SELECT
            s.shop_id, s.shop_name, s.owner_name, s.city, s.country, s.address,
            s.contact_number, s.whatsapp_number, s.shop_status,
            s.available_from, s.available_to, s.not_available_note,
            s.logo_image, s.cover_image, s.shop_image,
            s.updated_at,
            COALESCE(NULLIF(TRIM(s.shop_image), ''), NULLIF(TRIM(s.cover_image), ''), NULLIF(TRIM(s.logo_image), '')) AS hero_image,
            bt.type_name AS business_type_name,
            sp.specialization_name AS specialization_name
          FROM business_tailor_shops s
          LEFT JOIN business_type_management bt ON s.business_type_id = bt.type_id
          LEFT JOIN specialization_management sp ON s.specialization_id = sp.specialization_id
          WHERE s.shop_id = ?
          LIMIT 1
          `,
          [shopId]
        );
        if (!rows.length) {
          return res.status(404).json({ success: false, error: { message: 'Shop not found.' } });
        }
        res.set('Cache-Control', 'private, no-cache, must-revalidate');
        return res.json({ success: true, data: { ...rows[0], category_name: null, subcategory_name: null } });
      } catch (e2) {
        return res.status(500).json({ success: false, error: { message: e2.message } });
      }
    }
    res.status(500).json({ success: false, error: { message: error.message } });
  }
}

router.get('/public/shops/:shopId', getPublicShopById);

router.use(authenticateToken);
router.use(ensureInitialized);

// Upload business logo/cover image
router.post('/shops/upload-image', (req, res) => {
  businessImageUpload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: { message: err.message || 'Image upload failed' } });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, error: { message: 'No image file uploaded' } });
    }
    const imageUrl = `/images/business/${req.file.filename}`;
    return res.json({ success: true, data: { imageUrl } });
  });
});

// ── Enriched shops list (with type & specialization names) ────────────────────
router.get('/shops/enriched', async (req, res) => {
  try {
    const whereClause = isTailorUser(req) ? 'WHERE s.owner_user_id = ?' : '';
    const params = isTailorUser(req) ? [req.user.userId] : [];
    const [rows] = await db.query(
      `
        SELECT
          s.*,
          bt.type_name        AS business_type_name,
          sp.specialization_name AS specialization_name
        FROM business_tailor_shops s
        LEFT JOIN business_type_management bt ON s.business_type_id = bt.type_id
        LEFT JOIN specialization_management sp ON s.specialization_id = sp.specialization_id
        ${whereClause}
        ORDER BY s.shop_id DESC
      `,
      params
    );
    const maxShops = isTailorUser(req) ? getMaxShopsForTailorUser(req) : undefined;
    res.json({
      success: true,
      data: rows,
      ...(maxShops != null ? { meta: { maxShops } } : {}),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// ── Dropdown options for Business Types ───────────────────────────────────────
router.get('/options/business-types', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT type_id AS id, type_name AS name FROM business_type_management WHERE is_active = 1 ORDER BY type_name ASC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// ── Dropdown options for Specializations (optionally filtered by type) ────────
router.get('/options/specializations', async (req, res) => {
  try {
    const { business_type_id } = req.query;
    let query = 'SELECT specialization_id AS id, specialization_name AS name, business_type_id FROM specialization_management WHERE is_active = 1';
    const params = [];
    if (business_type_id) {
      query += ' AND (business_type_id = ? OR business_type_id IS NULL)';
      params.push(business_type_id);
    }
    query += ' ORDER BY specialization_name ASC';
    const [rows] = await db.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.get('/dashboard', async (req, res) => {
  try {
    const counts = {};
    for (const [key, config] of Object.entries(RESOURCES)) {
      const [rows] = await db.query(`SELECT COUNT(*) AS total FROM ${config.table}`);
      counts[key] = rows[0].total;
    }
    res.json({ success: true, data: counts });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

/** Per-shop tailor services — explicit paths so this never falls through to a broken generic :resource match. */
router.get('/services', async (req, res) => {
  try {
    let query = `
      SELECT s.*, sh.shop_name
      FROM business_tailor_services s
      LEFT JOIN business_tailor_shops sh ON sh.shop_id = s.shop_id
    `;
    const params = [];
    if (isTailorUser(req)) {
      query += ' WHERE s.owner_user_id = ?';
      params.push(req.user.userId);
    }
    query += ' ORDER BY s.business_service_id DESC';
    const [rows] = await db.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.post('/services', async (req, res) => {
  try {
    const userId = req.user.userId;
    const tailor = isTailorUser(req);
    const shopId = Number(req.body.shop_id);
    if (!Number.isFinite(shopId) || shopId < 1) {
      return res.status(400).json({ success: false, error: { message: 'Invalid shop_id' } });
    }
    if (tailor) {
      const [rows] = await db.query(
        'SELECT shop_id FROM business_tailor_shops WHERE shop_id = ? AND owner_user_id = ? LIMIT 1',
        [shopId, userId]
      );
      if (!rows.length) {
        return res.status(403).json({ success: false, error: { message: 'You can only add services to your own shop.' } });
      }
    }
    const garment_type = req.body.garment_type;
    if (!garment_type || !String(garment_type).trim()) {
      return res.status(400).json({ success: false, error: { message: 'Missing required fields: garment_type' } });
    }
    const owner_user_id = tailor ? userId : Number(req.body.owner_user_id) || userId;
    const [result] = await db.query(
      `INSERT INTO business_tailor_services (
        owner_user_id, shop_id, garment_type, description, price_min, price_max, delivery_time, service_status, is_active
      ) VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        owner_user_id,
        shopId,
        String(garment_type).trim(),
        req.body.description ?? null,
        req.body.price_min ?? 0,
        req.body.price_max ?? 0,
        req.body.delivery_time ?? null,
        req.body.service_status || 'available',
        req.body.is_active !== undefined ? req.body.is_active : 1,
      ]
    );
    await writeLog(req, {
      pageName: 'services',
      actionType: 'CREATE',
      entityId: result.insertId,
      description: 'services record created',
    });
    res.status(201).json({ success: true, data: { id: result.insertId, business_service_id: result.insertId } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.get('/:resource', async (req, res) => {
  try {
    const config = getResourceConfig(req.params.resource);
    if (!config) {
      return res.status(404).json({ success: false, error: { message: 'Resource not found' } });
    }
    let query = `SELECT * FROM ${config.table}`;
    const params = [];
    if (req.params.resource === 'services') {
      query = `
        SELECT s.*, sh.shop_name
        FROM business_tailor_services s
        LEFT JOIN business_tailor_shops sh ON sh.shop_id = s.shop_id
      `;
    }
    if (req.params.resource === 'shops' && isTailorUser(req)) {
      query += ' WHERE owner_user_id = ?';
      params.push(req.user.userId);
    } else if (req.params.resource === 'services' && isTailorUser(req)) {
      query += ' WHERE s.owner_user_id = ?';
      params.push(req.user.userId);
    }
    query += ` ORDER BY ${config.id} DESC`;
    const [rows] = await db.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.post('/:resource', async (req, res) => {
  try {
    const config = getResourceConfig(req.params.resource);
    if (!config) {
      return res.status(404).json({ success: false, error: { message: 'Resource not found' } });
    }

    const payload = {};
    for (const field of config.allowed) {
      if (req.body[field] !== undefined) payload[field] = req.body[field];
    }

    if (req.params.resource === 'shops') {
      sanitizeShopResourcePayload(payload, 'create');
      await coerceShopForeignKeys(payload, 'create');
    }
    if (req.params.resource === 'services') {
      if (isTailorUser(req)) payload.owner_user_id = req.user.userId;
      payload.service_status = payload.service_status || 'available';
      payload.is_active = payload.is_active !== undefined ? payload.is_active : 1;
      if (!(await ensureServiceShopOwnership(req, payload.shop_id))) {
        return res.status(403).json({ success: false, error: { message: 'You can only add services to your own shop.' } });
      }
    }

    if (req.params.resource === 'shops' && isTailorUser(req)) {
      payload.owner_user_id = req.user.userId;
      const [[ownCountRow]] = await db.query(
        'SELECT COUNT(*) AS total FROM business_tailor_shops WHERE owner_user_id = ?',
        [req.user.userId]
      );
      const maxShops = getMaxShopsForTailorUser(req);
      if ((ownCountRow?.total || 0) >= maxShops) {
        return res.status(400).json({
          success: false,
          error: {
            message:
              maxShops <= 1
                ? 'You can create only one business account.'
                : `You can create up to ${maxShops} business accounts.`,
          },
        });
      }
    }

    const missing = config.required.filter((field) => !payload[field] && payload[field] !== 0);
    if (missing.length) {
      return res.status(400).json({ success: false, error: { message: `Missing required fields: ${missing.join(', ')}` } });
    }

    if (!Object.keys(payload).length) {
      return res.status(400).json({ success: false, error: { message: 'No valid fields provided' } });
    }

    const fields = Object.keys(payload);
    const placeholders = fields.map(() => '?').join(', ');
    const values = fields.map((field) => payload[field]);

    const [result] = await db.query(
      `INSERT INTO ${config.table} (${fields.join(', ')}) VALUES (${placeholders})`,
      values
    );

    if (req.params.resource !== 'logs') {
      await writeLog(req, {
        pageName: req.params.resource,
        actionType: 'CREATE',
        entityId: result.insertId,
        description: `${req.params.resource} record created`
      });
    }

    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid business type or specialization. Please choose again or leave unset.' },
      });
    }
    console.error('POST /business/:resource', req.params.resource, error.message);
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id) || id < 1) {
      return res.status(400).json({ success: false, error: { message: 'Invalid id' } });
    }
    const userId = req.user.userId;
    const tailor = isTailorUser(req);
    const payload = {};
    const allowed = ['shop_id', 'garment_type', 'description', 'price_min', 'price_max', 'delivery_time', 'service_status', 'is_active'];
    for (const k of allowed) {
      if (req.body[k] !== undefined) payload[k] = req.body[k];
    }
    if (!Object.keys(payload).length) {
      return res.status(400).json({ success: false, error: { message: 'No valid fields provided for update' } });
    }
    if (payload.shop_id !== undefined) {
      const sid = Number(payload.shop_id);
      if (!Number.isFinite(sid) || sid < 1) {
        return res.status(400).json({ success: false, error: { message: 'Invalid shop_id' } });
      }
      if (tailor) {
        const [rows] = await db.query(
          'SELECT shop_id FROM business_tailor_shops WHERE shop_id = ? AND owner_user_id = ? LIMIT 1',
          [sid, userId]
        );
        if (!rows.length) {
          return res.status(403).json({ success: false, error: { message: 'You can only assign services to your own shop.' } });
        }
      }
      payload.shop_id = sid;
    }
    if (payload.garment_type !== undefined) payload.garment_type = String(payload.garment_type).trim();
    const fields = Object.keys(payload);
    const setClause = fields.map((f) => `${f} = ?`).join(', ');
    const values = fields.map((f) => payload[f]);
    values.push(id);
    let whereSql = 'business_service_id = ?';
    if (tailor) {
      whereSql += ' AND owner_user_id = ?';
      values.push(userId);
    }
    const [result] = await db.query(
      `UPDATE business_tailor_services SET ${setClause}, updated_at = NOW() WHERE ${whereSql}`,
      values
    );
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, error: { message: 'Record not found' } });
    }
    await writeLog(req, {
      pageName: 'services',
      actionType: 'UPDATE',
      entityId: id,
      description: 'services record updated',
    });
    res.json({ success: true, message: 'Record updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id) || id < 1) {
      return res.status(400).json({ success: false, error: { message: 'Invalid id' } });
    }
    const userId = req.user.userId;
    const tailor = isTailorUser(req);
    let q = 'DELETE FROM business_tailor_services WHERE business_service_id = ?';
    const p = [id];
    if (tailor) {
      q += ' AND owner_user_id = ?';
      p.push(userId);
    }
    const [result] = await db.query(q, p);
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, error: { message: 'Record not found' } });
    }
    await writeLog(req, {
      pageName: 'services',
      actionType: 'DELETE',
      entityId: id,
      description: 'services record deleted',
    });
    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.put('/:resource/:id', async (req, res) => {
  try {
    const config = getResourceConfig(req.params.resource);
    if (!config) {
      return res.status(404).json({ success: false, error: { message: 'Resource not found' } });
    }

    const payload = {};
    for (const field of config.allowed) {
      if (req.body[field] !== undefined) payload[field] = req.body[field];
    }

    if (req.params.resource === 'shops') {
      sanitizeShopResourcePayload(payload, 'update');
      await coerceShopForeignKeys(payload, 'update');
      // Ensure each saved shop stays linked to the authenticated business/tailor user.
      if (isTailorUser(req)) payload.owner_user_id = req.user.userId;
    }
    if (req.params.resource === 'services') {
      if (isTailorUser(req)) payload.owner_user_id = req.user.userId;
      if (payload.shop_id !== undefined && !(await ensureServiceShopOwnership(req, payload.shop_id))) {
        return res.status(403).json({ success: false, error: { message: 'You can only assign services to your own shop.' } });
      }
    }

    const fields = Object.keys(payload);
    if (!fields.length) {
      return res.status(400).json({ success: false, error: { message: 'No valid fields provided for update' } });
    }

    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => payload[field]);
    values.push(req.params.id);

    let whereClause = `${config.id} = ?`;
    if ((req.params.resource === 'shops' || req.params.resource === 'services') && isTailorUser(req)) {
      whereClause += ' AND owner_user_id = ?';
      values.push(req.user.userId);
    }

    const [result] = await db.query(`UPDATE ${config.table} SET ${setClause} WHERE ${whereClause}`, values);

    if (!result.affectedRows) {
      return res.status(404).json({ success: false, error: { message: 'Record not found' } });
    }

    if (req.params.resource !== 'logs') {
      await writeLog(req, {
        pageName: req.params.resource,
        actionType: 'UPDATE',
        entityId: Number(req.params.id),
        description: `${req.params.resource} record updated`
      });
    }

    res.json({ success: true, message: 'Record updated successfully' });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid business type or specialization. Please choose again or leave unset.' },
      });
    }
    console.error('PUT /business/:resource/:id', req.params.resource, error.message);
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.delete('/:resource/:id', async (req, res) => {
  try {
    const config = getResourceConfig(req.params.resource);
    if (!config) {
      return res.status(404).json({ success: false, error: { message: 'Resource not found' } });
    }

    let query = `DELETE FROM ${config.table} WHERE ${config.id} = ?`;
    const params = [req.params.id];
    if ((req.params.resource === 'shops' || req.params.resource === 'services') && isTailorUser(req)) {
      query += ' AND owner_user_id = ?';
      params.push(req.user.userId);
    }

    const [result] = await db.query(query, params);

    if (!result.affectedRows) {
      return res.status(404).json({ success: false, error: { message: 'Record not found' } });
    }

    if (req.params.resource !== 'logs') {
      await writeLog(req, {
        pageName: req.params.resource,
        actionType: 'DELETE',
        entityId: Number(req.params.id),
        description: `${req.params.resource} record deleted`
      });
    }

    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

module.exports = router;
module.exports.initPromise = initPromise;
module.exports.getPublicShopById = getPublicShopById;
module.exports.getTailorsForCatalogCategory = getTailorsForCatalogCategory;
