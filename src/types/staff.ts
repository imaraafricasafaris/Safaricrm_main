export interface Staff {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'agent' | 'driver' | 'guide';
  status: 'active' | 'inactive' | 'pending';
  permissions: {
    leads?: boolean;
    safaris?: boolean;
    vehicles?: boolean;
    reports?: boolean;
    settings?: boolean;
  };
  company_id: string;
  office_id?: string;
  phone?: string;
  last_login?: string;
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