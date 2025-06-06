'use client';

import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import { THEME } from '@/lib/constants';

interface DashboardHeaderProps {
  toggleSidebarAction: () => void;
  title: string;
  user?: {
    fullName: string;
    role: string;
  };
}

export default function DashboardHeader({ toggleSidebarAction, title, user }: DashboardHeaderProps) {
  return (
    <header 
      className="px-6 py-4 border-b"
      style={{
        background: `linear-gradient(to right, ${THEME.colors.dark.from}, ${THEME.colors.dark.via}, ${THEME.colors.dark.to})`,
        borderColor: THEME.colors.border
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSidebarAction} 
            className="lg:hidden"
            style={{ color: THEME.colors.text.primary }}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">
            <span 
              style={{
                background: `linear-gradient(to right, ${THEME.colors.primary.from}, ${THEME.colors.primary.to})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {title}
            </span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: THEME.colors.text.muted }}
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-800 border transition-colors focus:outline-none"
                style={{
                  borderColor: THEME.colors.border,
                  color: THEME.colors.text.primary
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = THEME.colors.primary.from;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = THEME.colors.border;
                }}
              />
            </div>
          </div>
          
          {/* Notifications */}
          <button 
            className="relative p-2 transition-colors"
            style={{ color: THEME.colors.text.secondary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = THEME.colors.text.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = THEME.colors.text.secondary;
            }}
          >
            <Bell className="w-6 h-6" />
            <span 
              className="absolute top-0 right-0 w-2 h-2 rounded-full"
              style={{ backgroundColor: '#EF4444' }}
            />
          </button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium" style={{ color: THEME.colors.text.primary }}>
                {user?.fullName || 'User'}
              </span>
              <span className="text-xs capitalize" style={{ color: THEME.colors.text.muted }}>
                {user?.role || 'Role'}
              </span>
            </div>
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${THEME.colors.primary.from}, ${THEME.colors.primary.to})`
              }}
            >
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}