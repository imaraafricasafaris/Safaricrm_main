import { supabase } from '../supabase';

export interface LeadActivity {
  id: string;
  lead_id: string;
  user_id: string;
  type: 'status_change' | 'note_added' | 'email_sent' | 'call_made' | 'document_added' | 'follow_up_scheduled' | 'proposal_sent';
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export async function getLeadActivities(leadId: string) {
  const { data, error } = await supabase
    .from('lead_activities')
    .select(`
      *,
      user:auth.users (
        email,
        user_metadata
      )
    `)
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data as LeadActivity[];
}

export async function createLeadActivity(activity: Omit<LeadActivity, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('lead_activities')
    .insert(activity)
    .select()
    .single();
    
  if (error) throw error;
  return data as LeadActivity;
}