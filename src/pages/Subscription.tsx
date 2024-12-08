import React from 'react';
import { CreditCard, Check, AlertTriangle, Download } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: 49,
    features: [
      '5 Team Members',
      'Core CRM Features',
      'Basic Vehicle Tracking',
      'Standard Support',
      '5GB Storage'
    ]
  },
  {
    name: 'Premium',
    price: 99,
    features: [
      '15 Team Members',
      'Advanced CRM Features',
      'Full Fleet Management',
      'Priority Support',
      '50GB Storage'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 199,
    features: [
      'Unlimited Team Members',
      'Custom Module Development',
      'Custom Integrations',
      'Dedicated Support',
      'Unlimited Storage'
    ]
  }
];

export default function Subscription() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Subscription
          </h1>
        </div>

        <div className="space-y-6">
          {/* Current Plan */}
          <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-lg border border-primary-200 dark:border-primary-900/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Current Plan: Premium
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Your plan renews on April 1, 2024
                </p>
              </div>
              <span className="px-3 py-1 text-sm text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/20 rounded-full">
                Active
              </span>
            </div>
          </div>

          {/* Plan Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 bg-white dark:bg-gray-800 rounded-lg border-2 transition-all ${
                  plan.popular
                    ? 'border-primary-500 shadow-lg md:scale-105'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${plan.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">/month</span>
                  </div>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`mt-8 w-full px-4 py-2 rounded-lg transition-colors ${
                      plan.popular
                        ? 'bg-primary-600 text-white hover:bg-primary-500'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {plan.name === 'Premium' ? 'Current Plan' : 'Upgrade'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Billing History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-x-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Billing History
              </h3>
              <div className="min-w-[600px]">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Description</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[
                      {
                        date: 'Mar 1, 2024',
                        description: 'Premium Plan - Monthly',
                        amount: 99.00,
                        status: 'paid'
                      },
                      {
                        date: 'Feb 1, 2024',
                        description: 'Premium Plan - Monthly',
                        amount: 99.00,
                        status: 'paid'
                      }
                    ].map((invoice, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {invoice.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {invoice.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          ${invoice.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/20 rounded-full">
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-primary-600 hover:text-primary-500 inline-flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            <span className="text-sm">PDF</span>
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
      </div>
    </div>
  );
}