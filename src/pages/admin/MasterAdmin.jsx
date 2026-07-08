import React, { useState, useEffect } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/request';
import { 
  Plus, Edit, Trash2, Key, Calendar, Globe, Search, 
  Building, Clock, ExternalLink, ShieldAlert, Check, X, 
  Palette, AlertCircle, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MasterAdmin() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Form States
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    custom_domain: '',
    logo_url: '',
    primary_color: '#2f4274',
    expired_at: '',
    is_active: true
  });
  
  const [resetData, setResetData] = useState({
    email: 'admin@weddingbliss.com',
    password: ''
  });
  
  const [deleteConfirm, setDeleteConfirm] = useState({
    dropDatabase: false,
    confirmName: ''
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const data = await apiGet('/api/admin/tenants');
      setTenants(data || []);
    } catch (err) {
      toast.error('Gagal mengambil data tenant: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setSelectedTenant(null);
    setFormData({
      name: '',
      subdomain: '',
      custom_domain: '',
      logo_url: '',
      primary_color: '#2f4274',
      expired_at: '',
      is_active: true
    });
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (tenant) => {
    setSelectedTenant(tenant);
    setFormData({
      name: tenant.name || '',
      subdomain: tenant.subdomain || '',
      custom_domain: tenant.custom_domain || '',
      logo_url: tenant.logo_url || '',
      primary_color: tenant.primary_color || '#2f4274',
      expired_at: tenant.expired_at ? tenant.expired_at.split('T')[0] : '',
      is_active: tenant.is_active === 1 || tenant.is_active === true
    });
    setShowAddEditModal(true);
  };

  const handleOpenReset = (tenant) => {
    setSelectedTenant(tenant);
    setResetData({
      email: 'admin@weddingbliss.com',
      password: ''
    });
    setShowResetModal(true);
  };

  const handleOpenDelete = (tenant) => {
    setSelectedTenant(tenant);
    setDeleteConfirm({
      dropDatabase: false,
      confirmName: ''
    });
    setShowDeleteModal(true);
  };

  const handleSubmitAddEdit = async (e) => {
    e.preventDefault();
    const cleanSubdomain = formData.subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
    
    const payload = {
      ...formData,
      subdomain: cleanSubdomain,
      expired_at: formData.expired_at || null
    };

    try {
      if (selectedTenant) {
        // Edit Mode
        await apiPut(`/api/admin/tenants/${selectedTenant.id}`, payload);
        toast.success('Tenant berhasil diperbarui.');
      } else {
        // Add Mode
        await apiPost('/api/admin/tenants', payload);
        toast.success('Tenant berhasil didaftarkan dan database diinisialisasi.');
      }
      setShowAddEditModal(false);
      fetchTenants();
    } catch (err) {
      toast.error(err.message || 'Operasi gagal.');
    }
  };

  const handleResetAdmin = async (e) => {
    e.preventDefault();
    if (!resetData.password || resetData.password.length < 6) {
      toast.error('Password minimal 6 karakter.');
      return;
    }

    try {
      await apiPost(`/api/admin/tenants/${selectedTenant.id}/reset-admin`, resetData);
      toast.success('Kredensial admin brand berhasil diperbarui.');
      setShowResetModal(false);
    } catch (err) {
      toast.error(err.message || 'Gagal mengubah password.');
    }
  };

  const handleDeleteTenant = async () => {
    if (deleteConfirm.confirmName !== selectedTenant.subdomain) {
      toast.error('Konfirmasi subdomain tidak cocok.');
      return;
    }

    try {
      await apiDelete(`/api/admin/tenants/${selectedTenant.id}?dropDatabase=${deleteConfirm.dropDatabase}`);
      toast.success('Tenant berhasil dihapus.');
      setShowDeleteModal(false);
      fetchTenants();
    } catch (err) {
      toast.error(err.message || 'Gagal menghapus tenant.');
    }
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.custom_domain && t.custom_domain.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (tenant) => {
    const now = new Date();
    const isExpired = tenant.expired_at && new Date(tenant.expired_at + 'T23:59:59') < now;
    const isActive = tenant.is_active === 1 || tenant.is_active === true;

    if (!isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Nonaktif
        </span>
      );
    }
    if (isExpired) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          Expired (Habis)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Aktif
      </span>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-bold leading-7 text-slate-900 sm:text-4xl sm:truncate flex items-center gap-3">
              <Building className="text-primary-600" size={36} />
              Master Admin Panel
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Kelola seluruh website client, database tenant, masa aktif layanan, dan domain.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={handleOpenAdd}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Daftarkan Brand Baru
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-xl p-5 border border-slate-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                <Building size={24} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Total Website Tenant</dt>
                  <dd className="text-2xl font-semibold text-slate-900">{tenants.length}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-xl p-5 border border-slate-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg text-green-600">
                <Check size={24} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Situs Aktif</dt>
                  <dd className="text-2xl font-semibold text-slate-900">
                    {tenants.filter(t => {
                      const now = new Date();
                      const isExpired = t.expired_at && new Date(t.expired_at + 'T23:59:59') < now;
                      return t.is_active && !isExpired;
                    }).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-xl p-5 border border-slate-200">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg text-red-600">
                <Clock size={24} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Nonaktif / Expired</dt>
                  <dd className="text-2xl font-semibold text-slate-900">
                    {tenants.filter(t => {
                      const now = new Date();
                      const isExpired = t.expired_at && new Date(t.expired_at + 'T23:59:59') < now;
                      return !t.is_active || isExpired;
                    }).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Table Card */}
        <div className="bg-white shadow rounded-xl border border-slate-200 overflow-hidden">
          {/* Filter Bar */}
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Cari berdasarkan nama, subdomain, atau domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="text-xs text-slate-500">
              Menampilkan {filteredTenants.length} dari {tenants.length} Tenant
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-10 text-center text-slate-500">Memuat data...</div>
          ) : filteredTenants.length === 0 ? (
            <div className="p-10 text-center text-slate-500">Tidak ada brand yang ditemukan.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Brand / Database</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Akses Subdomain</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Custom Domain</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Warna Tema</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Masa Aktif</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredTenants.map((tenant) => {
                    const domainLink = tenant.custom_domain 
                      ? `http://${tenant.custom_domain}` 
                      : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                        ? `http://${tenant.subdomain}.localhost:5173`
                        : `http://${tenant.subdomain}.user-photo.my.id`;
                    return (
                      <tr key={tenant.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {tenant.logo_url ? (
                              <img className="h-9 w-9 rounded-full object-cover border border-slate-200" src={tenant.logo_url} alt="" />
                            ) : (
                              <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                                {tenant.name.slice(0, 1).toUpperCase()}
                              </div>
                            )}
                            <div className="ml-3">
                              <div className="text-sm font-medium text-slate-900">{tenant.name}</div>
                              <div className="text-xs text-slate-500 font-mono">{tenant.db_name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a 
                            href={`${domainLink}?tenant=${tenant.subdomain}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                          >
                            {tenant.subdomain}
                            <ExternalLink size={14} className="ml-1" />
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {tenant.custom_domain ? (
                            <span className="flex items-center gap-1">
                              <Globe size={14} className="text-slate-400" />
                              {tenant.custom_domain}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <span 
                              className="h-4 w-4 rounded-full border border-slate-300 inline-block"
                              style={{ backgroundColor: tenant.primary_color }}
                            />
                            <span className="font-mono text-xs">{tenant.primary_color}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {tenant.expired_at ? (
                            <span className="flex items-center gap-1.5">
                              <Calendar size={14} className="text-slate-400" />
                              {new Date(tenant.expired_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          ) : (
                            <span className="text-green-600 font-medium">Selamanya (Lifetime)</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(tenant)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenReset(tenant)}
                              title="Reset Password Tenant Admin"
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            >
                              <Key size={18} />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(tenant)}
                              title="Edit Tenant"
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleOpenDelete(tenant)}
                              title="Hapus Tenant"
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 1. Modal: Tambah & Edit Tenant */}
      {showAddEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">
                {selectedTenant ? 'Edit Konfigurasi Website Brand' : 'Daftarkan Brand Baru'}
              </h3>
              <button 
                onClick={() => setShowAddEditModal(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitAddEdit}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Brand Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Brand / Client</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Contoh: Edo Wedding Photo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Subdomain */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Akses Subdomain</label>
                  <div className="flex rounded-lg shadow-sm">
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-l-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="contoh: edo-photo"
                      value={formData.subdomain}
                      onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                    />
                    <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-slate-300 bg-slate-50 text-slate-500 text-sm font-mono">
                      .user-photo.my.id
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">Gunakan hanya huruf kecil, angka, dan tanda hubung (-).</p>
                </div>

                {/* Custom Domain */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Custom Domain (Opsional)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Contoh: edophotography.com"
                    value={formData.custom_domain}
                    onChange={(e) => setFormData({ ...formData, custom_domain: e.target.value })}
                  />
                </div>

                {/* Logo URL */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Logo URL (Opsional)</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://example.com/logo.png"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  />
                </div>

                {/* Primary Theme Color */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Warna Utama Tema (Hex)</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      className="h-9 w-12 border border-slate-300 rounded-lg p-0.5 cursor-pointer"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    />
                    <input
                      type="text"
                      required
                      maxLength={7}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="#2f4274"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    />
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Masa Aktif Layanan / Tanggal Expired</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.expired_at}
                    onChange={(e) => setFormData({ ...formData, expired_at: e.target.value })}
                  />
                  <p className="mt-1 text-xs text-slate-400">Kosongkan jika ingin diset selamanya (Lifetime).</p>
                </div>

                {/* Active Toggle (Only on Edit) */}
                {selectedTenant && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700">Status Aktif Situs</label>
                      <p className="text-xs text-slate-500">Nonaktifkan untuk menangguhkan akses website.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        formData.is_active ? 'bg-indigo-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          formData.is_active ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {selectedTenant ? 'Simpan Perubahan' : 'Mulai Inisialisasi Website'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Reset Tenant Admin Credentials */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lock className="text-amber-500" size={20} />
                Atur Ulang Kredensial Tenant
              </h3>
              <button 
                onClick={() => setShowResetModal(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleResetAdmin}>
              <div className="p-6 space-y-4">
                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 text-xs text-amber-800 rounded">
                  Langkah ini akan langsung mengganti email & password admin utama pada database brand **{selectedTenant?.name}**.
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email Login Admin</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    value={resetData.email}
                    onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Password Baru</label>
                  <input
                    type="password"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Masukkan minimal 6 karakter..."
                    value={resetData.password}
                    onChange={(e) => setResetData({ ...resetData, password: e.target.value })}
                  />
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
                >
                  Update Kredensial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Hapus Tenant */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="bg-red-50 px-6 py-4 border-b border-red-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-red-950 flex items-center gap-2">
                <ShieldAlert className="text-red-600" size={20} />
                Konfirmasi Hapus Website Brand
              </h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-red-400 hover:text-red-700 rounded-lg p-1 hover:bg-red-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-sm text-slate-600">
                Apakah Anda yakin ingin menghapus situs **{selectedTenant?.name}**? Akses domain/subdomain akan langsung dihentikan.
              </div>
              
              {/* Drop DB Toggle */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="drop-db"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300 rounded"
                      checked={deleteConfirm.dropDatabase}
                      onChange={(e) => setDeleteConfirm({ ...deleteConfirm, dropDatabase: e.target.checked })}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="drop-db" className="font-semibold text-slate-800 flex items-center gap-1.5 cursor-pointer">
                      Hapus Database Fisik Permanen
                    </label>
                    <p className="text-xs text-red-500 mt-1">
                      Peringatan: Seluruh data portfolio, admin, pesanan, dan aset database **{selectedTenant?.db_name}** akan dihapus permanen dari server dan tidak dapat dikembalikan!
                    </p>
                  </div>
                </div>
              </div>

              {/* Type subdomain check */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                  Ketik subdomain <span className="font-mono text-red-600 font-bold">{selectedTenant?.subdomain}</span> untuk melanjutkan:
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  placeholder=""
                  value={deleteConfirm.confirmName}
                  onChange={(e) => setDeleteConfirm({ ...deleteConfirm, confirmName: e.target.value })}
                />
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteTenant}
                disabled={deleteConfirm.confirmName !== selectedTenant?.subdomain}
                type="button"
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors"
              >
                Ya, Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
