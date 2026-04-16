/**
 * Seed businesses for selected catalog categories.
 *
 * Target:
 * - Acting: 99 businesses
 * - Calligraphy: 99 businesses
 * - Event: 99 businesses
 * - Painting: 99 businesses
 *
 * Safe to run multiple times:
 * - Creates/activates categories if missing.
 * - Adds only missing rows to reach target count per category.
 */
const db = require('../config/database');
const businessRoutes = require('../routes/business.routes');
const { ensureCASubTables } = require('../utils/caSubTables');

const TARGET_PER_CATEGORY = 99;

const CATEGORY_NAMES = ['Acting', 'Calligraphy', 'Event', 'Painting'];

const CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
];

const OWNER_FIRST = [
  'Ahmed', 'Ali', 'Hassan', 'Bilal', 'Usman', 'Omar', 'Hamza', 'Saad', 'Fahad', 'Daniyal',
  'Ayesha', 'Hina', 'Sara', 'Mahnoor', 'Zara', 'Nimra', 'Fatima', 'Iqra', 'Maham', 'Noor',
];
const OWNER_LAST = [
  'Khan', 'Raza', 'Malik', 'Butt', 'Qureshi', 'Siddiqui', 'Mehmood', 'Sheikh', 'Nawaz', 'Farooq',
  'Aslam', 'Yousaf', 'Rehman', 'Tariq', 'Nadeem', 'Akhtar', 'Ijaz', 'Hussain', 'Chaudhry', 'Hashmi',
];

const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1400&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1400&q=80',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1400&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1400&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1400&q=80',
  'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1400&q=80',
  'https://images.unsplash.com/photo-1514996937319-344454492b37?w=1400&q=80',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1400&q=80',
  'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=1400&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=80',
];

const LOGO_IMAGES = [
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=320&h=320&fit=crop&q=80',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=320&h=320&fit=crop&q=80',
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=320&h=320&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=320&h=320&fit=crop&q=80',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=320&h=320&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544441893-675973e31985?w=320&h=320&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=320&h=320&fit=crop&q=80',
  'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=320&h=320&fit=crop&q=80',
];

function pick(list, idx) {
  return list[idx % list.length];
}

function ownerName(seed) {
  return `${pick(OWNER_FIRST, seed)} ${pick(OWNER_LAST, seed + 7)}`;
}

function shopName(category, i) {
  const suffix = [
    'Studio',
    'House',
    'Hub',
    'Works',
    'Collective',
    'Point',
    'Gallery',
    'Corner',
    'Craft',
    'Creations',
  ][i % 10];
  return `${category} ${suffix} ${String(i + 1).padStart(2, '0')}`;
}

function contactNumber(seed) {
  const base = 3000000000 + seed;
  return `+92 ${String(base).slice(0, 3)} ${String(base).slice(3, 10)}`;
}

async function ensureCategories() {
  for (const name of CATEGORY_NAMES) {
    await db.query(
      `INSERT INTO categories (name, description, is_active)
       VALUES (?, ?, TRUE)
       ON DUPLICATE KEY UPDATE description = VALUES(description), is_active = TRUE`,
      [name, `${name} services category`]
    );
  }
  const [rows] = await db.query(
    `SELECT id, name FROM categories
     WHERE name IN (${CATEGORY_NAMES.map(() => '?').join(',')})`,
    CATEGORY_NAMES
  );
  const map = new Map(rows.map((r) => [String(r.name).toLowerCase(), r.id]));
  return CATEGORY_NAMES.map((name) => ({
    name,
    id: map.get(name.toLowerCase()),
  })).filter((x) => Number.isFinite(x.id));
}

