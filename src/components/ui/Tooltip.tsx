import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
}

export default function Tooltip({ content, children, position = 'right', delay = 200 }: TooltipProps) {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2'
  };

  return (
    <div className="relative group/tooltip">
      {children}
      <div
        className={`
          absolute ${positionClasses[position]} z-[100]
          px-2 py-1 text-sm rounded-lg
          bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xl
          opacity-0 invisible
          group-hover/tooltip:opacity-100 group-hover/tooltip:visible
          transition-all duration-200
          whitespace-nowrap pointer-events-none
          border border-gray-200 dark:border-gray-800/50
        `}
        style={{ transitionDelay: `${delay}ms` }}
        role="tooltip"
      >
        {content}
        <div 
          className={`
            absolute w-2 h-2 bg-white dark:bg-gray-900 transform rotate-45
            border-gray-200 dark:border-gray-800/50
            ${position === 'top' ? 'border-b border-r bottom-[-4px] left-1/2 -translate-x-1/2' : ''}
            ${position === 'right' ? 'border-l border-b left-[-4px] top-1/2 -translate-y-1/2' : ''}
            ${position === 'bottom' ? 'border-t border-l top-[-4px] left-1/2 -translate-x-1/2' : ''}
            ${position === 'left' ? 'border-t border-r right-[-4px] top-1/2 -translate-y-1/2' : ''}
          `}
        />
      </div>
    </div>
  );
}