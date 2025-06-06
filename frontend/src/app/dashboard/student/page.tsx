'use client';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import BentoGrid from '@/components/dashboard/BentoGrid';
import BentoCard from '@/components/dashboard/BentoCard';
import ChartCard from '@/components/dashboard/ChartCard';
import TableCard from '@/components/dashboard/TableCard';
import { 
  BookOpen, 
  Calendar, 
  Target, 
  Clock, 
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';

export default function StudentDashboard() {
  // Mock data for demonstration
  const academicStats = [
    { label: 'Current GPA', value: '3.85', change: '+0.12', trend: 'up' },
    { label: 'Assignments', value: '3', change: '2 overdue', trend: 'down' },
    { label: 'Next Class', value: 'Physics', change: 'Room 204-A', trend: 'neutral' },
    { label: 'Study Time', value: '2.5 hrs', change: 'yesterday', trend: 'neutral' },
    { label: 'Goals', value: '75%', change: 'Complete!', trend: 'up' }
  ];

  const recentAssignments = [
    { id: 1, course: 'Physics 101', assignment: 'Momentum Lab Report', dueDate: '2024-01-15', status: 'overdue', grade: null },
    { id: 2, course: 'Calculus II', assignment: 'Integration Problems', dueDate: '2024-01-16', status: 'pending', grade: null },
    { id: 3, course: 'English Lit', assignment: 'Shakespeare Essay', dueDate: '2024-01-18', status: 'submitted', grade: 'A-' },
    { id: 4, course: 'Chemistry', assignment: 'Periodic Table Quiz', dueDate: '2024-01-20', status: 'upcoming', grade: null }
  ];

  const upcomingClasses = [
    { time: '09:00', course: 'Physics 101', room: '204-A', instructor: 'Dr. Johnson' },
    { time: '11:00', course: 'Calculus II', room: '301-B', instructor: 'Prof. Martinez' },
    { time: '14:00', course: 'English Literature', room: '105-C', instructor: 'Ms. Wilson' },
    { time: '16:00', course: 'Chemistry Lab', room: 'Lab-2', instructor: 'Dr. Brown' }
  ];

  const courseProgress = [
    { course: 'Physics 101', progress: 78, grade: 'B+', credits: 4 },
    { course: 'Calculus II', progress: 85, grade: 'A-', credits: 4 },
    { course: 'English Literature', progress: 92, grade: 'A', credits: 3 },
    { course: 'Chemistry', progress: 73, grade: 'B', credits: 4 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'submitted': return 'text-blue-600 bg-blue-50';
      case 'upcoming': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardHeader 
        title="Student Dashboard"
        subtitle="Track your academic progress and stay organized"
        actions={[
          { label: 'AI Tutor', icon: <BookOpen className="w-4 h-4" />, primary: true },
          { label: 'Study Tools', icon: <Target className="w-4 h-4" /> }
        ]}
      />

      <div className="dashboard-main">
        {/* Academic Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {academicStats.map((stat, index) => (
            <div key={index} className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-xs mt-1 ${
                    stat.trend === 'up' ? 'text-green-600' : 
                    stat.trend === 'down' ? 'text-red-600' : 
                    'text-gray-500'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`metric-icon ${
                  index === 0 ? 'blue' :
                  index === 1 ? 'red' :
                  index === 2 ? 'purple' :
                  index === 3 ? 'orange' : 'green'
                }`}>
                  {index === 0 && <TrendingUp className="w-4 h-4" />}
                  {index === 1 && <AlertCircle className="w-4 h-4" />}
                  {index === 2 && <BookOpen className="w-4 h-4" />}
                  {index === 3 && <Clock className="w-4 h-4" />}
                  {index === 4 && <Target className="w-4 h-4" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        <BentoGrid>
          {/* Academic Progress Tracker */}
          <BentoCard 
            title="Academic Progress" 
            className="col-span-1 md:col-span-2"
            icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
          >
            <div className="space-y-4 mt-4">
              {courseProgress.map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{course.course}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{course.grade}</span>
                      <span className="text-xs text-gray-500">{course.credits} credits</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">{course.progress}% complete</div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Assignment & Calendar Manager */}
          <BentoCard 
            title="Upcoming Assignments" 
            className="col-span-1 md:col-span-2"
            icon={<Calendar className="w-5 h-5 text-purple-600" />}
          >
            <div className="space-y-3 mt-4">
              {recentAssignments.slice(0, 4).map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {assignment.assignment}
                    </p>
                    <p className="text-xs text-gray-500">{assignment.course}</p>
                    <p className="text-xs text-gray-400">Due: {assignment.dueDate}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Today's Schedule */}
          <BentoCard 
            title="Today's Classes" 
            className="col-span-1 md:col-span-1"
            icon={<Clock className="w-5 h-5 text-green-600" />}
          >
            <div className="space-y-3 mt-4">
              {upcomingClasses.map((class_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-12 text-center">
                    <span className="text-xs font-medium text-gray-600">{class_.time}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{class_.course}</p>
                    <p className="text-xs text-gray-500">{class_.room} • {class_.instructor}</p>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* AI Learning Assistant */}
          <BentoCard 
            title="AI Learning Tools" 
            className="col-span-1 md:col-span-1"
            icon={<BookOpen className="w-5 h-5 text-orange-600" />}
          >
            <div className="space-y-3 mt-4">
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">AI Tutor</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">Get homework help</p>
              </button>
              
              <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Study Guide</span>
                </div>
                <p className="text-xs text-green-600 mt-1">Generate study materials</p>
              </button>
              
              <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Debate Partner</span>
                </div>
                <p className="text-xs text-purple-600 mt-1">Practice arguments</p>
              </button>
            </div>
          </BentoCard>

          {/* Study Analytics */}
          <ChartCard
            title="Study Time Analytics"
            subtitle="Weekly study hours by subject"
            className="col-span-1 md:col-span-2"
            icon={<Clock className="w-5 h-5 text-indigo-600" />}
          >
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Physics</span>
                <span className="text-sm font-medium text-gray-900">8.5 hrs</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Calculus</span>
                <span className="text-sm font-medium text-gray-900">6.2 hrs</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '62%' }} />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Literature</span>
                <span className="text-sm font-medium text-gray-900">4.1 hrs</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '41%' }} />
              </div>
            </div>
          </ChartCard>

          {/* Achievement Tracking */}
          <BentoCard 
            title="Achievements" 
            className="col-span-1 md:col-span-1"
            icon={<Award className="w-5 h-5 text-yellow-600" />}
          >
            <div className="space-y-3 mt-4">
              <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                <Star className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Deans List</p>
                  <p className="text-xs text-gray-500">Fall 2023</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Perfect Attendance</p>
                  <p className="text-xs text-gray-500">Last month</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">GPA Improvement</p>
                  <p className="text-xs text-gray-500">+0.3 this semester</p>
                </div>
              </div>
            </div>
          </BentoCard>
        </BentoGrid>

        {/* Quick Actions */}
        <div className="quick-actions mt-8">
          <button className="quick-action-btn">
            <BookOpen className="quick-action-icon" />
            <span className="quick-action-text">Study Tools</span>
          </button>
          <button className="quick-action-btn">
            <Calendar className="quick-action-icon" />
            <span className="quick-action-text">My Schedule</span>
          </button>
          <button className="quick-action-btn">
            <Users className="quick-action-icon" />
            <span className="quick-action-text">Study Groups</span>
          </button>
          <button className="quick-action-btn">
            <Target className="quick-action-icon" />
            <span className="quick-action-text">Set Goals</span>
          </button>
        </div>
      </div>
    </div>
  );
}