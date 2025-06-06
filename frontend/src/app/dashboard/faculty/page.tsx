'use client';
import React, { useState } from 'react';
import { BentoGrid } from '@/components/dashboard/BentoGrid';
import { BentoCard } from '@/components/dashboard/BentoCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { TableCard } from '@/components/dashboard/TableCard';
import { 
  BookOpenIcon, 
  ClipboardDocumentListIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  PresentationChartLineIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  SparklesIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  BeakerIcon,
  PencilIcon,
  StarIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function FacultyDashboard() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  // Mock data for dashboard
  const todayOverview = {
    classes: 3,
    nextClass: "2PM - Physics 101",
    assignments: 47,
    assignmentsDue: "2 hrs",
    studentsPresent: "89/94",
    attendanceRate: "94.7%",
    aiToolsUsed: 12,
    costToday: "$0.08"
  };

  const classPerformance = {
    gradeDistribution: [
      { grade: 'A', current: 25, previous: 22 },
      { grade: 'B', current: 35, previous: 33 },
      { grade: 'C', current: 20, previous: 25 },
      { grade: 'D', current: 8, previous: 12 },
      { grade: 'F', current: 6, previous: 8 }
    ],
    classAverage: 3.2,
    trend: '+0.3'
  };

  const aiTools = [
    { name: 'Lesson Plan Generator', category: 'Planning', icon: BookOpenIcon, used: 45 },
    { name: 'Quiz Generator', category: 'Assessment', icon: ClipboardDocumentListIcon, used: 32 },
    { name: 'Rubric Creator', category: 'Assessment', icon: DocumentTextIcon, used: 28 },
    { name: 'Assignment Generator', category: 'Planning', icon: PencilIcon, used: 25 },
    { name: 'Lesson Hook Generator', category: 'Engagement', icon: SparklesIcon, used: 22 },
    { name: 'Text Leveler', category: 'Differentiation', icon: AcademicCapIcon, used: 18 },
    { name: 'Feedback Assistant', category: 'Assessment', icon: ChatBubbleLeftRightIcon, used: 15 },
    { name: 'Student Grouping', category: 'Engagement', icon: UserGroupIcon, used: 12 }
  ];

  const upcomingDeadlines = [
    { title: 'Physics Midterm Grading', date: '2024-06-08', priority: 'high', type: 'grading' },
    { title: 'Chemistry Lab Reports', date: '2024-06-10', priority: 'medium', type: 'grading' },
    { title: 'Parent Conference Prep', date: '2024-06-12', priority: 'low', type: 'meeting' },
    { title: 'Biology Quiz Creation', date: '2024-06-15', priority: 'medium', type: 'preparation' }
  ];

  const studentEngagement = {
    participationRate: 87,
    discussionPosts: 234,
    averageEngagement: 4.2,
    topParticipants: ['Alice Johnson', 'Bob Smith', 'Carol Davis']
  };

  return (
    <div className="space-y-6">
      {/* Today's Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BentoCard className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">TODAY'S CLASSES</p>
              <p className="text-2xl font-bold text-blue-900">{todayOverview.classes}</p>
              <p className="text-xs text-blue-700">Next: {todayOverview.nextClass}</p>
            </div>
            <CalendarDaysIcon className="h-8 w-8 text-blue-500" />
          </div>
        </BentoCard>

        <BentoCard className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">ASSIGNMENTS TO GRADE</p>
              <p className="text-2xl font-bold text-orange-900">{todayOverview.assignments}</p>
              <p className="text-xs text-orange-700">Due: {todayOverview.assignmentsDue}</p>
            </div>
            <ClipboardDocumentListIcon className="h-8 w-8 text-orange-500" />
          </div>
        </BentoCard>

        <BentoCard className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">STUDENTS PRESENT</p>
              <p className="text-2xl font-bold text-green-900">{todayOverview.studentsPresent}</p>
              <p className="text-xs text-green-700">{todayOverview.attendanceRate}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-green-500" />
          </div>
        </BentoCard>

        <BentoCard className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">AI TOOLS USED TODAY</p>
              <p className="text-2xl font-bold text-purple-900">{todayOverview.aiToolsUsed}</p>
              <p className="text-xs text-purple-700">Cost: {todayOverview.costToday}</p>
            </div>
            <SparklesIcon className="h-8 w-8 text-purple-500" />
          </div>
        </BentoCard>
      </div>

      {/* Main Dashboard Grid */}
      <BentoGrid className="grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Performance Dashboard */}
        <ChartCard 
          title="Class Performance Overview" 
          className="lg:col-span-2"
          icon={<ChartBarIcon className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-700">Grade Distribution</h4>
              <span className="text-sm text-gray-500">Current vs Previous Semester</span>
            </div>
            <div className="space-y-2">
              {classPerformance.gradeDistribution.map((item) => (
                <div key={item.grade} className="flex items-center space-x-3">
                  <span className="w-8 text-sm font-medium">{item.grade}:</span>
                  <div className="flex-1 flex space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.current}%` }}
                      />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.previous}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{item.current}%</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Class Average GPA</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-lg">{classPerformance.classAverage}</span>
                  <span className="text-green-600 text-sm font-medium">{classPerformance.trend}</span>
                </div>
              </div>
            </div>
          </div>
        </ChartCard>

        {/* AI Tools Sidebar */}
        <BentoCard className="bg-gradient-to-b from-indigo-50 to-indigo-100 border-indigo-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-indigo-900">AI Teaching Tools</h3>
              <SparklesIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="space-y-2">
              {aiTools.slice(0, 6).map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => setSelectedTool(tool.name)}
                  className="w-full text-left p-3 rounded-lg bg-white hover:bg-indigo-50 border border-indigo-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <tool.icon className="h-4 w-4 text-indigo-600" />
                      <div>
                        <p className="font-medium text-sm text-gray-800">{tool.name}</p>
                        <p className="text-xs text-gray-600">{tool.category}</p>
                      </div>
                    </div>
                    <span className="text-xs text-indigo-600 font-medium">Used {tool.used}x</span>
                  </div>
                </button>
              ))}
            </div>
            <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              View All Tools
            </button>
          </div>
        </BentoCard>

        {/* Student Engagement Metrics */}
        <ChartCard 
          title="Student Engagement Analytics"
          icon={<PresentationChartLineIcon className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Participation Rate</span>
              <span className="font-semibold text-lg">{studentEngagement.participationRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${studentEngagement.participationRate}%` }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{studentEngagement.discussionPosts}</p>
                <p className="text-xs text-gray-600">Discussion Posts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{studentEngagement.averageEngagement}</p>
                <p className="text-xs text-gray-600">Avg Engagement</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Top Participants</h4>
              <div className="space-y-1">
                {studentEngagement.topParticipants.map((student, index) => (
                  <div key={student} className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700">{student}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ChartCard>

        {/* Assignment & Grading Center */}
        <TableCard 
          title="Grading Queue"
          className="lg:col-span-2"
          icon={<ClipboardDocumentListIcon className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-700">Pending Assignments</h4>
              <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Assignment</th>
                    <th className="text-left py-2">Course</th>
                    <th className="text-left py-2">Due Date</th>
                    <th className="text-left py-2">Submissions</th>
                    <th className="text-left py-2">Priority</th>
                    <th className="text-left py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingDeadlines.map((deadline, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2 font-medium">{deadline.title}</td>
                      <td className="py-2 text-gray-600">Physics 101</td>
                      <td className="py-2 text-gray-600">{deadline.date}</td>
                      <td className="py-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          23/25
                        </span>
                      </td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          deadline.priority === 'high' ? 'bg-red-100 text-red-800' :
                          deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {deadline.priority}
                        </span>
                      </td>
                      <td className="py-2">
                        <button className="text-blue-600 hover:text-blue-800">Grade</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TableCard>
      </BentoGrid>

      {/* Communication Hub Bottom Panel */}
      <BentoCard className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              <span>Communication Hub</span>
            </h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                New Message
              </button>
              <button className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700">
                Announcements
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-700 mb-2">Student Messages</h4>
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-xs text-gray-600">3 unread</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-700 mb-2">Parent Communications</h4>
              <p className="text-2xl font-bold text-green-600">5</p>
              <p className="text-xs text-gray-600">2 pending</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-700 mb-2">Faculty Collaboration</h4>
              <p className="text-2xl font-bold text-purple-600">8</p>
              <p className="text-xs text-gray-600">2 active threads</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-700 mb-2">Announcements</h4>
              <p className="text-2xl font-bold text-orange-600">3</p>
              <p className="text-xs text-gray-600">1 draft</p>
            </div>
          </div>
        </div>
      </BentoCard>
    </div>
  );
}