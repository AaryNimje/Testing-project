"use client";

import React, { useState } from "react";
import {
  IconUsers,
  IconBrain,
  IconChartBar,
  IconBuildingSkyscraper,
  IconCalendarEvent,
  IconFileText,
  IconDashboard,
  IconAlertTriangle,
  IconCoin,
  IconUser,
} from "@tabler/icons-react";

// Import local components directly to avoid module resolution issues
import { BentoGrid, BentoGridItem } from "../../../components/ui/bento-grid";

export default function AdminDashboard() {
  // Simulated user data - replace with actual auth
  const [user, setUser] = useState({
    name: "Michael Thompson",
    role: "admin"
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
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-300">Platform overview and institution management.</p>
      </div>

      <BentoGrid className="max-w-full">
        {adminItems.map((item, i: number) => (
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

// User Activity component
const UserActivity = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 overflow-hidden">
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">User Activity</h3>
      <div className="space-y-3 overflow-y-auto max-h-[calc(100%-2rem)]">
        {[
          { role: "Faculty", active: 42, total: 48, percentage: 88 },
          { role: "Students", active: 856, total: 970, percentage: 88 },
          { role: "Staff", active: 18, total: 25, percentage: 72 },
          { role: "Admins", active: 4, total: 5, percentage: 80 },
        ].map((item, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white truncate mr-2">{item.role}</span>
              <span className="text-cyan-400 whitespace-nowrap">{item.active}/{item.total} ({item.percentage}%)</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full">
              <div
                className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// AI Cost component
const AICost = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 overflow-hidden">
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">AI Usage Cost</h3>
      <div className="space-y-3 overflow-y-auto max-h-[calc(100%-2rem)]">
        <div className="bg-slate-900/60 p-3 rounded-lg text-center mb-3">
          <p className="text-3xl font-bold text-white">$2.87</p>
          <p className="text-xs text-cyan-400">Monthly Budget: $5.00</p>
          <div className="h-2 bg-slate-700 rounded-full mt-2">
            <div
              className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
              style={{ width: "57.4%" }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-1">57.4% of monthly budget used</p>
        </div>
        <h4 className="text-xs font-medium text-gray-300">Breakdown by Role</h4>
        {[
          { role: "Faculty", cost: "$1.52", percentage: 53 },
          { role: "Students", cost: "$0.98", percentage: 34 },
          { role: "Staff", cost: "$0.25", percentage: 9 },
          { role: "Admins", cost: "$0.12", percentage: 4 },
        ].map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-xs text-white truncate mr-2">{item.role}</span>
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

// System Alerts component
const SystemAlerts = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 overflow-hidden">
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">System Alerts</h3>
      <div className="space-y-3 overflow-y-auto max-h-[calc(100%-2rem)]">
        {[
          { title: "API Rate Limit", message: "Faculty account approaching daily limit", severity: "warning" },
          { title: "Storage Usage", message: "85% of storage quota utilized", severity: "info" },
          { title: "New Update Available", message: "Platform update v2.4.1 ready to install", severity: "info" },
        ].map((alert, idx) => (
          <div key={idx} className={`p-2 rounded-lg flex items-start space-x-2 ${
            alert.severity === "warning" ? "bg-amber-900/20 border border-amber-800/50" :
            alert.severity === "error" ? "bg-red-900/20 border border-red-800/50" :
            "bg-blue-900/20 border border-blue-800/50"
          }`}>
            <div className={`p-1 rounded shrink-0 ${
              alert.severity === "warning" ? "bg-amber-500/20 text-amber-400" :
              alert.severity === "error" ? "bg-red-500/20 text-red-400" :
              "bg-blue-500/20 text-blue-400"
            }`}>
              <IconAlertTriangle className="h-4 w-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm text-white truncate">{alert.title}</p>
              <p className="text-xs text-gray-400 truncate">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Academic Calendar component
const AcademicCalendar = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 overflow-hidden">
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Academic Calendar</h3>
      <div className="space-y-3 overflow-y-auto max-h-[calc(100%-2rem)]">
        {[
          { date: "Jun 10", event: "Final Exams Begin", type: "Academic" },
          { date: "Jun 15", event: "Faculty Meeting", type: "Staff" },
          { date: "Jun 17", event: "Final Exams End", type: "Academic" },
          { date: "Jun 20", event: "Graduation Ceremony", type: "Event" },
          { date: "Jun 25", event: "Summer Session Begins", type: "Academic" },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center space-x-3">
            <div className="bg-blue-900/30 text-cyan-400 text-xs rounded-md p-1 w-16 text-center shrink-0">
              {item.date}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm truncate">{item.event}</p>
              <p className="text-xs text-gray-400 truncate">{item.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const adminItems = [
  {
    title: "User Activity",
    description: "Active users by role across the platform",
    header: <UserActivity />,
    icon: <IconUsers className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "AI Usage Cost",
    description: "Current AI cost and budget monitoring",
    header: <AICost />,
    icon: <IconCoin className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "System Alerts",
    description: "Important system notifications and warnings",
    header: <SystemAlerts />,
    icon: <IconAlertTriangle className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "Academic Calendar",
    description: "Upcoming academic events and deadlines",
    header: <AcademicCalendar />,
    icon: <IconCalendarEvent className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "User Management",
    description: "Manage user accounts and permissions",
    header: <Skeleton className="bg-gradient-to-br from-blue-900 to-cyan-900 border-cyan-800/50" />,
    icon: <IconUsers className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "AI System Control",
    description: "Configure AI tools and manage permissions",
    header: <Skeleton className="bg-gradient-to-br from-blue-900 to-cyan-900 border-cyan-800/50" />,
    icon: <IconBrain className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "Analytics Dashboard",
    description: "Comprehensive platform analytics and reporting",
    header: <Skeleton className="bg-gradient-to-br from-blue-900 to-cyan-900 border-cyan-800/50" />,
    icon: <IconChartBar className="h-4 w-4 text-cyan-400" />,
  },
];