const BASE = 'http://localhost:5000/api/v1';

export function getToken() {
  return localStorage.getItem('token');
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Request failed');
  return data;
}
