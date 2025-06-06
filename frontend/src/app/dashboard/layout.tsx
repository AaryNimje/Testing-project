'use client';
import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
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