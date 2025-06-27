import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.email !== 'admin@makanbar.com') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
