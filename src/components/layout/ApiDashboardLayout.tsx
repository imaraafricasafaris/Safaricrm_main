import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Terminal, Activity, Key, Webhook, Book, Settings2, Home, Bell } from 'lucide-react';
import ApiDashboardHeader from '../api/ApiDashboardHeader';
import { Toaster } from 'react-hot-toast';

interface ApiDashboardLayoutProps {
  children: React.ReactNode;
}

export default function ApiDashboardLayout({ children }: ApiDashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'overview';

  const navigationItems = [
    { icon: Activity, label: 'Overview', id: 'overview', path: '/api-dashboard' },
    { icon: Key, label: 'API Keys', id: 'keys', path: '/api-dashboard/keys' },
    { icon: Terminal, label: 'Endpoints', id: 'endpoints', path: '/api-dashboard/endpoints' },
    { icon: Webhook, label: 'Webhooks', id: 'webhooks', path: '/api-dashboard/webhooks' },
    { icon: Book, label: 'Documentation', id: 'docs', path: '/api-dashboard/docs' },
    { icon: Settings2, label: 'Settings', id: 'settings', path: '/api-dashboard/settings' }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" />
      
      {/* Left Sidebar */}
      <div className="w-48 fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-[4px_0_30px_rgb(0,0,0,0.1)] rounded-r-[25px] z-50">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Terminal className="w-6 h-6 text-primary" />
            <span className="font-semibold text-gray-900 dark:text-white">API System</span>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors
                  ${currentPath === item.id
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Bottom Navigation */}
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                Return Home
              </button>
              <button 
                onClick={() => navigate('/notifications')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <Bell className="w-4 h-4" />
                Notifications
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-48">
        {/* Header */}
        <ApiDashboardHeader />

        {/* Content */}
        <div className="p-6 mt-24">
          {children}
        </div>
      </div>
    </div>
  );
}