import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';

export default function ApiDashboardHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <header className="fixed top-6 right-6 left-48 h-16 px-6 flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm z-40 rounded-[25px]">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search everything..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-[30px] focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* API Dashboard Link */}
        <button
          onClick={() => navigate('/api-dashboard')}
          className="px-4 py-1.5 text-sm text-[#0EA5E9] hover:text-white border border-[#0EA5E9] hover:bg-[#0EA5E9] rounded-lg transition-colors"
        >
          API Dashboard
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#FACC15] rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#0EA5E9] flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.email?.[0].toUpperCase()}
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500">API User</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}