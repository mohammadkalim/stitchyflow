/**
 * Admin Routes
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const ADMIN_SETTINGS_SCHEMA = {
  site_name: { type: 'string', default: 'StitchyFlow', description: 'Platform name shown in admin panel' },
  admin_email: { type: 'string', default: 'admin@stitchyflow.com', description: 'Primary admin email address' },
  support_email: { type: 'string', default: 'support@stitchyflow.com', description: 'Support contact email' },
  allow_registration: { type: 'boolean', default: true, description: 'Allow new user registration' },
  email_verification: { type: 'boolean', default: true, description: 'Require email verification for accounts' },
  maintenance_mode: { type: 'boolean', default: false, description: 'Enable platform maintenance mode' },
  max_login_attempts: { type: 'integer', default: 5, description: 'Maximum login attempts before lockout' },
  session_timeout_hours: { type: 'integer', default: 8, description: 'Session timeout duration in hours' },
  password_reset_expire_minutes: { type: 'integer', default: 30, description: 'Password reset token expiry time in minutes' },
  verification_code_expire_minutes: { type: 'integer', default: 10, description: 'Verification code expiry time in minutes' }
};

function toStorageValue(type, value, fallback) {
  if (type === 'boolean') {
    return (typeof value === 'boolean' ? value : fallback) ? 'true' : 'false';
  }
  if (type === 'integer') {
    const parsed = Number.isFinite(Number(value)) ? parseInt(value, 10) : fallback;
    return String(parsed);
  }
  return String(value ?? fallback ?? '');
}

function fromStorageValue(type, value, fallback) {
  if (value === undefined || value === null) return fallback;
  if (type === 'boolean') return String(value).toLowerCase() === 'true' || value === '1';
  if (type === 'integer') {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return value;
}

const STORAGE_TABLES = [
  { key: 'refresh_tokens', label: 'Refresh Tokens' },
  { key: 'session_logs', label: 'Session Logs' },
  { key: 'user_sessions', label: 'User Sessions' },
  { key: 'messages', label: 'Chat Messages' },
  { key: 'ai_error_logs', label: 'AI Error Logs' },
  { key: 'audit_logs', label: 'Audit Logs' }
];

function normalizePublicFileUrl(fileUrl = '') {
  const value = String(fileUrl || '').trim();
  if (!value) return '';
  if (value.startsWith('/')) return value;
  const uploadsIndex = value.indexOf('/uploads/');
  if (uploadsIndex >= 0) return value.slice(uploadsIndex);
  return '';
}

async function collectDirectoryUsageStats(baseDir) {
  const totals = { bytes: 0, files: 0 };
  const walk = async (currentDir) => {
    let entries = [];
    try {
      entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
    } catch (error) {
      return;
    }

    await Promise.all(entries.map(async (entry) => {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        return;
      }
      if (!entry.isFile()) return;
      try {
        const stat = await fs.promises.stat(fullPath);
        totals.bytes += stat.size;
        totals.files += 1;
      } catch (error) {
        // Ignore inaccessible file stats; continue scanning.
      }
    }));
  };

  await walk(baseDir);
  return totals;
}

async function getStorageOverview() {
  const tableNames = STORAGE_TABLES.map((item) => item.key);
  const placeholders = tableNames.map(() => '?').join(',');

  let tableStorageRows = [];
  let dbTotals = [{ used_bytes: 0, free_bytes: 0 }];

  try {
    const [r1] = await db.query(
      `SELECT
         LOWER(table_name) AS table_name,
         COALESCE(data_length, 0) + COALESCE(index_length, 0) AS used_bytes,
         COALESCE(data_free, 0) AS free_bytes,
         COALESCE(data_length, 0) + COALESCE(index_length, 0) + COALESCE(data_free, 0) AS total_allocated
       FROM information_schema.TABLES
       WHERE table_schema = DATABASE()
         AND LOWER(table_name) IN (${placeholders})`,
      tableNames
    );
    tableStorageRows = r1;
  } catch (_) {}

  try {
    const [r2] = await db.query(
      `SELECT
         COALESCE(SUM(data_length + index_length), 0) AS used_bytes,
         COALESCE(SUM(data_free), 0) AS free_bytes
       FROM information_schema.TABLES
       WHERE table_schema = DATABASE()`
    );
    dbTotals = r2;
  } catch (_) {}

  const tableStorageMap = tableStorageRows.reduce((acc, row) => {
    acc[row.table_name] = row;
    return acc;
  }, {});

  const tableCountMap = {};
  await Promise.all(
    STORAGE_TABLES.map(async ({ key }) => {
      try {
        const [rows] = await db.query(`SELECT COUNT(*) AS total_rows FROM \`${key}\``);
        tableCountMap[key] = Number(rows[0]?.total_rows || 0);
      } catch (_) {
        // Table may not exist yet — treat as 0 rows
        tableCountMap[key] = 0;
      }
    })
  );

  const backendRoot = path.join(__dirname, '..');
  const uploadsRoot = path.join(backendRoot, 'uploads');
  const chatDir = path.join(uploadsRoot, 'chat');
  const adsDir = path.join(uploadsRoot, 'ads');
  const [chatUsage, adsUsage] = await Promise.all([
    collectDirectoryUsageStats(chatDir),
    collectDirectoryUsageStats(adsDir)
  ]);

  const dbUsedBytes = Number(dbTotals[0]?.used_bytes || 0);
  const dbFreeBytes = Number(dbTotals[0]?.free_bytes || 0);
  const dbAllocatedBytes = dbUsedBytes + dbFreeBytes;
  const filesUsedBytes = chatUsage.bytes + adsUsage.bytes;
  const storageUsedBytes = dbUsedBytes + filesUsedBytes;
  const storageAllocatedBytes = dbAllocatedBytes + filesUsedBytes;
  const storagePercentUsed = storageAllocatedBytes > 0
    ? Number(((storageUsedBytes / storageAllocatedBytes) * 100).toFixed(1))
    : 0;

  const modules = STORAGE_TABLES.map(({ key, label }) => {
    const row = tableStorageMap[key] || {};
    const usedBytes = Number(row.used_bytes || 0);
    const freeBytes = Number(row.free_bytes || 0);
    const allocated = Number(row.total_allocated || (usedBytes + freeBytes));
    const percentUsed = allocated > 0 ? Number(((usedBytes / allocated) * 100).toFixed(1)) : 0;
    return {
      key,
      label,
      rows: tableCountMap[key] || 0,
      used_bytes: usedBytes,
      free_bytes: freeBytes,
      percent_used: percentUsed
    };
  });

  modules.push(
    {
      key: 'uploads_chat',
      label: 'Chat Upload Files',
      rows: chatUsage.files,
      used_bytes: chatUsage.bytes,
      free_bytes: 0,
      percent_used: 100
    },
    {
      key: 'uploads_ads',
      label: 'Ads Upload Files',
      rows: adsUsage.files,
      used_bytes: adsUsage.bytes,
      free_bytes: 0,
      percent_used: 100
    }
  );

  return {
    storage: {
      used_bytes: storageUsedBytes,
      free_bytes: Math.max(storageAllocatedBytes - storageUsedBytes, 0),
      allocated_bytes: storageAllocatedBytes,
      percent_used: storagePercentUsed
    },
    modules
  };
}

async function cleanupStorage(payload = {}) {
  const cleanup = {
    expired_refresh_tokens: payload.expired_refresh_tokens !== false,
    old_session_logs_days: Number(payload.old_session_logs_days || 60),
    old_ai_error_logs_days: Number(payload.old_ai_error_logs_days || 60),
    orphan_chat_files: payload.orphan_chat_files !== false
  };

  const result = {
    refresh_tokens_deleted: 0,
    session_logs_deleted: 0,
    ai_error_logs_deleted: 0,
    orphan_chat_files_deleted: 0,
    warnings: []
  };

  if (cleanup.expired_refresh_tokens) {
    const [deleted] = await db.query('DELETE FROM refresh_tokens WHERE expires_at <= NOW()');
    result.refresh_tokens_deleted = Number(deleted.affectedRows || 0);
  }

  if (cleanup.old_session_logs_days >= 7) {
    const [deleted] = await db.query(
      'DELETE FROM session_logs WHERE created_at < (NOW() - INTERVAL ? DAY)',
      [cleanup.old_session_logs_days]
    );
    result.session_logs_deleted = Number(deleted.affectedRows || 0);
  } else {
    result.warnings.push('Skipping session_logs cleanup: minimum retention is 7 days.');
  }

  if (cleanup.old_ai_error_logs_days >= 7) {
    const [deleted] = await db.query(
      'DELETE FROM ai_error_logs WHERE created_at < (NOW() - INTERVAL ? DAY)',
      [cleanup.old_ai_error_logs_days]
    );
    result.ai_error_logs_deleted = Number(deleted.affectedRows || 0);
  } else {
    result.warnings.push('Skipping ai_error_logs cleanup: minimum retention is 7 days.');
  }

  if (cleanup.orphan_chat_files) {
    try {
      const [messageFiles] = await db.query(
        "SELECT file_url FROM messages WHERE file_url IS NOT NULL AND file_url != ''"
      );
      const referenced = new Set(
        messageFiles
          .map((row) => normalizePublicFileUrl(row.file_url))
          .filter(Boolean)
          .map((item) => path.basename(item))
      );

      const chatUploadRoot = path.join(__dirname, '..', 'uploads', 'chat');
      let entries = [];
      try {
        entries = await fs.promises.readdir(chatUploadRoot, { withFileTypes: true });
      } catch (error) {
        result.warnings.push('Chat uploads directory is not available.');
      }

      for (const entry of entries) {
        if (!entry.isFile()) continue;
        if (referenced.has(entry.name)) continue;
        try {
          await fs.promises.unlink(path.join(chatUploadRoot, entry.name));
          result.orphan_chat_files_deleted += 1;
        } catch (error) {
          result.warnings.push(`Failed to delete chat file: ${entry.name}`);
        }
      }
    } catch (error) {
      // messages table may not exist yet — skip orphan cleanup gracefully
      result.warnings.push('Skipping orphan chat file cleanup: ' + error.message);
    }
  }

  return result;
}

async function getRefreshTokenMetrics() {
  const [tokenCounts] = await db.query(
    `SELECT
       COUNT(*) AS total_tokens,
       SUM(expires_at > NOW()) AS active_tokens,
       SUM(expires_at <= NOW()) AS expired_tokens
     FROM refresh_tokens`
  );

  const [activityCounts] = await db.query(
    `SELECT
       SUM(action = 'LOGIN') AS login_count,
       SUM(action = 'LOGOUT') AS logout_count
     FROM session_logs
     WHERE action IN ('LOGIN', 'LOGOUT')`
  );

  const [recentActivity] = await db.query(
    `SELECT sl.action, sl.ip_address, sl.user_agent, sl.details, sl.created_at,
            CONCAT(u.first_name, ' ', u.last_name) AS user_name, u.email
     FROM session_logs sl
     LEFT JOIN users u ON sl.user_id = u.user_id
     WHERE sl.action IN ('LOGIN', 'LOGOUT')
     ORDER BY sl.created_at DESC
     LIMIT 10`
  );

  const [storageInfo] = await db.query(
    `SELECT
       COALESCE(data_length, 0) + COALESCE(index_length, 0) AS used_bytes,
       COALESCE(data_free, 0) AS free_bytes,
       COALESCE(data_length, 0) + COALESCE(index_length, 0) + COALESCE(data_free, 0) AS total_allocated
     FROM information_schema.TABLES
     WHERE table_schema = DATABASE() AND table_name = 'refresh_tokens'`
  );

  const usedBytes = Number(storageInfo[0]?.used_bytes || 0);
  const freeBytes = Number(storageInfo[0]?.free_bytes || 0);
  const totalAllocated = Number(storageInfo[0]?.total_allocated || 0);
  let percentUsed = 0;
  if (totalAllocated > 0) {
    percentUsed = Number(((usedBytes / totalAllocated) * 100).toFixed(1));
  }

  // InnoDB may report zero free space for a small table that is not actually full.
  // Avoid a misleading 100% full alert when the refresh_tokens table is tiny.
  if (freeBytes === 0 && totalAllocated <= 2 * 1024 * 1024) {
    percentUsed = 0;
  }

  return {
    total_tokens: tokenCounts[0]?.total_tokens || 0,
    active_tokens: Number(tokenCounts[0]?.active_tokens || 0),
    expired_tokens: Number(tokenCounts[0]?.expired_tokens || 0),
    login_count: Number(activityCounts[0]?.login_count || 0),
    logout_count: Number(activityCounts[0]?.logout_count || 0),
    storage: {
      used_bytes: usedBytes,
      free_bytes: freeBytes,
      percent_used: percentUsed
    },
    history: recentActivity.map((row) => ({
      action: row.action,
      created_at: row.created_at,
      ip_address: row.ip_address,
      user_agent: row.user_agent,
      details: row.details,
      user_name: row.user_name || row.email || 'Unknown'
    }))
  };
}

// Get Analytics
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const [customers] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'customer'");
    const [tailors] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'tailor'");
    const [orders] = await db.query("SELECT COUNT(*) as count FROM orders");
    const [payments] = await db.query("SELECT COUNT(*) as count, SUM(amount) as total FROM payments WHERE status = 'completed'");
    const [pending] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'");
    const [completed] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'completed'");
    const [inProgress] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'in_progress'");

    res.json({
      success: true,
      data: {
        total_customers: customers[0].count,
        total_tailors: tailors[0].count,
        total_orders: orders[0].count,
        total_payments: payments[0].count,
        total_revenue: payments[0].total || 0,
        pending_orders: pending[0].count,
        completed_orders: completed[0].count,
        in_progress_orders: inProgress[0].count
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Get All Users
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT user_id, CONCAT(first_name, ' ', last_name) as full_name, email, phone as phone_number, role, status = 'active' as is_active, last_login, created_at FROM users ORDER BY created_at DESC"
    );
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Get Single User by ID
router.get('/users/:id', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT user_id, CONCAT(first_name, ' ', last_name) as full_name, email, phone as phone_number, role, status = 'active' as is_active, created_at, updated_at FROM users WHERE user_id = ?",
      [req.params.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, error: { message: 'User not found' } });
    }
    
    res.json({ success: true, data: users[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Create New User
router.post('/users', authenticateToken, async (req, res) => {
  try {
    const { full_name, email, phone_number, role, is_active, password } = req.body;
    
    // Validate required fields
    if (!full_name || !email || !role) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Full name, email, and role are required' } 
      });
    }
    
    // Check if email already exists
    const [existingUsers] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ 
        success: false, 
        error: { message: 'Email already exists' } 
      });
    }
    
    // Hash password
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(password || 'User@123', 10);
    
    // Insert user - split full_name into first_name and last_name
    const nameParts = full_name.trim().split(' ');
    const first_name = nameParts[0] || '';
    const last_name = nameParts.slice(1).join(' ') || '';
    
    const status = is_active ? 'active' : 'inactive';
    
    const [result] = await db.query(
      'INSERT INTO users (first_name, last_name, email, phone, role, status, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone_number || null, role, status, passwordHash]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'User created successfully',
      data: { user_id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Update User
router.put('/users/:id', authenticateToken, async (req, res) => {
  try {
    const { full_name, email, phone_number, role, is_active } = req.body;
    const userId = req.params.id;
    
    // Check if user exists
    const [existingUsers] = await db.query('SELECT user_id FROM users WHERE user_id = ?', [userId]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ success: false, error: { message: 'User not found' } });
    }
    
    // Check if email is being changed and if new email already exists
    if (email) {
      const [emailCheck] = await db.query(
        'SELECT user_id FROM users WHERE email = ? AND user_id != ?', 
        [email, userId]
      );
      if (emailCheck.length > 0) {
        return res.status(409).json({ 
          success: false, 
          error: { message: 'Email already exists' } 
        });
      }
    }
    
    // Build update query dynamically
    const updates = [];
    const values = [];
    
    if (full_name) {
      const nameParts = full_name.trim().split(' ');
      updates.push('first_name = ?', 'last_name = ?');
      values.push(nameParts[0] || '', nameParts.slice(1).join(' ') || '');
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (phone_number !== undefined) {
      updates.push('phone = ?');
      values.push(phone_number);
    }
    if (role) {
      updates.push('role = ?');
      values.push(role);
    }
    if (is_active !== undefined) {
      updates.push('status = ?');
      values.push(is_active ? 'active' : 'inactive');
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: { message: 'No fields to update' } });
    }
    
    values.push(userId);
    
    await db.query(
      `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );
    
    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Delete User (Soft Delete - Set status to inactive)
router.delete('/users/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const [existingUsers] = await db.query('SELECT user_id, role FROM users WHERE user_id = ?', [userId]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ success: false, error: { message: 'User not found' } });
    }
    
    // Prevent deleting the last admin
    const [adminCount] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'admin' AND status = 'active'");
    
    if (existingUsers[0].role === 'admin' && adminCount[0].count <= 1) {
      return res.status(403).json({ 
        success: false, 
        error: { message: 'Cannot delete the last admin user' } 
      });
    }
    
    // Soft delete - set status to inactive instead of actually deleting
    await db.query('UPDATE users SET status = ? WHERE user_id = ?', ['inactive', userId]);
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// ── SUSPEND USER ──────────────────────────────────────────────────────────────
// PATCH /api/v1/admin/users/:id/suspend
router.patch('/users/:id/suspend', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const [users] = await db.query('SELECT user_id, role, status FROM users WHERE user_id = ?', [userId]);
    if (!users.length) return res.status(404).json({ success: false, error: { message: 'User not found' } });

    // Prevent suspending last admin
    if (users[0].role === 'admin') {
      const [adminCount] = await db.query("SELECT COUNT(*) as cnt FROM users WHERE role='admin' AND status='active'");
      if (adminCount[0].cnt <= 1) return res.status(403).json({ success: false, error: { message: 'Cannot suspend the last admin' } });
    }

    // Set user status to suspended
    await db.query("UPDATE users SET status='suspended', updated_at=NOW() WHERE user_id=?", [userId]);

    // Auto-delete (mark deleted) all active sessions for this user
    await db.query(
      "UPDATE user_sessions SET status='deleted', deleted_at=NOW(), updated_at=NOW() WHERE user_id=? AND status IN ('active','pending')",
      [userId]
    );

    // Log to session_logs
    await db.query(
      "INSERT INTO session_logs (user_id, action, details, created_at) VALUES (?, 'TERMINATED', 'All sessions terminated — user suspended by admin', NOW())",
      [userId]
    );

    res.json({ success: true, message: 'User suspended and all sessions terminated' });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── ACTIVATE USER ─────────────────────────────────────────────────────────────
// PATCH /api/v1/admin/users/:id/activate
router.patch('/users/:id/activate', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const [users] = await db.query('SELECT user_id, status FROM users WHERE user_id = ?', [userId]);
    if (!users.length) return res.status(404).json({ success: false, error: { message: 'User not found' } });

    await db.query("UPDATE users SET status='active', updated_at=NOW() WHERE user_id=?", [userId]);

    // Log activation
    await db.query(
      "INSERT INTO session_logs (user_id, action, details, created_at) VALUES (?, 'STATUS_CHANGED', 'User account activated by admin', NOW())",
      [userId]
    );

    res.json({ success: true, message: 'User account activated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── GET SUSPENDED USERS ───────────────────────────────────────────────────────
// GET /api/v1/admin/users/suspended
router.get('/users/suspended/list', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT user_id, CONCAT(first_name,' ',last_name) AS full_name, email,
             phone AS phone_number, role, status, created_at, updated_at
      FROM users WHERE status='suspended' ORDER BY updated_at DESC
    `);
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// Get All Orders
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.order_id, o.status, o.total_amount, o.created_at,
             c.full_name as customer_name, t.full_name as tailor_name
      FROM orders o
      LEFT JOIN users c ON o.customer_id = c.user_id
      LEFT JOIN users t ON o.tailor_id = t.user_id
      ORDER BY o.created_at DESC
    `);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Get All Tailors
router.get('/tailors', authenticateToken, async (req, res) => {
  try {
    const [tailors] = await db.query("SELECT user_id as tailor_id, full_name, email, phone_number, is_active FROM users WHERE role = 'tailor' ORDER BY created_at DESC");
    res.json({ success: true, data: tailors });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Get All Measurements
router.get('/measurements', authenticateToken, async (req, res) => {
  try {
    const [measurements] = await db.query(`
      SELECT m.measurement_id, m.garment_type, m.chest, m.waist, m.length, m.created_at,
             u.full_name as customer_name
      FROM measurements m
      LEFT JOIN users u ON m.customer_id = u.user_id
      ORDER BY m.created_at DESC
    `);
    res.json({ success: true, data: measurements });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Get All Payments
router.get('/payments', authenticateToken, async (req, res) => {
  try {
    const [payments] = await db.query(`
      SELECT p.payment_id, p.order_id, p.amount, p.payment_method, p.status, p.created_at,
             u.full_name as customer_name
      FROM payments p
      LEFT JOIN orders o ON p.order_id = o.order_id
      LEFT JOIN users u ON o.customer_id = u.user_id
      ORDER BY p.created_at DESC
    `);
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Get Reports
router.get('/reports', authenticateToken, async (req, res) => {
  try {
    const [dailyRevenue] = await db.query("SELECT SUM(amount) as total FROM payments WHERE DATE(created_at) = CURDATE() AND status = 'completed'");
    const [weeklyRevenue] = await db.query("SELECT SUM(amount) as total FROM payments WHERE YEARWEEK(created_at) = YEARWEEK(NOW()) AND status = 'completed'");
    const [monthlyRevenue] = await db.query("SELECT SUM(amount) as total FROM payments WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW()) AND status = 'completed'");
    const [dailyOrders] = await db.query("SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()");
    const [weeklyOrders] = await db.query("SELECT COUNT(*) as count FROM orders WHERE YEARWEEK(created_at) = YEARWEEK(NOW())");
    const [monthlyOrders] = await db.query("SELECT COUNT(*) as count FROM orders WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())");

    res.json({
      success: true,
      data: {
        daily_revenue: dailyRevenue[0].total || 0,
        weekly_revenue: weeklyRevenue[0].total || 0,
        monthly_revenue: monthlyRevenue[0].total || 0,
        total_orders_today: dailyOrders[0].count,
        total_orders_week: weeklyOrders[0].count,
        total_orders_month: monthlyOrders[0].count
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Get Verification Expire Setting (public for frontend, auth for admin)
router.get('/settings/verification-expire', async (req, res) => {
  try {
    const [settings] = await db.query(
      "SELECT setting_value FROM system_settings WHERE setting_key = 'verification_code_expire_minutes'"
    );
    const minutes = settings.length > 0 ? parseInt(settings[0].setting_value) : 10;
    res.json({
      success: true,
      data: { expireMinutes: minutes }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Update Verification Expire Setting (admin only)
router.put('/settings/verification-expire', authenticateToken, async (req, res) => {
  try {
    const { expireMinutes } = req.body;
    
    if (!expireMinutes || expireMinutes < 1 || expireMinutes > 60) {
      return res.status(400).json({
        success: false,
        error: { message: 'Expire minutes must be between 1 and 60' }
      });
    }
    
    await db.query(
      `INSERT INTO system_settings (setting_key, setting_value, setting_type, description) 
       VALUES ('verification_code_expire_minutes', ?, 'integer', 'Email verification code expiration time in minutes')
       ON DUPLICATE KEY UPDATE 
       setting_value = ?,
       updated_at = CURRENT_TIMESTAMP`,
      [expireMinutes.toString(), expireMinutes.toString()]
    );
    
    res.json({
      success: true,
      message: 'Verification code expire time updated successfully',
      data: { expireMinutes }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Get Admin Settings
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const keys = Object.keys(ADMIN_SETTINGS_SCHEMA);
    const placeholders = keys.map(() => '?').join(',');
    const [rows] = await db.query(
      `SELECT setting_key, setting_value, setting_type
       FROM system_settings
       WHERE setting_key IN (${placeholders})`,
      keys
    );

    const rowMap = rows.reduce((acc, row) => {
      acc[row.setting_key] = row;
      return acc;
    }, {});

    const data = {};
    for (const key of keys) {
      const schema = ADMIN_SETTINGS_SCHEMA[key];
      const row = rowMap[key];
      data[key] = fromStorageValue(schema.type, row?.setting_value, schema.default);
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Get Refresh Token Health and Login/Logout Activity
router.get('/settings/refresh-tokens', authenticateToken, async (req, res) => {
  try {
    const data = await getRefreshTokenMetrics();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.get('/refresh-tokens', authenticateToken, async (req, res) => {
  try {
    const data = await getRefreshTokenMetrics();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Full storage overview for admin panel
router.get('/storage/overview', authenticateToken, async (req, res) => {
  try {
    const data = await getStorageOverview();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Full storage cleanup for admin panel
router.post('/storage/cleanup', authenticateToken, async (req, res) => {
  try {
    const before = await getStorageOverview();
    const cleanup = await cleanupStorage(req.body || {});
    const after = await getStorageOverview();
    const bytesFreed = Math.max(Number(before.storage.used_bytes || 0) - Number(after.storage.used_bytes || 0), 0);

    res.json({
      success: true,
      message: 'Storage cleanup completed successfully.',
      data: {
        cleanup,
        bytes_freed: bytesFreed,
        before,
        after
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Cleanup expired refresh tokens
router.delete('/settings/refresh-tokens/cleanup', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM refresh_tokens WHERE expires_at <= NOW()'
    );

    res.json({
      success: true,
      message: 'Expired refresh tokens cleaned successfully.',
      deleted_count: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.delete('/refresh-tokens/cleanup', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM refresh_tokens WHERE expires_at <= NOW()'
    );

    res.json({
      success: true,
      message: 'Expired refresh tokens cleaned successfully.',
      deleted_count: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Save Admin Settings
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const payload = req.body || {};
    const keys = Object.keys(ADMIN_SETTINGS_SCHEMA);

    for (const key of keys) {
      const schema = ADMIN_SETTINGS_SCHEMA[key];
      const incoming = payload[key];
      const storedValue = toStorageValue(schema.type, incoming, schema.default);
      await db.query(
        `INSERT INTO system_settings (setting_key, setting_value, setting_type, description)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           setting_value = VALUES(setting_value),
           setting_type = VALUES(setting_type),
           description = VALUES(description),
           updated_at = CURRENT_TIMESTAMP`,
        [key, storedValue, schema.type, schema.description]
      );
    }

    res.json({ success: true, message: 'Admin settings saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Email templates CRUD (same as /api/v1/email-templates) — admin panel uses this path first.
router.use('/email-templates', require('./email_templates.routes')());

// Splash ads — admin UI can call /api/v1/admin/ads/... if /api/v1/ads is not registered.
router.use('/ads', require('./ads.routes')());

module.exports = router;
