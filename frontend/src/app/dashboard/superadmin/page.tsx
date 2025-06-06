'use client';
import React from 'react';
import { BentoGrid } from '@/components/dashboard/BentoGrid';
import { BentoCard } from '@/components/dashboard/BentoCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { TableCard } from '@/components/dashboard/TableCard';
import { Users, Activity, DollarSign, Shield, Server, Database, AlertTriangle, TrendingUp } from 'lucide-react';

export default function SuperAdminDashboard() {
  // Mock data for demonstration
  const kpiData = [
    {
      title: "Total Users",
      value: "1,247",
      change: "+23 today",
      icon: Users,
      trend: "up"
    },
    {
      title: "System Uptime",
      value: "99.8%",
      change: "Last 30 days",
      icon: Server,
      trend: "up"
    },
    {
      title: "Daily Costs",
      value: "$0.12",
      change: "/$0.16 cap",
      icon: DollarSign,
      trend: "stable"
    },
    {
      title: "API Health",
      value: "98.7%",
      change: "All Green",
      icon: Shield,
      trend: "up"
    }
  ];

  const systemMetrics = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: [25, 32, 28, 45, 52, 38],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
      },
      {
        label: 'Memory Usage (%)',
        data: [42, 48, 44, 62, 58, 51],
        borderColor: '#EC4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
      }
    ]
  };

  const costBreakdown = {
    labels: ['OpenAI', 'Claude', 'Gemini', 'Infrastructure'],
    datasets: [{
      data: [45, 25, 20, 10],
      backgroundColor: ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981'],
    }]
  };

  const userActivityData = [
    { name: 'Super Admin', count: 2, lastActive: '2 mins ago', status: 'online' },
    { name: 'Admin', count: 8, lastActive: '5 mins ago', status: 'online' },
    { name: 'Faculty', count: 89, lastActive: '1 min ago', status: 'online' },
    { name: 'Student', count: 1,134, lastActive: 'Now', status: 'online' },
    { name: 'Staff', count: 14, lastActive: '3 mins ago', status: 'online' }
  ];

  const auditLogs = [
    { action: 'User role updated', user: 'admin@school.edu', time: '2 mins ago', level: 'medium' },
    { action: 'API key rotated', user: 'system', time: '15 mins ago', level: 'high' },
    { action: 'Bulk user import', user: 'admin@school.edu', time: '1 hour ago', level: 'low' },
    { action: 'Security scan completed', user: 'system', time: '2 hours ago', level: 'low' },
    { action: 'Failed login attempt', user: 'unknown', time: '3 hours ago', level: 'high' }
  ];

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
          <BentoCard key={index} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                <kpi.icon className="w-6 h-6 text-purple-400" />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs ${
                kpi.trend === 'up' ? 'bg-green-500/20 text-green-400' :
                kpi.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
                 kpi.trend === 'down' ? <AlertTriangle className="w-3 h-3" /> :
                 <Activity className="w-3 h-3" />}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{kpi.value}</h3>
            <p className="text-sm text-gray-400">{kpi.title}</p>
            <p className="text-xs text-gray-500 mt-2">{kpi.change}</p>
          </BentoCard>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <BentoGrid className="grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Performance */}
        <ChartCard
          title="System Performance"
          subtitle="Real-time metrics for the last 24 hours"
          type="line"
          data={systemMetrics}
          className="lg:col-span-2"
        />

        {/* Cost Analytics */}
        <ChartCard
          title="Cost Breakdown"
          subtitle="Current month API costs"
          type="doughnut"
          data={costBreakdown}
        />

        {/* User Activity */}
        <TableCard
          title="User Activity"
          subtitle="Active users by role"
          headers={['Role', 'Count', 'Last Active', 'Status']}
          data={userActivityData.map(user => [
            user.name,
            user.count.toString(),
            user.lastActive,
            <span key={user.name} className={`px-2 py-1 rounded-full text-xs ${
              user.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              {user.status}
            </span>
          ])}
        />

        {/* Audit Logs */}
        <TableCard
          title="Security & Audit"
          subtitle="Recent system activities"
          headers={['Action', 'User', 'Time', 'Level']}
          data={auditLogs.map(log => [
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
          ])}
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
        ].map((service) => (
          <BentoCard key={service.name} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white">{service.name}</h4>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-400 capitalize">{service.status}</p>
            <p className="text-xs text-gray-500 mt-1">Uptime: {service.uptime}</p>
          </BentoCard>
        ))}
      </div>
    </div>
  );
}