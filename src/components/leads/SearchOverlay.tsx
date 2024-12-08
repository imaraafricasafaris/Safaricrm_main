import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
}

export default function SearchOverlay({ isOpen, onClose, value, onChange }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-4">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search leads..."
            className="w-full h-16 pl-16 pr-12 bg-white dark:bg-gray-800 rounded-xl text-xl shadow-2xl border-0 focus:ring-0 focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 animate-fadeIn caret-primary"
          />
          <button
            onClick={onClose}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-400 dark:text-gray-500 text-center animate-fadeIn">
          Press ESC to close
        </div>
      </div>
    </div>
  );
}