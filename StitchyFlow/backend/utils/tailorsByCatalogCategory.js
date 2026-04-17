/**
 * Active tailor shops for one admin catalogue category (CA/SUB `categories.id`).
 * Used by public catalog + business routes (live DB).
 */

const { isExcludedCategoryId } = require('./catalogPublicFilters');

const SHOPS_FOR_CATALOG_CATEGORY_SQL = `
  SELECT shop_id, owner_user_id, shop_name, owner_name, city, country, address,
         s.category_id,
         s.subcategory_id,
         c.name AS category_name,
         sc.name AS subcategory_name,
         s.logo_image,
         s.cover_image,
         s.updated_at,
         COALESCE(NULLIF(TRIM(s.shop_image), ''), NULLIF(TRIM(s.cover_image), ''), NULLIF(TRIM(s.logo_image), '')) AS shop_image,
         s.available_from, s.available_to, s.not_available_note,
         bt.type_name AS business_type_name,
         sp.specialization_name AS specialization_name
  FROM business_tailor_shops s
  LEFT JOIN business_type_management bt ON s.business_type_id = bt.type_id
  LEFT JOIN specialization_management sp ON s.specialization_id = sp.specialization_id
  LEFT JOIN categories c ON s.category_id = c.id
  LEFT JOIN subcategories sc ON s.subcategory_id = sc.id
  WHERE s.shop_status = 'active'
    AND (
      s.category_id = ?
      OR sc.category_id = ?
      OR (
        bt.type_name IS NOT NULL
        AND (
          SELECT LOWER(TRIM(name))
          FROM categories
          WHERE id = ? AND is_active = TRUE
          LIMIT 1
        ) = LOWER(TRIM(bt.type_name))
      )
      OR (
        sp.specialization_name IS NOT NULL
        AND (
          SELECT LOWER(TRIM(name))
          FROM categories
          WHERE id = ? AND is_active = TRUE
          LIMIT 1
        ) = LOWER(TRIM(sp.specialization_name))
      )
    )
  ORDER BY s.shop_id DESC
  LIMIT 500
`;

async function fetchTailorShopsForCatalogCategory(db, catId) {
  if (await isExcludedCategoryId(db, catId)) return [];
  const [rows] = await db.query(SHOPS_FOR_CATALOG_CATEGORY_SQL, [catId, catId, catId, catId]);
  return rows;
}

module.exports = { fetchTailorShopsForCatalogCategory };
