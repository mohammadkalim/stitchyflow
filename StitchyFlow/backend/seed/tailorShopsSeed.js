/**
 * Seeds demo tailor shops when `business_tailor_shops` is empty (dev / first run).
 * Safe to run multiple times — skips if any shop row exists.
 */
const db = require('../config/database');

const DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
];

async function seedTailorShopsIfEmpty() {
  const businessRoutes = require('../routes/business.routes');
  await businessRoutes.initPromise;

  /** Seed only when there are no *active* shops — old rows could be inactive, which made the public API empty while seed stayed skipped. */
  const [[{ activeCnt }]] = await db.query(
    "SELECT COUNT(*) AS activeCnt FROM business_tailor_shops WHERE shop_status = 'active'"
  );
  if (Number(activeCnt) > 0) {
    return { skipped: true, reason: 'At least one active tailor shop already exists' };
  }

  await db.query(`
    INSERT INTO business_type_management (type_name, type_code, description, is_active) VALUES
    ('Bespoke & Formal', 'bespoke_formal', 'Custom suits and formal wear', 1),
    ('Bridal & Couture', 'bridal_couture', 'Wedding and festive outfits', 1)
    ON DUPLICATE KEY UPDATE type_name = VALUES(type_name)
  `);

  const [types] = await db.query(
    "SELECT type_id, type_code FROM business_type_management WHERE type_code IN ('bespoke_formal', 'bridal_couture')"
  );
  const tid = (code) => types.find((t) => t.type_code === code)?.type_id;

  const tBespoke = tid('bespoke_formal');
  const tBridal = tid('bridal_couture');

  const specs = [
    ["Men's Suits & Blazers", 'mens_suits', tBespoke],
    ['Alterations & Fitting', 'alterations', tBespoke],
    ['Bridal Wear', 'bridal_wear', tBridal],
    ['Traditional Wear', 'traditional_wear', tBespoke],
  ];

  for (const [name, code, btId] of specs) {
    await db.query(
      `INSERT INTO specialization_management (specialization_name, specialization_code, business_type_id, description, is_active)
       VALUES (?, ?, ?, '', 1)
       ON DUPLICATE KEY UPDATE specialization_name = VALUES(specialization_name), business_type_id = VALUES(business_type_id)`,
      [name, code, btId]
    );
  }

  const [specRows] = await db.query(
    `SELECT specialization_id, specialization_code FROM specialization_management
     WHERE specialization_code IN ('mens_suits','alterations','bridal_wear','traditional_wear')`
  );
  const sid = (code) => specRows.find((s) => s.specialization_code === code)?.specialization_id;

  const rows = [
    ['Royal Stitch Atelier', 'Ahmed Khan', 'Lahore', 'Gulberg III, Main Boulevard', '+92 300 1112233', DEMO_IMAGES[0], tBespoke, sid('mens_suits'), '10:00 AM', '7:00 PM', 'After 7:00 PM & Sundays'],
    ['Al-Noor Tailor House', 'Hassan Raza', 'Karachi', 'Clifton Block 2', '+92 321 4445566', DEMO_IMAGES[1], tBespoke, sid('alterations'), '9:30 AM', '8:00 PM', 'Late night & Sun (closed)'],
    ['Bridal Dreams Studio', 'Sara Malik', 'Islamabad', 'F-7 Markaz', '+92 333 7778899', DEMO_IMAGES[2], tBridal, sid('bridal_wear'), '11:00 AM', '6:00 PM', 'Before 11 AM & Mon off'],
    ['Classic Cuts', 'Omar Sheikh', 'Faisalabad', 'D Ground', '+92 300 2223344', DEMO_IMAGES[3], tBespoke, sid('mens_suits'), '10:30 AM', '6:30 PM', 'Evenings & public holidays'],
    ['Fashion Hub', 'Bilal Ahmed', 'Rawalpindi', 'Saddar', '+92 345 8889900', DEMO_IMAGES[4], tBespoke, sid('traditional_wear'), '9:00 AM', '9:00 PM', 'After 9:00 PM only'],
    ['Elite Tailors', 'Nasir Mehmood', 'Multan', 'Cantt', '+92 312 5556677', DEMO_IMAGES[5], tBespoke, sid('alterations'), '10:00 AM', '5:30 PM', 'Sat half-day & Sun closed'],
  ];

  for (const row of rows) {
    const [
      shop_name, owner_name, city, address, contact_number, shop_image, business_type_id, specialization_id,
      available_from, available_to, not_available_note,
    ] = row;
    await db.query(
      `INSERT INTO business_tailor_shops
        (shop_name, owner_name, city, address, contact_number, shop_status, shop_image, business_type_id, specialization_id,
         available_from, available_to, not_available_note)
       VALUES (?, ?, ?, ?, ?, 'active', ?, ?, ?, ?, ?, ?)`,
      [shop_name, owner_name, city, address, contact_number, shop_image, business_type_id, specialization_id,
        available_from, available_to, not_available_note]
    );
  }

  console.log('✓ Seeded 6 demo tailor shops (business_tailor_shops was empty).');
  return { skipped: false, inserted: rows.length };
}

module.exports = { seedTailorShopsIfEmpty };

if (require.main === module) {
  seedTailorShopsIfEmpty()
    .then((r) => {
      console.log(r);
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
