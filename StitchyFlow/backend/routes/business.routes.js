const express = require('express');
const router = express.Router();
const db = require('../config/database');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');

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

// ── PUBLIC: Active shops for frontend slider (no auth required) ───────────────
router.get('/public/shops', async (req, res) => {
  try {
    await initPromise;
    const shopQuery = `
      SELECT shop_id, owner_user_id, shop_name, owner_name, city, country, address,
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
    res.json({ success: true, data: rows });
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

router.get('/:resource', async (req, res) => {
  try {
    const config = getResourceConfig(req.params.resource);
    if (!config) {
      return res.status(404).json({ success: false, error: { message: 'Resource not found' } });
    }
    let query = `SELECT * FROM ${config.table}`;
    const params = [];
    if (req.params.resource === 'shops' && isTailorUser(req)) {
      query += ' WHERE owner_user_id = ?';
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

    if (req.params.resource === 'shops' && isTailorUser(req)) {
      payload.owner_user_id = req.user.userId;
      const [[ownCountRow]] = await db.query(
        'SELECT COUNT(*) AS total FROM business_tailor_shops WHERE owner_user_id = ?',
        [req.user.userId]
      );
      if ((ownCountRow?.total || 0) >= 1) {
        return res.status(400).json({ success: false, error: { message: 'You can create only one business account.' } });
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

    const fields = Object.keys(payload);
    if (!fields.length) {
      return res.status(400).json({ success: false, error: { message: 'No valid fields provided for update' } });
    }

    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => payload[field]);
    values.push(req.params.id);

    let whereClause = `${config.id} = ?`;
    if (req.params.resource === 'shops' && isTailorUser(req)) {
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
    if (req.params.resource === 'shops' && isTailorUser(req)) {
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
