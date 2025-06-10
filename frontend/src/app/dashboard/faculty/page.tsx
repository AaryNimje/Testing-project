"use client";

import React, { useState } from "react";
import {
  IconBook,
  IconBrain,
  IconChartBar,
  IconUsers,
  IconCalendarEvent,
  IconClipboard,
  IconSchool,
  IconFileText,
  IconRuler,
  IconUser,
} from "@tabler/icons-react";

// Import local components directly to avoid module resolution issues
import { BentoGrid, BentoGridItem } from "../../../components/ui/bento-grid";

export default function FacultyDashboard() {
  // Simulated user data - replace with actual auth
  const [user, setUser] = useState({
    name: "Dr. Emily Chen",
    role: "faculty"
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
        <h1 className="text-3xl font-bold text-white mb-2">Faculty Dashboard</h1>
        <p className="text-gray-300">Welcome back! Heres your teaching overview.</p>
      </div>

      <BentoGrid className="max-w-full">
        {facultyItems.map((item, i: number) => (
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

// Class Schedule component
const ClassSchedule = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 overflow-hidden">
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Todays Classes</h3>
      <div className="space-y-3 overflow-y-auto max-h-[calc(100%-2rem)]">
        {[
          { time: "09:00 AM", course: "Physics 101", location: "Science Hall 305", students: 28 },
          { time: "11:00 AM", course: "Physics 201", location: "Science Hall 310", students: 22 },
          { time: "02:00 PM", course: "Physics Lab", location: "Lab Building 105", students: 18 },
          { time: "04:00 PM", course: "Office Hours", location: "Science Hall 350", students: null },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center space-x-3">
            <div className="bg-blue-900/30 text-cyan-400 text-xs rounded-md p-1 w-20 text-center shrink-0">
              {item.time}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-white text-sm truncate">{item.course}</p>
              <p className="text-xs text-gray-400 truncate">{item.location}</p>
            </div>
            {item.students && (
              <div className="text-xs text-gray-400 flex items-center whitespace-nowrap">
                <IconUsers className="h-3 w-3 mr-1" />
                {item.students}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Assignments to Grade component
const AssignmentsToGrade = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 overflow-hidden">
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Assignments to Grade</h3>
      <div className="space-y-3 overflow-y-auto max-h-[calc(100%-2rem)]">
        {[
          { course: "Physics 101", assignment: "Lab Report Week 5", submitted: 26, total: 28 },
          { course: "Physics 201", assignment: "Midterm Exam", submitted: 21, total: 22 },
          { course: "Physics Lab", assignment: "Group Project Proposal", submitted: 6, total: 6 },
        ].map((item, idx) => (
          <div key={idx} className="flex justify-between items-center border-b border-slate-700/50 pb-2">
            <div className="overflow-hidden">
              <p className="text-white text-sm truncate">{item.assignment}</p>
              <p className="text-xs text-gray-400 truncate">{item.course}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 whitespace-nowrap ml-2">
              {item.submitted}/{item.total}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Class Performance component
const ClassPerformance = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 overflow-hidden">
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Class Performance</h3>
      <div className="space-y-4 overflow-y-auto max-h-[calc(100%-2rem)]">
        {[
          { course: "Physics 101", average: 82, change: "+3.2" },
          { course: "Physics 201", average: 78, change: "+1.5" },
          { course: "Physics Lab", average: 88, change: "+4.0" },
        ].map((course, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white truncate mr-2">{course.course}</span>
              <span className="text-cyan-400 whitespace-nowrap">{course.average}% <span className="text-green-400 text-xs">{course.change}</span></span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full">
              <div
                className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                style={{ width: `${course.average}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// AI Tools Stats component
const AIToolsStats = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4">
    <div className="w-full grid grid-cols-2 gap-4">
      <div className="bg-slate-700/30 p-3 rounded-lg">
        <p className="text-xs text-gray-400">Lesson Plans Created</p>
        <p className="text-2xl font-bold text-white">12</p>
        <p className="text-xs text-cyan-400">This month</p>
      </div>
      <div className="bg-slate-700/30 p-3 rounded-lg">
        <p className="text-xs text-gray-400">Quizzes Generated</p>
        <p className="text-2xl font-bold text-white">28</p>
        <p className="text-xs text-cyan-400">This month</p>
      </div>
      <div className="bg-slate-700/30 p-3 rounded-lg">
        <p className="text-xs text-gray-400">Feedback Generated</p>
        <p className="text-2xl font-bold text-white">45</p>
        <p className="text-xs text-cyan-400">This month</p>
      </div>
      <div className="bg-slate-700/30 p-3 rounded-lg">
        <p className="text-xs text-gray-400">AI Cost</p>
        <p className="text-2xl font-bold text-white">$1.87</p>
        <p className="text-xs text-cyan-400">Budget: $5.00</p>
      </div>
    </div>
  </div>
);

const facultyItems = [
  {
    title: "Class Schedule",
    description: "Today's teaching schedule and locations",
    header: <ClassSchedule />,
    icon: <IconCalendarEvent className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "Assignments to Grade",
    description: "Pending assignments requiring your feedback",
    header: <AssignmentsToGrade />,
    icon: <IconClipboard className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "Class Performance",
    description: "Academic performance metrics by class",
    header: <ClassPerformance />,
    icon: <IconChartBar className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "AI Tools Usage",
    description: "Overview of your AI tools utilization",
    header: <AIToolsStats />,
    icon: <IconBrain className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "Lesson Plan Generator",
    description: "Create standards-aligned lesson plans instantly",
    header: <Skeleton className="bg-gradient-to-br from-blue-900 to-cyan-900 border-cyan-800/50" />,
    icon: <IconBook className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "Quiz Generator",
    description: "Create customized quizzes with answer keys",
    header: <Skeleton className="bg-gradient-to-br from-blue-900 to-cyan-900 border-cyan-800/50" />,
    icon: <IconFileText className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "Rubric Creator",
    description: "Design comprehensive grading rubrics",
    header: <Skeleton className="bg-gradient-to-br from-blue-900 to-cyan-900 border-cyan-800/50" />,
    icon: <IconRuler className="h-4 w-4 text-cyan-400" />,
  },
];