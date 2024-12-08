import React from 'react';
import { CreditCard, Plus, Search } from 'lucide-react';

export default function Subscriptions() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Subscriptions
            </h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            Add Plan
          </button>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {['Basic', 'Premium', 'Enterprise'].map((plan) => (
            <div key={plan} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {plan}
              </h3>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                ${plan === 'Basic' ? '49' : plan === 'Premium' ? '99' : '199'}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  /month
                </span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <span className="w-4 h-4 mr-2 text-green-500">✓</span>
                  {plan === 'Basic' ? '5' : plan === 'Premium' ? '15' : 'Unlimited'} users
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <span className="w-4 h-4 mr-2 text-green-500">✓</span>
                  {plan === 'Basic' ? '10GB' : plan === 'Premium' ? '50GB' : 'Unlimited'} storage
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <span className="w-4 h-4 mr-2 text-green-500">✓</span>
                  {plan === 'Basic' ? 'Email' : plan === 'Premium' ? 'Priority' : 'Dedicated'} support
                </li>
              </ul>
              <button className="w-full px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors">
                Edit Plan
              </button>
            </div>
          ))}
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Active Subscriptions
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Next Billing
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[1, 2, 3].map((_, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Safari Tours Ltd
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                        Premium
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      Apr 1, 2024
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary hover:text-primary/90">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}