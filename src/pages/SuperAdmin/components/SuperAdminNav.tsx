import React from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, Key, BarChart3, Settings2, Users, CreditCard } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: BarChart3, path: '/super-admin' },
  { name: 'Companies', icon: Building2, path: '/super-admin/companies' },
  { name: 'Users', icon: Users, path: '/super-admin/users' },
  { name: 'API Keys', icon: Key, path: '/super-admin/api-keys' },
  { name: 'Subscriptions', icon: CreditCard, path: '/super-admin/subscriptions' },
  { name: 'Settings', icon: Settings2, path: '/super-admin/settings' },
];

export default function SuperAdminNav() {
  return (
    <nav className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Super Admin
        </h2>
      </div>
      <div className="px-3">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-lg mb-1
              ${isActive
                ? 'bg-primary text-black'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}