import React, { useState } from 'react';
import { Sun, Moon, Bell, Menu } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import UserMenu from './UserMenu';

interface HeaderProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export default function Header({ onMobileMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const theme = useTheme();
  const notificationCount = 3;
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  return (
    <header className="fixed top-0 right-0 left-0 md:left-16 h-16 px-4 md:px-6 flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm z-40 transition-all duration-300">
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={theme.toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          >
            {theme.isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-400" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-black text-xs font-medium rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={theme.toggleTheme}
          className="hidden md:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
        >
          {theme.isDarkMode ? (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
        
        <button
          className="hidden md:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors relative"
        >
          <Bell className="w-5 h-5 text-gray-400" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-black text-xs font-medium rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
        
        <UserMenu />
      </div>
    </header>
  );
}