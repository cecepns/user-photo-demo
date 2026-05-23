import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useSiteIdentity } from '../../hooks/useSiteIdentity';
import { imageUrl } from '../../utils/imageUrl';
import { API_ENDPOINTS } from '../../utils/endpoints';
import { buildUrl } from '../../utils/api';

const FreelancerLogin = () => {
  const [credentials, setCredentials] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { appName, appInitial, logoUrl } = useSiteIdentity();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(buildUrl(API_ENDPOINTS.FREELANCER_AUTH.LOGIN), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || 'Login gagal');
      localStorage.setItem('freelancer_token', data.token);
      localStorage.setItem('freelancer_name', data.freelancer?.name || '');
      toast.success(`Selamat datang, ${data.freelancer?.name || 'Freelance'}`);
      navigate('/freelancer/calendar');
    } catch (err) {
      toast.error(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login Freelance - {appName}</title>
      </Helmet>
      <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              {logoUrl ? (
                <img src={imageUrl(logoUrl)} alt={appName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white font-bold text-2xl">{appInitial}</span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Portal Freelance</h1>
            <p className="text-gray-600">Masuk dengan nomor HP dan password dari admin</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nomor HP</label>
              <input
                type="tel"
                value={credentials.phone}
                onChange={(e) => setCredentials((c) => ({ ...c, phone: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="08xxxxxxxxxx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="text"
                value={credentials.password}
                onChange={(e) => setCredentials((c) => ({ ...c, password: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono tracking-wider"
                placeholder="Password dari admin"
                autoComplete="current-password"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
              {loading ? 'Sedang masuk...' : 'Masuk'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            Admin?{' '}
            <Link to="/admin/login" className="text-primary-600 hover:underline">
              Masuk ke portal admin
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default FreelancerLogin;
