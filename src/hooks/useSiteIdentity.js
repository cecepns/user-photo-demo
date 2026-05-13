import { useEffect, useState } from 'react';

const API_BASE_URL = 'https://api-inventory.isavralabel.com/wedding-app/api';
const DEFAULT_APP_NAME = 'Chekusphoto';
const DEFAULT_COMPANY_NAME = 'PT Chekusphoto';
const DEFAULT_APP_INITIAL = 'C';

/** Kontak & media sosial (disimpan sebagai JSON di field description section site_identity). */
export const DEFAULT_SITE_CONTACT = {
  addressLine1: 'Jl. Raya panongan Kec. Panongan Kab. Tangerang',
  addressLine2: 'Provinsi Banten',
  phone: '089646829459',
  email: 'edo19priyatno@gmail.com',
  instagramUrl: 'https://www.instagram.com/user_wedding_organizer/',
  mapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3965.688906306652!2d106.532421074991!3d-6.304542493684667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwMTgnMTYuNCJTIDEwNsKwMzInMDYuMCJF!5e0!3m2!1sen!2sid!4v1753360840035!5m2!1sen!2sid',
  businessHours:
    'Senin - Jumat: 09:00 - 18:00\nSabtu: 10:00 - 16:00\nMinggu: Hanya dengan janji temu',
};

export const parseSiteContactFromDescription = (description) => {
  const merged = { ...DEFAULT_SITE_CONTACT };
  if (!description || typeof description !== 'string') return merged;
  const trimmed = description.trim();
  if (!trimmed.startsWith('{')) return merged;
  try {
    const obj = JSON.parse(trimmed);
    const c = obj?.siteContact && typeof obj.siteContact === 'object' ? obj.siteContact : {};
    for (const key of Object.keys(DEFAULT_SITE_CONTACT)) {
      if (Object.prototype.hasOwnProperty.call(c, key)) {
        merged[key] = String(c[key] ?? '').trim();
      }
    }
    return merged;
  } catch {
    return { ...DEFAULT_SITE_CONTACT };
  }
};

export const serializeSiteIdentityDescription = (siteContact) =>
  JSON.stringify({ siteContact: { ...DEFAULT_SITE_CONTACT, ...siteContact } });

const normalizeInitial = (value) => {
  if (!value) return '';
  const cleaned = String(value).trim();
  if (!cleaned) return '';
  return cleaned.slice(0, 2).toUpperCase();
};

const deriveInitialFromName = (appName) => {
  const words = String(appName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }
  return DEFAULT_APP_INITIAL;
};

const buildIdentity = (data) => {
  const appName = String(data?.title || '').trim() || DEFAULT_APP_NAME;
  const companyName = String(data?.subtitle || '').trim() || DEFAULT_COMPANY_NAME;
  const appInitial = normalizeInitial(data?.button_text) || deriveInitialFromName(appName);
  const logoUrl = String(data?.image_url || '').trim();
  const contact = parseSiteContactFromDescription(data?.description);

  return {
    appName,
    companyName,
    appInitial,
    logoUrl,
    contact,
  };
};

const defaultIdentity = buildIdentity(null);

export const replaceBrandTokens = (text, identity = defaultIdentity) => {
  const source = String(text || '');
  return source
    .replace(/PT User Wedding Organizer/g, identity.companyName)
    .replace(/User Wedding Organizer/g, identity.companyName)
    .replace(/User Wedding/g, identity.appName)
    .replace(/PT Chekusphoto/g, identity.companyName)
    .replace(/Chekusphoto/g, identity.appName);
};

export const useSiteIdentity = () => {
  const [identity, setIdentity] = useState(defaultIdentity);

  useEffect(() => {
    let cancelled = false;

    const fetchIdentity = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/content-sections/site_identity`);
        if (!response.ok) return;

        const data = await response.json();
        if (!cancelled) {
          setIdentity(buildIdentity(data));
        }
      } catch (error) {
        console.error('Error fetching site identity:', error);
      }
    };

    fetchIdentity();

    return () => {
      cancelled = true;
    };
  }, []);

  return identity;
};
