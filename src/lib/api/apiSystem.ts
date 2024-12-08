import { supabase } from '../supabase';
import type { ApiKey, ApiEndpoint, ApiUsageLog, ApiMetrics } from '../../types/api';

export async function getApiKeys() {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ApiKey[];
}

export async function getApiMetrics(startDate: string, endDate: string): Promise<ApiMetrics> {
  const { data, error } = await supabase
    .from('api_usage_logs')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (error) throw error;

  const logs = data as ApiUsageLog[];
  const totalRequests = logs.length;
  const totalResponseTime = logs.reduce((sum, log) => sum + log.response_time, 0);
  const errorRequests = logs.filter(log => log.status_code >= 400).length;

  // Calculate requests per minute
  const minuteGroups: Record<string, number> = {};
  logs.forEach(log => {
    const minute = new Date(log.created_at).setSeconds(0, 0);
    minuteGroups[minute] = (minuteGroups[minute] || 0) + 1;
  });
  const requestsPerMinute = Object.values(minuteGroups).reduce((sum, count) => sum + count, 0) / Object.keys(minuteGroups).length || 0;

  // Calculate top endpoints
  const endpointStats: Record<string, { count: number; totalTime: number }> = {};
  logs.forEach(log => {
    if (!endpointStats[log.path]) {
      endpointStats[log.path] = { count: 0, totalTime: 0 };
    }
    endpointStats[log.path].count++;
    endpointStats[log.path].totalTime += log.response_time;
  });

  const topEndpoints = Object.entries(endpointStats)
    .map(([path, stats]) => ({
      path,
      count: stats.count,
      average_time: stats.totalTime / stats.count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate status code distribution
  const statusCodes: Record<string, number> = {};
  logs.forEach(log => {
    const statusGroup = `${Math.floor(log.status_code / 100)}xx`;
    statusCodes[statusGroup] = (statusCodes[statusGroup] || 0) + 1;
  });

  return {
    total_requests: totalRequests,
    average_response_time: totalRequests ? totalResponseTime / totalRequests : 0,
    error_rate: totalRequests ? (errorRequests / totalRequests) * 100 : 0,
    requests_per_minute: requestsPerMinute,
    top_endpoints: topEndpoints,
    status_codes: statusCodes
  };
}

export async function getApiEndpoints() {
  const { data, error } = await supabase
    .from('api_endpoints')
    .select('*')
    .order('path');

  if (error) throw error;
  return data as ApiEndpoint[];
}