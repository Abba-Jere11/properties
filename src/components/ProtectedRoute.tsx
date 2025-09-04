import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireClient?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  requireClient = false,
  redirectTo,
}) => {
  const { user, loading, isAdmin, isClient, profile } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    // Redirect to appropriate login page based on requirements
    if (requireAdmin) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    if (requireClient) {
      return <Navigate to="/client/login" state={{ from: location }} replace />;
    }
    // Default to client login for general auth requirement
    return <Navigate to="/client/login" state={{ from: location }} replace />;
  }

  // Check admin access
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check client access
  if (requireClient && !isClient) {
    return <Navigate to="/client/login" replace />;
  }

  // Redirect authenticated users away from login pages
  if (!requireAuth && user) {
    // Redirect based on user role first to avoid loops
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    if (isClient) {
      return <Navigate to="/client" replace />;
    }
    // If user is authenticated but has no role yet, allow access to the page (no redirect)
    // so they can complete setup or sign out.
  }

  return <>{children}</>;
};

export default ProtectedRoute;