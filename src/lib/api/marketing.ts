import { supabase } from '../supabase';
import { EmailCampaign, SocialPost, LeadWorkflow, MarketingProvider } from '../../types/marketing';

// Email Campaigns
export async function getEmailCampaigns() {
  const { data, error } = await supabase
    .from('email_campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as EmailCampaign[];
}

export async function createEmailCampaign(campaign: Omit<EmailCampaign, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('email_campaigns')
    .insert([campaign])
    .select()
    .single();

  if (error) throw error;
  return data as EmailCampaign;
}

// Social Media Posts
export async function getSocialPosts() {
  const { data, error } = await supabase
    .from('social_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as SocialPost[];
}

export async function createSocialPost(post: Omit<SocialPost, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('social_posts')
    .insert([post])
    .select()
    .single();

  if (error) throw error;
  return data as SocialPost;
}

// Lead Nurturing Workflows
export async function getLeadWorkflows() {
  const { data, error } = await supabase
    .from('lead_workflows')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as LeadWorkflow[];
}

export async function createLeadWorkflow(workflow: Omit<LeadWorkflow, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('lead_workflows')
    .insert([workflow])
    .select()
    .single();

  if (error) throw error;
  return data as LeadWorkflow;
}

// Marketing Providers
export async function getMarketingProviders() {
  const { data, error } = await supabase
    .from('marketing_providers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as MarketingProvider[];
}

export async function updateMarketingProvider(
  id: string,
  updates: Partial<MarketingProvider>
) {
  const { data, error } = await supabase
    .from('marketing_providers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as MarketingProvider;
}