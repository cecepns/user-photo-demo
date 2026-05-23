import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AsyncSelect from 'react-select/async';
import {
  Plus, Trash2, Save, Settings, Edit, ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import { formatDate, formatRupiah } from '../../utils/formatters';
import { API_ENDPOINTS } from '../../utils/endpoints';
import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/request';

const emptyProductionItems = () => [{ label: '', amount: '' }];

const buildFinancialForm = (row = null) => ({
  order_source: row?.order_source || 'order',
  order_id: row?.order_id || null,
  client_name: row?.client_name || '',
  package_name: row?.package_name || '',
  gross_amount: row?.gross_amount ?? 0,
  accommodation_applied: row?.accommodation_applied ?? false,
  notes: row?.notes || '',
  production_items: row?.production_items?.length
    ? row.production_items.map((i) => ({ label: i.label, amount: i.amount }))
    : emptyProductionItems(),
});

const AdminFinance = () => {
  const [period, setPeriod] = useState('monthly');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [accommodationCost, setAccommodationCost] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [form, setForm] = useState(buildFinancialForm());
  const [selectedOrderOpt, setSelectedOrderOpt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const LIMIT_OPTIONS = [10, 25, 50, 100];

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadSummary = useCallback(async () => {
    const params = new URLSearchParams({ period, year: String(year) });
    if (period === 'monthly') params.set('month', String(month));
    const data = await apiGet(`${API_ENDPOINTS.ADMIN.FINANCE_SUMMARY}?${params}`);
    setSummary(data.data);
  }, [period, year, month]);

  const loadSettings = useCallback(async () => {
    const data = await apiGet(API_ENDPOINTS.ADMIN.FINANCE_SETTINGS);
    setAccommodationCost(Number(data.accommodation_cost || 0));
  }, []);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
      });
      if (debouncedSearch) params.set('search', debouncedSearch);
      const data = await apiGet(`${API_ENDPOINTS.ADMIN.FINANCE_ORDERS}?${params}`);
      setOrders(data.data || []);
      setPagination((p) => ({ ...p, ...data.pagination }));
    } catch (e) {
      toast.error(e.message || 'Gagal memuat data keuangan');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch]);

  useEffect(() => {
    loadSummary().catch((e) => toast.error(e.message));
    loadSettings().catch(() => {});
  }, [loadSummary, loadSettings]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const loadOrderOptions = async (inputValue) => {
    const rows = await apiGet(`${API_ENDPOINTS.ORDERS.SEARCH}?q=${encodeURIComponent(inputValue || '')}`);
    const list = Array.isArray(rows) ? rows : [];
    return list.map((row) => {
      const isCustom = row.order_source === 'custom_request';
      const datePart = row.wedding_date ? formatDate(row.wedding_date) : '-';
      const svc = row.service_name || (isCustom ? 'Layanan custom' : '-');
      const prefix = isCustom ? 'C' : '';
      const tag = isCustom ? 'Custom' : 'Biasa';
      return {
        value: isCustom ? `custom:${row.id}` : `order:${row.id}`,
        label: `#${prefix}${row.id} — ${row.name || '-'} — ${svc} (${tag}) · ${datePart}`,
        order: {
          id: row.id,
          source: isCustom ? 'custom_request' : 'order',
          name: row.name,
          package_name: svc,
          gross_amount: isCustom ? row.booking_amount : row.total_amount,
        },
      };
    });
  };

  const saveSettings = async () => {
    try {
      await apiPut(API_ENDPOINTS.ADMIN.FINANCE_SETTINGS, {
        accommodation_cost: Number(accommodationCost),
      });
      toast.success('Biaya akomodasi disimpan');
      setShowSettings(false);
      loadSummary();
      loadOrders();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setForm(buildFinancialForm());
    setSelectedOrderOpt(null);
  };

  const openCreate = () => {
    setModalMode('create');
    setForm(buildFinancialForm());
    setSelectedOrderOpt(null);
  };

  const openEdit = (row) => {
    setModalMode('edit');
    setForm(buildFinancialForm(row));
    setSelectedOrderOpt({
      value: `${row.order_source === 'custom_request' ? 'custom' : 'order'}:${row.order_id}`,
      label: `#${row.order_source === 'custom_request' ? 'C' : ''}${row.order_id} — ${row.client_name}`,
      order: {
        id: row.order_id,
        source: row.order_source,
        name: row.client_name,
        package_name: row.package_name,
        gross_amount: row.gross_amount,
      },
    });
  };

  const handleOrderSelect = (opt) => {
    setSelectedOrderOpt(opt);
    if (opt?.order) {
      setForm((f) => ({
        ...f,
        order_source: opt.order.source,
        order_id: opt.order.id,
        client_name: opt.order.name || '',
        package_name: opt.order.package_name || '',
        gross_amount: Number(opt.order.gross_amount) || 0,
      }));
    }
  };

  const buildPayload = () => ({
    order_source: form.order_source,
    order_id: form.order_id,
    accommodation_applied: form.accommodation_applied,
    notes: form.notes,
    production_items: form.production_items
      .filter((i) => i.label?.trim())
      .map((i) => ({ label: i.label.trim(), amount: Number(i.amount) || 0 })),
  });

  const saveFinancial = async () => {
    if (modalMode === 'create' && !form.order_id) {
      toast.error('Pilih pesanan terlebih dahulu');
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      if (modalMode === 'create') {
        await apiPost(API_ENDPOINTS.ADMIN.FINANCE_ORDERS, payload);
        toast.success('Catatan keuangan ditambahkan');
      } else {
        await apiPut(API_ENDPOINTS.ADMIN.FINANCE_ORDERS, payload);
        toast.success('Catatan keuangan diperbarui');
      }
      closeModal();
      loadOrders();
      loadSummary();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!row.financial_id) {
      toast.error('Belum ada catatan keuangan untuk dihapus');
      return;
    }
    if (!window.confirm(`Hapus catatan keuangan untuk ${row.client_name}?`)) return;
    try {
      const params = new URLSearchParams({
        order_source: row.order_source,
        order_id: String(row.order_id),
      });
      await apiDelete(`${API_ENDPOINTS.ADMIN.FINANCE_ORDERS}?${params}`);
      toast.success('Catatan keuangan dihapus');
      loadOrders();
      loadSummary();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <>
      <Helmet>
        <title>Catatan Keuangan - Admin</title>
      </Helmet>
      <AdminLayout>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Catatan Keuangan</h1>
            <p className="text-gray-600">Pendapatan, biaya produksi, dan pendapatan bersih per pesanan.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg"
            >
              <Plus size={18} />
              Tambah catatan
            </button>
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg"
            >
              <Settings size={18} />
              Biaya Akomodasi
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Periode</label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="border rounded-lg px-3 py-2">
              <option value="monthly">Bulanan</option>
              <option value="yearly">Tahunan</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Tahun</label>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="border rounded-lg px-3 py-2">
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          {period === 'monthly' && (
            <div>
              <label className="text-sm text-gray-600 block mb-1">Bulan</label>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="border rounded-lg px-3 py-2">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {new Date(2000, m - 1).toLocaleString('id-ID', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {summary && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
              <p className="text-sm text-gray-500">Uang Masuk</p>
              <p className="text-2xl font-bold">{formatRupiah(summary.grossIncome)}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5 border-l-4 border-orange-500">
              <p className="text-sm text-gray-500">Biaya Produksi</p>
              <p className="text-2xl font-bold">{formatRupiah(summary.productionTotal)}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5 border-l-4 border-amber-500">
              <p className="text-sm text-gray-500">Akomodasi</p>
              <p className="text-2xl font-bold">{formatRupiah(summary.accommodationTotal)}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5 border-l-4 border-primary-500">
              <p className="text-sm text-gray-500">Bersih</p>
              <p className="text-2xl font-bold">{formatRupiah(summary.netIncome)}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4 border-b">
            <input
              type="search"
              placeholder="Cari client / paket..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="border rounded-lg px-3 py-2 w-full sm:max-w-xs"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left">Paket</th>
                  <th className="px-4 py-3 text-left">Catatan</th>
                  <th className="px-4 py-3 text-right">Masuk</th>
                  <th className="px-4 py-3 text-right">Pengeluaran</th>
                  <th className="px-4 py-3 text-right">Bersih</th>
                  <th className="px-4 py-3 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-500">Memuat...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-500">Belum ada data pesanan</td></tr>
                ) : (
                  orders.map((row) => (
                    <tr key={`${row.order_source}-${row.order_id}`} className="border-t hover:bg-gray-50/80">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.client_name}</td>
                      <td className="px-4 py-3 text-gray-700">{row.package_name || '-'}</td>
                      <td className="px-4 py-3">
                        {row.financial_id ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Ada catatan
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Belum ada
                          </span>
                        )}
                        {row.notes ? (
                          <p className="text-xs text-gray-500 mt-1 max-w-[180px] truncate" title={row.notes}>
                            {row.notes}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-right">{formatRupiah(row.gross_amount)}</td>
                      <td className="px-4 py-3 text-right">
                        {formatRupiah(row.production_total + row.accommodation_cost)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{formatRupiah(row.net_amount)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(row)}
                            className="p-2 rounded-lg text-primary-600 bg-primary-50 hover:bg-primary-100"
                            title={row.financial_id ? 'Edit catatan' : 'Tambah / kelola catatan'}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(row)}
                            disabled={!row.financial_id}
                            className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Hapus catatan"
                          >
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

        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Biaya Akomodasi (per pesanan)</h3>
              <input
                type="number"
                min={0}
                value={accommodationCost}
                onChange={(e) => setAccommodationCost(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-4"
              />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowSettings(false)} className="px-4 py-2 border rounded-lg">Batal</button>
                <button type="button" onClick={saveSettings} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Simpan</button>
              </div>
            </div>
          </div>
        )}

        {modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-lg w-full my-8 shadow-xl">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  {modalMode === 'create' ? 'Tambah' : 'Edit'} Catatan Keuangan
                </h3>
                <button type="button" onClick={closeModal} className="p-1 rounded-lg text-gray-500 hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                {modalMode === 'create' ? (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pesanan *</label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={loadOrderOptions}
                      value={selectedOrderOpt}
                      onChange={handleOrderSelect}
                      placeholder="Cari pesanan (nama, HP, ID)…"
                      classNamePrefix="rs"
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: 42,
                          borderRadius: 8,
                          borderColor: '#d1d5db',
                        }),
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 mb-4">
                    <span className="font-medium text-gray-800">{form.client_name}</span>
                    {' · '}
                    {form.package_name || '-'}
                  </p>
                )}

                {form.order_id ? (
                  <p className="text-sm text-gray-500 mb-4">
                    Pendapatan pesanan: <span className="font-semibold text-gray-800">{formatRupiah(form.gross_amount)}</span>
                  </p>
                ) : null}

                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={form.accommodation_applied}
                    onChange={(e) => setForm({ ...form, accommodation_applied: e.target.checked })}
                  />
                  <span className="text-sm">Terapkan biaya akomodasi</span>
                </label>

                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-gray-700">Rincian pengeluaran</p>
                  {form.production_items.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        placeholder="Contoh: Video"
                        value={item.label}
                        onChange={(e) => {
                          const next = [...form.production_items];
                          next[idx] = { ...next[idx], label: e.target.value };
                          setForm({ ...form, production_items: next });
                        }}
                        className="flex-1 border rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        min={0}
                        placeholder="Jumlah"
                        value={item.amount}
                        onChange={(e) => {
                          const next = [...form.production_items];
                          next[idx] = { ...next[idx], amount: e.target.value };
                          setForm({ ...form, production_items: next });
                        }}
                        className="w-32 border rounded-lg px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = form.production_items.filter((_, i) => i !== idx);
                          setForm({
                            ...form,
                            production_items: next.length ? next : emptyProductionItems(),
                          });
                        }}
                        className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100"
                        title="Hapus baris"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setForm({
                      ...form,
                      production_items: [...form.production_items, { label: '', amount: '' }],
                    })}
                    className="text-sm text-primary-600 flex items-center gap-1"
                  >
                    <Plus size={16} /> Tambah item
                  </button>
                </div>

                <textarea
                  placeholder="Catatan tambahan"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mb-4 text-sm"
                  rows={2}
                />

                <div className="flex gap-2 justify-end pt-2 border-t">
                  <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-lg">
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={saveFinancial}
                    disabled={saving}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save size={16} />
                    {saving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
};

export default AdminFinance;
