// app/dashboard/staff/page.tsx
'use client';

import React from 'react';
import BentoGrid from '@/components/dashboard/BentoGrid';
import BentoCard from '@/components/dashboard/BentoCard';
import ChartCard from '@/components/dashboard/ChartCard';
import TableCard from '@/components/dashboard/TableCard';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  FileText,
  Users,
  Settings,
  MessageSquare,
  BarChart3,
  CheckSquare,
  Building,
  PieChart,
  Activity,
  BookOpen,
  Phone,
  Mail,
  ClipboardList,
  Target
} from 'lucide-react';

export default function StaffDashboard() {
  // Sample data for Staff Dashboard
  const taskData = [
    { name: 'Jan', completed: 28, pending: 12, urgent: 3 },
    { name: 'Feb', completed: 35, pending: 8, urgent: 5 },
    { name: 'Mar', completed: 42, pending: 15, urgent: 2 },
    { name: 'Apr', completed: 38, pending: 10, urgent: 4 },
    { name: 'May', completed: 45, pending: 18, urgent: 6 },
    { name: 'Jun', completed: 52, pending: 12, urgent: 3 }
  ];

  const serviceRequestData = [
    { name: 'Student Services', value: 35, color: '#8b5cf6' },
    { name: 'Faculty Support', value: 28, color: '#06b6d4' },
    { name: 'Administrative', value: 22, color: '#10b981' },
    { name: 'IT Support', value: 15, color: '#f59e0b' }
  ];

  const recentTasks = [
    { id: 1, task: 'Process student enrollment forms', priority: 'High', status: 'In Progress', dueDate: '2024-06-07' },
    { id: 2, task: 'Update faculty directory', priority: 'Medium', status: 'Pending', dueDate: '2024-06-08' },
    { id: 3, task: 'Prepare monthly attendance report', priority: 'High', status: 'Completed', dueDate: '2024-06-06' },
    { id: 4, task: 'Schedule room maintenance', priority: 'Low', status: 'Pending', dueDate: '2024-06-10' },
    { id: 5, task: 'Coordinate parent-teacher meetings', priority: 'Medium', status: 'In Progress', dueDate: '2024-06-09' }
  ];

  const upcomingEvents = [
    { id: 1, event: 'Faculty Meeting', time: '10:00 AM', date: 'Today', type: 'Meeting' },
    { id: 2, event: 'Student Registration Deadline', time: '5:00 PM', date: 'Tomorrow', type: 'Deadline' },
    { id: 3, event: 'Monthly Report Due', time: '9:00 AM', date: 'Jun 8', type: 'Deadline' },
    { id: 4, event: 'Equipment Maintenance', time: '2:00 PM', date: 'Jun 9', type: 'Maintenance' }
  ];
  const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'text-red-600 bg-red-50';
    case 'Medium': return 'text-yellow-600 bg-yellow-50';
    case 'Low': return 'text-green-600 bg-green-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'text-green-600 bg-green-50';
    case 'In Progress': return 'text-blue-600 bg-blue-50';
    case 'Pending': return 'text-orange-600 bg-orange-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

// Convert lucide icons to proper ReactNode elements
const taskIcon = <ClipboardList className="w-6 h-6" />;
const completedIcon = <CheckCircle2 className="w-6 h-6" />;
const deadlineIcon = <AlertTriangle className="w-6 h-6" />;
const efficiencyIcon = <Target className="w-6 h-6" />;
const barChartIcon = <BarChart3 className="w-6 h-6" />;
const pieChartIcon = <PieChart className="w-6 h-6" />;
const checkSquareIcon = <CheckSquare className="w-6 h-6" />;

// Create arrays for table data
const taskTableData = recentTasks.map(task => [
  task.task,
  <span key={task.id} className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
    {task.priority}
  </span>,
  <span key={`status-${task.id}`} className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
    {task.status}
  </span>,
  task.dueDate,
  <div key={`actions-${task.id}`} className="flex space-x-2">
    <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
    <button className="text-green-600 hover:text-green-800 text-sm">Complete</button>
  </div>
]);

return (
  <div className="space-y-6">
    {/* Top Status Cards */}
    <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <BentoCard 
        title="Pending Tasks"
        subtitle="5 urgent"
        icon={taskIcon}
        statInfo={{ value: -12, label: "vs last week" }}
        className="bg-gradient-to-br from-red-50 to-red-100 border-red-200"
      >
        <div className="text-2xl font-bold text-red-900">23</div>
      </BentoCard>
      
      <BentoCard 
        title="Completed Today"
        subtitle="+3 vs avg"
        icon={completedIcon}
        statInfo={{ value: 20, label: "vs yesterday" }}
        className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
      >
        <div className="text-2xl font-bold text-green-900">15</div>
      </BentoCard>
      
      <BentoCard 
        title="Upcoming Deadlines"
        subtitle="2 critical"
        icon={deadlineIcon}
        statInfo={{ value: 0, label: "same as yesterday" }}
        className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200"
      >
        <div className="text-2xl font-bold text-yellow-900">7</div>
      </BentoCard>
      
      <BentoCard 
        title="Efficiency Score"
        subtitle="+2% ↑"
        icon={efficiencyIcon}
        statInfo={{ value: 2, label: "vs last month" }}
        className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
      >
        <div className="text-2xl font-bold text-blue-900">94%</div>
      </BentoCard>
    </BentoGrid>

    {/* Main Dashboard Grid */}
    <BentoGrid className="grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Task Management Dashboard */}
      <BentoCard
        title="Task Management Overview"
        subtitle="Monthly task completion trends"
        icon={barChartIcon}
        className="lg:col-span-1"
      >
        <div className="h-64 w-full bg-gray-100 rounded flex items-center justify-center">
          [Task Management Chart]
        </div>
      </BentoCard>

      {/* Service Request Distribution */}
      <BentoCard
        title="Service Request Distribution"
        subtitle="Request types by department"
        icon={pieChartIcon}
        className="lg:col-span-1"
      >
        <div className="h-64 w-full bg-gray-100 rounded flex items-center justify-center">
          [Service Request Chart]
        </div>
      </BentoCard>

      {/* Recent Tasks Table */}
      <TableCard
        title="Recent Tasks & Assignments"
        subtitle="Current workload and priorities"
        icon={checkSquareIcon}
        headers={['Task', 'Priority', 'Status', 'Due Date', 'Actions']}
        data={taskTableData}
        className="lg:col-span-1"
      />

      {/* Student Services Overview */}
      <BentoCard
        title="Student Services Queue"
        className="lg:col-span-1 p-6"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Active Requests</p>
                <p className="text-sm text-gray-500">18 pending resolution</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-blue-600">18</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Transcript Request</p>
                <p className="text-xs text-gray-500">Student ID: 2024001</p>
              </div>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Urgent</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Course Registration</p>
                <p className="text-xs text-gray-500">Multiple students</p>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">Normal</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Facility Booking</p>
                <p className="text-xs text-gray-500">Conference Room A</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Low</span>
            </div>
          </div>
          
          <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            View All Requests
          </button>
        </div>
      </BentoCard>
    </BentoGrid>

    {/* Bottom Section - Communication & Resources */}
    <BentoGrid className="grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Communication Hub */}
      <BentoCard
        title="Communication Hub"
        className="lg:col-span-1 p-6"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-sm">Unread Messages</p>
              <p className="text-xs text-gray-500">8 new notifications</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-sm">Email Queue</p>
              <p className="text-xs text-gray-500">12 pending responses</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-purple-600" />
            <div>
              <p className="font-medium text-sm">Scheduled Calls</p>
              <p className="text-xs text-gray-500">3 calls today</p>
            </div>
          </div>
          
          <button className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors">
            Open Communication Center
          </button>
        </div>
      </BentoCard>

      {/* Resource Management */}
      <BentoCard
        title="Resource Management"
        className="lg:col-span-1 p-6"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium">Room Bookings</span>
            </div>
            <span className="text-sm text-gray-500">85% occupied</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium">Equipment</span>
            </div>
            <span className="text-sm text-gray-500">3 maintenance</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Documents</span>
            </div>
            <span className="text-sm text-gray-500">47 pending</span>
          </div>
          
          <div className="pt-3 border-t">
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
              Manage Resources
            </button>
          </div>
        </div>
      </BentoCard>

      {/* Upcoming Events & Deadlines */}
      <BentoCard
        title="Upcoming Events"
        className="lg:col-span-1 p-6"
      >
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{event.event}</p>
                <p className="text-xs text-gray-500">{event.time} • {event.date}</p>
              </div>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                {event.type}
              </span>
            </div>
          ))}
          
          <button className="w-full mt-4 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors">
            View Full Calendar
          </button>
        </div>
      </BentoCard>
    </BentoGrid>

    {/* Quick Actions Floating Panel */}
    <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border p-4 space-y-2">
      <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions</p>
      <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center space-x-2">
        <CheckSquare className="w-4 h-4" />
        <span>New Task</span>
      </button>
      <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center space-x-2">
        <Calendar className="w-4 h-4" />
        <span>Schedule Meeting</span>
      </button>
      <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center space-x-2">
        <FileText className="w-4 h-4" />
        <span>Generate Report</span>
      </button>
    </div>
  </div>
);
}