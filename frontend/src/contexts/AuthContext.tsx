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
          setState({
            ...state,
            loading: false,
          });
        }
      } catch (error) {
        setState({
          ...state,
          loading: false,
          error: null,
        });
      }
    };
    
    checkAuth();
  }, );
  
  // Login function
  const login = async (credentials: LoginCredentials) => {
    setState({
      ...state,
      loading: true,
      error: null,
    });
    
    try {
      const response = await authApi.login(credentials.email, credentials.password);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.user.role);
      
      setState({
        isAuthenticated: true,
        user: response.user,
        token: response.token,
        loading: false,
        error: null,
      });
      
      router.push('/dashboard');
    } catch (error) {
      const errorMessage = (error as Error).message || 'Login failed';
      
      setState({
        ...state,
        loading: false,
        error: errorMessage,
      });
      
      throw new Error(errorMessage);
    }
  };
  
  // Signup function
  const signup = async (data: SignupData) => {
    setState({
      ...state,
      loading: true,
      error: null,
    });
    
    try {
      await authApi.signup(data);
      
      setState({
        ...state,
        loading: false,
      });
      
      router.push('/login?registered=true');
    } catch (error) {
      const errorMessage = (error as Error).message || 'Signup failed';
      
      setState({
        ...state,
        loading: false,
        error: errorMessage,
      });
      
      throw new Error(errorMessage);
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    
    setState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
    });
    
    router.push('/login');
  };
  
  // Clear error function
  const clearError = () => {
    setState({
      ...state,
      error: null,
    });
  };
  
  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      signup,
      logout,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};