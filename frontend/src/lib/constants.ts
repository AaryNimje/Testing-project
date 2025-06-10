import { ComponentType, ReactElement } from 'react';  // Remove ReactNode

export type UserRole = 'super_admin' | 'admin' | 'faculty' | 'student' | 'staff';

export interface DashboardMenuItem {
  name: string;
  path?: string;
  icon: ComponentType<Record<string, never>> | (() => ReactElement);  // Replace any with Record<string, never>
  badge?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export const THEME = {
  colors: {
    primary: {
      from: '#4f46e5',
      to: '#8b5cf6',
    },
    dark: {
      from: '#111827',
      via: '#1f2937',
      to: '#374151',
    },
    accent: '#8b5cf6',
    text: {
      primary: '#f9fafb',
      secondary: '#e5e7eb',
      muted: '#9ca3af',
    },
  },
  border: 'rgba(255, 255, 255, 0.1)'
};