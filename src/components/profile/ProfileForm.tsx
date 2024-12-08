import React, { useState } from 'react';
import { Phone, MapPin, Briefcase, Globe, Save } from 'lucide-react';

interface ProfileData {
  fullName: string;
  phone: string;
  location: string;
  company: string;
  website: string;
  bio: string;
}

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    phone: '',
    location: '',
    company: '',
    website: '',
    bio: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            value={profileData.fullName}
            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </div>
          </label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </div>
          </label>
          <input
            type="text"
            value={profileData.location}
            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
            placeholder="Enter your location"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Company
            </div>
          </label>
          <input
            type="text"
            value={profileData.company}
            onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
            placeholder="Enter your company name"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website
            </div>
          </label>
          <input
            type="url"
            value={profileData.website}
            onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
            placeholder="Enter your website URL"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bio
          </label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            disabled={!isEditing}
            rows={4}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
            placeholder="Write a short bio about yourself"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </>
        )}
      </div>
    </form>
  );
}