'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    // Check local storage for user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user data', e);
      }
    }
    setIsLoading(false);
  }, []);
  
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mock login for development
      const mockUsers: Record<string, User> = {
        'superadmin': {
          id: '1',
          username: 'superadmin',
          name: 'Super Administrator',
          email: 'superadmin@platform.edu',
          role: 'super_admin',
          avatar: '/avatars/superadmin.jpg'
        },
        'admin': {
          id: '2',
          username: 'admin',
          name: 'University Admin',
          email: 'admin@university.edu',
          role: 'admin',
          avatar: '/avatars/admin.jpg'
        },
        'faculty': {
          id: '3',
          username: 'faculty',
          name: 'Dr. Sarah Johnson',
          email: 'faculty@university.edu',
          role: 'faculty',
          avatar: '/avatars/faculty.jpg'
        },
        'student': {
          id: '4',
          username: 'student',
          name: 'Alex Chen',
          email: 'student@university.edu',
          role: 'student',
          avatar: '/avatars/student.jpg'
        },
        'staff': {
          id: '5',
          username: 'staff',
          name: 'Maria Rodriguez',
          email: 'staff@university.edu',
          role: 'staff',
          avatar: '/avatars/staff.jpg'
        }
      };
      
      const foundUser = mockUsers[username];
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        
        // Redirect based on role
        switch (foundUser.role) {
          case 'super_admin':
            router.push('/dashboard/superadmin');
            break;
          case 'admin':
            router.push('/dashboard/admin');
            break;
          default:
            router.push(`/dashboard/${foundUser.role}`);
            break;
        }
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };
  
  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);