import React from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileForm from '../components/profile/ProfileForm';

export default function Profile() {
  return (
    <main className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <ProfileHeader />
          <div className="p-6 pt-20">
            <ProfileForm />
          </div>
        </div>
      </div>
    </main>
  );
}