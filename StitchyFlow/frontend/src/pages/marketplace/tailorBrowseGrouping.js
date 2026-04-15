/** Shared grouping for tailor browse pages (by business type name). */

export function norm(v) {
  return String(v || '').trim().toLowerCase();
}

export const UNCATEGORIZED = 'Other';

export function groupShopsByBusinessCategory(shops) {
  const map = new Map();
  for (const row of shops) {
    const key = (row.business_type_name && String(row.business_type_name).trim()) || UNCATEGORIZED;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(row);
  }
  for (const list of map.values()) {
    list.sort((a, b) => norm(a.shop_name).localeCompare(norm(b.shop_name)));
  }
  return [...map.entries()].sort(([a], [b]) => {
    if (a === UNCATEGORIZED) return 1;
    if (b === UNCATEGORIZED) return -1;
    return a.localeCompare(b);
  });
}
