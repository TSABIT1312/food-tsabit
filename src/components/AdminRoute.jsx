import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800"></div>
      </div>
    );
  }

  // Debug: Log current user info (remove this in production)
  console.log('AdminRoute - Current user:', user);
  console.log('AdminRoute - User email:', user?.email);

  // Check if user is logged in
  if (!user) {
    console.log('AdminRoute - No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is admin - for demo purposes, allow any logged-in user
  // Change this back to strict email check in production
  const isAdmin = user.email === 'admin@makanbar.com' || 
                  user.email === 'demo@makanbar.com' ||
                  user.role === 'admin';

  if (!isAdmin) {
    console.log('AdminRoute - User is not admin, redirecting to home');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  console.log('AdminRoute - Admin access granted');
  return <Outlet />;
};

export default AdminRoute;