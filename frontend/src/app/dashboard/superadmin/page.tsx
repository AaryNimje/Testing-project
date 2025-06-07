"use client";

import React, { useState } from "react";
import {
  IconServer,
  IconBrain,
  IconChartBar,
  IconUsers,
  IconLock,
  IconAlertTriangle,
  IconDeviceDesktop,
  IconDatabase,
  IconUser,
} from "@tabler/icons-react";

// Import local components directly to avoid module resolution issues
import { BentoGrid, BentoGridItem } from "../../../components/ui/bento-grid";

export default function SuperAdminDashboard() {
  // Simulated user data - replace with actual auth
  const [user, setUser] = useState({
    name: "David Roberts",
    role: "superadmin"
  });

  return (
    <div className="space-y-6 p-2">
      {/* User greeting */}
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white mr-3">
          <IconUser className="h-5 w-5" />
        </div>
        <div>
          <p className="text-gray-300 text-sm">Hello,</p>
          <h2 className="text-white text-xl font-medium">{user.name}</h2>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Super Admin Dashboard</h1>
        <p className="text-gray-300">Complete platform oversight and management.</p>
      </div>

      <BentoGrid className="max-w-full">
        {superAdminItems.map((item, i: number) => (
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
    </div>
  );
}

// Skeleton component with academic theme styling
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 ${className}`}></div>
);

// System Health component
const SystemHealth = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 overflow-hidden">
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">System Health</h3>
      <div className="space-y-3 overflow-y-auto max-h-[calc(100%-2rem)]">
        {[
          { service: "Web Frontend", status: "Operational", uptime: "99.99%", load: 32 },
          { service: "API Backend", status: "Operational", uptime: "99.95%", load: 48 },
          { service: "Database", status: "Operational", uptime: "99.99%", load: 57 },
          { service: "AI Services", status: "Degraded", uptime: "98.75%", load: 83 },
          { service: "Storage", status: "Operational", uptime: "100%", load: 65 },
        ].map((service, idx) => (
          <div key={idx} className="flex justify-between items-center border-b border-slate-700/50 pb-2">
            <div className="overflow-hidden">
              <p className="text-white text-sm truncate">{service.service}</p>
              <div className="flex items-center overflow-hidden">
                <div className={`w-2 h-2 rounded-full mr-1 shrink-0 ${
                  service.status === "Operational" ? "bg-green-500" : 
                  service.status === "Degraded" ? "bg-amber-500" : 
                  "bg-red-500"
                }`}></div>
                <span className="text-xs text-gray-400 truncate">{service.status}</span>
                <span className="text-xs text-gray-500 mx-1">·</span>
                <span className="text-xs text-gray-400 truncate">Uptime: {service.uptime}</span>
              </div>
            </div>
            <div className="flex items-center ml-2">
              <div className="w-16 h-1.5 bg-slate-700 rounded-full mr-2">
                <div
                  className={`h-1.5 rounded-full ${
                    service.load < 50 ? "bg-green-500" : 
                    service.load < 80 ? "bg-amber-500" : 
                    "bg-red-500"
                  }`}
                  style={{ width: `${service.load}%` }}
                ></div>
              </div>
              <span className="text-xs text-cyan-400 whitespace-nowrap">{service.load}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// AI System component
const AISystem = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 overflow-hidden">
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">AI System Overview</h3>
      <div className="space-y-3 overflow-y-auto max-h-[calc(100%-2rem)]">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-slate-700/30 p-2 rounded-lg">
            <p className="text-xs text-gray-400">Monthly Cost</p>
            <p className="text-xl font-bold text-white">$4.87</p>
            <p className="text-xs text-green-400">Under budget</p>
          </div>
          <div className="bg-slate-700/30 p-2 rounded-lg">
            <p className="text-xs text-gray-400">API Calls</p>
            <p className="text-xl font-bold text-white">15,432</p>
            <p className="text-xs text-cyan-400">This month</p>
          </div>
        </div>
        
        <h4 className="text-xs font-medium text-gray-300">Model Usage</h4>
        {[
          { model: "GPT-4", calls: 2845, cost: "$2.12", percentage: 43 },
          { model: "Gemini Pro", calls: 8756, cost: "$1.75", percentage: 36 },
          { model: "Claude 3", calls: 3831, cost: "$1.00", percentage: 21 },
        ].map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-xs text-white truncate mr-2">{item.model}</span>
            <div className="flex items-center">
              <div className="w-16 h-1.5 bg-slate-700 rounded-full mr-2">
                <div
                  className="h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <span className="text-xs text-cyan-400 whitespace-nowrap">{item.cost}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Security Logs component
const SecurityLogs = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 overflow-hidden">
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Security Logs</h3>
      <div className="space-y-3 overflow-y-auto max-h-[calc(100%-2rem)]">
        {[
          { event: "Failed Login Attempt", user: "admin@academy.edu", time: "10:45 AM", severity: "warning" },
          { event: "Password Reset", user: "jsmith@academy.edu", time: "09:32 AM", severity: "info" },
          { event: "Permission Change", user: "dthomas@academy.edu", time: "Yesterday", severity: "info" },
          { event: "Unusual Access Pattern", user: "mwilson@academy.edu", time: "Yesterday", severity: "warning" },
        ].map((log, idx) => (
          <div key={idx} className={`p-2 rounded-lg flex items-start space-x-2 ${
            log.severity === "warning" ? "bg-amber-900/20 border border-amber-800/50" :
            log.severity === "error" ? "bg-red-900/20 border border-red-800/50" :
            "bg-blue-900/20 border border-blue-800/50"
          }`}>
            <div className={`p-1 rounded shrink-0 ${
              log.severity === "warning" ? "bg-amber-500/20 text-amber-400" :
              log.severity === "error" ? "bg-red-500/20 text-red-400" :
              "bg-blue-500/20 text-blue-400"
            }`}>
              <IconAlertTriangle className="h-4 w-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm text-white truncate">{log.event}</p>
              <div className="flex text-xs text-gray-400 overflow-hidden">
                <span className="truncate">{log.user}</span>
                <span className="mx-1 shrink-0">·</span>
                <span className="whitespace-nowrap">{log.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Database Stats component
const DatabaseStats = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 overflow-hidden">
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Database Statistics</h3>
      <div className="space-y-3 overflow-y-auto max-h-[calc(100%-2rem)]">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-slate-700/30 p-2 rounded-lg">
            <p className="text-xs text-gray-400">Storage Used</p>
            <p className="text-xl font-bold text-white">15.8 GB</p>
            <p className="text-xs text-cyan-400">of 20 GB (79%)</p>
          </div>
          <div className="bg-slate-700/30 p-2 rounded-lg">
            <p className="text-xs text-gray-400">Query Count</p>
            <p className="text-xl font-bold text-white">1.2M</p>
            <p className="text-xs text-cyan-400">Today</p>
          </div>
        </div>
        
        <h4 className="text-xs font-medium text-gray-300">Table Sizes</h4>
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

const superAdminItems = [
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
];