import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SuperAdminLayout from '../../components/superadmin/layout/SuperAdminLayout';

export default function SuperAdminLayoutPage() {
  const { user, userRole, loading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (user && userRole) {
      setInitialized(true);
    }
  }, [user, userRole]);

  // Show loading state
  if (loading || isRedirecting || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not authenticated or not super admin
  if (!user || !userRole) {
    setIsRedirecting(true);
    return <Navigate to="/login" replace />;
  }

  if (userRole !== 'super_admin') {
    setIsRedirecting(true);
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <SuperAdminLayout>
      <Outlet />
    </SuperAdminLayout>
  );
}