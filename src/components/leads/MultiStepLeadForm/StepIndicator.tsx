import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  step: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

export default function StepIndicator({ step, title, isActive, isCompleted }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center relative z-10">
      <div
        className={`
          w-10 h-10 rounded-full flex items-center justify-center
          transition-all duration-200
          ${isActive ? 'bg-primary text-black ring-4 ring-primary/20' : ''}
          ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}
          ${!isActive && !isCompleted ? 'border-2 border-gray-300 dark:border-gray-600' : ''}
        `}
      >
        {isCompleted ? (
          <Check className="w-5 h-5" />
        ) : (
          <span className="text-sm font-medium">{step}</span>
        )}
      </div>
      <span className="mt-2 text-xs font-medium text-gray-600 dark:text-gray-400">
        {title}
      </span>
    </div>
  );
}