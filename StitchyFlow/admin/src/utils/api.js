/**
 * API Utility - Axios instance with auth interceptor
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */
import axios from 'axios';

/** Ensures paths like /admin/ads resolve under /api/v1 (common misconfig: REACT_APP_API_URL without /api/v1). */
function normalizeApiBase() {
  const raw = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1').trim().replace(/\/$/, '');
  if (/\/api\/v\d+$/i.test(raw)) return raw;
  return `${raw}/api/v1`;
}

const API_BASE_URL = normalizeApiBase();

export const api = axios.create({
  baseURL: API_BASE_URL
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// On 401/403 — token expired or invalid → clear and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error?.message || error.message || 'Request failed';
    const url = error.config?.url || '';

    // Dispatch to AI error capture (non-blocking)
    if (status !== 401 && status !== 403) {
      window.dispatchEvent(new CustomEvent('axios-error', {
        detail: { message, status, url, stack: error.stack }
      }));
    }

    // 401 = unauthenticated → login. 403 = often "no permission" → show error, do not redirect (so Save errors are visible).
    // Exception: suspended account should still clear session.
    if (status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    } else if (status === 403 && error.response?.data?.code === 'ACCOUNT_SUSPENDED') {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default API_BASE_URL;
