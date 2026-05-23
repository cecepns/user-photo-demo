import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, Camera, Video, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import { formatRupiah } from '../../utils/formatters';
import { API_ENDPOINTS } from '../../utils/endpoints';
import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/request';

const AdminFreelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', photo_price: '', video_price: '' });
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [priceModalType, setPriceModalType] = useState(null);
  const [loading, setLoading] = useState(false);

  const LIMIT_OPTIONS = [10, 25, 50, 100];

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

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
    setForm({ name: '', photo_price: '', video_price: '' });
    setShowModal(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      photo_price: row.photo_price,
      video_price: row.video_price,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      name: form.name.trim(),
      photo_price: Number(form.photo_price) || 0,
      video_price: Number(form.video_price) || 0,
    };
    try {
      if (editingId) {
        await apiPut(API_ENDPOINTS.FREELANCERS.UPDATE(editingId), body);
        toast.success('Freelance diperbarui');
      } else {
        await apiPost(API_ENDPOINTS.FREELANCERS.CREATE, body);
        toast.success('Freelance ditambahkan');
      }
      setShowModal(false);
      fetchList();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Nonaktifkan freelance ini?')) return;
    try {
      await apiDelete(API_ENDPOINTS.FREELANCERS.DELETE(id));
      toast.success('Dinonaktifkan');
      fetchList();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <Helmet><title>Freelance Inhouse - Admin</title></Helmet>
      <AdminLayout>
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Database Freelance Inhouse</h1>
            <p className="text-gray-600">Daftar freelance dan harga jasa foto/video.</p>
          </div>
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg">
            <Plus size={18} /> Tambah
          </button>
        </div>

        <input
          type="search"
          placeholder="Cari nama..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
          className="mb-4 border rounded-lg px-3 py-2 max-w-sm w-full"
        />

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Memuat...</div>
          ) : freelancers.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Users className="mx-auto mb-3 text-gray-300" size={40} />
              <p className="font-medium text-gray-700">
                {debouncedSearch ? 'Tidak ada freelance yang cocok dengan pencarian' : 'Belum ada data freelance inhouse'}
              </p>
              <p className="text-sm mt-1 text-gray-400">
                {debouncedSearch
                  ? 'Coba kata kunci lain atau kosongkan pencarian.'
                  : 'Klik tombol Tambah untuk menambahkan freelance pertama.'}
              </p>
            </div>
          ) : (
            <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {freelancers.map((f) => (
                <div key={f.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-lg mb-3">{f.name}</h3>
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => { setSelectedFreelancer(f); setPriceModalType('photo'); }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm"
                    >
                      <Camera size={16} /> Foto
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedFreelancer(f); setPriceModalType('video'); }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-secondary-50 text-secondary-700 rounded-lg text-sm"
                    >
                      <Video size={16} /> Video
                    </button>
                  </div>
                  <div className="flex gap-2 text-sm text-gray-500">
                    <button type="button" onClick={() => openEdit(f)} className="text-primary-600"><Edit size={16} /></button>
                    <button type="button" onClick={() => handleDelete(f.id)} className="text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && pagination.total > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Tampilkan</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => setPagination((p) => ({
                    ...p,
                    limit: Number(e.target.value),
                    page: 1,
                  }))}
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
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronLeft size={16} /> Sebelumnya
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                >
                  Berikutnya <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {priceModalType && selectedFreelancer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">{selectedFreelancer.name}</h3>
              <p className="text-gray-600 mb-1">Harga jasa {priceModalType === 'photo' ? 'Foto' : 'Video'}</p>
              <p className="text-2xl font-bold text-primary-600">
                {formatRupiah(priceModalType === 'photo' ? selectedFreelancer.photo_price : selectedFreelancer.video_price)}
              </p>
              <button type="button" onClick={() => setPriceModalType(null)} className="mt-4 px-4 py-2 border rounded-lg w-full">Tutup</button>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Tambah'} Freelance</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
                <input type="number" placeholder="Harga Foto" value={form.photo_price} onChange={(e) => setForm({ ...form, photo_price: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                <input type="number" placeholder="Harga Video" value={form.video_price} onChange={(e) => setForm({ ...form, video_price: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                <div className="flex gap-2 justify-end">
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
