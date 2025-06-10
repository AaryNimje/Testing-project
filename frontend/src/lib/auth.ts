import { UserRole } from '@/lib/types';

// Helper function to get user's color based on role
export const getUserRoleColor = (role: UserRole): string => {
  const colorMap: Record<UserRole, string> = {
    super_admin: 'bg-red-500',
    admin: 'bg-blue-500',
    faculty: 'bg-purple-500',
    student: 'bg-green-500',
    staff: 'bg-orange-500'
  };

  return colorMap[role] || 'bg-gray-500';
};

// Session storage utilities
export const setUserPreferences = (preferences: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('user_preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error storing user preferences:', error);
      // Fallback to a cookie-based approach if needed
    }
  }
};

export const getUserPreferences = (): Record<string, unknown> => {
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('user_preferences');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error retrieving user preferences:', error);
      return {};
    }
  }
  return {};
};

// API utilities for authentication
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  
  if (response.status === 401) {
    // Redirect to login if unauthorized
    window.location.href = '/login';
    return null;
  }

  return response;
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};