export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent' | 'error';
  scheduled_date?: string;
  sent_date?: string;
  recipient_count: number;
  open_rate?: number;
  click_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface SocialPost {
  id: string;
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter';
  content: string;
  media_urls?: string[];
  status: 'draft' | 'scheduled' | 'published' | 'error';
  scheduled_date?: string;
  published_date?: string;
  engagement_stats?: {
    likes: number;
    shares: number;
    comments: number;
  };
  created_at: string;
  updated_at: string;
}

export interface LeadWorkflow {
  id: string;
  name: string;
  trigger_type: 'new_lead' | 'status_change' | 'tag_added' | 'custom';
  trigger_conditions: Record<string, any>;
  steps: Array<{
    type: 'email' | 'notification' | 'task' | 'delay' | 'condition';
    config: Record<string, any>;
  }>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarketingProvider {
  id: string;
  name: string;
  type: 'email' | 'social' | 'sms';
  credentials: Record<string, any>;
  settings: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  error_message?: string;
  created_at: string;
  updated_at: string;
}