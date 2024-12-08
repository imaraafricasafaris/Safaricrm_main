import { supabase } from '../supabase';
import type { AutomatedWorkflow, EmailTemplate } from '../database/types';

export async function getWorkflows(filters?: {
  is_active?: boolean;
  trigger_event?: AutomatedWorkflow['trigger']['event'];
}) {
  let query = supabase.from('automated_workflows').select('*');

  if (filters?.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active);
  }

  if (filters?.trigger_event) {
    query = query.eq('trigger->event', filters.trigger_event);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as AutomatedWorkflow[];
}

export async function createWorkflow(workflow: Omit<AutomatedWorkflow, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('automated_workflows')
    .insert(workflow)
    .select()
    .single();

  if (error) throw error;
  return data as AutomatedWorkflow;
}

export async function getEmailTemplates(type?: EmailTemplate['type']) {
  let query = supabase.from('email_templates').select('*');

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query.eq('is_active', true);
  if (error) throw error;
  return data as EmailTemplate[];
}

export async function createEmailTemplate(template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('email_templates')
    .insert(template)
    .select()
    .single();

  if (error) throw error;
  return data as EmailTemplate;
}