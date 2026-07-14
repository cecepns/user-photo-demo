import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Plus, Edit, Trash2, ChevronLeft, ChevronRight, Users, Phone, Copy, KeyRound, Info,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import { formatRupiah } from '../../utils/formatters';
import { API_ENDPOINTS } from '../../utils/endpoints';
import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/request';

const emptyForm = () => ({
  name: '',
  phone: '',
  email: '',
  rekening: '',
  alamat: '',
  rates: [{ label: 'Foto', price: '' }, { label: 'Video', price: '' }],
});

const PasswordBadge = ({ value, highlight }) => {
  if (!value) {
    return <span className="text-gray-400 text-sm">—</span>;
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Password disalin');
    } catch {
      toast.error('Gagal menyalin');
    }
  };
  return (
    <div className="flex items-center gap-2">
      <code
        className={`px-2.5 py-1 rounded-md text-sm font-bold tracking-wider ${highlight
            ? 'bg-amber-200 text-amber-950 ring-2 ring-amber-400 animate-pulse'
            : 'bg-amber-100 text-amber-900'
          }`}
      >
        {value}
      </code>
      <button
        type="button"
        onClick={copy}
        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
        title="Salin password"
      >
        <Copy size={14} />
      </button>
    </div>
  );
};

const AdminFreelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [loading, setLoading] = useState(false);
  const [highlightIds, setHighlightIds] = useState(() => new Set());
  const [regeneratingId, setRegeneratingId] = useState(null);

  const LIMIT_OPTIONS = [10, 25, 50, 100];

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const flashPassword = (id, password) => {
    setHighlightIds((prev) => new Set(prev).add(id));
    setFreelancers((list) =>
      list.map((f) => (f.id === id ? { ...f, login_password: password } : f)),
    );
    setTimeout(() => {
      setHighlightIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 8000);
  };

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pagination.page), limit: String(pagination.limit) });
      if (debouncedSearch) params.set('search', debouncedSearch);
      const data = await apiGet(`${API_ENDPOINTS.FREELANCERS.LIST}?${params}`);
      setFreelancers(data.data || []);
      setPagination((p) => ({
        ...p,
        page: data.pagination?.page ?? p.page,
        limit: data.pagination?.limit ?? p.limit,
        total: data.pagination?.total ?? 0,
        totalPages: data.pagination?.totalPages ?? 1,
      }));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch]);

  useEffect(() => { fetchList(); }, [fetchList]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowModal(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    let initialRates = Array.isArray(row.rates) ? row.rates : [];
    if (initialRates.length === 0) {
      initialRates = [
        { label: 'Foto', price: row.photo_price ?? '' },
        { label: 'Video', price: row.video_price ?? '' }
      ];
    }
    setForm({
      name: row.name || '',
      phone: row.phone || '',
      email: row.email || '',
      rekening: row.rekening || '',
      alamat: row.alamat || '',
      rates: initialRates,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      rekening: form.rekening.trim() || null,
      alamat: form.alamat.trim() || null,
      rates: form.rates
        .filter(r => r.label.trim())
        .map(r => ({ label: r.label.trim(), price: Number(r.price) || 0 })),
    };
    try {
      if (editingId) {
        const data = await apiPut(API_ENDPOINTS.FREELANCERS.UPDATE(editingId), body);
        toast.success('Freelance diperbarui');
        if (data.login_password) {
          flashPassword(Number(editingId), data.login_password);
          toast.success(`Password baru: ${data.login_password}`, { duration: 6000 });
        }
      } else {
        const data = await apiPost(API_ENDPOINTS.FREELANCERS.CREATE, body);
        toast.success('Freelance ditambahkan');
        if (data.login_password) {
          toast.success(`Password login: ${data.login_password}`, { duration: 8000 });
        }
      }
      setShowModal(false);
      fetchList();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRegeneratePassword = async (row) => {
    if (!window.confirm(`Buat password baru untuk ${row.name}?`)) return;
    setRegeneratingId(row.id);
    try {
      const data = await apiPost(API_ENDPOINTS.FREELANCERS.REGENERATE_PASSWORD(row.id), {});
      flashPassword(row.id, data.login_password);
      toast.success(`Password baru: ${data.login_password}`, { duration: 8000 });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Nonaktifkan freelance ini? Akun login tidak bisa dipakai lagi.')) return;
    try {
      await apiDelete(API_ENDPOINTS.FREELANCERS.DELETE(id));
      toast.success('Dinonaktifkan');
      fetchList();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <Helmet><title>Freelance Inhouse - Admin</title></Helmet>
      <AdminLayout>
        <div className="mb-6 flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Database Freelance Inhouse</h1>
          </div>
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg shrink-0">
            <Plus size={18} /> Tambah
          </button>
        </div>

        <input
          type="search"
          placeholder="Cari nama atau nomor HP..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
          className="mb-4 border rounded-lg px-3 py-2 max-w-sm w-full"
        />

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="md:hidden flex items-center gap-2 m-4 mb-2 text-blue-700 bg-blue-50 px-3 py-2 rounded-lg text-xs font-medium">
            <Info size={14} className="shrink-0 animate-pulse" />
            <span>Geser tabel ke kanan untuk melihat kolom lainnya &amp; tombol aksi &rarr;</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Nama</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">No. HP (login)</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">No. Rekening</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Alamat</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Password login</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Daftar Tugas &amp; Harga</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 w-36">Edit</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500">Memuat...</td>
                  </tr>
                ) : freelancers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                      <Users className="mx-auto mb-2 text-gray-300" size={36} />
                      <p className="font-medium text-gray-700">
                        {debouncedSearch ? 'Tidak ada data yang cocok' : 'Belum ada data freelance'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  freelancers.map((f) => (
                    <tr key={f.id} className="border-t border-gray-100 hover:bg-gray-50/80">
                      <td className="px-4 py-3 font-medium text-gray-900">{f.name}</td>
                      <td className="px-4 py-3 text-gray-700">
                        <span className="inline-flex items-center gap-1">
                          <Phone size={14} className="text-gray-400 shrink-0" />
                          {f.phone || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{f.rekening || '—'}</td>
                      <td className="px-4 py-3 text-gray-700 max-w-xs truncate" title={f.alamat}>{f.alamat || '—'}</td>
                      <td className="px-4 py-3">
                        <PasswordBadge
                          value={f.login_password}
                          highlight={highlightIds.has(f.id)}
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        <div className="flex flex-wrap gap-1">
                          {f.rates?.length > 0 ? (
                            f.rates.map((r, idx) => (
                              <span key={idx} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-100">
                                {r.label}: {formatRupiah(r.price)}
                              </span>
                            ))
                          ) : (
                            <>
                              <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700 border border-gray-150">
                                Foto: {formatRupiah(f.photo_price)}
                              </span>
                              <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700 border border-gray-150">
                                Video: {formatRupiah(f.video_price)}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleRegeneratePassword(f)}
                            disabled={regeneratingId === f.id}
                            className="p-2 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:opacity-50"
                            title="Generate ulang password"
                          >
                            <KeyRound size={16} />
                          </button>
                          <button type="button" onClick={() => openEdit(f)} className="p-2 rounded-lg text-primary-600 bg-primary-50 hover:bg-primary-100">
                            <Edit size={16} />
                          </button>
                          <button type="button" onClick={() => handleDelete(f.id)} className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && pagination.total > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Tampilkan</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => setPagination((p) => ({ ...p, limit: Number(e.target.value), page: 1 }))}
                  className="border border-gray-200 rounded-lg px-2 py-1 text-sm"
                >
                  {LIMIT_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span>
                  · {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total}
                </span>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2">
                <span className="text-sm text-gray-600 sm:mr-2">
                  Halaman {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40"
                >
                  <ChevronLeft size={16} /> Sebelumnya
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40"
                >
                  Berikutnya <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-1">{editingId ? 'Edit' : 'Tambah'} Freelance</h3>
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
                Password login dibuat <strong>otomatis</strong> oleh sistem. Setelah simpan, password muncul di tabel (kolom kuning).
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nama *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-1 focus:ring-primary-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">No. HP (untuk login) *</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    placeholder="08xxxxxxxxxx"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email (opsional)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    placeholder="Untuk catatan internal"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">No. Rekening (opsional)</label>
                  <input
                    value={form.rekening}
                    onChange={(e) => setForm({ ...form, rekening: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    placeholder="Contoh: BCA 1234567890 a/n Edo"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Alamat (opsional)</label>
                  <textarea
                    value={form.alamat}
                    onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    placeholder="Alamat lengkap freelancer"
                    rows={2}
                  />
                </div>

                <div className="space-y-2 border-t pt-3">
                  <label className="text-sm font-medium text-gray-700 block">Daftar Tugas &amp; Harga</label>
                  {form.rates.map((rate, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        placeholder="Nama tugas (misal: Akad Foto/Video)"
                        value={rate.label}
                        onChange={(e) => {
                          const next = [...form.rates];
                          next[idx] = { ...next[idx], label: e.target.value };
                          setForm({ ...form, rates: next });
                        }}
                        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 focus:outline-none"
                        required
                      />
                      <input
                        type="number"
                        min={0}
                        placeholder="Harga (Rp)"
                        value={rate.price}
                        onChange={(e) => {
                          const next = [...form.rates];
                          next[idx] = { ...next[idx], price: e.target.value };
                          setForm({ ...form, rates: next });
                        }}
                        className="w-32 border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = form.rates.filter((_, i) => i !== idx);
                          setForm({ ...form, rates: next });
                        }}
                        disabled={form.rates.length <= 1}
                        className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50"
                        title="Hapus baris"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, rates: [...form.rates, { label: '', price: '' }] })}
                    className="text-xs text-primary-600 flex items-center gap-1 font-semibold hover:text-primary-700 transition-colors mt-1"
                  >
                    <Plus size={14} /> Tambah tugas &amp; rate baru
                  </button>
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">Batal</button>
                  <button type="submit" className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 transition-colors rounded-lg">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
};

export default AdminFreelancers;
