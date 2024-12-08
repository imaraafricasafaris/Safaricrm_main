import React from 'react';
import { Camera, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileHeader() {
  const { user } = useAuth();
  const userInitial = user?.email?.[0].toUpperCase() || '?';

  return (
    <div className="relative mb-6">
      <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10 rounded-t-lg" />
      <div className="absolute -bottom-16 left-6 flex items-end space-x-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-black border-4 border-white dark:border-gray-800">
            {userInitial}
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <div className="pb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user?.email?.split('@')[0]}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}