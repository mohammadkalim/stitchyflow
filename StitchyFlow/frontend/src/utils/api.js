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

const REFRESH_STORAGE_KEY = 'refreshToken';

export function getRefreshToken() {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(REFRESH_STORAGE_KEY);
}

/** True when the API rejected the access token (expired / invalid), not e.g. wrong password or role-only 403. */
function isAccessTokenRejected(status, data) {
  const code = data?.code;
  if (code === 'ACCOUNT_SUSPENDED' || code === 'ACCOUNT_INACTIVE') return false;

  const msg = String(data?.error?.message || data?.message || '').toLowerCase();

  if (status === 401) {
    if (msg.includes('invalid credentials')) return false;
    if (msg.includes('access token')) return true;
    if (msg === 'token required') return true;
    return false;
  }

  if (status === 403) {
    if (msg.includes('access denied')) return false;
    if (msg.includes('invalid') && msg.includes('token')) return true;
    if (msg.includes('expired') && msg.includes('token')) return true;
    if (msg === 'invalid or expired token') return true;
    return false;
  }

  return false;
}

let refreshInFlight = null;

/**
 * Uses POST /auth/refresh (raw fetch — must not go through apiFetch retry loop).
 * Returns true when a new access token was stored.
 */
async function tryRefreshAccessToken() {
  if (typeof localStorage === 'undefined') return false;
  const rt = localStorage.getItem(REFRESH_STORAGE_KEY);
  if (!rt) return false;

  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const p = '/auth/refresh';
      const base = getApiBase();
      const url = `${base}${p.startsWith('/') ? p : `/${p}`}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: rt }),
      });

      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!res.ok) return false;

      const at = data?.data?.accessToken;
      if (typeof at === 'string' && at.length) {
        localStorage.setItem('token', at);
        const u = data?.data?.user;
        if (u && typeof u === 'object') {
          try {
            const prev = JSON.parse(localStorage.getItem('user') || 'null');
            const merged = {
              ...(prev && typeof prev === 'object' ? prev : {}),
              ...u,
              firstName: u.firstName ?? prev?.firstName,
              lastName: u.lastName ?? prev?.lastName,
              email: u.email ?? prev?.email,
              role: u.role ?? prev?.role,
              approvalStatus: u.approvalStatus ?? u.approval_status ?? prev?.approvalStatus,
            };
            localStorage.setItem('user', JSON.stringify(merged));
          } catch {
            localStorage.setItem('user', JSON.stringify(u));
          }
        }
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

let sessionRedirectScheduled = false;

export function clearClientSessionAndRedirectToLogin() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('token');
    localStorage.removeItem(REFRESH_STORAGE_KEY);
    localStorage.removeItem('user');
    try {
      const keys = Object.keys(sessionStorage);
      for (const k of keys) {
        if (k.startsWith('stitchyflow:')) sessionStorage.removeItem(k);
      }
    } catch { /* ignore */ }
  } catch { /* ignore */ }

  const path = `${window.location.pathname || ''}${window.location.search || ''}`;
  const next = encodeURIComponent(path);
  window.location.replace(`/login?reason=session&next=${next}`);
}

function scheduleSessionExpiredRedirect() {
  if (sessionRedirectScheduled) return;
  sessionRedirectScheduled = true;
  clearClientSessionAndRedirectToLogin();
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
    const retryAfterRefresh = options.__retryAfterRefresh !== false;

    if (retryAfterRefresh && isAccessTokenRejected(res.status, data)) {
      const refreshed = await tryRefreshAccessToken();
      if (refreshed) {
        return apiFetch(path, { ...options, __retryAfterRefresh: false });
      }
    }

    if (isAccessTokenRejected(res.status, data)) {
      const hadToken = !!token;
      const hadRefresh = !!getRefreshToken();
      if (hadToken || hadRefresh) scheduleSessionExpiredRedirect();
    }

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
