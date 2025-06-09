// src/components/layout/ProtectedLayout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedLayout({ 
  children, 
  allowedRoles = ['super_admin', 'admin', 'faculty', 'student', 'staff'] 
}: ProtectedLayoutProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const [authorized, setAuthorized] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Authentication check
    if (!loading) {
      if (!isAuthenticated) {
        // Not logged in, redirect to login page
        router.push('/auth');
        return;
      }
      
      if (user && allowedRoles.includes(user.role as UserRole)) {
        // User has the required role, allow access
        setAuthorized(true);
      } else {
        // User doesn't have the required role, redirect to unauthorized page
        router.push('/unauthorized');
      }
      
      // Route verification: check if the user is accessing the correct dashboard for their role
      if (user) {
        const rolePath = `/dashboard/${user.role}`;
        const currentPathSegments = pathname.split('/');
        const dashboardTypeSegment = currentPathSegments.length > 2 ? currentPathSegments[2] : '';
        
        // If the user is in a dashboard but not their role's dashboard
        if (pathname.startsWith('/dashboard/') && dashboardTypeSegment !== user.role) {
          // Redirect to the correct dashboard
          router.push(rolePath);
        }
      }
    }
  }, [isAuthenticated, user, loading, allowedRoles, router, pathname]);
  
  // Show loading indicator while checking authentication
  if (loading || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  // Render the children when authenticated and authorized
  return <>{children}</>;
}