import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const navigate = useNavigate();
  const { isAdmin, isLoading, session } = useAdminAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        navigate('/admin/login');
      } else if (!isAdmin) {
        navigate('/admin/login');
      }
    }
  }, [isAdmin, isLoading, session, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
