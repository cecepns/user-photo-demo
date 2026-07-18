import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { getSubdomain } from './utils/api'

// Global Frontend Fetch Interceptor for Token Expiration (401) and Tenant Subdomain injection
const { fetch: originalFetch } = window;
window.fetch = async (input, init = {}) => {
  const tenant = getSubdomain();
  if (tenant) {
    try {
      if (input instanceof Request) {
        input.headers.set('X-Tenant-Subdomain', tenant);
      } else {
        if (!init.headers) {
          init.headers = {};
        }
        if (init.headers instanceof Headers) {
          init.headers.set('X-Tenant-Subdomain', tenant);
        } else if (Array.isArray(init.headers)) {
          init.headers.push(['X-Tenant-Subdomain', tenant]);
        } else {
          init.headers = { ...init.headers, 'X-Tenant-Subdomain': tenant };
        }
      }
    } catch (e) {
      console.warn("Failed to inject X-Tenant-Subdomain header:", e);
    }
  }

  const response = await originalFetch(input, init);
  if (response.status === 401) {
    const url = typeof input === 'string' ? input : (input instanceof URL ? input.href : (input?.url || ''));
    const isLoginEndpoint = url.includes('/login');
    const isLoginPage = window.location.pathname.includes('/login');

    if (!isLoginEndpoint && !isLoginPage) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('freelancer_token');
      
      // Redirect depending on the route type
      if (window.location.pathname.startsWith('/freelancer')) {
        window.location.href = '/freelancer/login';
      } else {
        window.location.href = '/admin/login';
      }
    }
  }
  return response;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
