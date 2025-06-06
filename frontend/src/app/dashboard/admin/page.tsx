// app/dashboard/admin/page.tsx
'use client';
import React from 'react';
import BentoGrid from '@/components/dashboard/BentoGrid';
import BentoCard from '@/components/dashboard/BentoCard';
import ChartCard from '@/components/dashboard/ChartCard';
import TableCard from '@/components/dashboard/TableCard';
import { Users, BookOpen, GraduationCap, TrendingUp, Award, Calendar, BarChart3, UserCheck } from 'lucide-react';

export default function AdminDashboard() {
  const institutionMetrics = [
    {
      title: "Enrollment",
      value: "2,456",
      change: "+45 this semester",
      icon: <Users className="w-6 h-6" />,
      trend: "up"
    },
    {
      title: "Faculty",
      value: "89",
      change: "3 pending approval",
      icon: <UserCheck className="w-6 h-6" />,
      trend: "stable"
    },
    {
      title: "Courses",
      value: "342",
      change: "12 new added",
      icon: <BookOpen className="w-6 h-6" />,
      trend: "up"
    },
    {
      title: "Completion Rate",
      value: "87.3%",
      change: "+2.1% from last term",
      icon: <TrendingUp className="w-6 h-6" />,
      trend: "up"
    },
    {
      title: "Satisfaction",
      value: "4.6/5.0",
      change: "+0.2 improvement",
      icon: <Award className="w-6 h-6" />,
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

  // Transform faculty workload and activities to match TableCard data format
  const facultyWorkloadData = facultyWorkload.map(item => [
    item.name,
    item.courses.toString(),
    item.students.toString(),
    item.workload
  ]);

  const activitiesData = recentActivities.map(item => [
    item.activity,
    item.department,
    item.time,
    <span key={item.activity} className={`px-2 py-1 rounded-full text-xs ${
      item.priority === 'high' ? 'bg-red-100 text-red-800' :
      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
      'bg-green-100 text-green-800'
    }`}>
      {item.priority}
    </span>
  ]);

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
          <BentoCard
            key={index}
            title={metric.title}
            subtitle={metric.change}
            icon={metric.icon}
            className="p-4"
          >
            <div className="text-2xl font-bold">{metric.value}</div>
          </BentoCard>
        ))}
      </div>

      {/* Main Analytics Grid */}
      <BentoGrid className="grid-cols-1 lg:grid-cols-2 gap-6">
        <BentoCard
          title="Enrollment Analytics"
          subtitle="Student enrollment trends over time"
        >
          <div className="p-4 space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Enrollment: 2,456</span>
              <span>New Students: 45</span>
            </div>
            <div className="h-64 w-full bg-gray-100 rounded flex items-center justify-center">
              [Enrollment Chart]
            </div>
          </div>
        </BentoCard>

        <BentoCard
          title="Department Distribution"
          subtitle="Students by department"
        >
          <div className="p-4 space-y-4">
            <div className="h-64 w-full bg-gray-100 rounded flex items-center justify-center">
              [Department Chart]
            </div>
          </div>
        </BentoCard>
      </BentoGrid>

      {/* Faculty and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TableCard
          title="Faculty Workload"
          subtitle="Current teaching assignments"
          headers={['Faculty', 'Courses', 'Students', 'Workload']}
          data={facultyWorkloadData}
          className="lg:col-span-2"
        />

        <BentoCard 
          title="Upcoming Events" 
          subtitle="Schedule" 
          icon={<Calendar className="w-6 h-6" />} 
          className="p-6"
        >
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
        data={activitiesData}
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'User Management', description: 'Manage faculty and staff accounts', color: 'purple' },
          { title: 'Course Catalog', description: 'Update course offerings', color: 'pink' },
          { title: 'Reports', description: 'Generate institutional reports', color: 'blue' },
          { title: 'Settings', description: 'System configuration', color: 'green' }
        ].map((action, index) => (
          <BentoCard
            key={index}
            title={action.title}
            subtitle={action.description}
            icon={<BarChart3 className="w-6 h-6" />}
            className={`p-4 cursor-pointer hover:scale-105 transition-transform border-${action.color}-200`}
          />
        ))}
      </div>
    </div>
  );
}