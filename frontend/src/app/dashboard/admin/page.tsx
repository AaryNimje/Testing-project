'use client';
import React from 'react';
import { BentoGrid } from '@/components/dashboard/BentoGrid';
import { BentoCard } from '@/components/dashboard/BentoCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { TableCard } from '@/components/dashboard/TableCard';
import { Users, BookOpen, GraduationCap, TrendingUp, Award, Calendar, BarChart3, UserCheck } from 'lucide-react';

export default function AdminDashboard() {
  const institutionMetrics = [
    {
      title: "Enrollment",
      value: "2,456",
      change: "+45 this semester",
      icon: Users,
      trend: "up"
    },
    {
      title: "Faculty",
      value: "89",
      change: "3 pending approval",
      icon: UserCheck,
      trend: "stable"
    },
    {
      title: "Courses",
      value: "342",
      change: "12 new added",
      icon: BookOpen,
      trend: "up"
    },
    {
      title: "Completion Rate",
      value: "87.3%",
      change: "+2.1% from last term",
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Satisfaction",
      value: "4.6/5.0",
      change: "+0.2 improvement",
      icon: Award,
      trend: "up"
    }
  ];

  const enrollmentData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Enrollment',
        data: [2100, 2150, 2200, 2300, 2400, 2456],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
      },
      {
        label: 'New Students',
        data: [50, 45, 60, 70, 65, 45],
        borderColor: '#EC4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        fill: true,
      }
    ]
  };

  const departmentData = {
    labels: ['Engineering', 'Business', 'Arts & Sciences', 'Medicine', 'Law'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B'],
    }]
  };

  const facultyWorkload = [
    { name: 'Dr. Sarah Johnson', department: 'Engineering', courses: 3, students: 89, workload: '85%' },
    { name: 'Prof. Michael Chen', department: 'Business', courses: 4, students: 124, workload: '92%' },
    { name: 'Dr. Emily Rodriguez', department: 'Arts & Sciences', courses: 2, students: 67, workload: '78%' },
    { name: 'Prof. David Kim', department: 'Medicine', courses: 3, students: 45, workload: '88%' },
    { name: 'Dr. Amanda Wilson', department: 'Law', courses: 2, students: 38, workload: '73%' }
  ];

  const recentActivities = [
    { activity: 'New course "AI Ethics" approved', department: 'Engineering', time: '2 hours ago', priority: 'normal' },
    { activity: 'Faculty review meeting scheduled', department: 'Business', time: '4 hours ago', priority: 'high' },
    { activity: 'Student enrollment milestone reached', department: 'All', time: '6 hours ago', priority: 'low' },
    { activity: 'Curriculum update submitted', department: 'Arts & Sciences', time: '1 day ago', priority: 'normal' },
    { activity: 'Accreditation report due', department: 'Medicine', time: '2 days ago', priority: 'high' }
  ];

  const upcomingEvents = [
    { event: 'Faculty Senate Meeting', date: 'Dec 15', time: '2:00 PM', location: 'Conference Room A' },
    { event: 'Student Registration Opens', date: 'Dec 18', time: '9:00 AM', location: 'Online Portal' },
    { event: 'Curriculum Review Committee', date: 'Dec 20', time: '10:00 AM', location: 'Dean\'s Office' },
    { event: 'Holiday Break Begins', date: 'Dec 22', time: 'All Day', location: 'Campus Wide' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 mt-2">
          Institutional oversight and academic administration
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {institutionMetrics.map((metric, index) => (
          <BentoCard key={index} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                <metric.icon className="w-5 h-5 text-purple-400" />
              </div>
              <div className={`w-2 h-2 rounded-full ${
                metric.trend === 'up' ? 'bg-green-400' : 'bg-blue-400'
              }`} />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{metric.value}</h3>
            <p className="text-sm font-medium text-gray-300">{metric.title}</p>
            <p className="text-xs text-gray-500 mt-2">{metric.change}</p>
          </BentoCard>
        ))}
      </div>

      {/* Main Analytics Grid */}
      <BentoGrid className="grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Enrollment Analytics"
          subtitle="Student enrollment trends over time"
          type="line"
          data={enrollmentData}
        />

        <ChartCard
          title="Department Distribution"
          subtitle="Students by department"
          type="doughnut"
          data={departmentData}
        />
      </BentoGrid>

      {/* Faculty and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TableCard
          title="Faculty Workload"
          subtitle="Current teaching assignments"
          headers={['Faculty', 'Courses', 'Students', 'Workload']}
          data={facultyWorkload.map(faculty => [
            <div key={faculty.name}>
              <p className="font-medium text-white">{faculty.name}</p>
              <p className="text-xs text-gray-400">{faculty.department}</p>
            </div>,
            faculty.courses.toString(),
            faculty.students.toString(),
            <span key={faculty.name} className={`px-2 py-1 rounded-full text-xs ${
              parseInt(faculty.workload) > 90 ? 'bg-red-500/20 text-red-400' :
              parseInt(faculty.workload) > 80 ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {faculty.workload}
            </span>
          ])}
          className="lg:col-span-2"
        />

        <BentoCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="border-l-2 border-purple-500/30 pl-4">
                <p className="font-medium text-white text-sm">{event.event}</p>
                <p className="text-xs text-gray-400">{event.date} • {event.time}</p>
                <p className="text-xs text-gray-500">{event.location}</p>
              </div>
            ))}
          </div>
        </BentoCard>
      </div>

      {/* Recent Activities */}
      <TableCard
        title="Recent Activities"
        subtitle="Latest institutional activities and updates"
        headers={['Activity', 'Department', 'Time', 'Priority']}
        data={recentActivities.map(activity => [
          activity.activity,
          activity.department,
          activity.time,
          <span key={activity.activity} className={`px-2 py-1 rounded-full text-xs ${
            activity.priority === 'high' ? 'bg-red-500/20 text-red-400' :
            activity.priority === 'normal' ? 'bg-blue-500/20 text-blue-400' :
            'bg-green-500/20 text-green-400'
          }`}>
            {activity.priority}
          </span>
        ])}
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'User Management', description: 'Manage faculty and staff accounts', color: 'purple' },
          { title: 'Course Catalog', description: 'Update course offerings', color: 'pink' },
          { title: 'Reports', description: 'Generate institutional reports', color: 'blue' },
          { title: 'Settings', description: 'System configuration', color: 'green' }
        ].map((action, index) => (
          <BentoCard key={index} className="p-4 cursor-pointer hover:scale-105 transition-transform">
            <div className={`w-full h-2 bg-gradient-to-r ${
              action.color === 'purple' ? 'from-purple-500 to-purple-600' :
              action.color === 'pink' ? 'from-pink-500 to-pink-600' :
              action.color === 'blue' ? 'from-blue-500 to-blue-600' :
              'from-green-500 to-green-600'
            } rounded-full mb-4`} />
            <h4 className="font-semibold text-white mb-2">{action.title}</h4>
            <p className="text-sm text-gray-400">{action.description}</p>
          </BentoCard>
        ))}
      </div>
    </div>
  );
}