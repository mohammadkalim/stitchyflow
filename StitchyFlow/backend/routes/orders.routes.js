const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get orders — tailors see only their jobs; customers see only theirs; admin sees all
router.get('/', authenticateToken, async (req, res) => {
  try {
    const role = String(req.user.role || '').toLowerCase();
    const userId = req.user.userId;
    const baseSelect = `
      SELECT
        o.order_id,
        o.customer_id,
        o.order_number,
        o.status,
        o.garment_type,
        o.estimated_price,
        o.final_price,
        o.created_at,
        o.estimated_completion_date,
        o.actual_completion_date,
        CONCAT(cu_user.first_name, ' ', cu_user.last_name) AS customer_name,
        cu_user.email AS customer_email,
        cu_user.phone AS customer_phone,
        CONCAT(t_user.first_name, ' ', t_user.last_name) AS tailor_name,
        t.rating AS tailor_rating,
        b.business_name,
        p.payment_status,
        p.amount AS payment_amount,
        COALESCE(p.amount, o.final_price, o.estimated_price, 0) AS total_amount
      FROM orders o
      INNER JOIN customers c ON o.customer_id = c.customer_id
      INNER JOIN users cu_user ON c.user_id = cu_user.user_id
      LEFT JOIN tailors t ON o.tailor_id = t.tailor_id
      LEFT JOIN users t_user ON t.user_id = t_user.user_id
      LEFT JOIN businesses b ON o.business_id = b.business_id
      LEFT JOIN payments p ON o.order_id = p.order_id
    `;

    if (role === 'tailor') {
      const [orders] = await db.query(
        `${baseSelect}
         WHERE t.user_id = ?
         ORDER BY o.created_at DESC`,
        [userId]
      );
      return res.json({ success: true, data: orders });
    }

    if (role === 'customer') {
      const [orders] = await db.query(
        `${baseSelect}
         WHERE c.user_id = ?
         ORDER BY o.created_at DESC`,
        [userId]
      );
      return res.json({ success: true, data: orders });
    }

    const [orders] = await db.query(`${baseSelect} ORDER BY o.created_at DESC`);
    res.json({ success: true, data: orders });
  } catch (error) {
    // Fallback path for environments where legacy/partial schema causes join failures.
    try {
      const role = String(req.user.role || '').toLowerCase();
      const userId = req.user.userId;
      const baseFallback = `
        SELECT
          o.order_id,
          o.customer_id,
          o.order_number,
          o.status,
          o.garment_type,
          o.estimated_price,
          o.final_price,
          o.created_at,
          o.estimated_completion_date,
          o.actual_completion_date,
          NULL AS customer_name,
          NULL AS customer_email,
          NULL AS customer_phone,
          NULL AS tailor_name,
          NULL AS tailor_rating,
          NULL AS business_name,
          NULL AS payment_status,
          NULL AS payment_amount,
          COALESCE(o.final_price, o.estimated_price, 0) AS total_amount
        FROM orders o
      `;

      if (role === 'tailor') {
        const [orders] = await db.query(
          `${baseFallback}
           WHERE o.tailor_id = ?
              OR o.tailor_id IN (SELECT tailor_id FROM tailors WHERE user_id = ?)
           ORDER BY o.created_at DESC`,
          [userId, userId]
        );
        return res.json({ success: true, data: orders });
      }

      if (role === 'customer') {
        const [orders] = await db.query(
          `${baseFallback}
           WHERE o.customer_id = ?
              OR o.customer_id IN (SELECT customer_id FROM customers WHERE user_id = ?)
           ORDER BY o.created_at DESC`,
          [userId, userId]
        );
        return res.json({ success: true, data: orders });
      }

      const [orders] = await db.query(`${baseFallback} ORDER BY o.created_at DESC`);
      return res.json({ success: true, data: orders });
    } catch (fallbackError) {
      return res.status(500).json({ success: false, error: { message: fallbackError.message } });
    }
  }
});

// Create order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { customerId, tailorId, businessId, garmentType, description, specialInstructions, estimatedPrice } = req.body;
    
    await db.query(
      'CALL sp_create_order(?, ?, ?, ?, ?, ?, ?, @order_id, @order_number)',
      [customerId, tailorId, businessId, garmentType, description, specialInstructions, estimatedPrice]
    );
    
    const [[result]] = await db.query('SELECT @order_id as orderId, @order_number as orderNumber');
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Update order status
router.patch('/:orderId/status', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, notes } = req.body;
    
    await db.query(
      'CALL sp_update_order_status(?, ?, ?, ?)',
      [orderId, status, req.user.userId, notes]
    );
    
    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

module.exports = router;
