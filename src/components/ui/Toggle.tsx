import React from 'react';

interface ToggleProps {
  enabled: boolean;
  onChange?: (enabled: boolean) => Promise<void>;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export default function Toggle({
  enabled,
  onChange,
  label,
  description,
  size = 'md',
  disabled = false
}: ToggleProps) {
  const sizes = {
    sm: {
      switch: 'w-8 h-5',
      handle: 'h-3.5 w-3.5',
      translate: 'translate-x-3',
    },
    md: {
      switch: 'w-11 h-6',
      handle: 'h-5 w-5',
      translate: 'translate-x-5',
    },
    lg: {
      switch: 'w-14 h-7',
      handle: 'h-6 w-6',
      translate: 'translate-x-7',
    },
  };

  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div>
          {label && (
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </div>
          )}
          {description && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </div>
          )}
        </div>
      )}
      <button
        type="button"
        role="switch"
        disabled={disabled}
        aria-checked={enabled}
        onClick={async () => {
          if (onChange) {
            await onChange(!enabled);
          }
        }}
        className={`
          relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500
          focus:ring-offset-2 ${sizes[size].switch} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${enabled ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block transform rounded-full bg-white shadow
            ring-0 transition duration-200 ease-in-out ${sizes[size].handle}
            ${enabled ? sizes[size].translate : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
}