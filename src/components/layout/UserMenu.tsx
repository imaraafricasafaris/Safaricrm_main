import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors tap-target"
      >
        <span className="text-sm font-medium text-primary">
          {user?.email?.[0].toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700 z-[60] animate-fadeIn">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 tap-target"
          >
            <UserCircle className="w-4 h-4" />
            Profile
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 tap-target"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 tap-target"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}