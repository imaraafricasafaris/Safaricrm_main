import { supabase } from '../supabase';

export async function getCompanies() {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      subscription:company_subscriptions(
        subscription_plan:subscription_plans(*)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getApiKeys() {
  const { data, error } = await supabase
    .from('api_keys')
    .select(`
      *,
      company:companies(name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getSystemHealth() {
  const { data, error } = await supabase
    .from('system_health_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;
  return data;
}

export async function getApiUsageStats() {
  const { data, error } = await supabase
    .from('api_usage_logs')
    .select(`
      endpoint,
      count(*),
      avg(response_time)::integer as avg_response_time,
      count(*) filter (where status_code >= 200 and status_code < 300)::float / count(*)::float * 100 as success_rate
    `)
    .group('endpoint')
    .order('count', { ascending: false });

  if (error) throw error;
  return data;
}

export async function generateApiKey(companyId: string, name: string) {
  const key = crypto.randomUUID();
  
  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      company_id: companyId,
      name,
      key,
      status: 'active'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function revokeApiKey(keyId: string) {
  const { error } = await supabase
    .from('api_keys')
    .update({ status: 'revoked' })
    .eq('id', keyId);

  if (error) throw error;
}

export async function updateCompanyStatus(companyId: string, status: 'active' | 'suspended' | 'cancelled') {
  const { error } = await supabase
    .from('companies')
    .update({ status })
    .eq('id', companyId);

  if (error) throw error;
}

export async function updateSubscriptionPlan(companyId: string, planId: string) {
  const { error } = await supabase
    .from('company_subscriptions')
    .update({
      plan_id: planId,
      updated_at: new Date().toISOString()
    })
    .eq('company_id', companyId);

  if (error) throw error;
}