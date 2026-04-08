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

async function ensureSMTPDefaultColumn() {
  const [columns] = await db.query("SHOW COLUMNS FROM smtp_settings LIKE 'is_default'");
  if (columns.length === 0) {
    await db.query("ALTER TABLE smtp_settings ADD COLUMN is_default BOOLEAN NOT NULL DEFAULT FALSE");
    await db.query(`
      UPDATE smtp_settings
      SET is_default = TRUE
      WHERE id = (
        SELECT id FROM (
          SELECT id
          FROM smtp_settings
          WHERE is_active = TRUE
          ORDER BY updated_at DESC, id DESC
          LIMIT 1
        ) AS fallback
      )
    `);
  }
}

async function getDefaultSMTPSettings() {
  await ensureSMTPDefaultColumn();
  const [settings] = await db.query(`
    SELECT *
    FROM smtp_settings
    WHERE is_default = TRUE
    LIMIT 1
  `);

  if (settings.length > 0) {
    return settings[0];
  }

  const [fallback] = await db.query(`
    SELECT *
    FROM smtp_settings
    WHERE is_active = TRUE
    ORDER BY updated_at DESC, id DESC
    LIMIT 1
  `);

  if (fallback.length > 0) {
    await db.query('UPDATE smtp_settings SET is_default = FALSE');
    await db.query('UPDATE smtp_settings SET is_default = TRUE WHERE id = ?', [fallback[0].id]);
    return { ...fallback[0], is_default: true };
  }

  return null;
}

