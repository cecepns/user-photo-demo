import { API_BASE } from './endpoints';

function getSubdomain() {
  const hostname = window.location.hostname;
  
  // Check query parameter '?tenant=subdomain' (very useful for local development and testing)
  const urlParams = new URLSearchParams(window.location.search);
  const queryTenant = urlParams.get('tenant');
  if (queryTenant) {
    localStorage.setItem('selected_tenant_subdomain', queryTenant);
    return queryTenant;
  }
  
  const savedTenant = localStorage.getItem('selected_tenant_subdomain');
  if (savedTenant && (hostname === 'localhost' || hostname === '127.0.0.1')) {
    return savedTenant;
  }

  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') {
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      return parts[0];
    }
    return null;
  }
  
  // Domain utama: user-photo.my.id
  const baseSuffix = '.user-photo.my.id';
  if (hostname.endsWith(baseSuffix)) {
    const sub = hostname.slice(0, -baseSuffix.length);
    if (sub === 'www' || sub === 'api' || sub === 'admin') return null;
    return sub;
  }
  
  return null;
}

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
  
  const tenant = getSubdomain();
  if (tenant) {
    headers['X-Tenant-Subdomain'] = tenant;
  }

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
