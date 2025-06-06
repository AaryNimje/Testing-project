'use client';
import React from 'react';
import BentoGrid from '@/components/dashboard/BentoGrid';
import BentoCard from '@/components/dashboard/BentoCard';
import ChartCard from '@/components/dashboard/ChartCard';
import TableCard from '@/components/dashboard/TableCard';
import { Users, Activity, DollarSign, Shield, Server, Database, AlertTriangle, TrendingUp } from 'lucide-react';

export default function SuperAdminDashboard() {
  // Mock data for demonstration
  const kpiData = [
    {
      title: "Total Users",
      value: "1,247",
      change: "+23 today",
      icon: <Users className="w-6 h-6" />,
      trend: "up"
    },
    {
      title: "System Uptime",
      value: "99.8%",
      change: "Last 30 days",
      icon: <Server className="w-6 h-6" />,
      trend: "up"
    },
    {
      title: "Daily Costs",
      value: "$0.12",
      change: "/$0.16 cap",
      icon: <DollarSign className="w-6 h-6" />,
      trend: "stable"
    },
    {
      title: "API Health",
      value: "98.7%",
      change: "All Green",
      icon: <Shield className="w-6 h-6" />,
      trend: "up"
    }
  ];

  const userActivityData = [
    { name: 'Super Admin', count: 2, lastActive: '2 mins ago', status: 'online' },
    { name: 'Admin', count: 8, lastActive: '5 mins ago', status: 'online' },
    { name: 'Faculty', count: 89, lastActive: '1 min ago', status: 'online' },
    { name: 'Student', count: 1134, lastActive: 'Now', status: 'online' },
    { name: 'Staff', count: 14, lastActive: '3 mins ago', status: 'online' }
  ];

  const auditLogs = [
    { action: 'User role updated', user: 'admin@school.edu', time: '2 mins ago', level: 'medium' },
    { action: 'API key rotated', user: 'system', time: '15 mins ago', level: 'high' },
    { action: 'Bulk user import', user: 'admin@school.edu', time: '1 hour ago', level: 'low' },
    { action: 'Security scan completed', user: 'system', time: '2 hours ago', level: 'low' },
    { action: 'Failed login attempt', user: 'unknown', time: '3 hours ago', level: 'high' }
  ];

  // Transform data for TableCard
  const userActivityRows = userActivityData.map(user => [
    user.name,
    user.count.toString(),
    user.lastActive,
    <span key={user.name} className={`px-2 py-1 rounded-full text-xs ${
      user.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
    }`}>
      {user.status}
    </span>
  ]);

  const auditLogRows = auditLogs.map(log => [
    log.action,
    log.user,
    log.time,
    <span key={log.action} className={`px-2 py-1 rounded-full text-xs ${
      log.level === 'high' ? 'bg-red-500/20 text-red-400' :
      log.level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
      'bg-green-500/20 text-green-400'
    }`}>
      {log.level}
    </span>
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Super Admin Dashboard
        </h1>
        <p className="text-gray-400 mt-2">
          Complete platform oversight and system management
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <BentoCard 
            key={index} 
            title={kpi.title}
            subtitle={kpi.change}
            icon={kpi.icon}
            className="p-6"
          >
            <div className="text-2xl font-bold">{kpi.value}</div>
          </BentoCard>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <BentoGrid className="grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Performance */}
        <BentoCard
          title="System Performance"
          subtitle="Real-time metrics for the last 24 hours"
          className="lg:col-span-2"
        >
          <div className="h-64 w-full bg-gray-100 rounded flex items-center justify-center">
            [System Performance Chart]
          </div>
        </BentoCard>

        {/* Cost Analytics */}
        <BentoCard
          title="Cost Breakdown"
          subtitle="Current month API costs"
        >
          <div className="h-64 w-full bg-gray-100 rounded flex items-center justify-center">
            [Cost Breakdown Chart]
          </div>
        </BentoCard>

        {/* User Activity */}
        <TableCard
          title="User Activity"
          subtitle="Active users by role"
          headers={['Role', 'Count', 'Last Active', 'Status']}
          data={userActivityRows}
        />

        {/* Audit Logs */}
        <TableCard
          title="Security & Audit"
          subtitle="Recent system activities"
          headers={['Action', 'User', 'Time', 'Level']}
          data={auditLogRows}
          className="lg:col-span-2"
        />
      </BentoGrid>

      {/* System Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'Google APIs', status: 'online', uptime: '99.9%' },
          { name: 'Database', status: 'online', uptime: '100%' },
          { name: 'AI Services', status: 'online', uptime: '98.5%' },
          { name: 'File Storage', status: 'online', uptime: '99.7%' }
        ].map((service, index) => (
          <BentoCard 
            key={index} 
            title={service.name}
            subtitle={`Uptime: ${service.uptime}`}
            className="p-4"
          >
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-400 capitalize">{service.status}</p>
            </div>
          </BentoCard>
        ))}
      </div>
    </div>
  );
}