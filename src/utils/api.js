import { API_BASE } from './endpoints';

export function buildUrl(path) {
  return `${API_BASE}${path}`;
}

export async function apiFetch(path, options = {}) {
  const { tokenKey = 'admin_token', ...fetchOptions } = options;
  const token = localStorage.getItem(tokenKey);
  const headers = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(buildUrl(path), { ...fetchOptions, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data?.message || 'Request failed');
    err.status = response.status;
    err.data = data;
    throw err;
  }
  return data;
}
