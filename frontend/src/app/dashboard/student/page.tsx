"use client";

import React, { useState } from "react";
import {
  IconBook,
  IconBrain,
  IconChartBar,
  IconClock,
  IconCalendarEvent,
  IconClipboard,
  IconMessageChatbot,
  IconUser,
} from "@tabler/icons-react";

// Import local components directly to avoid module resolution issues
import { BentoGrid, BentoGridItem } from "../../../components/ui/bento-grid";

export default function StudentDashboard() {
  // Simulated user data - replace with actual auth
  const [user] = useState({
    name: "Alex Johnson",
    role: "student"
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
        <h1 className="text-3xl font-bold text-white mb-2">Student Dashboard</h1>
        <p className="text-gray-300">Welcome back! Heres your academic overview.</p>
      </div>

      <BentoGrid className="max-w-full">
        {studentItems.map((item, i: number) => (
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

// Course Progress component
const CourseProgress = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 overflow-hidden">
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Current Progress</h3>
      <div className="space-y-3 overflow-y-auto max-h-[calc(100%-2rem)]">
        {[
          { course: "Physics 101", progress: 78 },
          { course: "Calculus II", progress: 65 },
          { course: "English Literature", progress: 92 },
          { course: "Computer Science", progress: 88 },
        ].map((course, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white truncate mr-2">{course.course}</span>
              <span className="text-cyan-400 whitespace-nowrap">{course.progress}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full">
              <div
                className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Upcoming Assignments component
const UpcomingAssignments = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 overflow-hidden">
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Upcoming Assignments</h3>
      <div className="space-y-3 overflow-y-auto max-h-[calc(100%-2rem)]">
        {[
          { course: "Physics 101", assignment: "Lab Report", due: "Tomorrow" },
          { course: "Calculus II", assignment: "Problem Set 5", due: "3 days" },
          { course: "English Lit", assignment: "Essay Draft", due: "1 week" },
        ].map((item, idx) => (
          <div key={idx} className="flex justify-between items-center border-b border-slate-700/50 pb-2">
            <div className="overflow-hidden">
              <p className="text-white text-sm truncate">{item.assignment}</p>
              <p className="text-xs text-gray-400 truncate">{item.course}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ml-2 ${
              item.due === "Tomorrow" 
                ? "bg-red-500/20 text-red-300" 
                : "bg-blue-500/20 text-blue-300"
            }`}>
              {item.due}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Schedule component
const Schedule = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 overflow-hidden">
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Todays Schedule</h3>
      <div className="space-y-3 overflow-y-auto max-h-[calc(100%-2rem)]">
        {[
          { time: "09:00 AM", course: "Physics 101", location: "Science Hall 305" },
          { time: "11:00 AM", course: "Calculus II", location: "Math Building 210" },
          { time: "02:00 PM", course: "English Literature", location: "Arts Center 120" },
          { time: "04:00 PM", course: "Study Group", location: "Library - Room 4" },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center space-x-3">
            <div className="bg-blue-900/30 text-cyan-400 text-xs rounded-md p-1 w-20 text-center shrink-0">
              {item.time}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm truncate">{item.course}</p>
              <p className="text-xs text-gray-400 truncate">{item.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Stats component
const Stats = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4">
    <div className="w-full grid grid-cols-2 gap-4">
      <div className="bg-slate-700/30 p-3 rounded-lg">
        <p className="text-xs text-gray-400">Current GPA</p>
        <p className="text-2xl font-bold text-white">3.8</p>
        <p className="text-xs text-cyan-400">+0.2 this semester</p>
      </div>
      <div className="bg-slate-700/30 p-3 rounded-lg">
        <p className="text-xs text-gray-400">Attendance</p>
        <p className="text-2xl font-bold text-white">98%</p>
        <p className="text-xs text-cyan-400">Excellent</p>
      </div>
      <div className="bg-slate-700/30 p-3 rounded-lg">
        <p className="text-xs text-gray-400">Study Hours</p>
        <p className="text-2xl font-bold text-white">24</p>
        <p className="text-xs text-cyan-400">This week</p>
      </div>
      <div className="bg-slate-700/30 p-3 rounded-lg">
        <p className="text-xs text-gray-400">Assignments</p>
        <p className="text-2xl font-bold text-white">5</p>
        <p className="text-xs text-red-300">2 due soon</p>
      </div>
    </div>
  </div>
);

const studentItems = [
  {
    title: "Course Progress",
    description: "Track your progress in current courses",
    header: <CourseProgress />,
    icon: <IconBook className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "Upcoming Assignments",
    description: "View your pending assignments and deadlines",
    header: <UpcomingAssignments />,
    icon: <IconClipboard className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "Today's Schedule",
    description: "Check your classes and appointments for today",
    header: <Schedule />,
    icon: <IconCalendarEvent className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "Performance Stats",
    description: "View your academic performance metrics",
    header: <Stats />,
    icon: <IconChartBar className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "AI Tutor",
    description: "Get 24/7 help with any subject",
    header: <Skeleton className="bg-gradient-to-br from-blue-900 to-cyan-900 border-cyan-800/50" />,
    icon: <IconBrain className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "Study Timer",
    description: "Track and optimize your study sessions",
    header: <Skeleton />,
    icon: <IconClock className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "AI Study Assistant",
    description: "Generate study guides and get homework help",
    header: <Skeleton className="bg-gradient-to-br from-blue-900 to-cyan-900 border-cyan-800/50" />,
    icon: <IconMessageChatbot className="h-4 w-4 text-cyan-400" />,
  },
];