'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { THEME } from '@/lib/constants';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Mock user data for demonstration
  const userData = {
    fullName: 'John Doe',
    role: 'admin',
    id: '1',
    email: 'john@example.com'
  };
  
  // Mock menu items
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: () => <span>📊</span> },
    { name: 'Users', path: '/dashboard/users', icon: () => <span>👥</span> },
    { name: 'Settings', path: '/dashboard/settings', icon: () => <span>⚙️</span> }
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        toggleSidebarAction={() => setSidebarOpen(!sidebarOpen)}
        menuItems={menuItems}
        user={userData}
        onLogoutAction={() => console.log('Logout clicked')}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader 
          title="Dashboard"
          toggleSidebarAction={() => setSidebarOpen(!sidebarOpen)}
          user={userData}
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}