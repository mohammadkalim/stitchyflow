/**
 * API base: full URL (no trailing slash), e.g. http://localhost:5000/api/v1
 * CRA dev on :3000: prefer same-origin /api/v1 → setupProxy.js (avoids hitting the wrong process on :5000).
 * Set REACT_APP_DIRECT_API=1 to force using REACT_APP_API_URL in dev when you really want the browser to call :5000 directly.
 */
export function getApiBase() {
  const env = (process.env.REACT_APP_API_URL || '').trim();
  let base = '/api/v1';

  if (env) {
    base = env.replace(/\/$/, '');
    if (/^https?:\/\//i.test(base) && !/\/api\/v\d+/i.test(base)) {
      base = `${base}/api/v1`;
    }
  }

  const isCraDev3000 =
    process.env.NODE_ENV === 'development' &&
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
    window.location.port === '3000';

  const forceDirect =
    process.env.REACT_APP_DIRECT_API === '1' || String(process.env.REACT_APP_DIRECT_API).toLowerCase() === 'true';

  if (isCraDev3000 && env && !forceDirect) {
    const localApi =
      /^https?:\/\/(127\.0\.0\.1|localhost):5000\/api\/v\d*$/i.test(base) ||
      /^https?:\/\/(127\.0\.0\.1|localhost)\/api\/v\d*$/i.test(base);
    if (localApi) return '/api/v1';
  }

  return base;
}

export function getToken() {
  return localStorage.getItem('token');
}

/** Bust browser cache for API-served images when the DB row changes (`updated_at`). */
export function appendShopAssetCacheBust(url, meta) {
  if (!url) return url;
  const u = String(url);
  if (u.includes('images.unsplash.com')) return u;
  const stamp = meta && meta.updated_at != null ? String(meta.updated_at) : '';
  if (!stamp) return u;
  const sep = u.includes('?') ? '&' : '?';
  return `${u}${sep}v=${encodeURIComponent(stamp)}`;
}

/**
 * Full URL for a stored path (`/images/...`, `/uploads/...`) or absolute URL.
 * In CRA dev on :3000 uses same-origin paths so src/setupProxy.js reaches the API.
 */
export function resolvePublicBusinessImageUrl(storedPath, cacheMeta = null) {
  if (!storedPath || !String(storedPath).trim()) return '';
  const raw = String(storedPath).trim();
  if (raw.startsWith('http')) return appendShopAssetCacheBust(raw, cacheMeta);

  const pathOnly = raw.startsWith('/') ? raw : `/${raw}`;
  const api = getApiBase();
  const isCraDev =
    process.env.NODE_ENV === 'development' &&
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
    window.location.port === '3000';

  if (isCraDev && !api.startsWith('http')) {
    return appendShopAssetCacheBust(pathOnly, cacheMeta);
  }

  const origin = api.startsWith('http')
    ? api.replace(/\/api\/v\d+\/?$/i, '')
    : typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:5000';
  return appendShopAssetCacheBust(`${origin}${pathOnly}`, cacheMeta);
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  let p = path.startsWith('/') ? path : `/${path}`;
  const base = getApiBase();
  if (/^https?:\/\//i.test(base) && /^\/api\/v\d+/i.test(p)) {
    p = p.replace(/^\/api\/v\d+/, '') || '/';
  }
  const url = `${base}${p}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const msg = data?.error?.message || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export async function gex(path, options = {}) {
  return apiFetch(path, { method: 'GET', ...options });
}

/** Fired after a tailor creates/updates/deletes a business so public pages can refetch `/business/public/shops`. */
export const PUBLIC_SHOPS_CHANGED_EVENT = 'stitchyflow:public-shops-changed';

export function notifyPublicShopsChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(PUBLIC_SHOPS_CHANGED_EVENT));
  }
}