// Get SMTP Settings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const settings = await getDefaultSMTPSettings();
    if (!settings) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'SMTP settings not found' } 
      });
    }

    // Remove password from response for security
    const { password, ...safeSettings } = settings;
    
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
    const settings = await getDefaultSMTPSettings();
    if (!settings) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'SMTP settings not found' } 
      });
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching full SMTP settings:', error);
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Get All SMTP Configurations
router.get('/all', authenticateToken, async (req, res) => {
  try {
    await ensureSMTPDefaultColumn();
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
    await ensureSMTPDefaultColumn();
    const { 
      server_address, 
      username, 
      password, 
      port, 
      encryption, 
      authentication_required,
      is_active,
      is_default
    } = req.body;

    // Validate required fields
    if (!server_address || !username || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Server address, username, and password are required' }
      });
    }

    if (is_default === true) {
      await db.query('UPDATE smtp_settings SET is_default = FALSE');
    }

    const [result] = await db.query(
      `INSERT INTO smtp_settings 
        (server_address, username, password, port, encryption, authentication_required, is_active, is_default) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        server_address, 
        username, 
        password, 
        port || 465, 
        encryption || 'SSL', 
        authentication_required !== false,
        is_active !== false,
        is_default === true
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
    await ensureSMTPDefaultColumn();

    // Check if settings exist
    const [existing] = await db.query('SELECT id, is_default FROM smtp_settings WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'SMTP configuration not found' }
      });
    }

    await db.query('DELETE FROM smtp_settings WHERE id = ?', [id]);
    if (existing[0].is_default) {
      const [remaining] = await db.query('SELECT id FROM smtp_settings ORDER BY updated_at DESC, id DESC LIMIT 1');
      if (remaining.length > 0) {
        await db.query('UPDATE smtp_settings SET is_default = FALSE');
        await db.query('UPDATE smtp_settings SET is_default = TRUE WHERE id = ?', [remaining[0].id]);
      }
    }

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
    await ensureSMTPDefaultColumn();

    // Check if settings exist
    const [existing] = await db.query('SELECT id, is_active, is_default FROM smtp_settings WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'SMTP configuration not found' }
      });
    }

    const newStatus = !existing[0].is_active;
    await db.query('UPDATE smtp_settings SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newStatus, id]);
    if (!newStatus && existing[0].is_default) {
      await db.query('UPDATE smtp_settings SET is_default = FALSE WHERE id = ?', [id]);
      const [candidate] = await db.query('SELECT id FROM smtp_settings WHERE is_active = TRUE ORDER BY updated_at DESC, id DESC LIMIT 1');
      if (candidate.length > 0) {
        await db.query('UPDATE smtp_settings SET is_default = TRUE WHERE id = ?', [candidate[0].id]);
      }
    }

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
    await ensureSMTPDefaultColumn();
    const { 
      server_address, 
      username, 
      password, 
      port, 
      encryption, 
      authentication_required,
      is_default
    } = req.body;

    // Validate required fields
    if (!server_address || !username || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Server address, username, and password are required' }
      });
    }

    // Check if settings already exist
    const [existing] = await db.query('SELECT id FROM smtp_settings ORDER BY is_default DESC, updated_at DESC, id DESC LIMIT 1');

    if (existing.length > 0) {
      // Update existing settings
      if (is_default === true) {
        await db.query('UPDATE smtp_settings SET is_default = FALSE');
      }

      const shouldBeDefault = is_default !== false;
      await db.query(
        `UPDATE smtp_settings SET 
          server_address = ?, 
          username = ?, 
          password = ?, 
          port = ?, 
          encryption = ?, 
          authentication_required = ?,
          is_default = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
          server_address, 
          username, 
          password, 
          port || 465, 
          encryption || 'SSL', 
          authentication_required !== false,
          shouldBeDefault,
          existing[0].id
        ]
      );

      res.json({
        success: true,
        message: 'SMTP settings updated successfully'
      });
    } else {
      // Create new settings
      if (is_default === true) {
        await db.query('UPDATE smtp_settings SET is_default = FALSE');
      }

      const shouldBeDefault = is_default !== false;
      const [result] = await db.query(
        `INSERT INTO smtp_settings 
          (server_address, username, password, port, encryption, authentication_required, is_active, is_default) 
        VALUES (?, ?, ?, ?, ?, ?, TRUE, ?)`,
        [
          server_address, 
          username, 
          password, 
          port || 465, 
          encryption || 'SSL', 
          authentication_required !== false,
          shouldBeDefault
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
    await ensureSMTPDefaultColumn();
    const { 
      server_address, 
      username, 
      password, 
      port, 
      encryption, 
      authentication_required,
      is_active,
      is_default
    } = req.body;
    // Check if settings exist
    const [existing] = await db.query('SELECT id FROM smtp_settings WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'SMTP settings not found' }
      });
    }

    if (is_default === true) {
      await db.query('UPDATE smtp_settings SET is_default = FALSE');
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
    if (is_default !== undefined) {
      updates.push('is_default = ?');
      values.push(is_default);
    }
    if (is_active === false && is_default === true) {
      return res.status(400).json({
        success: false,
        error: { message: 'Default SMTP must remain active' }
      });
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

// Set Default SMTP Settings
router.patch('/:id/default', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await ensureSMTPDefaultColumn();
    const [existing] = await db.query('SELECT id, is_active FROM smtp_settings WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'SMTP settings not found' }
      });
    }

    if (!existing[0].is_active) {
      return res.status(400).json({
        success: false,
        error: { message: 'Only active SMTP can be set as default' }
      });
    }

    await db.query('UPDATE smtp_settings SET is_default = FALSE');
    await db.query('UPDATE smtp_settings SET is_default = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Default SMTP updated successfully'
    });
  } catch (error) {
    console.error('Error setting default SMTP:', error);
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

// Send Test Email using provided SMTP configuration
router.post('/test-email', authenticateToken, async (req, res) => {
  try {
    const {
      server_address,
      username,
      password,
      port,
      encryption,
      test_email
    } = req.body;

    if (!server_address || !username || !password || !test_email) {
      return res.json({
        success: false,
        error: { message: 'Server, username, password and test email are required' }
      });
    }

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

    await transporter.verify();

    await transporter.sendMail({
      from: `"StitchyFlow SMTP Test" <${username}>`,
      to: test_email,
      subject: 'SMTP Test Email - StitchyFlow',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; background: #f5f7fb;">
          <div style="background: #ffffff; border-radius: 12px; padding: 26px; border: 1px solid #e6ebf5;">
            <h2 style="margin: 0 0 14px; color: #1f2a44;">SMTP Test Successful</h2>
            <p style="margin: 0 0 10px; color: #42526b; line-height: 1.6;">
              This is a test email from StitchyFlow Admin Panel.
            </p>
            <p style="margin: 0 0 10px; color: #42526b; line-height: 1.6;">
              SMTP server: <strong>${server_address}</strong><br/>
              Port: <strong>${port || 465}</strong><br/>
              Encryption: <strong>${encryption || 'SSL'}</strong>
            </p>
            <p style="margin: 18px 0 0; font-size: 12px; color: #7b8799;">
              If you received this, your SMTP configuration is working.
            </p>
          </div>
        </div>
      `
    });

    res.json({
      success: true,
      message: `Test email sent successfully to ${test_email}`
    });
  } catch (error) {
    console.error('SMTP Test Email Error:', error);
    res.json({
      success: false,
      error: {
        message: 'SMTP test email failed: ' + (error.message || 'Unknown error')
      }
    });
  }
});

module.exports = router;
