/**
 * Catalogue categories hidden on the public site & marketplace (removed pillar).
 * Admin authenticated routes still return full rows so staff can edit or delete.
 * Developer by: Muhammad Kalim — Product of LogixInventor (PVT) Ltd.
 */

/** SQL predicate: category `name` column (no table alias). */
const WHERE_CATEGORY_NAME_PUBLIC = `LOWER(TRIM(name)) <> 'event'`;

/** SQL predicate: categories table aliased as `c`. */
const WHERE_CATEGORY_NAME_PUBLIC_ALIAS_C = `LOWER(TRIM(c.name)) <> 'event'`;

/** True when this category id is the hidden “Event” pillar (public APIs return no shops). */
async function isExcludedCategoryId(db, catId) {
  const [[row]] = await db.query(
    'SELECT LOWER(TRIM(name)) AS n FROM categories WHERE id = ? LIMIT 1',
    [catId]
  );
  return Boolean(row && row.n === 'event');
}

module.exports = {
  WHERE_CATEGORY_NAME_PUBLIC,
  WHERE_CATEGORY_NAME_PUBLIC_ALIAS_C,
  isExcludedCategoryId,
};
