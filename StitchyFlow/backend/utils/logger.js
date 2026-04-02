/**
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 *
 * Logger utility — writes to system_logs and audit_logs tables
 */

const db = require('../config/database');

/**
 * Write a system log entry
 * @param {'info'|'warn'|'error'|'debug'} level
 * @param {string} message
 * @param {string} source  - file/module name
 * @param {object} meta    - optional extra data
 */
async function systemLog(level = 'info', message, source = '', meta = null) {
  try {
    await db.query(
      'INSERT INTO system_logs (level, message, source, meta) VALUES (?, ?, ?, ?)',
      [level, message, source, meta ? JSON.stringify(meta) : null]
    );
  } catch (_) {
    // never crash the app due to logging failure
  }
}

/**
 * Write an audit log entry
 * @param {object} opts
 */
async function auditLog({ userId = null, userName = null, action, tableName = null, recordId = null, description = null, ipAddress = null, userAgent = null }) {
  try {
    await db.query(
      `INSERT INTO audit_logs
        (user_id, action, entity_type, entity_id, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, action, tableName, recordId, ipAddress, userAgent]
    );
  } catch (_) {
    // never crash the app due to logging failure
  }
}

module.exports = { systemLog, auditLog };
