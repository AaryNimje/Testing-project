// components/dashboard/Sidebar.tsx
'use client';

import React, { ReactElement } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ChevronRight, LogOut, GraduationCap } from 'lucide-react';
import { THEME } from '@/lib/constants';

export interface SidebarProps {
  isOpen: boolean;
  toggleSidebarAction: () => void;
  menuItems: {
    name: string;
    path?: string;
    icon: React.ComponentType<any> | (() => ReactElement);
    badge?: string;
  }[];
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  onLogoutAction: () => void;
}

export default function Sidebar({
  isOpen,
  toggleSidebarAction,
  menuItems,
  user,
  onLogoutAction
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebarAction}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        style={{
          background: `linear-gradient(to bottom, ${THEME.colors.dark.from}, ${THEME.colors.dark.via}, ${THEME.colors.dark.to})`
        }}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${THEME.colors.primary.from}, ${THEME.colors.primary.to})`
                }}
              >
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold">
                <span 
                  style={{
                    background: `linear-gradient(to right, ${THEME.colors.primary.from}, ${THEME.colors.primary.to})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  } as React.CSSProperties}
                >
                  Academic AI
                </span>
              </h2>
            </div>
            <button onClick={toggleSidebarAction} className="lg:hidden">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          
          {/* User Info */}
          <div 
            className="mb-6 p-3 rounded-lg backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          >
            <p className="text-xs" style={{ color: THEME.colors.text.secondary }}>
              Logged in as
            </p>
            <p className="font-semibold text-white">{user.fullName}</p>
            <p className="text-xs capitalize" style={{ color: THEME.colors.text.muted }}>
              {user.role.replace('_', ' ')}
            </p>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.path;
              const IconComponent = item.icon;
              
              return (
                <Link
                  key={index}
                  href={item.path || '#'}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive ? 'border-l-4' : ''
                  }`}
                  style={{
                    backgroundColor: isActive ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    borderColor: isActive ? THEME.colors.primary.from : 'transparent',
                  }}
                >
                  <span className="w-5 h-5" style={{ color: isActive ? THEME.colors.accent : THEME.colors.text.secondary }}>
                    {React.createElement(IconComponent)}
                  </span>
                  <span 
                    className={isActive ? 'text-white' : ''}
                    style={{ color: isActive ? '#FFFFFF' : THEME.colors.text.secondary }}
                  >
                    {item.name}
                  </span>
                  {item.badge && (
                    <span 
                      className="ml-auto px-2 py-0.5 text-xs rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${THEME.colors.primary.from}, ${THEME.colors.primary.to})`,
                        color: 'white'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight 
                      className="w-4 h-4 ml-auto"
                      style={{ color: THEME.colors.accent }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* Logout Button */}
          <button
            onClick={onLogoutAction}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-red-400 hover:bg-red-600/10"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}