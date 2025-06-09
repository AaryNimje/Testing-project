// src/app/unauthorized/page.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { IconLockAccess, IconArrowLeft } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  
  const handleBackToDashboard = () => {
    if (isAuthenticated && user) {
      router.push(`/dashboard/${user.role}`);
    } else {
      router.push('/auth');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black">
      <div className="max-w-md p-8 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 shadow-xl text-center">
        <div className="h-20 w-20 rounded-full bg-red-900/40 flex items-center justify-center mx-auto mb-6">
          <IconLockAccess className="h-10 w-10 text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-6">
          You don't have permission to access this page. This area requires higher privileges than your current role.
        </p>
        
        {isAuthenticated && user ? (
          <div className="space-y-4">
            <p className="text-white">
              You are currently logged in as <span className="font-medium">{user.name}</span> with the role of{' '}
              <span className="font-medium">{user.role}</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleBackToDashboard} 
                className="bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                <IconArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              
              <Button 
                onClick={logout} 
                variant="outline" 
                className="border-white/10 text-white hover:bg-white/10"
              >
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={() => router.push('/auth')} 
            className="bg-gradient-to-r from-cyan-500 to-blue-600"
          >
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
}