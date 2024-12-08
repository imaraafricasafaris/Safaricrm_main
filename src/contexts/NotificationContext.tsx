import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Notification, NotificationPreferences } from '../types/notifications';
import toast from 'react-hot-toast';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences | null;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  dismissNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
    loadPreferences();
    subscribeToNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError('Failed to load notifications');
    }
  };

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setPreferences(data);
    } catch (error) {
      console.error('Error loading preferences:', error);
      setError('Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToNotifications = () => {
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${supabase.auth.user()?.id}`
      }, payload => {
        const notification = payload.new as Notification;
        setNotifications(prev => [notification, ...prev]);
        
        // Show toast for high priority notifications
        if (notification.priority === 'high') {
          toast(notification.title, {
            description: notification.message,
            action: notification.action_url ? {
              label: "View",
              onClick: () => window.location.href = notification.action_url!
            } : undefined
          });
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, status: 'read' } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to update notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('status', 'unread');

      if (error) throw error;
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, status: 'read' }))
      );
      
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to update notifications');
    }
  };

  const updatePreferences = async (prefs: Partial<NotificationPreferences>) => {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: supabase.auth.user()?.id,
          ...preferences,
          ...prefs,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setPreferences(prev => prev ? { ...prev, ...prefs } : null);
      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  const dismissNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'archived' })
        .eq('id', id);

      if (error) throw error;
      
      setNotifications(prev =>
        prev.filter(n => n.id !== id)
      );
    } catch (error) {
      console.error('Error dismissing notification:', error);
      toast.error('Failed to dismiss notification');
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount: notifications.filter(n => n.status === 'unread').length,
      preferences,
      loading,
      error,
      markAsRead,
      markAllAsRead,
      updatePreferences,
      dismissNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}