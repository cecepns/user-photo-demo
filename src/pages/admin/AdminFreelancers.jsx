import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Plus, Edit, Trash2, ChevronLeft, ChevronRight, Users, Phone, Copy, KeyRound,
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
  photo_price: '',
  video_price: '',
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
        className={`px-2.5 py-1 rounded-md text-sm font-bold tracking-wider ${
          highlight
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
    setForm({
      name: row.name || '',
      phone: row.phone || '',
      email: row.email || '',
      photo_price: row.photo_price ?? '',
      video_price: row.video_price ?? '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      photo_price: Number(form.photo_price) || 0,
      video_price: Number(form.video_price) || 0,
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
            <p className="text-gray-600">
              Login freelance memakai <strong>nomor HP</strong>. Password dibuat otomatis dan bisa dilihat di tabel.
            </p>
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
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Nama</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">No. HP (login)</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Password login</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Harga Foto</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Harga Video</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 w-36">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">Memuat...</td>
                  </tr>
                ) : freelancers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
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
                      <td className="px-4 py-3">
                        <PasswordBadge
                          value={f.login_password}
                          highlight={highlightIds.has(f.id)}
                        />
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">{formatRupiah(f.photo_price)}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{formatRupiah(f.video_price)}</td>
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
            <div className="bg-white rounded-xl max-w-md w-full p-6 my-8">
              <h3 className="text-lg font-semibold mb-1">{editingId ? 'Edit' : 'Tambah'} Freelance</h3>
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
                Password login dibuat <strong>otomatis</strong> oleh sistem. Setelah simpan, password muncul di tabel (kolom kuning).
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nama *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">No. HP (untuk login) *</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
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
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                    placeholder="Untuk catatan internal"
                  />
                </div>
                <input type="number" placeholder="Harga Foto" value={form.photo_price} onChange={(e) => setForm({ ...form, photo_price: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                <input type="number" placeholder="Harga Video" value={form.video_price} onChange={(e) => setForm({ ...form, video_price: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                <div className="flex gap-2 justify-end pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Batal</button>
                  <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg">Simpan</button>
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
