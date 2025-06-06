// components/dashboard/DashboardHeader.tsx (updated)
'use client';

import React, { useState } from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import { THEME } from '@/lib/constants';

export interface DashboardHeaderProps {
  toggleSidebarAction?: () => void;
  title?: string;
  subtitle?: string;
  actions?: {
    label: string;
    icon?: React.ReactNode;
    primary?: boolean;
    onClick?: () => void;
  }[];
  user?: {
    fullName: string;
    role: string;
  };
}

export default function DashboardHeader({
  title = "Dashboard",
  subtitle,
  actions = [],
  toggleSidebarAction = () => {},
  user = { fullName: 'User', role: 'student' }
}: DashboardHeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isBellHovered, setIsBellHovered] = useState(false);

  // Add border to THEME if not present
  const theme = {
    ...THEME,
    border: THEME.border || 'rgba(255, 255, 255, 0.1)'
  };

  return (
    <header
      className="px-6 py-4 border-b"
      style={{
        background: `linear-gradient(to right, ${theme.colors.dark.from}, ${theme.colors.dark.via}, ${theme.colors.dark.to})`,
        borderColor: theme.border
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebarAction}
            className="lg:hidden"
            style={{ color: theme.colors.text.primary }}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">
            <span
              style={{
                background: `linear-gradient(to right, ${theme.colors.primary.from}, ${theme.colors.primary.to})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              } as React.CSSProperties}
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
                style={{ color: theme.colors.text.muted }}
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-800 border transition-colors focus:outline-none"
                style={{
                  borderColor: isSearchFocused ? theme.colors.primary.from : theme.border,
                  color: theme.colors.text.primary
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>
          
          {/* Notifications */}
          <button
            className="relative p-2 transition-colors"
            style={{ color: isBellHovered ? theme.colors.text.primary : theme.colors.text.secondary }}
            onMouseEnter={() => setIsBellHovered(true)}
            onMouseLeave={() => setIsBellHovered(false)}
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
              <span className="text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                {user?.fullName || 'User'}
              </span>
              <span className="text-xs capitalize" style={{ color: theme.colors.text.muted }}>
                {user?.role || 'Role'}
              </span>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary.from}, ${theme.colors.primary.to})`
              }}
            >
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      {actions.length > 0 && (
        <div className="flex space-x-2 mt-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                action.primary 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                  : 'bg-gray-800 text-gray-200'
              }`}
            >
              {action.icon && <span>{action.icon}</span>}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
      
      {subtitle && (
        <p className="mt-2 text-sm" style={{ color: theme.colors.text.secondary }}>
          {subtitle}
        </p>
      )}
    </header>
  );
}