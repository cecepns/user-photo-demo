import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedFreelancerRoute = ({ children }) => {
  const token = localStorage.getItem('freelancer_token');
  if (!token) {
    return <Navigate to="/freelancer/login" replace />;
  }
  return children;
};

ProtectedFreelancerRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedFreelancerRoute;
