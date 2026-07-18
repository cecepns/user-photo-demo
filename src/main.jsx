import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Global Frontend Fetch Interceptor for Token Expiration (401)
const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  if (response.status === 401) {
    const url = typeof args[0] === 'string' ? args[0] : (args[0] instanceof URL ? args[0].href : (args[0]?.url || ''));
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
