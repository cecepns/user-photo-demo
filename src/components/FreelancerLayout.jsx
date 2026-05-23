import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Calendar, LogOut } from 'lucide-react';
import { useSiteIdentity } from '../hooks/useSiteIdentity';
import { imageUrl } from '../utils/imageUrl';

const FreelancerLayout = ({ children }) => {
  const navigate = useNavigate();
  const { appName, appInitial, logoUrl } = useSiteIdentity();
  const freelancerName = localStorage.getItem('freelancer_name') || 'Freelance';

  const handleLogout = () => {
    localStorage.removeItem('freelancer_token');
    localStorage.removeItem('freelancer_name');
    navigate('/freelancer/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {logoUrl ? (
              <img src={imageUrl(logoUrl)} alt={appName} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {appInitial}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 truncate">{appName}</p>
              <p className="text-xs text-gray-500 truncate">Portal Freelance · {freelancerName}</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              to="/freelancer/calendar"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary-100 text-primary-700"
            >
              <Calendar size={16} /> Kalender Saya
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
            >
              <LogOut size={16} /> Keluar
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4 sm:p-6">{children}</main>
    </div>
  );
};

FreelancerLayout.propTypes = {
  children: PropTypes.node,
};

export default FreelancerLayout;
