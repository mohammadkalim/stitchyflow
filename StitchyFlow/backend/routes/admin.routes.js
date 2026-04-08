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

module.exports = router;
