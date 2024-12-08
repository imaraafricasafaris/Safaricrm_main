import React from 'react';
import { CreditCard, AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubscriptionBannerProps {
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  activeModules: number;
  totalModules: number;
  onUpgrade: () => void;
}

export default function SubscriptionBanner({
  plan,
  activeModules,
  totalModules,
  onUpgrade
}: SubscriptionBannerProps) {
  const navigate = useNavigate();

  const planInfo = {
    free: { color: 'gray', limit: 3 },
    basic: { color: 'blue', limit: 5 },
    premium: { color: 'purple', limit: 10 },
    enterprise: { color: 'primary', limit: -1 }
  };

  const { limit } = planInfo[plan];
  const isNearLimit = limit > 0 && activeModules >= limit * 0.8;
  const isAtLimit = limit > 0 && activeModules >= limit;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-primary/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeModules} of {limit > 0 ? limit : 'Unlimited'} modules active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isNearLimit && (
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">Approaching limit</span>
            </div>
          )}
          
          {isAtLimit ? (
            <button
              onClick={onUpgrade}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
            >
              Upgrade Now
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/subscription')}
              className="text-sm text-primary hover:text-primary/90"
            >
              View Plans
            </button>
          )}
        </div>
      </div>
    </div>
  );
}