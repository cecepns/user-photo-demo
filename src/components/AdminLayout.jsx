import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSiteIdentity } from '../hooks/useSiteIdentity';
import { imageUrl } from '../utils/imageUrl';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { appName, appInitial, logoUrl } = useSiteIdentity();

  const categories = [
    {
      id: 'utama',
      name: 'Manajemen Utama',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      items: [
        { name: 'Daftar Vendor', path: '/admin/vendors', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { name: 'Pesan Kontak', path: '/admin/contact-messages', icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { name: 'Freelance Inhouse', path: '/admin/freelancers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
      ]
    },
    {
      id: 'operasional',
      name: 'Operasional',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      items: [
        { name: 'Pesanan', path: '/admin/orders', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { name: 'Progress Pesanan', path: '/admin/order-progress', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        { name: 'Detail Acara', path: '/admin/detail-acara', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { name: 'History Pesanan', path: '/admin/orders-history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
        { name: 'Kalender Freelance', path: '/admin/freelance-calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
      ]
    },
    {
      id: 'keuangan',
      name: 'Keuangan',
      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
      items: [
        { name: 'Catatan Keuangan', path: '/admin/finance', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
        { name: 'Pembayaran', path: '/admin/payments', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
      ]
    },
    {
      id: 'layanan',
      name: 'Kelola Layanan',
      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
      items: [
        { name: 'Paket Layanan', path: '/admin/services', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z' },
        { name: 'Item Layanan', path: '/admin/items', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
      ]
    },
    {
      id: 'setting',
      name: 'Setting',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      items: [
        { name: 'Galeri', path: '/admin/gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'Konten', path: '/admin/content', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
        { name: 'Cards Management', path: '/admin/service-cards', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { name: 'Ubah Password', path: '/admin/change-password', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
      ]
    }
  ];

  const [expandedCategories, setExpandedCategories] = useState(() => {
    const initial = { utama: false, operasional: false, keuangan: false, layanan: false, setting: false };
    const activeCat = categories.find(c => c.items.some(item => location.pathname === item.path))?.id;
    if (activeCat) {
      initial[activeCat] = true;
    } else {
      initial.utama = true; // default open first category
    }
    return initial;
  });

  useEffect(() => {
    const activeCat = categories.find(c => c.items.some(item => location.pathname === item.path))?.id;
    if (activeCat) {
      setExpandedCategories(prev => ({ ...prev, [activeCat]: true }));
    }
  }, [location.pathname]);

  const toggleCategory = (id) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform fixed flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:inset-0`}>
        {/* Header - Fixed at top */}
        <div className="flex items-center justify-center h-20 px-4 bg-gradient-to-r from-primary-600 to-secondary-600 flex-shrink-0">
          <Link to="/" className="flex items-center space-x-3">
            {logoUrl ? (
              <img src={imageUrl(logoUrl)} alt={appName} className="w-10 h-10 rounded-full object-cover bg-white" />
            ) : (
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold">{appInitial}</span>
              </div>
            )}
            <span className=" text-xl font-bold text-white">{appName}</span>
          </Link>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 overflow-y-auto mt-6">
          <div className="px-4 space-y-4">
            {/* Standalone Dashboard Link */}
            <div className="space-y-1">
              <Link
                to="/admin/dashboard"
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  location.pathname === '/admin/dashboard'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
                Dashboard
              </Link>
            </div>

            {categories.map((cat) => {
              const isOpen = expandedCategories[cat.id];
              return (
                <div key={cat.id} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-primary-700 hover:bg-slate-50 rounded-xl transition-all duration-200 text-left"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`p-1.5 rounded-lg transition-colors ${
                        isOpen ? (
                          cat.id === 'utama' ? 'bg-primary-100 text-primary-700' :
                          cat.id === 'operasional' ? 'bg-amber-100 text-amber-700' :
                          cat.id === 'keuangan' ? 'bg-green-100 text-green-700' :
                          cat.id === 'layanan' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        ) : (
                          cat.id === 'utama' ? 'bg-primary-50 text-primary-600' :
                          cat.id === 'operasional' ? 'bg-amber-50 text-amber-600' :
                          cat.id === 'keuangan' ? 'bg-green-50 text-green-600' :
                          cat.id === 'layanan' ? 'bg-blue-50 text-blue-600' :
                          'bg-purple-50 text-purple-600'
                        )
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cat.icon} />
                        </svg>
                      </span>
                      <span className="text-gray-700 font-semibold tracking-wider text-[11px]">{cat.name}</span>
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div className={`space-y-1 pl-2 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100 py-1' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                    {cat.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${isActive
                              ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                          </svg>
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Logout button inside scrollable area */}
          <div className="mt-8 pt-8 pb-4 border-t border-gray-200">
            <div className="px-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Keluar
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-4">
              <Link
                to="/"
                target="_blank"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Lihat Website
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node,
};

export default AdminLayout;