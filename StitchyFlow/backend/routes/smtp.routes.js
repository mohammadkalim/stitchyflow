/**
 * SMTP Settings Routes
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
const nodemailer = require('nodemailer');

// Get SMTP Settings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [settings] = await db.query('SELECT * FROM smtp_settings WHERE is_active = TRUE LIMIT 1');
    
    if (settings.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'SMTP settings not found' } 
      });
    }

    // Remove password from response for security
    const { password, ...safeSettings } = settings[0];
    
    res.json({
      success: true,
      data: safeSettings
    });
  } catch (error) {
    console.error('Error fetching SMTP settings:', error);
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Get Full SMTP Settings (with password - admin only)
router.get('/full', authenticateToken, async (req, res) => {
  try {
    const [settings] = await db.query('SELECT * FROM smtp_settings WHERE is_active = TRUE LIMIT 1');
    
    if (settings.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'SMTP settings not found' } 
      });
    }

    res.json({
      success: true,
      data: settings[0]
    });
  } catch (error) {
    console.error('Error fetching full SMTP settings:', error);
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Get All SMTP Configurations
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const [settings] = await db.query('SELECT * FROM smtp_settings ORDER BY created_at DESC');
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching all SMTP settings:', error);
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Create New SMTP Configuration
router.post('/new', authenticateToken, async (req, res) => {
  try {
    const { 
      server_address, 
      username, 
      password, 
      port, 
      encryption, 
      authentication_required,
      is_active
    } = req.body;

    // Validate required fields
    if (!server_address || !username || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Server address, username, and password are required' }
      });
    }

    const [result] = await db.query(
      `INSERT INTO smtp_settings 
        (server_address, username, password, port, encryption, authentication_required, is_active) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        server_address, 
        username, 
        password, 
        port || 465, 
        encryption || 'SSL', 
        authentication_required !== false,
        is_active !== false
      ]
    );

    res.status(201).json({
      success: true,
      message: 'SMTP configuration created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error creating SMTP settings:', error);
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Delete SMTP Configuration
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if settings exist
    const [existing] = await db.query('SELECT id FROM smtp_settings WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'SMTP configuration not found' }
      });
    }

    await db.query('DELETE FROM smtp_settings WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'SMTP configuration deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting SMTP settings:', error);
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Toggle SMTP Active Status (Connect/Disconnect)
router.patch('/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if settings exist
    const [existing] = await db.query('SELECT id, is_active FROM smtp_settings WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'SMTP configuration not found' }
      });
    }

    const newStatus = !existing[0].is_active;
    await db.query('UPDATE smtp_settings SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newStatus, id]);

    res.json({
      success: true,
      message: newStatus ? 'SMTP connected successfully' : 'SMTP disconnected successfully',
      data: { is_active: newStatus }
    });
  } catch (error) {
    console.error('Error toggling SMTP status:', error);
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Create or Update SMTP Settings
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { 
      server_address, 
      username, 
      password, 
      port, 
      encryption, 
      authentication_required 
    } = req.body;

    // Validate required fields
    if (!server_address || !username || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Server address, username, and password are required' }
      });
    }

    // Check if settings already exist
    const [existing] = await db.query('SELECT id FROM smtp_settings LIMIT 1');

    if (existing.length > 0) {
      // Update existing settings
      await db.query(
        `UPDATE smtp_settings SET 
          server_address = ?, 
          username = ?, 
          password = ?, 
          port = ?, 
          encryption = ?, 
          authentication_required = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
          server_address, 
          username, 
          password, 
          port || 465, 
          encryption || 'SSL', 
          authentication_required !== false,
          existing[0].id
        ]
      );

      res.json({
        success: true,
        message: 'SMTP settings updated successfully'
      });
    } else {
      // Create new settings
      const [result] = await db.query(
        `INSERT INTO smtp_settings 
          (server_address, username, password, port, encryption, authentication_required, is_active) 
        VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
        [
          server_address, 
          username, 
          password, 
          port || 465, 
          encryption || 'SSL', 
          authentication_required !== false
        ]
      );

      res.status(201).json({
        success: true,
        message: 'SMTP settings created successfully',
        data: { id: result.insertId }
      });
    }
  } catch (error) {
    console.error('Error saving SMTP settings:', error);
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Update SMTP Settings
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      server_address, 
      username, 
      password, 
      port, 
      encryption, 
      authentication_required,
      is_active
    } = req.body;

    // Check if settings exist
    const [existing] = await db.query('SELECT id FROM smtp_settings WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'SMTP settings not found' }
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (server_address !== undefined) {
      updates.push('server_address = ?');
      values.push(server_address);
    }
    if (username !== undefined) {
      updates.push('username = ?');
      values.push(username);
    }
    if (password !== undefined) {
      updates.push('password = ?');
      values.push(password);
    }
    if (port !== undefined) {
      updates.push('port = ?');
      values.push(port);
    }
    if (encryption !== undefined) {
      updates.push('encryption = ?');
      values.push(encryption);
    }
    if (authentication_required !== undefined) {
      updates.push('authentication_required = ?');
      values.push(authentication_required);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'No fields to update' }
      });
    }

    values.push(id);

    await db.query(
      `UPDATE smtp_settings SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'SMTP settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating SMTP settings:', error);
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Test SMTP Connection
router.post('/test', authenticateToken, async (req, res) => {
  try {
    const { 
      server_address, 
      username, 
      password, 
      port, 
      encryption 
    } = req.body;

    // Validate required fields
    if (!server_address || !username || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required SMTP configuration' }
      });
    }

    // Create transporter with provided settings
    const transporter = nodemailer.createTransport({
      host: server_address,
      port: parseInt(port) || 465,
      secure: encryption === 'SSL' || (parseInt(port) === 465),
      auth: {
        user: username,
        pass: password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection configuration
    await transporter.verify();

    res.json({
      success: true,
      message: 'SMTP connection successful'
    });
  } catch (error) {
    console.error('SMTP Connection Test Error:', error);
    res.status(400).json({ 
      success: false, 
      error: { 
        message: 'SMTP connection failed: ' + (error.message || 'Unknown error')
      } 
    });
  }
});

module.exports = router;
