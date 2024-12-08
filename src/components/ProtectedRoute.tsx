import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../lib/api/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for auth to be ready
    if (!loading && userRole) {
      setIsReady(true);
    }
  }, [loading, user, userRole]);

  // Show loading spinner while checking auth or redirecting
  if (loading || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Handle unauthenticated users
  if (!user || !userRole) {
    const loginPath = requiredRole === 'super_admin' ? '/superadmin/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location.pathname }} replace />;
  }

  // Role-based access control
  const isSuperAdmin = userRole === 'super_admin';
  const isCompanyUser = userRole === 'company';
  const isSuperAdminRoute = currentPath.includes('super-admin');
  const isApiRoute = currentPath.includes('api-dashboard');
  const isDashboardRoute = currentPath.includes('dashboard');

  // Enforce strict role-based access
  if (isSuperAdmin && isDashboardRoute) {
    return <Navigate to="/super-admin" replace />;
  }

  if (isCompanyUser && (isSuperAdminRoute || isApiRoute)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    const redirectPath = isSuperAdmin ? '/super-admin' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}