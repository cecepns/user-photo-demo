import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AsyncSelect from 'react-select/async';
import { Edit, Trash2, Plus, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import { formatDate, toDateOnlyString } from '../../utils/formatters';
import { API_ENDPOINTS } from '../../utils/endpoints';
import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/request';
import { API_BASE, imageUrl } from '../../utils/imageUrl';
import {
  PHOTO_STATUS_OPTIONS,
  VIDEO_STATUS_OPTIONS,
  formatPhotoStatus,
  formatVideoStatus,
} from '../../constants/orderProgress';

// Status yang termasuk kategori "Progres"
const PROGRESS_PHOTO_STATUSES = ['photo_progress', 'editing', 'draft_album', 'printing', 'shipping'];
const PROGRESS_VIDEO_STATUSES = ['video_progress', 'processing', 'revision'];

const FILTER_TABS = [
  { id: 'all', label: 'Semua' },
  { id: 'progress', label: 'Progres' },
  { id: 'done', label: 'Selesai' },
];

const AdminOrderProgress = () => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedOrderOpt, setSelectedOrderOpt] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState({
    photo_status: 'photo_progress',
    video_status: 'video_progress',
    photo_link: '',
    video_link: '',
    album_status: 'pending',
    estimated_completion: '',
    album_link: '',
    custom_links: [],
  });

  const fetchAlbumPhotos = useCallback(async (id = editingId) => {
    if (!id) return;
    try {
      const res = await apiGet(`/api/order-progress/${id}/photos`);
      setPhotos(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    }
  }, [editingId]);

  const compressImage = (file, maxWidth = 1000, quality = 0.6) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }));
          }, 'image/jpeg', quality);
        };
      };
    });
  };


  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
      });
      if (q.trim()) params.set('q', q.trim());
      const data = await apiGet(`${API_ENDPOINTS.ORDER_PROGRESS.LIST}?${params}`);
      setItems(data.items || []);
      setPagination((p) => ({
        ...p,
        total: data.pagination?.total ?? 0,
        totalPages: data.pagination?.totalPages ?? 1,
      }));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, q]);

  useEffect(() => {
    const t = setTimeout(() => fetchList(), 300);
    return () => clearTimeout(t);
  }, [fetchList]);

  // Filter items berdasarkan tab aktif
  const filteredItems = items.filter((row) => {
    if (activeFilter === 'all') return true;
    const photoInProgress = PROGRESS_PHOTO_STATUSES.includes(row.photo_status);
    const videoInProgress = PROGRESS_VIDEO_STATUSES.includes(row.video_status);
    const photoDone = row.photo_status === 'completed';
    const videoDone = row.video_status === 'completed';
    if (activeFilter === 'progress') {
      return photoInProgress || videoInProgress;
    }
    if (activeFilter === 'done') {
      return photoDone && videoDone;
    }
    return true;
  });

  const loadOrderOptions = async (inputValue) => {
    const data = await apiGet(`${API_ENDPOINTS.ORDERS.SEARCH}?q=${encodeURIComponent(inputValue || '')}`);
    const rows = Array.isArray(data) ? data : [];
    return rows.map((row) => {
      const isCustom = row.order_source === 'custom_request';
      const prefix = isCustom ? 'C' : '';
      return {
        value: isCustom ? `custom:${row.id}` : `order:${row.id}`,
        label: `#${prefix}${row.id} — ${row.name || '-'} (${formatDate(row.wedding_date)})`,
        order: { id: row.id, source: isCustom ? 'custom_request' : 'order', name: row.name },
      };
    });
  };

  const openCreate = () => {
    setEditingId(null);
    setPhotos([]);
    setForm({
      photo_status: 'photo_progress',
      video_status: 'video_progress',
      photo_link: '',
      video_link: '',
      album_status: 'pending',
      estimated_completion: '',
      album_link: '',
      custom_links: [],
    });
    setSelectedOrderOpt(null);
    setShowModal(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setPhotos([]);
    fetchAlbumPhotos(row.id);
    let parsedCustomLinks = [];
    try {
      if (row.custom_links) {
        parsedCustomLinks = typeof row.custom_links === 'string'
          ? JSON.parse(row.custom_links)
          : row.custom_links;
      }
    } catch (e) {
      console.error("Error parsing custom links:", e);
    }
    setForm({
      photo_status: row.photo_status,
      video_status: row.video_status,
      photo_link: row.photo_link || '',
      video_link: row.video_link || '',
      album_status: row.album_status || 'pending',
      estimated_completion: toDateOnlyString(row.estimated_completion),
      album_link: row.album_link || '',
      custom_links: Array.isArray(parsedCustomLinks) ? parsedCustomLinks : [],
    });

    const isCustom = row.order_source === 'custom_request';
    setSelectedOrderOpt({
      value: isCustom ? `custom:${row.order_id}` : `order:${row.order_id}`,
      label: `#${isCustom ? 'C' : ''}${row.order_id} — ${row.client_name}`,
      order: { id: row.order_id, source: row.order_source, name: row.client_name },
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      custom_links: JSON.stringify(form.custom_links),
    };
    try {
      if (editingId) {
        await apiPut(API_ENDPOINTS.ORDER_PROGRESS.UPDATE(editingId), payload);
        toast.success('Progress diperbarui');
      } else {
        if (!selectedOrderOpt?.order) {
          toast.error('Pilih pesanan');
          return;
        }
        await apiPost(API_ENDPOINTS.ORDER_PROGRESS.CREATE, {
          order_source: selectedOrderOpt.order.source,
          order_id: selectedOrderOpt.order.id,
          ...payload,
        });
        toast.success('Progress dibuat');
      }
      setShowModal(false);
      fetchList();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus progress ini?')) return;
    try {
      await apiDelete(API_ENDPOINTS.ORDER_PROGRESS.DELETE(id));
      toast.success('Dihapus');
      fetchList();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const getStatusBadgeColor = (status, type) => {
    if (status === 'completed') return 'bg-green-100 text-green-800';
    if (type === 'photo' && PROGRESS_PHOTO_STATUSES.includes(status)) return 'bg-blue-100 text-blue-800';
    if (type === 'video' && PROGRESS_VIDEO_STATUSES.includes(status)) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <>
      <Helmet><title>Progress Pesanan - Admin</title></Helmet>
      <AdminLayout>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Progress Pesanan</h1>
            <p className="text-gray-600">Status progres foto &amp; video pesanan.</p>
          </div>
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg">
            <Plus size={18} /> Tambah Progress
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {FILTER_TABS.map((tab) => {
            const count = items.filter((row) => {
              if (tab.id === 'all') return true;
              const photoInProg = PROGRESS_PHOTO_STATUSES.includes(row.photo_status);
              const videoInProg = PROGRESS_VIDEO_STATUSES.includes(row.video_status);
              const photoDone = row.photo_status === 'completed';
              const videoDone = row.video_status === 'completed';
              if (tab.id === 'progress') return photoInProg || videoInProg;
              if (tab.id === 'done') return photoDone && videoDone;
              return true;
            }).length;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeFilter === tab.id
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <input
          type="search"
          placeholder="Cari nama client..."
          value={q}
          onChange={(e) => { setQ(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
          className="mb-4 border rounded-lg px-3 py-2 w-full max-w-sm"
        />

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="md:hidden flex items-center gap-2 m-4 mb-2 text-blue-700 bg-blue-50 px-3 py-2 rounded-lg text-xs font-medium">
            <Info size={14} className="shrink-0 animate-pulse" />
            <span>Geser tabel ke kanan untuk melihat kolom lainnya &amp; tombol aksi &rarr;</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Foto</th>
                <th className="px-4 py-3 text-left">Video</th>
                <th className="px-4 py-3 text-left">Link</th>
                <th className="px-4 py-3 text-left">Status Album</th>
                <th className="px-4 py-3">Edit</th>

              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center">Memuat...</td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">

                  {activeFilter === 'progress' ? 'Tidak ada pesanan yang sedang progres' :
                    activeFilter === 'done' ? 'Tidak ada pesanan yang selesai' : 'Belum ada data'}
                </td></tr>
              ) : (
                filteredItems.map((row) => (
                  <tr key={row.id} className="border-t hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.client_name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(row.photo_status, 'photo')}`}>
                        {formatPhotoStatus(row.photo_status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(row.video_status, 'video')}`}>
                        {formatVideoStatus(row.video_status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {(() => {
                        let parsed = [];
                        try {
                          if (row.custom_links) {
                            parsed = typeof row.custom_links === 'string' ? JSON.parse(row.custom_links) : row.custom_links;
                          }
                        } catch {}
                        const hasCustom = Array.isArray(parsed) && parsed.length > 0;
                        const hasDefault = row.photo_link || row.video_link || row.album_link;
                        
                        return (
                          <>
                            {row.photo_link && <a href={row.photo_link} target="_blank" rel="noreferrer" className="text-primary-600 block hover:underline">📷 Foto</a>}
                            {row.video_link && <a href={row.video_link} target="_blank" rel="noreferrer" className="text-primary-600 block hover:underline">🎬 Video</a>}
                            {row.album_link && <a href={row.album_link} target="_blank" rel="noreferrer" className="text-primary-600 block hover:underline">📖 Album</a>}
                            {hasCustom && parsed.map((lnk, idx) => (
                              lnk.url && <a key={idx} href={lnk.url} target="_blank" rel="noreferrer" className="text-primary-600 block hover:underline">🔗 {lnk.title || 'Link'}</a>
                            ))}
                            {!hasDefault && !hasCustom && <span className="text-gray-400">–</span>}
                          </>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${row.album_status === 'selesai'
                          ? 'bg-green-100 text-green-800'
                          : row.album_status === 'diproses'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                        {row.album_status === 'selesai' ? 'Selesai' : row.album_status === 'diproses' ? 'Diproses' : 'Pending'}
                      </span>
                      {row.estimated_completion && (
                        <p className="text-[10px] text-gray-500 mt-1">Est: {formatDate(row.estimated_completion)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 flex gap-2 justify-center">
                      {row.photo_status === 'completed' && row.video_status === 'completed' ? (
                        <span className="text-gray-300 p-1 cursor-not-allowed" title="Selesai (tidak dapat diedit)"><Edit size={18} /></span>
                      ) : (
                        <button type="button" onClick={() => openEdit(row)} className="text-primary-600 p-1 rounded hover:bg-primary-50" title="Edit"><Edit size={18} /></button>
                      )}
                      <button type="button" onClick={() => handleDelete(row.id)} className="text-red-600 p-1 rounded hover:bg-red-50"><Trash2 size={18} /></button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
        {!loading && pagination.total > pagination.limit && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Total: {pagination.total} data</span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                ← Sebelumnya
              </button>
              <span className="px-3 py-1">Hal {pagination.page}/{pagination.totalPages}</span>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Berikutnya →
              </button>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Tambah'} Progress</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingId && (
                  <div>
                    <label className="text-sm font-medium">Pesanan</label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={loadOrderOptions}
                      value={selectedOrderOpt}
                      onChange={setSelectedOrderOpt}
                      placeholder="Cari pesanan..."
                    />
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium">Progres Foto</label>
                  <select
                    value={form.photo_status}
                    onChange={(e) => setForm({ ...form, photo_status: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  >
                    {PHOTO_STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Progres Video</label>
                  <select
                    value={form.video_status}
                    onChange={(e) => setForm({ ...form, video_status: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  >
                    {VIDEO_STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Status Album</label>
                  <select
                    value={form.album_status}
                    onChange={(e) => setForm({ ...form, album_status: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="diproses">Diproses</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Estimasi Selesai (Album)</label>
                  <input
                    type="date"
                    value={form.estimated_completion}
                    onChange={(e) => setForm({ ...form, estimated_completion: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Link Foto</label>
                  <input
                    type="url"
                    value={form.photo_link}
                    onChange={(e) => setForm({ ...form, photo_link: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Link Video</label>
                  <input
                    type="url"
                    value={form.video_link}
                    onChange={(e) => setForm({ ...form, video_link: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Link Album</label>
                  <input
                    type="url"
                    value={form.album_link}
                    onChange={(e) => setForm({ ...form, album_link: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2 border-t pt-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Link Kustom Tambahan</label>
                    <button
                      type="button"
                      onClick={() => {
                        const currentLinks = Array.isArray(form.custom_links) ? form.custom_links : [];
                        setForm({ ...form, custom_links: [...currentLinks, { title: '', url: '' }] });
                      }}
                      className="text-xs text-primary-600 font-semibold hover:underline"
                    >
                      + Tambah Link
                    </button>
                  </div>
                  {(Array.isArray(form.custom_links) ? form.custom_links : []).map((link, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        placeholder="Judul link (misal: Drive 1)"
                        value={link.title}
                        onChange={(e) => {
                          const next = [...form.custom_links];
                          next[idx] = { ...next[idx], title: e.target.value };
                          setForm({ ...form, custom_links: next });
                        }}
                        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 focus:outline-none"
                        required
                      />
                      <input
                        type="url"
                        placeholder="URL (https://...)"
                        value={link.url}
                        onChange={(e) => {
                          const next = [...form.custom_links];
                          next[idx] = { ...next[idx], url: e.target.value };
                          setForm({ ...form, custom_links: next });
                        }}
                        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = form.custom_links.filter((_, i) => i !== idx);
                          setForm({ ...form, custom_links: next });
                        }}
                        className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100"
                        title="Hapus link"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {editingId && (
                  <div className="border-t pt-4 space-y-4">
                    <h4 className="text-sm font-bold text-gray-800">Alur Penyortiran &amp; Cetak Album</h4>
                    
                    {/* Step 1: Upload Sorting Photos */}
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-700">1. Unggah Foto Sortir</span>
                        <span className="text-[10px] text-gray-500">Otomatis Dikompres Sisi Klien</span>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length === 0) return;
                          
                          const toastId = toast.loading("Mengompres & mengunggah gambar...");
                          try {
                            const formData = new FormData();
                            for (const file of files) {
                              const compressed = await compressImage(file, 1000, 0.6);
                              formData.append("files", compressed);
                            }
                            
                            const res = await fetch(`${API_BASE}/api/order-progress/${editingId}/upload-sort`, {
                              method: "POST",
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem("admin_token")}`
                              },
                              body: formData
                            });
                            const data = await res.json();
                            if (res.ok) {
                              toast.success("Foto sortir berhasil diunggah!", { id: toastId });
                              fetchAlbumPhotos(editingId);
                            } else {
                              toast.error(data.message || "Gagal unggah", { id: toastId });
                            }
                          } catch (err) {
                            toast.error("Error upload", { id: toastId });
                          }
                        }}
                        className="w-full text-xs"
                      />
                    </div>

                    {/* Step 2: Client selections & Upload Highres */}
                    {photos.length > 0 && (
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-gray-700">2. Foto Terpilih Klien ({photos.filter(p => p.is_selected === 1).length})</span>
                          <button
                            type="button"
                            onClick={() => {
                              const list = photos.filter(p => p.is_selected === 1).map(p => p.filename).join("\n");
                              navigator.clipboard.writeText(list);
                              toast.success("Daftar nama file disalin!");
                            }}
                            className="text-[10px] text-primary-600 hover:underline font-semibold"
                          >
                            Salin Nama File
                          </button>
                        </div>
                        <div className="max-h-28 overflow-y-auto text-[11px] bg-white border p-2 rounded divide-y">
                          {photos.filter(p => p.is_selected === 1).map(p => (
                            <div key={p.id} className="py-1 text-gray-700 truncate" title={p.filename}>
                              {p.filename}
                            </div>
                          ))}
                          {photos.filter(p => p.is_selected === 1).length === 0 && (
                            <div className="text-gray-400 italic">Klien belum memilih foto.</div>
                          )}
                        </div>

                        <div className="pt-2 border-t space-y-2">
                          <span className="block text-[11px] font-semibold text-gray-700">3. Unggah Foto High-Res Cetak (Maks 150)</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length === 0) return;
                              if (files.length > 150) {
                                toast.error("Maksimal 150 file original");
                                return;
                              }

                              const toastId = toast.loading("Memproses & mengunggah file original...");
                              try {
                                const formData = new FormData();
                                for (const file of files) {
                                  formData.append("files", file);
                                  const comp = await compressImage(file, 800, 0.5);
                                  formData.append("compressed_files", comp);
                                }

                                const res = await fetch(`${API_BASE}/api/order-progress/${editingId}/upload-highres`, {
                                  method: "POST",
                                  headers: {
                                    Authorization: `Bearer ${localStorage.getItem("admin_token")}`
                                  },
                                  body: formData
                                });
                                const data = await res.json();
                                if (res.ok) {
                                  toast.success("Foto original cetak berhasil diunggah!", { id: toastId });
                                  fetchAlbumPhotos(editingId);
                                } else {
                                  toast.error(data.message || "Gagal unggah original", { id: toastId });
                                }
                              } catch (err) {
                                toast.error("Error upload original", { id: toastId });
                              }
                            }}
                            className="w-full text-xs"
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 3: Print layout generator & files list preview */}
                    {photos.some(p => p.is_high_res === 1) && (
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                        <span className="block text-xs font-semibold text-gray-700">4. Pratinjau Foto Resolusi Tinggi</span>
                        <div className="grid grid-cols-5 gap-1.5 max-h-32 overflow-y-auto p-1 bg-white border rounded">
                          {photos.filter(p => p.is_high_res === 1).map(p => (
                            <div key={p.id} className="relative aspect-square bg-gray-100 rounded overflow-hidden" title={p.original_filename}>
                              <img
                                src={imageUrl(p.filename)}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const origLinks = photos
                                .filter(p => p.is_high_res === 1 && p.original_filename)
                                .map(p => `${API_BASE}/uploads-weddingsapp/${p.original_filename}`);
                              
                              if (origLinks.length === 0) {
                                toast.error("Tidak ada file resolusi tinggi.");
                                return;
                              }
                              
                              const win = window.open("", "_blank");
                              win.document.write(`
                                <html>
                                  <head>
                                    <title>Original High-Res Album Photos</title>
                                    <style>
                                      body { font-family: sans-serif; padding: 20px; }
                                      li { margin-bottom: 8px; word-break: break-all; }
                                    </style>
                                  </head>
                                  <body>
                                    <h2>Daftar URL Foto Resolusi Tinggi untuk Cetak (${origLinks.length} file)</h2>
                                    <ol>
                                      ${origLinks.map(lnk => `<li><a href="${lnk}" target="_blank">${lnk}</a></li>`).join("")}
                                    </ol>
                                  </body>
                                </html>
                              `);
                              win.document.close();
                            }}
                            className="flex-1 py-1.5 bg-[#2f4274] hover:bg-[#202e53] text-white rounded text-xs font-semibold shadow-sm"
                          >
                            Generate Album (File Ori)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

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

export default AdminOrderProgress;
