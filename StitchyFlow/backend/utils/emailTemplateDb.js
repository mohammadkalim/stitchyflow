const db = require('../config/database');

async function ensureEmailTemplatesTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS email_templates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(64) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      subject VARCHAR(500) NOT NULL,
      body_html MEDIUMTEXT NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

function interpolate(template, vars) {
  if (!template) return '';
  let out = String(template);
  const map = vars && typeof vars === 'object' ? vars : {};
  out = out.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
    if (Object.prototype.hasOwnProperty.call(map, key)) return String(map[key] ?? '');
    return '';
  });
  return out;
}

/**
 * Returns { subject, html } from DB if an active row exists for slug; otherwise null (caller uses legacy HTML).
 */
async function getRenderedEmail(slug, vars = {}) {
  await ensureEmailTemplatesTable();
  await seedDefaultEmailTemplates();
  const [rows] = await db.query(
    'SELECT subject, body_html FROM email_templates WHERE slug = ? AND is_active = TRUE LIMIT 1',
    [slug]
  );
  if (!rows.length) return null;
  return {
    subject: interpolate(rows[0].subject, vars),
    html: interpolate(rows[0].body_html, vars)
  };
}

async function seedDefaultEmailTemplates() {
  await ensureEmailTemplatesTable();
  const defaults = [
    {
      slug: 'registration_verification',
      name: 'Registration verification code',
      description: 'Sent when a user registers. Placeholders: {{firstName}}, {{code}}, {{expireMinutes}}',
      subject: 'Your StitchyFlow Verification Code',
      body_html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
  <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #2563eb; margin: 0; font-size: 28px;">StitchyFlow</h1>
      <p style="color: #64748b; margin: 10px 0 0 0;">Your Verification Code</p>
    </div>
    <p style="color: #334155; font-size: 16px; line-height: 1.6;">Hi {{firstName}},</p>
    <p style="color: #334155; font-size: 16px; line-height: 1.6;">Thank you for creating an account with StitchyFlow. Please use the verification code below:</p>
    <div style="background: #eff6ff; border: 2px dashed #2563eb; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
      <span style="font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 8px;">{{code}}</span>
    </div>
    <p style="color: #64748b; font-size: 14px; text-align: center;">This code will expire in <strong>{{expireMinutes}} minutes</strong>.</p>
    <div style="border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 20px;">
      <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">If you did not request this code, please ignore this email.<br>&copy; 2026 StitchyFlow.</p>
    </div>
  </div>
</div>`
    },
    {
      slug: 'password_changed',
      name: 'Password changed notification',
      description: 'Sent after password is updated. Placeholders: {{firstName}}',
      subject: 'Your StitchyFlow Password Has Been Changed',
      body_html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
  <div style="background: white; border-radius: 12px; padding: 30px;">
    <h1 style="color: #2563eb; text-align: center;">StitchyFlow</h1>
    <p style="color: #334155; font-size: 16px;">Hi {{firstName}},</p>
    <p style="color: #334155; font-size: 16px;">This is to confirm that your StitchyFlow account password has been successfully changed.</p>
    <p style="color: #334155; font-size: 16px;">If you did not make this change, please contact support immediately.</p>
    <p style="color: #94a3b8; font-size: 12px; text-align: center;">&copy; 2026 StitchyFlow.</p>
  </div>
</div>`
    },
    {
      slug: 'tailor_approval_approved',
      name: 'Tailor shop approved',
      description: 'Placeholders: {{firstName}}, {{note}}, {{loginUrl}}',
      subject: 'Your StitchyFlow Shop is Approved!',
      body_html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
  <div style="background:#fff;border-radius:12px;padding:30px;">
    <h1 style="color:#2563eb;text-align:center;">StitchyFlow</h1>
    <h2 style="color:#15803d;">Congratulations, {{firstName}}!</h2>
    <p>Your Tailor Shop has been <strong>approved</strong>.</p>
    <p>{{note}}</p>
    <p style="text-align:center;"><a href="{{loginUrl}}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">Login</a></p>
    <p style="color:#94a3b8;font-size:12px;text-align:center;">&copy; 2026 StitchyFlow.</p>
  </div>
</div>`
    },
    {
      slug: 'tailor_approval_rejected',
      name: 'Tailor shop not approved',
      description: 'Placeholders: {{firstName}}, {{note}}',
      subject: 'StitchyFlow Account Update',
      body_html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
  <div style="background:#fff;border-radius:12px;padding:30px;">
    <h1 style="color:#2563eb;text-align:center;">StitchyFlow</h1>
    <p>Hi {{firstName}}, your Tailor Shop application was not approved at this time.</p>
    <p>{{note}}</p>
    <p style="color:#94a3b8;font-size:12px;text-align:center;">&copy; 2026 StitchyFlow.</p>
  </div>
</div>`
    }
  ];

  for (const d of defaults) {
    await db.query(
      `INSERT IGNORE INTO email_templates (slug, name, description, subject, body_html, is_active)
       VALUES (?, ?, ?, ?, ?, TRUE)`,
      [d.slug, d.name, d.description, d.subject, d.body_html]
    );
  }
}

module.exports = {
  ensureEmailTemplatesTable,
  seedDefaultEmailTemplates,
  getRenderedEmail,
  interpolate
};
