import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../context/auth-context";
import { setPostLoginDestination } from '../../lib/auth';

/**
 * ProtectedRoute - Ensures only authenticated users can access
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (!loading && !isAuthenticated) {
    setPostLoginDestination(location.pathname);
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (loading && !user) {
    return <div className="auth-spinner">Loading...</div>;
  }

  return children;
}

/**
 * AdminRoute - Ensures only authenticated admins can access
 */
export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading, role } = useAuth();

  if (loading) {
    return <div className="auth-spinner">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/access-restricted" replace />;
  }

  return children;
}
