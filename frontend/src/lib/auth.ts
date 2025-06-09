import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';

// Define UserRole type
export type UserRole = 'super_admin' | 'admin' | 'faculty' | 'student' | 'staff';

// IMPORTANT: This is a mock user database for demonstration purposes only.
// In a production environment, use a secure database and password hashing.
interface MockUser {
  id: string;
  email: string;
  password?: string; // Password is not always present, e.g., for OAuth users
  name: string;
  role: UserRole;
  institutionId?: string;
  departmentId?: string;
  avatar?: string;
}

const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'superadmin@platform.edu',
    password: 'admin123',
    name: 'Super Administrator',
    role: 'super_admin',
    avatar: '/avatars/superadmin.jpg'
  },
  {
    id: '2',
    email: 'admin@university.edu',
    password: 'admin123',
    name: 'University Admin',
    role: 'admin',
    institutionId: 'univ_1',
    avatar: '/avatars/admin.jpg'
  },
  {
    id: '3',
    email: 'faculty@university.edu',
    password: 'faculty123',
    name: 'Dr. Sarah Johnson',
    role: 'faculty',
    institutionId: 'univ_1',
    departmentId: 'dept_cs',
    avatar: '/avatars/faculty.jpg'
  },
  {
    id: '4',
    email: 'student@university.edu',
    password: 'student123',
    name: 'Alex Chen',
    role: 'student',
    institutionId: 'univ_1',
    departmentId: 'dept_cs',
    avatar: '/avatars/student.jpg'
  },
  {
    id: '5',
    email: 'staff@university.edu',
    password: 'staff123',
    name: 'Maria Rodriguez',
    role: 'staff',
    institutionId: 'univ_1',
    avatar: '/avatars/staff.jpg'
  }
];

// Authentication configuration
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/drive',
        },
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // In production, verify against your database
        const user = mockUsers.find(
          u => u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            institutionId: user.institutionId,
            departmentId: user.departmentId,
            avatar: user.avatar
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user: any; account: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.institutionId = user.institutionId;
        token.departmentId = user.departmentId;
      }

      // Handle Google OAuth
      if (account?.provider === 'google') {
        // In a real application, you would look up the user in your database
        // and assign a role based on their profile. For this demo, we'll
        // default to 'student' for any new Google sign-ins.
        token.role = token.role || 'student';
      }

      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.institutionId = token.institutionId;
        session.user.departmentId = token.departmentId;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Utility functions
export const getUserRole = (email: string): UserRole => {
  const user = mockUsers.find(u => u.email === email);
  return user?.role || 'student';
};

export const hasPermission = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    super_admin: 5,
    admin: 4,
    faculty: 3,
    staff: 2,
    student: 1
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

export const canAccessDashboard = (userRole: UserRole, dashboardType: string): boolean => {
  const accessMap: Record<string, UserRole[]> = {
    superadmin: ['super_admin'],
    admin: ['super_admin', 'admin'],
    faculty: ['super_admin', 'admin', 'faculty'],
    student: ['super_admin', 'admin', 'faculty', 'student'],
    staff: ['super_admin', 'admin', 'staff']
  };

  return accessMap[dashboardType]?.includes(userRole) || false;
};

export const getDashboardPath = (role: UserRole): string => {
  const dashboardPaths: Record<UserRole, string> = {
    super_admin: '/dashboard/superadmin',
    admin: '/dashboard/admin',
    faculty: '/dashboard/faculty',
    student: '/dashboard/student',
    staff: '/dashboard/staff'
  };

  return dashboardPaths[role] || '/dashboard/student';
};

// Helper function to get user's initials for avatar
export const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

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
export const setUserPreferences = (preferences: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('user_preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error storing user preferences:', error);
      // Fallback to a cookie-based approach if needed
    }
  }
};


export const getUserPreferences = (): Record<string, any> => {
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