async function ensureBusinessTypesAndSpecializations(categoryRows) {
  for (const c of categoryRows) {
    const code = `seed_${String(c.name).toLowerCase()}`.replace(/[^a-z0-9_]/g, '_');
    await db.query(
      `INSERT INTO business_type_management (type_name, type_code, description, is_active)
       VALUES (?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE type_name = VALUES(type_name), is_active = 1`,
      [c.name, code, `${c.name} business type`]
    );
  }

  const [types] = await db.query(
    `SELECT type_id, type_name FROM business_type_management WHERE type_name IN (${categoryRows.map(() => '?').join(',')})`,
    categoryRows.map((c) => c.name)
  );
  const typeByName = new Map(types.map((t) => [String(t.type_name).toLowerCase(), t.type_id]));

  for (const c of categoryRows) {
    const specCode = `seed_spec_${String(c.name).toLowerCase()}`.replace(/[^a-z0-9_]/g, '_');
    await db.query(
      `INSERT INTO specialization_management (specialization_name, specialization_code, business_type_id, description, is_active)
       VALUES (?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE business_type_id = VALUES(business_type_id), is_active = 1`,
      [c.name, specCode, typeByName.get(String(c.name).toLowerCase()) || null, `${c.name} specialization`]
    );
  }

  const [specs] = await db.query(
    `SELECT specialization_id, specialization_name FROM specialization_management
     WHERE specialization_name IN (${categoryRows.map(() => '?').join(',')})`,
    categoryRows.map((c) => c.name)
  );
  const specByName = new Map(specs.map((s) => [String(s.specialization_name).toLowerCase(), s.specialization_id]));

  return { typeByName, specByName };
}

async function seedCategoryBusinesses(categoryRow, typeByName, specByName) {
  const [countRows] = await db.query(
    `SELECT COUNT(*) AS cnt
     FROM business_tailor_shops
     WHERE shop_status = 'active' AND category_id = ?`,
    [categoryRow.id]
  );
  const current = Number(countRows?.[0]?.cnt || 0);
  const missing = Math.max(0, TARGET_PER_CATEGORY - current);
  if (missing === 0) {
    return { category: categoryRow.name, inserted: 0, total: current };
  }

  const businessTypeId = typeByName.get(String(categoryRow.name).toLowerCase()) || null;
  const specializationId = specByName.get(String(categoryRow.name).toLowerCase()) || null;

  for (let i = 0; i < missing; i += 1) {
    const n = current + i;
    const seed = categoryRow.id * 1000 + n;
    const city = pick(CITIES, seed);
    const name = shopName(categoryRow.name, n);
    const owner = ownerName(seed);
    const cover = pick(COVER_IMAGES, seed);
    const logo = pick(LOGO_IMAGES, seed + 3);
    const fromHour = 9 + (seed % 3); // 9, 10, 11
    const toHour = 6 + (seed % 4);   // 6..9 PM

    await db.query(
      `INSERT INTO business_tailor_shops
        (shop_name, owner_name, city, country, address, contact_number,
         shop_status, shop_image, logo_image, cover_image,
         category_id, business_type_id, specialization_id,
         available_from, available_to, not_available_note)
       VALUES (?, ?, ?, 'Pakistan', ?, ?, 'active', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        owner,
        city,
        `${city} Main Market`,
        contactNumber(seed),
        cover,
        logo,
        cover,
        categoryRow.id,
        businessTypeId,
        specializationId,
        `${String(fromHour).padStart(2, '0')}:00`,
        `${String(toHour).padStart(2, '0')}:00`,
        'Friday evening and national holidays',
      ]
    );
  }

  return { category: categoryRow.name, inserted: missing, total: TARGET_PER_CATEGORY };
}

async function seedCatalogCategoryBusinesses() {
  await businessRoutes.initPromise;
  await ensureCASubTables();

  const categories = await ensureCategories();
  if (!categories.length) {
    throw new Error('Could not resolve categories for seeding.');
  }

  const { typeByName, specByName } = await ensureBusinessTypesAndSpecializations(categories);

  const results = [];
  for (const categoryRow of categories) {
    // sequential writes keep DB load predictable
    // eslint-disable-next-line no-await-in-loop
    const r = await seedCategoryBusinesses(categoryRow, typeByName, specByName);
    results.push(r);
  }
  return results;
}

module.exports = { seedCatalogCategoryBusinesses };

if (require.main === module) {
  seedCatalogCategoryBusinesses()
    .then((results) => {
      for (const row of results) {
        console.log(`✓ ${row.category}: inserted ${row.inserted}, total ${row.total}`);
      }
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding failed:', err.message);
      process.exit(1);
    });
}
