import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import { useEffect } from 'react';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useStore();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to access this page');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    // Redirect to auth page with return url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
