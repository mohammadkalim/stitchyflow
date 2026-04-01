/**
 * AI Error Handling System - Routes
 * Auto-captures, analyzes, and suggests fixes for frontend & backend errors
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

// ─── AI Analysis Engine ───────────────────────────────────────────────────────
// Rule-based AI that analyzes errors and suggests fixes without external API
function aiAnalyzeError(error) {
  const msg = (error.message || '').toLowerCase();
  const stack = (error.stack_trace || '').toLowerCase();
  const source = (error.source || '').toLowerCase();
  const statusCode = error.status_code || 0;

  let severity = 'medium';
  let category = 'Unknown';
  let aiSuggestion = 'Review the error details and check related code.';
  let autoFixable = false;
  let fixSteps = [];

  // ── HTTP / API Errors ──
  if (statusCode === 401 || msg.includes('unauthorized') || msg.includes('invalid token')) {
    category = 'Authentication';
    severity = 'high';
    aiSuggestion = 'JWT token is missing or expired. User needs to re-authenticate.';
    autoFixable = true;
    fixSteps = ['Clear localStorage adminToken', 'Redirect user to /login', 'Issue fresh JWT on re-login'];
  } else if (statusCode === 403 || msg.includes('forbidden') || msg.includes('access denied')) {
    category = 'Authorization';
    severity = 'high';
    aiSuggestion = 'User lacks permission for this resource. Verify role-based access control.';
    fixSteps = ['Check user role in JWT payload', 'Verify authorizeRoles middleware', 'Confirm user has required role in DB'];
  } else if (statusCode === 404 || msg.includes('not found') || msg.includes('cannot get')) {
    category = 'Not Found';
    severity = 'low';
    aiSuggestion = 'Resource or route does not exist. Check API endpoint URL and route registration.';
    fixSteps = ['Verify route is registered in server.js', 'Check URL spelling in frontend api call', 'Confirm record exists in database'];
  } else if (statusCode === 429 || msg.includes('too many requests') || msg.includes('rate limit')) {
    category = 'Rate Limiting';
    severity = 'medium';
    aiSuggestion = 'Too many requests from this client. Implement request throttling on frontend.';
    fixSteps = ['Add debounce to API calls', 'Implement exponential backoff retry', 'Review rate limit config'];
  } else if (statusCode >= 500 || msg.includes('internal server') || msg.includes('econnrefused')) {
    category = 'Server Error';
    severity = 'critical';
    aiSuggestion = 'Backend server crashed or is unreachable. Check server logs immediately.';
    fixSteps = ['Check backend process is running on port 5000', 'Review server.log for crash details', 'Verify database connection'];
  }
  // ── Database Errors ──
  else if (msg.includes('er_dup_entry') || msg.includes('duplicate entry') || msg.includes('unique constraint')) {
    category = 'Database - Duplicate';
    severity = 'medium';
    aiSuggestion = 'Duplicate key violation. A record with this value already exists in the database.';
    fixSteps = ['Check for existing record before insert', 'Use INSERT IGNORE or ON DUPLICATE KEY UPDATE', 'Validate uniqueness on frontend before submit'];
  } else if (msg.includes('er_no_such_table') || msg.includes('table') && msg.includes("doesn't exist")) {
    category = 'Database - Missing Table';
    severity = 'critical';
    aiSuggestion = 'Database table does not exist. Run table initialization or migration.';
    autoFixable = true;
    fixSteps = ['Run CREATE TABLE IF NOT EXISTS migration', 'Restart backend to trigger auto-init', 'Check DB_NAME in .env matches actual database'];
  } else if (msg.includes('econnrefused') || msg.includes('connect econnrefused') || msg.includes('enotfound')) {
    category = 'Database - Connection';
    severity = 'critical';
    aiSuggestion = 'Cannot connect to MySQL. Database server may be down or credentials are wrong.';
    fixSteps = ['Verify MySQL is running on port 3306', 'Check DB_USER and DB_PASSWORD in .env', 'Test connection via phpMyAdmin'];
  } else if (msg.includes('er_bad_field_error') || msg.includes('unknown column')) {
    category = 'Database - Schema';
    severity = 'high';
    aiSuggestion = 'Query references a column that does not exist in the table. Schema mismatch detected.';
    fixSteps = ['Run DESCRIBE table_name to check columns', 'Update query to match actual schema', 'Add missing column via ALTER TABLE'];
  }
  // ── Frontend / React Errors ──
  else if (msg.includes('cannot read') || msg.includes('undefined') || msg.includes('null')) {
    category = 'Frontend - Null Reference';
    severity = 'medium';
    aiSuggestion = 'Attempting to access property of null/undefined. Add null checks or optional chaining.';
    fixSteps = ['Use optional chaining: obj?.property', 'Add conditional rendering: {data && <Component />}', 'Initialize state with safe default values'];
  } else if (msg.includes('network error') || msg.includes('cors') || msg.includes('cross-origin')) {
    category = 'CORS / Network';
    severity = 'high';
    aiSuggestion = 'CORS policy blocking request. Verify backend CORS config allows the frontend origin.';
    fixSteps = ['Add http://localhost:4000 to CORS origins in server.js', 'Check ADMIN_URL in .env', 'Ensure credentials: true in CORS config'];
  } else if (msg.includes('syntaxerror') || msg.includes('unexpected token') || msg.includes('json')) {
    category = 'Parse Error';
    severity = 'medium';
    aiSuggestion = 'Invalid JSON response received. Backend may be returning HTML error page instead of JSON.';
    fixSteps = ['Check backend is returning Content-Type: application/json', 'Verify API endpoint exists and returns valid JSON', 'Check for proxy configuration issues'];
  } else if (msg.includes('memory') || msg.includes('heap') || msg.includes('maximum call stack')) {
    category = 'Performance - Memory';
    severity = 'critical';
    aiSuggestion = 'Memory leak or infinite recursion detected. Review component lifecycle and recursive calls.';
    fixSteps = ['Check useEffect dependencies array', 'Look for infinite re-render loops', 'Profile memory usage in DevTools'];
  } else if (source === 'frontend' && (msg.includes('chunk') || msg.includes('loading'))) {
    category = 'Frontend - Build';
    severity = 'low';
    aiSuggestion = 'Code splitting chunk failed to load. Usually a network issue or stale cache.';
    fixSteps = ['Hard refresh browser (Ctrl+Shift+R)', 'Clear browser cache', 'Rebuild frontend with npm run build'];
  }

  // Determine severity from keywords if not already set
  if (severity === 'medium') {
    if (msg.includes('critical') || msg.includes('crash') || msg.includes('fatal')) severity = 'critical';
    else if (msg.includes('warning') || msg.includes('deprecated')) severity = 'low';
  }

  return { category, severity, aiSuggestion, autoFixable, fixSteps };
}

// ─── Table Init ───────────────────────────────────────────────────────────────
async function initTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS ai_error_logs (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      source        ENUM('frontend','backend','database') NOT NULL DEFAULT 'frontend',
      error_type    VARCHAR(120),
      message       TEXT NOT NULL,
      stack_trace   TEXT,
      url           VARCHAR(500),
      user_agent    VARCHAR(500),
      ip_address    VARCHAR(45),
      status_code   INT DEFAULT 0,
      category      VARCHAR(120),
      severity      ENUM('low','medium','high','critical') DEFAULT 'medium',
      ai_suggestion TEXT,
      fix_steps     JSON,
      auto_fixable  TINYINT(1) DEFAULT 0,
      is_resolved   TINYINT(1) DEFAULT 0,
      resolved_at   DATETIME NULL,
      resolved_by   VARCHAR(120),
      occurrence_count INT DEFAULT 1,
      last_seen_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_severity (severity),
      INDEX idx_source (source),
      INDEX idx_resolved (is_resolved),
      INDEX idx_created (created_at)
    )
  `);
}

const initPromise = initTable().catch((e) =>
  console.error('AI Error table init failed:', e.message)
);

async function ensureInit(req, res, next) {
  try { await initPromise; next(); }
  catch (e) { res.status(500).json({ success: false, error: { message: 'AI Error module init failed' } }); }
}

router.use(ensureInit);

// ─── POST /api/v1/ai-errors/capture  (public — frontend calls this) ──────────
router.post('/capture', async (req, res) => {
  try {
    const {
      source = 'frontend', error_type, message, stack_trace,
      url, user_agent, status_code = 0
    } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: { message: 'message is required' } });
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
      || req.socket.remoteAddress || null;
    const ua = user_agent || req.headers['user-agent'] || null;

    // Run AI analysis
    const analysis = aiAnalyzeError({ message, stack_trace, source, status_code });

    // Check if same error already exists (dedup by message fingerprint)
    const fingerprint = message.substring(0, 200);
    const [existing] = await db.query(
      `SELECT id, occurrence_count FROM ai_error_logs
       WHERE message LIKE ? AND is_resolved = 0 LIMIT 1`,
      [`${fingerprint}%`]
    );

    if (existing.length > 0) {
      // Increment occurrence count
      await db.query(
        `UPDATE ai_error_logs
         SET occurrence_count = occurrence_count + 1, last_seen_at = NOW()
         WHERE id = ?`,
        [existing[0].id]
      );
      return res.json({ success: true, data: { id: existing[0].id, deduplicated: true } });
    }

    const [result] = await db.query(
      `INSERT INTO ai_error_logs
        (source, error_type, message, stack_trace, url, user_agent, ip_address,
         status_code, category, severity, ai_suggestion, fix_steps, auto_fixable)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        source, error_type || null, message,
        stack_trace || null, url || null, ua, ip,
        status_code, analysis.category, analysis.severity,
        analysis.aiSuggestion, JSON.stringify(analysis.fixSteps),
        analysis.autoFixable ? 1 : 0
      ]
    );

    res.status(201).json({ success: true, data: { id: result.insertId, analysis } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// ─── GET /api/v1/ai-errors  (admin — list all errors) ────────────────────────
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { severity, source, resolved, limit = 200 } = req.query;
    let where = [];
    let params = [];

    if (severity) { where.push('severity = ?'); params.push(severity); }
    if (source)   { where.push('source = ?');   params.push(source); }
    if (resolved !== undefined) {
      where.push('is_resolved = ?');
      params.push(resolved === 'true' ? 1 : 0);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [rows] = await db.query(
      `SELECT * FROM ai_error_logs ${whereClause}
       ORDER BY
         FIELD(severity,'critical','high','medium','low'),
         last_seen_at DESC
       LIMIT ?`,
      [...params, parseInt(limit)]
    );

    // Parse fix_steps JSON
    const data = rows.map(r => ({
      ...r,
      fix_steps: (() => { try { return JSON.parse(r.fix_steps); } catch { return []; } })()
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// ─── GET /api/v1/ai-errors/stats ─────────────────────────────────────────────
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const [[totals]] = await db.query(`
      SELECT
        COUNT(*) AS total,
        SUM(severity = 'critical') AS critical,
        SUM(severity = 'high')     AS high,
        SUM(severity = 'medium')   AS medium,
        SUM(severity = 'low')      AS low,
        SUM(is_resolved = 1)       AS resolved,
        SUM(is_resolved = 0)       AS unresolved,
        SUM(auto_fixable = 1)      AS auto_fixable
      FROM ai_error_logs
    `);

    const [bySource] = await db.query(`
      SELECT source, COUNT(*) AS count
      FROM ai_error_logs GROUP BY source
    `);

    const [byCategory] = await db.query(`
      SELECT category, COUNT(*) AS count
      FROM ai_error_logs
      WHERE is_resolved = 0
      GROUP BY category ORDER BY count DESC LIMIT 10
    `);

    const [trend] = await db.query(`
      SELECT DATE(created_at) AS date, COUNT(*) AS count
      FROM ai_error_logs
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at) ORDER BY date ASC
    `);

    res.json({ success: true, data: { totals, bySource, byCategory, trend } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// ─── PUT /api/v1/ai-errors/:id/resolve ───────────────────────────────────────
router.put('/:id/resolve', authenticateToken, async (req, res) => {
  try {
    const { resolved_by = 'Admin' } = req.body;
    const [result] = await db.query(
      `UPDATE ai_error_logs
       SET is_resolved = 1, resolved_at = NOW(), resolved_by = ?
       WHERE id = ?`,
      [resolved_by, req.params.id]
    );
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, error: { message: 'Error log not found' } });
    }
    res.json({ success: true, message: 'Marked as resolved' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// ─── PUT /api/v1/ai-errors/:id/reanalyze ─────────────────────────────────────
router.put('/:id/reanalyze', authenticateToken, async (req, res) => {
  try {
    const [[row]] = await db.query('SELECT * FROM ai_error_logs WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ success: false, error: { message: 'Not found' } });

    const analysis = aiAnalyzeError({
      message: row.message,
      stack_trace: row.stack_trace,
      source: row.source,
      status_code: row.status_code
    });

    await db.query(
      `UPDATE ai_error_logs
       SET category = ?, severity = ?, ai_suggestion = ?, fix_steps = ?, auto_fixable = ?
       WHERE id = ?`,
      [
        analysis.category, analysis.severity, analysis.aiSuggestion,
        JSON.stringify(analysis.fixSteps), analysis.autoFixable ? 1 : 0,
        req.params.id
      ]
    );

    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// ─── DELETE /api/v1/ai-errors/:id ────────────────────────────────────────────
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM ai_error_logs WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, error: { message: 'Not found' } });
    }
    res.json({ success: true, message: 'Error log deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// ─── DELETE /api/v1/ai-errors/bulk/resolved ──────────────────────────────────
router.delete('/bulk/resolved', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM ai_error_logs WHERE is_resolved = 1');
    res.json({ success: true, message: `Deleted ${result.affectedRows} resolved errors` });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

module.exports = router;
