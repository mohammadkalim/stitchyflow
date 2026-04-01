const express = require('express');
const router = express.Router();
const db = require('../config/database');
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
    allowed: ['shop_name', 'owner_name', 'city', 'address', 'contact_number', 'business_type_id', 'specialization_id', 'shop_status']
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

router.use(authenticateToken);
router.use(ensureInitialized);

// ── Enriched shops list (with type & specialization names) ────────────────────
router.get('/shops/enriched', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        s.*,
        bt.type_name        AS business_type_name,
        sp.specialization_name AS specialization_name
      FROM business_tailor_shops s
      LEFT JOIN business_type_management bt ON s.business_type_id = bt.type_id
      LEFT JOIN specialization_management sp ON s.specialization_id = sp.specialization_id
      ORDER BY s.shop_id DESC
    `);
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
    const [rows] = await db.query(`SELECT * FROM ${config.table} ORDER BY ${config.id} DESC`);
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

    const fields = Object.keys(payload);
    if (!fields.length) {
      return res.status(400).json({ success: false, error: { message: 'No valid fields provided for update' } });
    }

    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => payload[field]);
    values.push(req.params.id);

    const [result] = await db.query(
      `UPDATE ${config.table} SET ${setClause} WHERE ${config.id} = ?`,
      values
    );

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
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.delete('/:resource/:id', async (req, res) => {
  try {
    const config = getResourceConfig(req.params.resource);
    if (!config) {
      return res.status(404).json({ success: false, error: { message: 'Resource not found' } });
    }

    const [result] = await db.query(
      `DELETE FROM ${config.table} WHERE ${config.id} = ?`,
      [req.params.id]
    );

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
