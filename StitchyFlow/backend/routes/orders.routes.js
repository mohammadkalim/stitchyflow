const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get all orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM vw_order_details ORDER BY created_at DESC');
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
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
