import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useModules } from '../../contexts/ModuleContext';
import Tooltip from '../ui/Tooltip';
import { 
  LayoutDashboard, Users, UserPlus, Map, ScrollText, Calendar, BarChart3, 
  Bell, Settings2, ChevronLeft, ChevronRight, CheckSquare, Grid, Receipt, 
  Building2, CreditCard, GitBranch, Terminal 
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
}

export default function Sidebar({ isCollapsed, onToggle, isMobileMenuOpen, onMobileMenuClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isModuleActive } = useModules();
  const currentPath = location.pathname.split('/').pop() || 'dashboard';

  // Check if module is accessible
  const isModuleAccessible = (item: { moduleId?: string }) => {
    if (!item.moduleId) return true;
    return isModuleActive(item.moduleId);
  };

  // Core navigation items (always visible)
  const coreNavItems = [
    // Core modules (always visible)
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', moduleId: 'dashboard' },
    { name: 'Leads', icon: UserPlus, path: '/leads', moduleId: 'leads' },
    { name: 'Modules', icon: Grid, path: '/modules', moduleId: 'modules' }
  ];

  // Optional modules
  const optionalNavItems = [
    { name: 'Clients', icon: Users, path: '/clients', moduleId: 'client-management', optional: true },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks', moduleId: 'task-management', optional: true },
    { name: 'Documents', icon: ScrollText, path: '/documents', moduleId: 'document-management', optional: true },
    { name: 'Reports', icon: BarChart3, path: '/reports', moduleId: 'advanced-reporting', optional: true },
    { name: 'Staff', icon: Users, path: '/staff', moduleId: 'staff-management', optional: true },
    { name: 'Branches', icon: GitBranch, path: '/branches', moduleId: 'office-management', optional: true }
  ];

  // Combine and filter navigation items
  const navigationItems = [
    ...coreNavItems,
    ...optionalNavItems.filter(item => isModuleAccessible(item))
  ];

  // Core bottom navigation items
  const coreBottomNavItems = [
    { name: 'Settings', icon: Settings2, path: '/settings', moduleId: 'settings' },
    { name: 'Notifications', icon: Bell, path: '/notifications', moduleId: 'notifications' },
    { name: 'Subscription', icon: CreditCard, path: '/subscription' },
  ];

  const handleNavigation = (item: { moduleId?: string; path: string; name: string }) => {
    try {
      if (!isModuleAccessible(item)) {
        toast.error(
          `The ${item.name} module is not active. Please activate it in Modules.`,
          { duration: 3000 }
        );
        return;
      }
      
      navigate(item.path);
      if (onMobileMenuClose) {
        onMobileMenuClose();
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Failed to navigate');
    }
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onMobileMenuClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen
          ${isCollapsed ? 'w-16' : 'w-56 lg:w-64'}
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          flex flex-col
          transition-all duration-300 ease-in-out
          z-50
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
      {/* Header/Logo */}
      <button
        onClick={onToggle}
        className="h-16 w-full px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Map className="w-6 h-6 text-primary flex-shrink-0" />
          <span
            className={`
              font-semibold text-nav text-gray-900 dark:text-white
              ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}
              transition-all duration-300
            `}
          >
            Safari CRM
          </span>
        </div>
        {!isCollapsed && <ChevronLeft className="w-4 h-4 text-gray-400" />}
      </button>

      {/* Main Navigation */}
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
        <nav className="flex-1 p-2 space-y-1">
          {/* Only render visible navigation items */}
          {navigationItems.map((item) => {
            const isActive = currentPath === item.path.split('/').pop();
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item)}
                className={`
                  w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-nav transition-colors
                  ${isActive
                    ? 'bg-primary text-black'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
                <span
                  className={`
                    whitespace-nowrap
                    ${isCollapsed ? 'hidden' : 'block'}
                  `}
                >
                  {item.name}
                </span>
                {isCollapsed && (
                  <Tooltip content={item.name} position="right">
                    <span className="sr-only">{item.name}</span>
                  </Tooltip>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
          {/* Only render visible bottom navigation items */}
          {coreBottomNavItems.map((item) => {
            const isActive = currentPath === item.path.split('/').pop();
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item)}
                className={`
                  w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-nav transition-colors
                  ${isActive
                    ? 'bg-primary text-black'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
                <span
                  className={`
                    whitespace-nowrap
                    ${isCollapsed ? 'hidden' : 'block'}
                  `}
                >
                  {item.name}
                </span>
                {isCollapsed && (
                  <Tooltip content={item.name} position="right">
                    <span className="sr-only">{item.name}</span>
                  </Tooltip>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
    </>
  );
}