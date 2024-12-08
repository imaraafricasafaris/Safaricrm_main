import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, Users, Key, CreditCard, Grid, 
  Shield, Bell, Settings2, HelpCircle, Home, Terminal, ChevronLeft, ChevronRight
} from 'lucide-react';
import SuperAdminHeader from './SuperAdminHeader';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'dashboard';
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    { icon: LayoutDashboard, label: 'Overview', id: 'dashboard', path: '/super-admin' },
    { icon: Building2, label: 'Companies', id: 'companies', path: '/super-admin/companies' },
    { icon: Users, label: 'Users', id: 'users', path: '/super-admin/users' },
    { icon: CreditCard, label: 'Subscriptions', id: 'subscriptions', path: '/super-admin/subscriptions' },
    { icon: Grid, label: 'Modules', id: 'modules', path: '/super-admin/modules' },
    { icon: Terminal, label: 'API System', id: 'api-dashboard', path: '/api-dashboard' },
    { icon: Key, label: 'API Keys', id: 'api-keys', path: '/super-admin/api-keys' },
    { icon: Shield, label: 'Security', id: 'security', path: '/super-admin/security' },
    { icon: Bell, label: 'Notifications', id: 'notifications', path: '/super-admin/notifications' },
    { icon: Settings2, label: 'Settings', id: 'settings', path: '/super-admin/settings' },
    { icon: HelpCircle, label: 'Support', id: 'support', path: '/super-admin/support' }
  ];

  return (
    <div className="flex h-screen bg-[#0F172A] dark:bg-gray-900">
      {/* Left Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-[#0F172A] dark:bg-gray-800 shadow-lg z-50 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-[#0EA5E9]" />
              {!isCollapsed && (
                <div>
                  <h1 className="text-lg font-bold text-white">Safari CRM</h1>
                  <p className="text-xs text-gray-400">Super Admin Panel</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${
                  currentPath === item.id
                    ? 'bg-[#0EA5E9] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-[#1E293B]'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Bottom Navigation */}
          <div className="absolute bottom-6 left-0 right-0 px-6">
            <button 
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-[#1E293B] rounded-lg transition-colors"
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>Exit Super Admin</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        isCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        {/* Header */}
        <SuperAdminHeader />

        {/* Content */}
        <div className="p-8 mt-16">
          {children}
        </div>
      </div>
    </div>
  );
}