// Define user roles
export type UserRole = 'super_admin' | 'admin' | 'faculty' | 'student' | 'staff';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  institution?: string;
  lastLogin?: string;
}

// Authentication state
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Signup data
export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Dashboard statistics
export interface DashboardStats {
  userCount: number;
  newToday: number;
  systemUptime: number;
  dailyCost: number;
  dailyCap: number;
  apiHealth: number;
  recentActivity: Array<{
    user: string;
    action: string;
    timestamp: string;
  }>;
}