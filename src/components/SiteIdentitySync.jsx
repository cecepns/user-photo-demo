import { useEffect, useState } from 'react';
import { replaceBrandTokens, useSiteIdentity } from '../hooks/useSiteIdentity';
import { apiFetch } from '../utils/api';
import { ShieldAlert } from 'lucide-react';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function adjustColorBrightness(hex, percent) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const r = Math.min(255, Math.max(0, rgb.r + Math.round(percent * 2.55)));
  const g = Math.min(255, Math.max(0, rgb.g + Math.round(percent * 2.55)));
  const b = Math.min(255, Math.max(0, rgb.b + Math.round(percent * 2.55)));
  
  return rgbToHex(r, g, b);
}

function generateShades(hex) {
  return {
    50: adjustColorBrightness(hex, 85),
    100: adjustColorBrightness(hex, 70),
    200: adjustColorBrightness(hex, 50),
    300: adjustColorBrightness(hex, 30),
    400: adjustColorBrightness(hex, 15),
    500: hex,
    600: adjustColorBrightness(hex, -10),
    700: adjustColorBrightness(hex, -20),
    800: adjustColorBrightness(hex, -35),
    900: adjustColorBrightness(hex, -50),
  };
}

const SiteIdentitySync = () => {
  const identity = useSiteIdentity();
  const [tenantStatus, setTenantStatus] = useState({
    loading: true,
    is_active: true,
    is_expired: false,
    name: ''
  });

  // Load and apply tenant theme color
  useEffect(() => {
    let active = true;
    const fetchTenantConfig = async () => {
      try {
        // apiFetch automatically detects the subdomain from window.location.hostname
        // and sends it as X-Tenant-Subdomain header — works in localhost AND production
        const config = await apiFetch('/api/tenant/config');
        if (active) {
          setTenantStatus({
            loading: false,
            is_active: config.is_active,
            is_expired: config.is_expired,
            name: config.name
          });
        }

        if (config && config.primary_color) {
          const shades = generateShades(config.primary_color);
          Object.entries(shades).forEach(([shade, hex]) => {
            document.documentElement.style.setProperty(`--color-primary-${shade}`, hex);
          });
        }
      } catch (error) {
        console.error('Error loading tenant branding config:', error);
        if (active) {
          setTenantStatus(prev => ({ ...prev, loading: false }));
        }
      }
    };

    fetchTenantConfig();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const syncBrandTokens = () => {
      const nextTitle = replaceBrandTokens(document.title, identity);
      if (nextTitle !== document.title) {
        document.title = nextTitle;
      }

      const metaSelectors = [
        'meta[name="description"]',
        'meta[property="og:title"]',
        'meta[property="og:description"]',
        'meta[name="twitter:title"]',
        'meta[name="twitter:description"]',
      ];

      metaSelectors.forEach((selector) => {
        const element = document.querySelector(selector);
        if (!element) return;

        const currentContent = element.getAttribute('content');
        if (!currentContent) return;

        const nextContent = replaceBrandTokens(currentContent, identity);
        if (nextContent !== currentContent) {
          element.setAttribute('content', nextContent);
        }
      });
    };

    syncBrandTokens();

    const observer = new MutationObserver(() => {
      syncBrandTokens();
    });

    observer.observe(document.head, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
    };
  }, [identity]);

  if (tenantStatus.loading) {
    return null;
  }

  if (!tenantStatus.is_active || tenantStatus.is_expired) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4 z-[99999] font-sans text-white">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex p-4 rounded-full bg-red-500/10 text-red-500 mb-2">
            <ShieldAlert size={48} className="animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {tenantStatus.is_expired ? 'Masa Aktif Berakhir' : 'Website Dinonaktifkan'}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {tenantStatus.is_expired 
              ? `Website untuk brand "${tenantStatus.name}" telah melewati masa aktif layanannya. Silakan hubungi administrator untuk melakukan perpanjangan.`
              : `Website untuk brand "${tenantStatus.name}" saat ini sedang dinonaktifkan oleh administrator.`
            }
          </p>
          <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 font-mono">
            Status: {tenantStatus.is_expired ? 'TENANT_EXPIRED' : 'TENANT_INACTIVE'}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SiteIdentitySync;
