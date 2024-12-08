export interface ApiKey {
  id: string;
  name: string;
  key: string;
  secret: string;
  status: 'active' | 'revoked' | 'expired';
  permissions: string[];
  rate_limit: number;
  expires_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ApiEndpoint {
  id: string;
  path: string;
  method: string;
  description: string;
  version: string;
  auth_required: boolean;
  rate_limit: number;
  cache_ttl: number;
  deprecated: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiUsageLog {
  id: string;
  api_key_id: string;
  endpoint_id: string;
  method: string;
  path: string;
  status_code: number;
  response_time: number;
  request_body?: Record<string, any>;
  response_body?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface ApiMetrics {
  total_requests: number;
  average_response_time: number;
  error_rate: number;
  requests_per_minute: number;
  top_endpoints: Array<{
    path: string;
    count: number;
    average_time: number;
  }>;
  status_codes: Record<string, number>;
}