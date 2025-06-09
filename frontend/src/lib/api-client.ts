// src/lib/api-client.ts
import { UserRole } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  institution?: string;
  lastLogin?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  status: number;
}

// Helper method to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json();
    throw {
      message: errorData.message || 'An error occurred',
      status: response.status
    } as ApiError;
  }
  
  return response.json() as Promise<T>;
}

// Auth API client
export const authApi = {
  // Login user
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    
    return handleResponse<AuthResponse>(response);
  },
  
  // Sign up user
  signup: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<{ message: string; user: Partial<User> }> => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    return handleResponse<{ message: string; user: Partial<User> }>(response);
  },
  
  // Get current user profile
  getProfile: async (token: string): Promise<{ user: User }> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    return handleResponse<{ user: User }>(response);
  },
  
  // Update user role (SuperAdmin only)
  updateUserRole: async (token: string, userId: string, role: UserRole): Promise<{ message: string; user: User }> => {
    const response = await fetch(`${API_BASE_URL}/auth/users/role`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, role }),
      credentials: 'include'
    });
    
    return handleResponse<{ message: string; user: User }>(response);
  },
  
  // Get all users (Admin/SuperAdmin only)
  getAllUsers: async (token: string): Promise<{ users: User[] }> => {
    const response = await fetch(`${API_BASE_URL}/auth/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    return handleResponse<{ users: User[] }>(response);
  }
};

// Dashboard API client
export const dashboardApi = {
  // Get dashboard statistics
  getStats: async (token: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse<any>(response);
  }
};