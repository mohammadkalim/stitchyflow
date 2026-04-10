const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const db = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const chatUploadRoot = path.join(__dirname, '..', 'uploads', 'chat');
fs.mkdirSync(chatUploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: chatUploadRoot,
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    const safeName = path.basename(file.originalname, fileExt).replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}-${safeName}${fileExt}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WEBP, GIF and PDF attachments are allowed')); 
    }
  }
});

const isTailorRole = (role) => ['tailor', 'business_owner'].includes(String(role).toLowerCase());

const ensureConversation = async (customerId, tailorId) => {
  const [existing] = await db.query(
    'SELECT * FROM conversations WHERE customer_id = ? AND tailor_id = ? LIMIT 1',
    [customerId, tailorId]
  );

  if (existing.length) {
    return existing[0];
  }

  const [result] = await db.query(
    'INSERT INTO conversations (customer_id, tailor_id, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
    [customerId, tailorId]
  );

  const [rows] = await db.query('SELECT * FROM conversations WHERE conversation_id = ?', [result.insertId]);
  return rows[0];
};

const verifyFollowRelationship = async (customerId, tailorId) => {
  const [rows] = await db.query(
    'SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ? LIMIT 1',
    [customerId, tailorId]
  );
  return rows.length > 0;
};

const getConversationRoom = (conversationId) => `conversation_${conversationId}`;

const broadcastConversationUpdate = async (req, conversationId) => {
  const io = req.app.get('io');
  if (!io) return;

  const [conversationRows] = await db.query('SELECT unread_count FROM conversations WHERE conversation_id = ?', [conversationId]);
  const conversation = conversationRows[0] || {};

  io.to(getConversationRoom(conversationId)).emit('conversation_updated', {
    conversation_id: conversationId,
    unread_count: conversation.unread_count || 0
  });
};

