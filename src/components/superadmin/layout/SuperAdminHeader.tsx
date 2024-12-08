import React, { useState } from 'react';
import { Search, Bell, User, LogOut, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';

export default function SuperAdminHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="h-16 bg-[#0F172A] border-b border-[#1E293B] px-8 flex items-center justify-between fixed top-0 right-0 left-64 z-40">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search anything in system..."
          className="w-full pl-10 pr-4 py-2 bg-[#1E293B] border border-[#2D3B4E] rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#1E293B]"
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
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#FACC15] rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#0EA5E9] flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.email?.[0].toUpperCase()}
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">
                {user?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0F172A] rounded-lg shadow-lg border border-[#1E293B] py-1">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#1E293B]"
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