// hooks/useAuth.ts
'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Parse the dashboard path to determine role
    const path = pathname.split('/');
    if (path[1] === 'dashboard') {
      const dashboardType = path[2] || 'student';
      // Set local storage for the dashboard
      localStorage.setItem('userRole', dashboardType === 'superadmin' ? 'super_admin' : dashboardType);
    }
  }, [pathname]);
  
  return null;
}