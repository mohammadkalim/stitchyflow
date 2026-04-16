/**
 * Per-tailor business services (/api/v1/business/services).
 * Standalone module so server.js can register routes with a plain require (avoids 404s when
 * handlers are only attached to the business router export object).
 */
const db = require('../config/database');

function isTailorUser(req) {
  return ['tailor', 'business_owner'].includes(String(req.user?.role || '').toLowerCase());
}

async function writeServicesLog(req, { pageName, actionType, entityId = null, description }) {
  const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || null;
  await db.query(
    `INSERT INTO business_tailor_logs 
      (page_name, action_type, entity_id, description, actor_user_id, actor_role, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      pageName,
      actionType,
      entityId,
      description,
      req.user?.userId || null,
      req.user?.role || null,
      ipAddress,
      req.headers['user-agent'] || null,
    ]
  );
}

async function listBusinessTailorServices(req, res) {
  try {
    let query = `
      SELECT s.*, sh.shop_name
      FROM business_tailor_services s
      LEFT JOIN business_tailor_shops sh ON sh.shop_id = s.shop_id
    `;
    const params = [];
    if (isTailorUser(req)) {
      query += ' WHERE s.owner_user_id = ?';
      params.push(req.user.userId);
    }
    query += ' ORDER BY s.business_service_id DESC';
    const [rows] = await db.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
}

async function createBusinessTailorService(req, res) {
  try {
    const userId = req.user.userId;
    const tailor = isTailorUser(req);
    const shopId = Number(req.body.shop_id);
    if (!Number.isFinite(shopId) || shopId < 1) {
      return res.status(400).json({ success: false, error: { message: 'Invalid shop_id' } });
    }
    if (tailor) {
      const [rows] = await db.query(
        'SELECT shop_id FROM business_tailor_shops WHERE shop_id = ? AND owner_user_id = ? LIMIT 1',
        [shopId, userId]
      );
      if (!rows.length) {
        return res.status(403).json({ success: false, error: { message: 'You can only add services to your own shop.' } });
      }
    }
    const garment_type = req.body.garment_type;
    if (!garment_type || !String(garment_type).trim()) {
      return res.status(400).json({ success: false, error: { message: 'Missing required fields: garment_type' } });
    }
    const owner_user_id = tailor ? userId : Number(req.body.owner_user_id) || userId;
    const [result] = await db.query(
      `INSERT INTO business_tailor_services (
        owner_user_id, shop_id, garment_type, description, price_min, price_max, delivery_time, service_status, is_active
      ) VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        owner_user_id,
        shopId,
        String(garment_type).trim(),
        req.body.description ?? null,
        req.body.price_min ?? 0,
        req.body.price_max ?? 0,
        req.body.delivery_time ?? null,
        req.body.service_status || 'available',
        req.body.is_active !== undefined ? req.body.is_active : 1,
      ]
    );
    await writeServicesLog(req, {
      pageName: 'services',
      actionType: 'CREATE',
      entityId: result.insertId,
      description: 'services record created',
    });
    res.status(201).json({ success: true, data: { id: result.insertId, business_service_id: result.insertId } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
}

async function updateBusinessTailorService(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id) || id < 1) {
      return res.status(400).json({ success: false, error: { message: 'Invalid id' } });
    }
    const userId = req.user.userId;
    const tailor = isTailorUser(req);
    const payload = {};
    const allowed = ['shop_id', 'garment_type', 'description', 'price_min', 'price_max', 'delivery_time', 'service_status', 'is_active'];
    for (const k of allowed) {
      if (req.body[k] !== undefined) payload[k] = req.body[k];
    }
    if (!Object.keys(payload).length) {
      return res.status(400).json({ success: false, error: { message: 'No valid fields provided for update' } });
    }
    if (payload.shop_id !== undefined) {
      const sid = Number(payload.shop_id);
      if (!Number.isFinite(sid) || sid < 1) {
        return res.status(400).json({ success: false, error: { message: 'Invalid shop_id' } });
      }
      if (tailor) {
        const [rows] = await db.query(
          'SELECT shop_id FROM business_tailor_shops WHERE shop_id = ? AND owner_user_id = ? LIMIT 1',
          [sid, userId]
        );
        if (!rows.length) {
          return res.status(403).json({ success: false, error: { message: 'You can only assign services to your own shop.' } });
        }
      }
      payload.shop_id = sid;
    }
    if (payload.garment_type !== undefined) payload.garment_type = String(payload.garment_type).trim();
    const fields = Object.keys(payload);
    const setClause = fields.map((f) => `${f} = ?`).join(', ');
    const values = fields.map((f) => payload[f]);
    values.push(id);
    let whereSql = 'business_service_id = ?';
    if (tailor) {
      whereSql += ' AND owner_user_id = ?';
      values.push(userId);
    }
    const [result] = await db.query(
      `UPDATE business_tailor_services SET ${setClause}, updated_at = NOW() WHERE ${whereSql}`,
      values
    );
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, error: { message: 'Record not found' } });
    }
    await writeServicesLog(req, {
      pageName: 'services',
      actionType: 'UPDATE',
      entityId: id,
      description: 'services record updated',
    });
    res.json({ success: true, message: 'Record updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
}

async function deleteBusinessTailorService(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id) || id < 1) {
      return res.status(400).json({ success: false, error: { message: 'Invalid id' } });
    }
    const userId = req.user.userId;
    const tailor = isTailorUser(req);
    let q = 'DELETE FROM business_tailor_services WHERE business_service_id = ?';
    const p = [id];
    if (tailor) {
      q += ' AND owner_user_id = ?';
      p.push(userId);
    }
    const [result] = await db.query(q, p);
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, error: { message: 'Record not found' } });
    }
    await writeServicesLog(req, {
      pageName: 'services',
      actionType: 'DELETE',
      entityId: id,
      description: 'services record deleted',
    });
    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
}

module.exports = {
  listBusinessTailorServices,
  createBusinessTailorService,
  updateBusinessTailorService,
  deleteBusinessTailorService,
};
