export interface Office {
  id: string;
  company_id: string;
  name: string;
  country: string;
  city: string;
  address?: string;
  timezone: string;
  currency: string;
  status: 'active' | 'inactive';
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface StaffOffice {
  id: string;
  staff_id: string;
  office_id: string;
  role: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface OfficeMetrics {
  id: string;
  office_id: string;
  metric_type: string;
  value: number;
  period_start: string;
  period_end: string;
  created_at: string;
}

export interface OfficeFormData {
  name: string;
  country: string;
  city: string;
  address?: string;
  timezone: string;
  currency: string;
}