export type NotificationPriority = 'high' | 'medium' | 'low';
export type NotificationType = 'module' | 'subscription' | 'system' | 'error';
export type NotificationStatus = 'unread' | 'read' | 'archived';
export type DeliveryMethod = 'email' | 'in-app' | 'sms';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  metadata?: Record<string, any>;
  error_code?: string;
  action_url?: string;
  delivery_methods: DeliveryMethod[];
  created_at: string;
  read_at?: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  module_notifications: boolean;
  subscription_alerts: boolean;
  system_notifications: boolean;
  error_alerts: boolean;
  delivery_methods: DeliveryMethod[];
  quiet_hours?: {
    start: string;
    end: string;
    timezone: string;
  };
}