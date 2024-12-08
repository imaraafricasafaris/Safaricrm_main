import { theme } from '../lib/theme';

export interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
  moduleId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'agent';
}

export interface ThemeConfig {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: typeof theme;
}