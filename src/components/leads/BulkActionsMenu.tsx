import React, { useRef, useEffect } from 'react';
import { Mail, Phone, Tag, Archive, Trash2, UserCheck, Download } from 'lucide-react';

interface BulkActionsMenuProps {
  onClose: () => void;
}

export default function BulkActionsMenu({ onClose }: BulkActionsMenuProps) {
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
    <div ref={menuRef} className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50">
      <div className="p-2 space-y-1">
        <span role="button" tabIndex={0} onClick={() => {}} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
          <Mail className="w-4 h-4" />
          Send Email
        </span>
        <span role="button" tabIndex={0} onClick={() => {}} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
          <Tag className="w-4 h-4" />
          Add Tags
        </span>
        <div onClick={() => {}} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
          <UserCheck className="w-4 h-4" />
          Assign To
        </div>
        <div onClick={() => {}} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
          <Download className="w-4 h-4" />
          Export Selected
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
        <div onClick={() => {}} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
          <Archive className="w-4 h-4" />
          Archive
        </div>
        <div onClick={() => {}} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
          <Trash2 className="w-4 h-4" />
          Delete
        </div>
      </div>
    </div>
  );
}