// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api-client';
import { User, AuthState, LoginCredentials, SignupData } from '@/lib/types';

// Define the context interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
    error: null,
  });
  
  const router = useRouter();
  
  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        
        if (storedToken) {
          try {
            // Validate token and get user profile
            const { user } = await authApi.getProfile(storedToken);
            
            setState({
              isAuthenticated: true,
              user,
              token: storedToken,
              loading: false,
              error: null,
            });
          } catch (error) {
            // Token invalid, clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            
            setState({
              isAuthenticated: false,
              user: null,
              token: null,
              loading: false,
              error: null,
            });
          }
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        setState({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: 'Authentication check failed',
        });
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { token, user } = await authApi.login(credentials.email, credentials.password);
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      
      setState({
        isAuthenticated: true,
        user,
        token,
        loading: false,
        error: null,
      });
      
      // Redirect based on user role
      redirectToDashboard(user.role);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Login failed',
      }));
    }
  };
  
  // Signup function
  const signup = async (data: SignupData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await authApi.signup(data);
      
      setState(prev => ({
        ...prev,
        loading: false,
      }));
      
      // Redirect to login page
      router.push('/auth');
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Signup failed',
      }));
    }
  };
  
  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    
    setState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
    });
    
    // Redirect to login page
    router.push('/auth');
  };
  
  // Clear error
  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };
  
  // Helper function to redirect based on role
  const redirectToDashboard = (role: string) => {
    switch (role) {
      case 'super_admin':
        router.push('/dashboard/superadmin');
        break;
      case 'admin':
        router.push('/dashboard/admin');
        break;
      case 'faculty':
        router.push('/dashboard/faculty');
        break;
      case 'student':
        router.push('/dashboard/student');
        break;
      case 'staff':
        router.push('/dashboard/staff');
        break;
      default:
        router.push('/dashboard');
        break;
    }
  };
  
  // Context value
  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    clearError,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}