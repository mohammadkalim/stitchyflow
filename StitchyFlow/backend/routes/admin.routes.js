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
    const [users] = await db.query('SELECT user_id, full_name, email, phone_number, role, is_active, created_at FROM users ORDER BY created_at DESC');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
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

module.exports = router;
