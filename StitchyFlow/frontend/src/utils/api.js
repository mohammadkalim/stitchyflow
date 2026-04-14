/**
 * API base: use REACT_APP_API_URL in production (full URL, no trailing slash).
 * In development, default is relative `/api/v1` so Create React App proxies to `package.json` "proxy" (port 5000).
 */
export function getApiBase() {
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
