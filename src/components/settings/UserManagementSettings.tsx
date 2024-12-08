import React from 'react';
import { Users, UserPlus, Shield, Settings } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'active' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Agent', status: 'inactive' },
];

export default function UserManagementSettings() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            User Management
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors">
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>

        <div className="space-y-6">
          {/* User List */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {mockUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                          <span className="text-primary-600 dark:text-primary-400 font-medium">
                            {user.name[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200'
                      }`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Role Management */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Role Management
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'Admin', description: 'Full system access' },
                { name: 'Manager', description: 'Team and resource management' },
                { name: 'Agent', description: 'Basic system access' }
              ].map((role) => (
                <div
                  key={role.name}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {role.name}
                    </h4>
                    <button className="p-1 text-gray-400 hover:text-primary-500">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {role.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Default Permissions
            </h3>
            <div className="space-y-4">
              {[
                'View and manage leads',
                'Create and edit safari packages',
                'Access financial reports',
                'Manage vehicle fleet',
                'Handle client communications'
              ].map((permission) => (
                <div
                  key={permission}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary-500" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {permission}
                    </span>
                  </div>
                  <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Changes */}
          <div className="flex justify-end pt-4">
            <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}