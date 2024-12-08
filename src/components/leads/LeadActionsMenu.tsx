import React, { useRef, useEffect } from 'react';
import { 
  Edit2, Mail, Phone, FileText, Trash2, Archive, Share2, 
  Calendar, Star, UserCheck, Tag, AlertTriangle
} from 'lucide-react';
import { Lead } from '../../types/leads';

import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface LeadActionsMenuProps {
  lead: Lead;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  position: { top: number; left: number };
}

export default function LeadActionsMenu({ lead, onClose, onEdit, onDelete, onArchive, position }: LeadActionsMenuProps) {
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

  const handleAction = async (action: string) => {
    switch (action) {
      case 'email':
        try {
          window.location.href = `mailto:${lead.email}`;
          await supabase.from('lead_activities').insert({
            lead_id: lead.id,
            type: 'email_sent',
            description: 'Email client opened'
          });
        } catch (err) {
          console.error('Failed to log email activity:', err);
        }
        break;

      case 'call':
        try {
          window.location.href = `tel:${lead.phone}`;
          await supabase.from('lead_activities').insert({
            lead_id: lead.id,
            type: 'call_made',
            description: 'Phone call initiated'
          });
        } catch (err) {
          console.error('Failed to log call activity:', err);
        }
        break;

      case 'schedule':
        try {
          await supabase.from('lead_activities').insert({
            lead_id: lead.id,
            type: 'follow_up_scheduled',
            description: 'Meeting scheduled'
          });
          toast.success('Meeting scheduled');
        } catch (err) {
          toast.error('Failed to schedule meeting');
        }
        break;

      case 'edit':
        onEdit?.();
        break;

      case 'mark-priority':
        try {
          const { error } = await supabase
            .from('leads')
            .update({ 
              priority: 'high',
              updated_at: new Date().toISOString()
            })
            .eq('id', lead.id);
          
          if (error) throw error;
          
          await supabase.from('lead_activities').insert({
            lead_id: lead.id,
            type: 'status_change',
            description: 'Marked as priority lead'
          });

          toast.success('Lead marked as priority');
        } catch (err) {
          toast.error('Failed to update lead priority');
        }
        break;

      case 'delete':
        try {
          const { error } = await supabase
            .from('leads')
            .delete()
            .eq('id', lead.id);
          
          if (error) throw error;
          toast.success('Lead deleted successfully');
          onDelete?.();
        } catch (err) {
          toast.error('Failed to delete lead');
        }
        break;
      case 'archive':
        onArchive?.();
        break;
      default:
        break;
    }
    onClose();
  };

  return (
    <div 
      ref={menuRef}
      className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-48 z-[60] animate-fadeIn"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`,
        transform: 'translate(-100%, 0)'
      }}
    >
      <div className="p-2 space-y-1">
        <button
          onClick={() => handleAction('email')}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <Mail className="w-4 h-4" />
          Send Email
        </button>

        {lead.phone && (
          <button
            onClick={() => handleAction('call')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Phone className="w-4 h-4" />
            Call Lead
          </button>
        )}

        <button
          onClick={() => handleAction('schedule')}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <Calendar className="w-4 h-4" />
          Schedule Meeting
        </button>

        <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

        <button
          onClick={() => handleAction('edit')}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <Edit2 className="w-4 h-4" />
          Edit Lead
        </button>

        <button
          onClick={() => handleAction('mark-priority')}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <Star className="w-4 h-4" />
          Mark as Priority
        </button>

        <button
          onClick={() => handleAction('assign')}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <UserCheck className="w-4 h-4" />
          Assign Lead
        </button>

        <button
          onClick={() => handleAction('add-tags')}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <Tag className="w-4 h-4" />
          Add Tags
        </button>

        <button
          onClick={() => handleAction('share')}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <Share2 className="w-4 h-4" />
          Share Lead
        </button>

        <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

        <button
          onClick={() => handleAction('archive')}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <Archive className="w-4 h-4" />
          Archive Lead
        </button>

        <button
          onClick={() => handleAction('delete')}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg"
        >
          <Trash2 className="w-4 h-4" />
          Delete Lead
        </button>
      </div>
    </div>
  );
}