router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;
    let query;
    let params = [];

    if (req.user.role === 'admin') {
      query = `SELECT c.*, 
        CONCAT(cu.first_name, ' ', cu.last_name) AS customer_name,
        CONCAT(tu.first_name, ' ', tu.last_name) AS tailor_name
      FROM conversations c
      JOIN users cu ON cu.user_id = c.customer_id
      JOIN users tu ON tu.user_id = c.tailor_id
      ORDER BY c.updated_at DESC`;
    } else if (String(role).toLowerCase() === 'customer') {
      query = `SELECT c.*, 
        CONCAT(cu.first_name, ' ', cu.last_name) AS customer_name,
        CONCAT(tu.first_name, ' ', tu.last_name) AS tailor_name
      FROM conversations c
      JOIN users cu ON cu.user_id = c.customer_id
      JOIN users tu ON tu.user_id = c.tailor_id
      WHERE c.customer_id = ?
      ORDER BY c.updated_at DESC`;
      params = [userId];
    } else if (isTailorRole(role)) {
      query = `SELECT c.*, 
        CONCAT(cu.first_name, ' ', cu.last_name) AS customer_name,
        CONCAT(tu.first_name, ' ', tu.last_name) AS tailor_name
      FROM conversations c
      JOIN users cu ON cu.user_id = c.customer_id
      JOIN users tu ON tu.user_id = c.tailor_id
      WHERE c.tailor_id = ?
      ORDER BY c.updated_at DESC`;
      params = [userId];
    } else {
      return res.status(403).json({ success: false, error: { message: 'Chat access is not allowed for this role' } });
    }

    const [conversations] = await db.query(query, params);
    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.get('/conversations/:conversationId/messages', authenticateToken, async (req, res) => {
  try {
    const conversationId = Number(req.params.conversationId);
    const { userId, role } = req.user;

    const [conversations] = await db.query('SELECT * FROM conversations WHERE conversation_id = ? LIMIT 1', [conversationId]);
    if (!conversations.length) {
      return res.status(404).json({ success: false, error: { message: 'Conversation not found' } });
    }

    const conversation = conversations[0];
    const isParticipant = [conversation.customer_id, conversation.tailor_id].includes(userId);
    if (!isParticipant && role !== 'admin') {
      return res.status(403).json({ success: false, error: { message: 'Access denied' } });
    }

    const [messages] = await db.query(
      `SELECT m.*, CONCAT(u.first_name, ' ', u.last_name) AS sender_name, u.role AS sender_role
       FROM messages m
       JOIN users u ON u.user_id = m.sender_id
       WHERE m.conversation_id = ?
       ORDER BY m.created_at ASC`,
      [conversationId]
    );

    res.json({ success: true, data: { conversation, messages } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.post('/conversations', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;
    const isCustomer = String(role).toLowerCase() === 'customer';
    const isTailor = isTailorRole(role);
    const { tailorId, customerId } = req.body;
    let customer = null;
    let tailor = null;

    if (isCustomer) {
      if (!tailorId) {
        return res.status(400).json({ success: false, error: { message: 'tailorId is required' } });
      }
      customer = userId;
      tailor = Number(tailorId);
      const canChat = await verifyFollowRelationship(customer, tailor);
      if (!canChat) {
        return res.status(403).json({ success: false, error: { message: 'You must follow the tailor before you can chat.' } });
      }
    } else if (isTailor) {
      if (!customerId) {
        return res.status(400).json({ success: false, error: { message: 'customerId is required' } });
      }
      customer = Number(customerId);
      tailor = userId;
    } else {
      return res.status(403).json({ success: false, error: { message: 'Only customers and tailors can create conversations' } });
    }

    const conversation = await ensureConversation(customer, tailor);
    res.json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.post('/messages', authenticateToken, upload.single('attachment'), async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { conversationId, text } = req.body;
    if (!conversationId) {
      return res.status(400).json({ success: false, error: { message: 'conversationId is required' } });
    }

    const [conversations] = await db.query('SELECT * FROM conversations WHERE conversation_id = ? LIMIT 1', [conversationId]);
    if (!conversations.length) {
      return res.status(404).json({ success: false, error: { message: 'Conversation not found' } });
    }

    const conversation = conversations[0];
    const isParticipant = [conversation.customer_id, conversation.tailor_id].includes(userId);
    if (!isParticipant) {
      return res.status(403).json({ success: false, error: { message: 'Access denied' } });
    }

    let messageType = 'text';
    let fileUrl = null;
    let body = text || null;

    if (req.file) {
      const filePath = req.file.path;
      const publicUrl = `/uploads/chat/${req.file.filename}`;
      fileUrl = publicUrl;

      if (req.file.mimetype.startsWith('image/')) {
        const metadata = await sharp(filePath).metadata();
        if (metadata.width > 1024 || metadata.height > 1024) {
          await sharp(filePath)
            .resize({ width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true })
            .toFile(`${filePath}.tmp`);
          fs.renameSync(`${filePath}.tmp`, filePath);
        }
        messageType = 'image';
      } else if (req.file.mimetype === 'application/pdf') {
        messageType = 'pdf';
      }

      if (!body) {
        body = `${messageType.toUpperCase()} attachment`;
      }
    }

    if (!body && !fileUrl) {
      return res.status(400).json({ success: false, error: { message: 'Message text or attachment is required' } });
    }

    const [result] = await db.query(
      `INSERT INTO messages (conversation_id, sender_id, message_type, body, file_url, is_read)
       VALUES (?, ?, ?, ?, ?, false)`,
      [conversationId, userId, messageType, body, fileUrl]
    );

    await db.query(
      `UPDATE conversations SET last_message = ?, last_message_type = ?, updated_at = CURRENT_TIMESTAMP, unread_count = unread_count + 1
       WHERE conversation_id = ?`,
      [body, messageType, conversationId]
    );

    const [messageRows] = await db.query(
      `SELECT m.*, CONCAT(u.first_name, ' ', u.last_name) AS sender_name, u.role AS sender_role
       FROM messages m
       JOIN users u ON u.user_id = m.sender_id
       WHERE m.id = ?`,
      [result.insertId]
    );

    const newMessage = messageRows[0];
    const io = req.app.get('io');
    if (io) {
      io.to(getConversationRoom(conversationId)).emit('new_message', newMessage);
      io.emit('conversation_update', { conversation_id: conversationId, unread_count: conversation.unread_count + 1 });
    }

    res.json({ success: true, data: newMessage });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ success: false, error: { message: error.message } });
    }
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.patch('/conversations/:conversationId/read', authenticateToken, async (req, res) => {
  try {
    const conversationId = Number(req.params.conversationId);
    const { userId } = req.user;
    const [conversations] = await db.query('SELECT * FROM conversations WHERE conversation_id = ? LIMIT 1', [conversationId]);
    if (!conversations.length) {
      return res.status(404).json({ success: false, error: { message: 'Conversation not found' } });
    }

    const conversation = conversations[0];
    if (![conversation.customer_id, conversation.tailor_id].includes(userId)) {
      return res.status(403).json({ success: false, error: { message: 'Access denied' } });
    }

    await db.query(
      'UPDATE messages SET is_read = true WHERE conversation_id = ? AND sender_id != ?',
      [conversationId, userId]
    );

    const [unreadRows] = await db.query(
      'SELECT COUNT(*) AS unread FROM messages WHERE conversation_id = ? AND is_read = false',
      [conversationId]
    );
    const unreadCount = unreadRows[0]?.unread || 0;

    await db.query('UPDATE conversations SET unread_count = ? WHERE conversation_id = ?', [unreadCount, conversationId]);
    await broadcastConversationUpdate(req, conversationId);

    res.json({ success: true, data: { conversationId, unreadCount } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;
    let query;
    let params;

    if (req.user.role === 'admin') {
      query = 'SELECT SUM(unread_count) AS total_unread FROM conversations';
      params = [];
    } else if (String(role).toLowerCase() === 'customer') {
      query = 'SELECT SUM(unread_count) AS total_unread FROM conversations WHERE customer_id = ?';
      params = [userId];
    } else if (isTailorRole(role)) {
      query = 'SELECT SUM(unread_count) AS total_unread FROM conversations WHERE tailor_id = ?';
      params = [userId];
    } else {
      return res.status(403).json({ success: false, error: { message: 'Access denied' } });
    }

    const [rows] = await db.query(query, params);
    res.json({ success: true, data: { total_unread: rows[0]?.total_unread || 0 } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.delete('/conversations/:conversationId', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const conversationId = Number(req.params.conversationId);
    await db.query('DELETE FROM conversations WHERE conversation_id = ?', [conversationId]);
    res.json({ success: true, data: { conversationId } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.delete('/messages/:messageId', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const messageId = Number(req.params.messageId);
    await db.query('DELETE FROM messages WHERE id = ?', [messageId]);
    res.json({ success: true, data: { messageId } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

module.exports = router;
