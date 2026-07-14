import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Edit, Plus, Trash2, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import { API_BASE, imageUrl } from '../../utils/imageUrl';
import { buildUrl } from '../../utils/api';
import {
  DEFAULT_SITE_CONTACT,
  DEFAULT_FOOTER_SERVICES,
  parseSiteContactFromDescription,
  parseFooterServicesFromDescription,
  serializeSiteIdentityDescription,
} from '../../hooks/useSiteIdentity';

function getTenantSubdomainHeader() {
  const hostname = window.location.hostname;
  const urlParams = new URLSearchParams(window.location.search);
  const queryTenant = urlParams.get('tenant');
  if (queryTenant) return queryTenant;
  const saved = localStorage.getItem('selected_tenant_subdomain');
  if (saved && (hostname === 'localhost' || hostname === '127.0.0.1')) return saved;
  const baseSuffix = '.user-photo.my.id';
  if (hostname.endsWith(baseSuffix)) {
    const sub = hostname.slice(0, -baseSuffix.length);
    if (sub === 'www' || sub === 'api' || sub === 'admin') return null;
    return sub;
  }
  return null;
}

function getAuthHeaders(extra = {}) {
  const token = localStorage.getItem('admin_token');
  const tenant = getTenantSubdomainHeader();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(tenant ? { 'X-Tenant-Subdomain': tenant } : {}),
    ...extra,
  };
}

const SECTION_LABELS = {
  site_identity: 'Identitas & Informasi Profil Website',
  Chekusphoto: 'Branding Ringkasan (Photo & Video)',
  hero_section: 'Banner Utama Halaman Depan',
  services_hero_section: 'Header Daftar Paket Layanan',
  services_preview_section: 'Judul Preview Layanan',
  custom_service_section: 'Banner Layanan Kustom',
  button_item_detail: 'Label Tombol Detail Paket',
  home_cta_section: 'Banner Ajakan Aksi (CTA) Halaman Depan',
  about_hero_section: 'Banner Utama Tentang Kami',
  about_mission_section: 'Misi & Visi Kami',
  about_cta_section: 'Banner Ajakan Aksi Tentang Kami',
  gallery_hero_section: 'Header Halaman Galeri',
  contact_hero_section: 'Header Halaman Kontak'
};

const CATEGORIES = [
  {
    id: 'profile',
    name: 'Profil & Branding Website',
    description: 'Logo website, nama aplikasi, alamat kontak, jam operasional, link sosial media, dan teks footer.',
    sections: ['site_identity', 'Chekusphoto']
  },
  {
    id: 'home',
    name: 'Halaman Home (Beranda)',
    description: 'Banner utama, promo layanan kustom, deskripsi daftar paket, dan tombol ajakan aksi (CTA) di beranda.',
    sections: ['hero_section', 'services_hero_section', 'services_preview_section', 'custom_service_section', 'home_cta_section', 'button_item_detail']
  },
  {
    id: 'about',
    name: 'Halaman Tentang & Galeri',
    description: 'Konten cerita tentang kami, visi/misi perusahaan, tombol ajakan halaman tentang, dan header galeri.',
    sections: ['about_hero_section', 'about_mission_section', 'about_cta_section', 'gallery_hero_section']
  },
  {
    id: 'contact',
    name: 'Halaman Kontak',
    description: 'Judul header dan sub-judul pada halaman kontak kami.',
    sections: ['contact_hero_section']
  }
];

