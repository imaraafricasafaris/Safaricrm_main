import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onClose?: () => void;
}

export default function ErrorDisplay({ error, onClose }: ErrorDisplayProps) {
  return (
    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/50 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-red-600 dark:text-red-200">{error}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-500 hover:text-red-600 dark:hover:text-red-400"
        >
          <XCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}