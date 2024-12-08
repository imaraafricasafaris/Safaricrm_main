import React, { useState, useRef, useEffect } from 'react';
import { Edit2, UserX, Shield, Mail, Trash2, AlertTriangle, Eye } from 'lucide-react';
import { Staff } from '../../types/staff';
import { useStaff } from '../../contexts/StaffContext';
import toast from 'react-hot-toast';

interface StaffActionsProps {
  staff: Staff;
  position: { top: number; left: number };
  onClose: () => void;
}

export default function StaffActions({ staff, position, onClose }: StaffActionsProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { updateStaff, deleteStaff } = useStaff();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleAction = async (action: string) => {
    try {
      setIsProcessing(true);

      switch (action) {
        case 'view':
          // TODO: Implement view details modal
          toast.success('View details coming soon');
          break;

        case 'edit':
          // TODO: Implement edit modal
          toast.success('Edit functionality coming soon');
          break;

        case 'toggle-status':
          await updateStaff(staff.id, {
            status: staff.status === 'active' ? 'inactive' : 'active'
          });
          toast.success(`Staff member ${staff.status === 'active' ? 'deactivated' : 'activated'}`);
          break;

        case 'permissions':
          // TODO: Implement permissions modal
          toast.success('Permissions management coming soon');
          break;

        case 'email':
          window.location.href = `mailto:${staff.email}`;
          break;

        case 'delete':
          setShowDeleteConfirm(true);
          return; // Don't close menu yet

        default:
          break;
      }
      onClose();
    } catch (error) {
      console.error('Error performing action:', error);
      toast.error('Failed to perform action');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsProcessing(true);
      await deleteStaff(staff.id);
      toast.success('Staff member deleted successfully');
      onClose();
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error('Failed to delete staff member');
    } finally {
      setIsProcessing(false);
    }
  };

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
      {!showDeleteConfirm ? (
        <div className="py-1">
          <button
            onClick={() => handleAction('view')}
            disabled={isProcessing}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>

          <button
            onClick={() => handleAction('edit')}
            disabled={isProcessing}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <Edit2 className="w-4 h-4" />
            Edit Details
          </button>

          <button
            onClick={() => handleAction('toggle-status')}
            disabled={isProcessing}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <UserX className="w-4 h-4" />
            {staff.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>

          <button
            onClick={() => handleAction('permissions')}
            disabled={isProcessing}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <Shield className="w-4 h-4" />
            Permissions
          </button>

          <button
            onClick={() => handleAction('email')}
            disabled={isProcessing}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <Mail className="w-4 h-4" />
            Send Email
          </button>

          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

          <button
            onClick={() => handleAction('delete')}
            disabled={isProcessing}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/10 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex items-center gap-2 text-error-600 dark:text-error-400 mb-3">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Confirm Delete</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Are you sure you want to delete this staff member? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isProcessing}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isProcessing}
              className="px-3 py-1.5 text-sm text-white bg-error-600 hover:bg-error-700 rounded disabled:opacity-50 flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}