const AdminContent = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    section_name: '',
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    button_text: '',
    button_url: '',
    is_active: true,
    sort_order: 0
  });
  const [siteContactDraft, setSiteContactDraft] = useState(() => ({
    ...DEFAULT_SITE_CONTACT,
  }));
  const [footerServicesText, setFooterServicesText] = useState(
    () => DEFAULT_FOOTER_SERVICES.join('\n')
  );

  const [openCategory, setOpenCategory] = useState('profile');

  const groupedSections = useMemo(() => {
    const grouped = {
      profile: [],
      home: [],
      about: [],
      contact: [],
      other: []
    };

    sections.forEach(sec => {
      if (CATEGORIES[0].sections.includes(sec.section_name)) {
        grouped.profile.push(sec);
      } else if (CATEGORIES[1].sections.includes(sec.section_name)) {
        grouped.home.push(sec);
      } else if (CATEGORIES[2].sections.includes(sec.section_name)) {
        grouped.about.push(sec);
      } else if (CATEGORIES[3].sections.includes(sec.section_name)) {
        grouped.contact.push(sec);
      } else {
        grouped.other.push(sec);
      }
    });

    return grouped;
  }, [sections]);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch(buildUrl('/api/content-sections?is_active=false'), {
        headers: getAuthHeaders({ 'Content-Type': undefined }),
      });
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Gagal memuat data konten');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const method = editingSection ? 'PUT' : 'POST';
      
      const isSiteIdentity = formData.section_name === 'site_identity';
      const payload = isSiteIdentity
        ? {
            ...formData,
            description: serializeSiteIdentityDescription(
              siteContactDraft,
              footerServicesText
                .split('\n')
                .map((l) => l.trim())
                .filter(Boolean)
                .slice(0, 20)
            ),
          }
        : formData;

      const response = await fetch(buildUrl(editingSection ? `/api/content-sections/${editingSection.id}` : '/api/content-sections'), {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(editingSection ? 'Konten berhasil diperbarui' : 'Konten berhasil dibuat');
        setShowModal(false);
        setEditingSection(null);
        resetForm();
        fetchSections();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error('Gagal menyimpan konten');
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setFormData({
      section_name: section.section_name,
      title: section.title || '',
      subtitle: section.subtitle || '',
      description: section.description || '',
      image_url: section.image_url || '',
      button_text: section.button_text || '',
      button_url: section.button_url || '',
      is_active: section.is_active,
      sort_order: section.sort_order || 0
    });
    setSiteContactDraft(parseSiteContactFromDescription(section.description));
    setFooterServicesText(
      parseFooterServicesFromDescription(section.description).join('\n')
    );
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus konten ini?')) return;

    try {
      const response = await fetch(buildUrl(`/api/content-sections/${id}`), {
        method: 'DELETE',
        headers: getAuthHeaders({ 'Content-Type': undefined }),
      });

      if (response.ok) {
        toast.success('Konten berhasil dihapus');
        fetchSections();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error('Error deleting section:', error);
      toast.error('Gagal menghapus konten');
    }
  };

  const resetForm = () => {
    setFormData({
      section_name: '',
      title: '',
      subtitle: '',
      description: '',
      image_url: '',
      button_text: '',
      button_url: '',
      is_active: true,
      sort_order: 0
    });
    setSiteContactDraft({ ...DEFAULT_SITE_CONTACT });
    setFooterServicesText(DEFAULT_FOOTER_SERVICES.join('\n'));
  };

  const openCreateModal = () => {
    setEditingSection(null);
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSection(null);
    resetForm();
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/image\/(jpeg|png|gif|webp)/.test(file.type)) {
      toast.error('Hanya file gambar (JPEG, PNG, GIF, WebP) yang diizinkan.');
      return;
    }

    const form = new FormData();
    form.append('file', file);

    try {
      setUploadingImage(true);
      const response = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: form,
      });

      const data = await response.json();
      if (!response.ok || !data?.filename) {
        toast.error(data?.message || 'Upload gambar gagal');
        return;
      }

      setFormData((prev) => ({ ...prev, image_url: data.filename }));
      toast.success('Gambar berhasil diupload');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Upload gambar gagal');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Kelola Konten - Dashboard Admin</title>
      </Helmet>

      <AdminLayout>
        {/** section khusus untuk branding global */}
        {/** title: nama app, subtitle: nama perusahaan, button_text: inisial, image_url: logo */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Kelola Konten</h1>
              <p className="text-gray-600">Kelola konten dinamis untuk website Anda. Edit section <strong>site_identity</strong> untuk nama aplikasi, nama perusahaan, inisial, logo, kontak &amp; peta, daftar teks kolom Layanan di footer, serta data untuk invoice.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/admin/service-cards"
                className="px-4 py-2 text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Edit size={16} />
                Kelola Service Cards
              </a>
              <a
                href="/admin/service-features"
                className="px-4 py-2 text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Edit size={16} />
                Kelola Fitur Layanan
              </a>
              <button
                onClick={openCreateModal}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={20} />
                Tambah Konten Baru
              </button>
            </div>
          </div>
        </div>

        {/* Content Sections Accordion */}
        <div className="space-y-4">
          {CATEGORIES.map((cat) => {
            const catSections = groupedSections[cat.id] || [];
            const isOpen = openCategory === cat.id;
            
            return (
              <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50/50 transition-colors focus:outline-none"
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-800">{cat.name}</h3>
                    <p className="text-sm text-gray-500 font-normal">{cat.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {catSections.length} Item
                    </span>
                    {isOpen ? <ChevronUp className="text-gray-500" size={20} /> : <ChevronDown className="text-gray-500" size={20} />}
                  </div>
                </button>
                
                {isOpen && (
                  <div className="p-6 pt-0 border-t border-gray-50 bg-gray-50/20">
                    {catSections.length === 0 ? (
                      <p className="text-sm text-gray-500 py-6 text-center">Belum ada konten untuk kategori ini.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                        {catSections.map((sec) => (
                          <div key={sec.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between gap-4">
                                <h4 className="font-bold text-gray-800 text-base">
                                  {SECTION_LABELS[sec.section_name] || sec.section_name}
                                </h4>
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
                                  sec.is_active ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                                }`}>
                                  {sec.is_active ? "Aktif" : "Nonaktif"}
                                </span>
                              </div>
                              
                              <div className="flex gap-4">
                                {sec.image_url && (
                                  <img
                                    src={imageUrl(sec.image_url)}
                                    alt={sec.title || "Preview"}
                                    className="w-20 h-20 rounded-lg object-cover border border-gray-100 bg-gray-50 shrink-0"
                                    onError={(ev) => {
                                      ev.currentTarget.style.display = 'none';
                                    }}
                                  />
                                )}
                                <div className="space-y-1 min-w-0 flex-1">
                                  {sec.title && <p className="text-sm font-semibold text-gray-900 truncate">{sec.title}</p>}
                                  {sec.subtitle && <p className="text-xs font-medium text-gray-500 truncate">{sec.subtitle}</p>}
                                  {sec.description && (
                                    <p className="text-xs text-gray-500 line-clamp-3 whitespace-pre-line leading-relaxed">
                                      {sec.section_name === 'site_identity' 
                                        ? "Konfigurasi kontak, alamat, jam kerja, dan footer"
                                        : sec.description
                                      }
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                              <span className="text-xs text-gray-400">Urutan: {sec.sort_order}</span>
                              <button
                                onClick={() => handleEdit(sec)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2f4274] hover:bg-[#202e53] text-white rounded-lg text-xs font-semibold transition-colors"
                              >
                                <Edit size={12} />
                                Edit Konten
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Kategori Kustom / Lainnya (hanya muncul jika ada data) */}
          {groupedSections.other && groupedSections.other.length > 0 && (() => {
            const catSections = groupedSections.other;
            const isOpen = openCategory === 'other';
            
            return (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenCategory(isOpen ? null : 'other')}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50/50 transition-colors focus:outline-none"
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-800">Konten Kustom / Lainnya</h3>
                    <p className="text-sm text-gray-500 font-normal">Daftar konten kustom tambahan yang dibuat manual.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {catSections.length} Item
                    </span>
                    {isOpen ? <ChevronUp className="text-gray-500" size={20} /> : <ChevronDown className="text-gray-500" size={20} />}
                  </div>
                </button>
                
                {isOpen && (
                  <div className="p-6 pt-0 border-t border-gray-50 bg-gray-50/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                      {catSections.map((sec) => (
                        <div key={sec.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <h4 className="font-bold text-gray-800 text-base truncate">
                                {sec.section_name}
                              </h4>
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
                                sec.is_active ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                              }`}>
                                {sec.is_active ? "Aktif" : "Nonaktif"}
                              </span>
                            </div>
                            
                            <div className="flex gap-4">
                              {sec.image_url && (
                                <img
                                  src={imageUrl(sec.image_url)}
                                  alt={sec.title || "Preview"}
                                  className="w-20 h-20 rounded-lg object-cover border border-gray-100 bg-gray-50 shrink-0"
                                  onError={(ev) => {
                                    ev.currentTarget.style.display = 'none';
                                  }}
                                />
                              )}
                              <div className="space-y-1 min-w-0 flex-1">
                                {sec.title && <p className="text-sm font-semibold text-gray-900 truncate">{sec.title}</p>}
                                {sec.subtitle && <p className="text-xs font-medium text-gray-500 truncate">{sec.subtitle}</p>}
                                {sec.description && <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{sec.description}</p>}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                            <span className="text-xs text-gray-400">Urutan: {sec.sort_order}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(sec)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2f4274] hover:bg-[#202e53] text-white rounded-lg text-xs font-semibold transition-colors"
                              >
                                <Edit size={12} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(sec.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-colors"
                              >
                                <Trash2 size={12} />
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingSection 
                    ? `Edit Konten — ${SECTION_LABELS[formData.section_name] || formData.section_name}` 
                    : 'Tambah Konten Baru'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {(() => {
                  const isSiteIdentity = formData.section_name === 'site_identity';
                  return (
                    <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {!editingSection ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Kunci Section *
                      </label>
                      <input
                        type="text"
                        value={formData.section_name}
                        onChange={(e) => setFormData({...formData, section_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="contoh: custom_promo"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        ID unik (huruf kecil dan garis bawah, tanpa spasi).
                      </p>
                    </div>
                  ) : null}

                  <div className={editingSection ? "md:col-span-2" : ""}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Tampilan
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Tampilkan section ini di website</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Utama
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Hari"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub Judul
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Pernikahan"
                    />
                  </div>
                </div>

                {isSiteIdentity ? (
                  <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/80 p-4">
                    <p className="text-sm font-medium text-gray-800">Kontak &amp; lokasi (tampil di footer, halaman Kontak, dan PDF invoice)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat baris 1</label>
                        <input
                          type="text"
                          value={siteContactDraft.addressLine1}
                          onChange={(e) =>
                            setSiteContactDraft((p) => ({ ...p, addressLine1: e.target.value }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat baris 2</label>
                        <input
                          type="text"
                          value={siteContactDraft.addressLine2}
                          onChange={(e) =>
                            setSiteContactDraft((p) => ({ ...p, addressLine2: e.target.value }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                        <input
                          type="text"
                          value={siteContactDraft.phone}
                          onChange={(e) =>
                            setSiteContactDraft((p) => ({ ...p, phone: e.target.value }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                        <input
                          type="text"
                          value={siteContactDraft.whatsapp || ''}
                          onChange={(e) =>
                            setSiteContactDraft((p) => ({ ...p, whatsapp: e.target.value }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                          placeholder="Contoh: 6289646829459"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={siteContactDraft.email}
                          onChange={(e) =>
                            setSiteContactDraft((p) => ({ ...p, email: e.target.value }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL Instagram</label>
                        <input
                          type="url"
                          value={siteContactDraft.instagramUrl}
                          onChange={(e) =>
                            setSiteContactDraft((p) => ({ ...p, instagramUrl: e.target.value }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                          placeholder="https://www.instagram.com/akun/"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teks / Link Website di Invoice</label>
                        <input
                          type="text"
                          value={siteContactDraft.invoiceWebsiteText || ''}
                          onChange={(e) =>
                            setSiteContactDraft((p) => ({ ...p, invoiceWebsiteText: e.target.value }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                          placeholder="Contoh: https://sites.google.com/... atau PT Wedding Organizer"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL embed Google Maps (iframe src)</label>
                        <input
                          type="url"
                          value={siteContactDraft.mapsEmbedUrl}
                          onChange={(e) =>
                            setSiteContactDraft((p) => ({ ...p, mapsEmbedUrl: e.target.value }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jam kerja (satu baris per baris)</label>
                        <textarea
                          value={siteContactDraft.businessHours}
                          onChange={(e) =>
                            setSiteContactDraft((p) => ({ ...p, businessHours: e.target.value }))
                          }
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white font-mono text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Daftar layanan (kolom &quot;Layanan&quot; di footer)
                        </label>
                        <p className="text-xs text-gray-500 mb-2">Satu baris = satu item. Maksimal 20 baris.</p>
                        <textarea
                          value={footerServicesText}
                          onChange={(e) => setFooterServicesText(e.target.value)}
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white font-mono text-sm"
                          placeholder={DEFAULT_FOOTER_SERVICES.join('\n')}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Deskripsi section..."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Gambar
                  </label>
                    {formData.image_url && (
                      <img
                        src={imageUrl(formData.image_url)}
                        alt="Preview"
                        className="h-24 w-auto rounded-lg border border-gray-200 object-cover mb-3"
                        onError={(ev) => {
                          ev.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <label className="inline-flex items-center gap-2 px-3 py-2 bg-[#2f4274] text-white rounded-lg cursor-pointer hover:bg-[#2a3b68] text-sm font-medium">
                      <Upload size={16} />
                      {uploadingImage ? 'Mengupload...' : 'Upload Gambar'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        className="hidden"
                        onChange={handleUploadImage}
                        disabled={uploadingImage}
                      />
                    </label>
                    <input
                      type="text"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mt-2"
                      placeholder={isSiteIdentity ? 'Logo akan diisi dari hasil upload' : 'URL gambar atau filename upload'}
                      readOnly={isSiteIdentity}
                    />
                    {isSiteIdentity && (
                      <p className="text-xs text-gray-500 mt-1">
                        Untuk logo brand, gunakan tombol upload (tanpa input link manual).
                      </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teks Tombol
                    </label>
                    <input
                      type="text"
                      value={formData.button_text}
                      onChange={(e) => setFormData({...formData, button_text: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Konsultasi Gratis"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Tombol
                    </label>
                    <input
                      type="text"
                      value={formData.button_url}
                      onChange={(e) => setFormData({...formData, button_url: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="/contact"
                    />
                  </div>
                </div>
                    </>
                  );
                })()}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urutan
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingSection ? 'Perbarui' : 'Buat'} Konten
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
};

export default AdminContent; 