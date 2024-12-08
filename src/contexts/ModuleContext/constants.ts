export const CORE_MODULES = [
  'dashboard',
  'settings',
  'notifications',
  'leads', 
  'modules'
];

export const DEFAULT_MODULES = [
  'client-management',
  'task-management',
  'document-management',
  'invoicing',
  'itinerary-builder',
  'advanced-reporting',
  'staff-management',
  'office-management'
];

export const MODULE_CATEGORIES = {
  core: 'Core Features',
  crm: 'Customer Management',
  operations: 'Operations',
  finance: 'Finance',
  reporting: 'Reports & Analytics',
  automation: 'Automation'
} as const;

export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    level: 0,
    moduleLimit: 3,
    price: 0
  },
  basic: {
    name: 'Basic',
    level: 1,
    moduleLimit: 5,
    price: 49
  },
  premium: {
    name: 'Premium',
    level: 2,
    moduleLimit: 10,
    price: 99
  },
  enterprise: {
    name: 'Enterprise',
    level: 3,
    moduleLimit: -1,
    price: 199
  }
} as const;