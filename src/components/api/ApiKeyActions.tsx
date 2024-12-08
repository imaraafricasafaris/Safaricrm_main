import React, { useRef, useEffect } from 'react';
import { Edit2, RefreshCw, Trash2, Copy } from 'lucide-react';

interface ApiKeyActionsProps {
  position: { top: number; left: number };
  onClose: () => void;
  onEdit: () => void;
  onRevoke: () => void;
}

export default function ApiKeyActions({ position, onClose, onEdit, onRevoke }: ApiKeyActionsProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div 
      ref={menuRef}
      className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-48 z-50"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`,
        transform: 'translate(-100%, 0)'
      }}
    >
      <div className="py-1">
        <button
          onClick={onEdit}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Edit2 className="w-4 h-4" />
          Edit Key
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText('API_KEY');
            onClose();
          }}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Copy className="w-4 h-4" />
          Copy Key
        </button>
        <button
          onClick={() => {
            // TODO: Implement key regeneration
            onClose();
          }}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerate
        </button>
        <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
        <button
          onClick={onRevoke}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
        >
          <Trash2 className="w-4 h-4" />
          Revoke Key
        </button>
      </div>
    </div>
  );
}