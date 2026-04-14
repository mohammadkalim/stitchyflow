/**
 * API base: use REACT_APP_API_URL in production (full URL, no trailing slash).
 * In development, default is relative `/api/v1` so Create React App proxies to `package.json` "proxy" (port 5000).
 */
export function getApiBase() {
  // In CRA dev on :3000, always use same-origin `/api/v1` so package.json proxy hits one backend.
  // Direct `http://localhost:5000/...` often points at a stale or different process → confusing 404s.
  if (
    process.env.NODE_ENV === 'development' &&
    typeof window !== 'undefined' &&
    window.location.hostname === 'localhost' &&
    window.location.port === '3000'
  ) {
    return '/api/v1';
  }
  const env = process.env.REACT_APP_API_URL;
  if (env && env.trim()) {
    return env.replace(/\/$/, '');
  }
  return '/api/v1';
}

const BASE = getApiBase();

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
    window.location.hostname === 'localhost' &&
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
  const p = path.startsWith('/') ? path : `/${path}`;
  const url = BASE.startsWith('http') ? `${BASE}${p}` : `${BASE}${p}`;

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
