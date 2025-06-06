'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

// Simple placeholder components
const Sidebar = ({ user, onLogoutAction }: any) => (
  <div className="w-64 bg-gray-900 text-white p-4">
    <div className="mb-4">
      <h2 className="text-xl font-bold">{user?.name || 'User'}</h2>
      <p className="text-sm text-gray-400">{user?.role || 'Role'}</p>
    </div>
    <nav className="space-y-2">
      <a href="/dashboard" className="block p-2 hover:bg-gray-800 rounded">Dashboard</a>
      <button onClick={onLogoutAction} className="block w-full text-left p-2 text-red-400 hover:bg-gray-800 rounded">Logout</button>
    </nav>
  </div>
);

const Header = ({ title }: any) => (
  <header className="bg-gray-800 p-4 text-white">
    <h1 className="text-xl font-bold">{title}</h1>
  </header>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }
  
  if (!user) {
    router.push('/login');
    return null;
  }
  
  return (
    <div className="min-h-screen flex bg-gray-900">
      <Sidebar user={user} onLogoutAction={logout} />
      
      <div className="flex-1 flex flex-col">
        <Header title={`${user.role.replace('_', ' ')} Dashboard`} />
        
        <main className="flex-1 overflow-auto p-6 bg-gray-800 text-white">
          {children}
        </main>
      </div>
    </div>
  );
}