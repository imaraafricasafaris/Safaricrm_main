import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/api/ErrorBoundary';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SuperAdminLogin from './pages/auth/SuperAdminLogin';
import SuperAdminSignup from './pages/auth/SuperAdminSignup';
import SuperAdminLayout from './pages/SuperAdmin/Layout';
import SuperAdminDashboard from './pages/SuperAdmin/Dashboard';
import Companies from './pages/SuperAdmin/Companies';
import Users from './pages/SuperAdmin/Users';
import Subscriptions from './pages/SuperAdmin/Subscriptions';
import ApiKeys from './pages/SuperAdmin/ApiKeys';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import ApiDashboard from './pages/ApiDashboard';
import Modules from './pages/Modules';

// CRM Routes
import Leads from './pages/Leads';
import Clients from './pages/Clients';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Staff from './pages/Staff';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Subscription from './pages/Subscription';
import Branches from './pages/Branches';

const App = () => {
  const { user, userRole } = useAuth();

  return (
    <ErrorBoundary>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            !user ? (
              <Landing />
            ) : userRole === 'super_admin' ? (
              <Navigate to="/super-admin" />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/login"
          element={
            !user ? (
              <Login />
            ) : userRole === 'super_admin' ? (
              <Navigate to="/super-admin" />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !user ? (
              <Signup />
            ) : userRole === 'super_admin' ? (
              <Navigate to="/super-admin" />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/superadmin/login"
          element={!user ? <SuperAdminLogin /> : <Navigate to="/super-admin" />}
        />
        <Route
          path="/superadmin/signup"
          element={!user ? <SuperAdminSignup /> : <Navigate to="/super-admin" />}
        />

        {/* Super Admin Routes */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <SuperAdminLayout>
                <Outlet />
              </SuperAdminLayout>
            </ProtectedRoute>
          }
        >
          <Route index element={<SuperAdminDashboard />} />
          <Route path="companies" element={<Companies />} />
          <Route path="users" element={<Users />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="api-keys" element={<ApiKeys />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Main CRM Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute requiredRole="company">
              <MainLayout>
                <Outlet />
              </MainLayout>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="clients" element={<Clients />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="documents" element={<Documents />} />
          <Route path="reports" element={<Reports />} />
          <Route path="staff" element={<Staff />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="branches" element={<Branches />} />
          <Route path="modules" element={<Modules />} />
        </Route>

        {/* API Dashboard */}
        <Route
          path="/api-dashboard/*"
          element={<ProtectedRoute requiredRole="super_admin"><ApiDashboard /></ProtectedRoute>}
        />

        {/* Catch-all redirect */}
        <Route
          path="*"
          element={<Navigate to={!user ? '/login' : userRole === 'super_admin' ? '/super-admin' : '/dashboard'} replace />}
        />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;