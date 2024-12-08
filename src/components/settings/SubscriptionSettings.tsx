import React from 'react';
import { CreditCard, Check, AlertTriangle } from 'lucide-react';

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

export default function SubscriptionSettings() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Subscription & Billing
        </h2>

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
          <div className="grid grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 bg-white dark:bg-gray-800 rounded-lg border-2 transition-all ${
                  plan.popular
                    ? 'border-primary-500 shadow-lg scale-105'
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

          {/* Payment Methods */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Payment Methods
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      •••• •••• •••• 4242
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Expires 12/24
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/20 rounded-full">
                    Default
                  </span>
                  <button className="text-sm text-primary-600 hover:text-primary-500">
                    Edit
                  </button>
                </div>
              </div>
              <button className="w-full px-4 py-2 text-sm text-primary-600 hover:text-primary-500 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 transition-colors">
                + Add Payment Method
              </button>
            </div>
          </div>

          {/* Billing History */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Billing History
            </h3>
            <div className="overflow-x-auto">
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
                    <tr key={i}>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600 hover:text-primary-500">
                        <button>Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cancellation Notice */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Cancellation Policy
                </h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  You can cancel your subscription at any time. Your service will continue until the end of your billing period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}