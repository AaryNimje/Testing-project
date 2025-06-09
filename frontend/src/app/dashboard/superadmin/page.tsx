// src/app/dashboard/superadmin/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  IconServer,
  IconBrain,
  IconChartBar,
  IconUsers,
  IconLock,
  IconDeviceDesktop,
  IconDatabase,
  IconUser,
} from "@tabler/icons-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { UserManagement } from "@/components/dashboard/superadmin/UserManagement";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardApi } from "@/lib/api-client";

// Skeleton component with academic theme styling
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`h-full w-full rounded-xl bg-slate-800 border border-white/5 ${className}`}></div>
);

// Dashboard components for system health, AI system, security logs, etc.
const SystemHealth = () => (
  <div className="h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-cyan-900 border border-cyan-800/50 p-4 text-white">
    <h4 className="text-xs font-medium text-gray-300">System Status</h4>
    <div className="flex items-center justify-between">
      <div className="grid grid-cols-2 gap-2 mt-2 w-full">
        <div className="bg-cyan-900/30 p-2 rounded-lg">
          <p className="text-xs text-gray-400">Uptime</p>
          <p className="text-xl font-bold text-white">99.8%</p>
        </div>
        <div className="bg-cyan-900/30 p-2 rounded-lg">
          <p className="text-xs text-gray-400">Response Time</p>
          <p className="text-xl font-bold text-white">189ms</p>
        </div>
        <div className="bg-cyan-900/30 p-2 rounded-lg">
          <p className="text-xs text-gray-400">Server Load</p>
          <p className="text-xl font-bold text-white">42%</p>
        </div>
        <div className="bg-cyan-900/30 p-2 rounded-lg">
          <p className="text-xs text-gray-400">API Status</p>
          <div className="flex items-center mt-1">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
            <p className="text-sm font-bold text-white">Healthy</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AISystem = () => (
  <div className="h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-cyan-900 border border-cyan-800/50 p-4 text-white">
    <h4 className="text-xs font-medium text-gray-300">AI Usage Today</h4>
    <div className="flex items-center justify-between">
      <div className="grid grid-cols-2 gap-2 mt-2 w-full">
        <div className="bg-cyan-900/30 p-2 rounded-lg">
          <p className="text-xs text-gray-400">Total Queries</p>
          <p className="text-xl font-bold text-white">2,567</p>
        </div>
        <div className="bg-cyan-900/30 p-2 rounded-lg">
          <p className="text-xs text-gray-400">Cost</p>
          <p className="text-xl font-bold text-white">$0.12</p>
        </div>
        <div className="bg-cyan-900/30 p-2 rounded-lg">
          <p className="text-xs text-gray-400">Top Tool</p>
          <p className="text-sm font-bold text-white">Quiz Generator</p>
        </div>
        <div className="bg-cyan-900/30 p-2 rounded-lg">
          <p className="text-xs text-gray-400">Response Time</p>
          <p className="text-xl font-bold text-white">1.2s</p>
        </div>
      </div>
    </div>
  </div>
);

const SecurityLogs = () => (
  <div className="h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-cyan-900 border border-cyan-800/50 p-4 text-white">
    <h4 className="text-xs font-medium text-gray-300">Security Events</h4>
    <div className="mt-2 space-y-2">
      {[
        { event: "Failed Login Attempt", user: "unknown@mail.com", time: "10:23 AM", level: "warning" },
        { event: "Role Change", user: "faculty@university.edu", time: "09:45 AM", level: "info" },
        { event: "Password Reset", user: "student@university.edu", time: "08:30 AM", level: "info" },
      ].map((log, idx) => (
        <div key={idx} className="flex items-center justify-between bg-cyan-900/30 p-2 rounded-lg">
          <div>
            <p className="text-sm font-medium text-white">{log.event}</p>
            <p className="text-xs text-gray-400">{log.user}</p>
          </div>
          <div className="flex items-center">
            <span
              className={`w-2 h-2 rounded-full mr-2 ${
                log.level === "warning" ? "bg-yellow-500" : "bg-blue-500"
              }`}
            ></span>
            <p className="text-xs text-gray-400">{log.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DatabaseStats = () => (
  <div className="h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-cyan-900 border border-cyan-800/50 p-4 text-white">
    <h4 className="text-xs font-medium text-gray-300">Database</h4>
    <div className="flex items-center justify-between mt-2">
      <div className="flex-1">
        <div className="flex justify-between mb-2">
          <p className="text-xs text-gray-400">Storage</p>
          <p className="text-xs text-cyan-400">15.8 GB / 20 GB</p>
        </div>
        <div className="w-full h-1.5 bg-slate-700 rounded-full">
          <div
            className="h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
            style={{ width: "79%" }}
          ></div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="bg-cyan-900/30 p-2 rounded-lg">
            <p className="text-xs text-gray-400">Queries/min</p>
            <p className="text-xl font-bold text-white">347</p>
          </div>
          <div className="bg-cyan-900/30 p-2 rounded-lg">
            <p className="text-xs text-gray-400">Query Count</p>
            <p className="text-xl font-bold text-white">1.2M</p>
            <p className="text-xs text-cyan-400">Today</p>
          </div>
        </div>
        
        <h4 className="text-xs font-medium text-gray-300 mt-4">Table Sizes</h4>
        {[
          { table: "users", size: "4.2 GB", percentage: 27 },
          { table: "courses", size: "3.8 GB", percentage: 24 },
          { table: "assignments", size: "5.5 GB", percentage: 35 },
          { table: "resources", size: "2.3 GB", percentage: 14 },
        ].map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-xs text-white truncate mr-2">{item.table}</span>
            <div className="flex items-center">
              <div className="w-16 h-1.5 bg-slate-700 rounded-full mr-2">
                <div
                  className="h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <span className="text-xs text-cyan-400 whitespace-nowrap">{item.size}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function SuperAdminDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    userCount: 0,
    newToday: 0,
    systemUptime: 0,
    dailyCost: 0,
    dailyCap: 0,
    apiHealth: 0,
    recentActivity: []
  });
  
  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (token) {
        try {
          const dashboardStats = await dashboardApi.getStats(token);
          setStats(dashboardStats);
        } catch (error) {
          console.error('Error fetching dashboard stats:', error);
        }
      }
    };
    
    fetchStats();
  }, [token]);

  return (
    <div className="space-y-6 p-2">
      {/* User greeting */}
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white mr-3">
          <IconUser className="h-5 w-5" />
        </div>
        <div>
          <p className="text-gray-300 text-sm">Hello,</p>
          <h2 className="text-white text-xl font-medium">{user?.name || 'Super Admin'}</h2>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Super Admin Dashboard</h1>
        <p className="text-gray-300">Complete platform oversight and management.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-lg border border-white/10 p-4">
          <p className="text-gray-400 text-sm">Total Users</p>
          <p className="text-white text-2xl font-bold">{stats.userCount}</p>
          <p className="text-cyan-400 text-sm">+{stats.newToday} today</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg border border-white/10 p-4">
          <p className="text-gray-400 text-sm">System Uptime</p>
          <p className="text-white text-2xl font-bold">{stats.systemUptime}%</p>
          <p className="text-cyan-400 text-sm">Last 30 days</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg border border-white/10 p-4">
          <p className="text-gray-400 text-sm">Daily Costs</p>
          <p className="text-white text-2xl font-bold">${stats.dailyCost}</p>
          <p className="text-cyan-400 text-sm">/${stats.dailyCap} cap</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg border border-white/10 p-4">
          <p className="text-gray-400 text-sm">API Health</p>
          <p className="text-white text-2xl font-bold">{stats.apiHealth}%</p>
          <p className="text-cyan-400 text-sm">All Green</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-white/10">
          <TabsTrigger value="overview" className="text-white data-[state=active]:bg-slate-700">
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="text-white data-[state=active]:bg-slate-700">
            User Management
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <BentoGrid className="max-w-full">
            {[
              {
                title: "System Health",
                description: "Platform service status and performance",
                header: <SystemHealth />,
                icon: <IconServer className="h-4 w-4 text-cyan-400" />,
              },
              {
                title: "AI System Overview",
                description: "AI usage, costs, and model performance",
                header: <AISystem />,
                icon: <IconBrain className="h-4 w-4 text-cyan-400" />,
              },
              {
                title: "Security Logs",
                description: "Authentication and security events",
                header: <SecurityLogs />,
                icon: <IconLock className="h-4 w-4 text-cyan-400" />,
              },
              {
                title: "Database Statistics",
                description: "Storage usage and query performance",
                header: <DatabaseStats />,
                icon: <IconDatabase className="h-4 w-4 text-cyan-400" />,
              },
              {
                title: "User Management",
                description: "Global user administration and roles",
                header: <Skeleton className="bg-gradient-to-br from-blue-900 to-cyan-900 border-cyan-800/50" />,
                icon: <IconUsers className="h-4 w-4 text-cyan-400" />,
              },
              {
                title: "System Configuration",
                description: "Platform-wide settings and configuration",
                header: <Skeleton className="bg-gradient-to-br from-blue-900 to-cyan-900 border-cyan-800/50" />,
                icon: <IconDeviceDesktop className="h-4 w-4 text-cyan-400" />,
              },
              {
                title: "Global Analytics",
                description: "Comprehensive platform usage statistics",
                header: <Skeleton className="bg-gradient-to-br from-blue-900 to-cyan-900 border-cyan-800/50" />,
                icon: <IconChartBar className="h-4 w-4 text-cyan-400" />,
              },
            ].map((item, i: number) => (
              <BentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                header={item.header}
                icon={item.icon}
                className={i === 3 || i === 6 ? "md:col-span-2" : ""}
              />
            ))}
          </BentoGrid>
        </TabsContent>
        
        <TabsContent value="users" className="mt-4">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}