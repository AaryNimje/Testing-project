"use client";

import React, { useState } from "react";
import {
  IconFileText,
  IconBrain,
  IconChartBar,
  IconCalendarEvent,
  IconClipboard,
  IconBuildingCommunity,
  IconDeviceLaptop,
  IconBook,
  IconUser,
} from "@tabler/icons-react";

// Import local components directly to avoid module resolution issues
import { BentoGrid, BentoGridItem } from "../../../components/ui/bento-grid";

export default function StaffDashboard() {
  // Simulated user data - replace with actual auth
  const [user, setUser] = useState({
    name: "Sarah Wilson",
    role: "staff"
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
        <h1 className="text-3xl font-bold text-white mb-2">Staff Dashboard</h1>
        <p className="text-gray-300">Manage institutional resources and operations.</p>
      </div>

      <BentoGrid className="max-w-full">
        {staffItems.map((item, i: number) => (
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

// Document Management component
const DocumentManagement = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 overflow-hidden">
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Recent Documents</h3>
      <div className="space-y-3 overflow-y-auto max-h-[calc(100%-2rem)]">
        {[
          { title: "Course Catalog 2024-25", type: "PDF", modified: "2 days ago", size: "4.2 MB" },
          { title: "Academic Calendar", type: "XLSX", modified: "Yesterday", size: "1.8 MB" },
          { title: "Facility Maintenance Schedule", type: "DOCX", modified: "Today", size: "2.3 MB" },
          { title: "Budget Report Q2", type: "XLSX", modified: "3 days ago", size: "3.1 MB" },
        ].map((doc, idx) => (
          <div key={idx} className="flex justify-between items-center border-b border-slate-700/50 pb-2">
            <div className="flex items-center overflow-hidden">
              <div className={`w-6 h-6 rounded flex items-center justify-center mr-2 text-xs font-semibold shrink-0 ${
                doc.type === "PDF" ? "bg-red-500/20 text-red-400" : 
                doc.type === "XLSX" ? "bg-green-500/20 text-green-400" : 
                "bg-blue-500/20 text-blue-400"
              }`}>
                {doc.type.substring(0, 3)}
              </div>
              <div className="overflow-hidden">
                <p className="text-white text-sm truncate">{doc.title}</p>
                <p className="text-xs text-gray-400 truncate">{doc.modified} · {doc.size}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Resource Booking component
const ResourceBooking = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 overflow-hidden">
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Resource Bookings</h3>
      <div className="space-y-3 overflow-y-auto max-h-[calc(100%-2rem)]">
        {[
          { resource: "Conference Room A", time: "10:00 - 11:30 AM", bookedBy: "Faculty Meeting" },
          { resource: "Computer Lab 101", time: "1:00 - 3:00 PM", bookedBy: "CS Department" },
          { resource: "Auditorium", time: "4:00 - 6:00 PM", bookedBy: "Guest Speaker" },
          { resource: "Projector #5", time: "All Day", bookedBy: "Science Department" },
        ].map((booking, idx) => (
          <div key={idx} className="flex justify-between items-center border-b border-slate-700/50 pb-2">
            <div className="overflow-hidden">
              <p className="text-white text-sm truncate">{booking.resource}</p>
              <div className="flex items-center text-xs overflow-hidden">
                <span className="text-cyan-400 mr-2 truncate">{booking.time}</span>
                <span className="text-gray-400 truncate">{booking.bookedBy}</span>
              </div>
            </div>
            <div className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 whitespace-nowrap ml-2">
              Booked
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Facility Status component
const FacilityStatus = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 overflow-hidden">
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Facility Status</h3>
      <div className="space-y-3 overflow-y-auto max-h-[calc(100%-2rem)]">
        {[
          { facility: "Main Building", status: "Operational", notes: "Regular maintenance scheduled next week" },
          { facility: "Science Building", status: "Maintenance", notes: "HVAC repairs in progress" },
          { facility: "Library", status: "Operational", notes: "Extended hours this week" },
          { facility: "Cafeteria", status: "Operational", notes: "Special menu today" },
        ].map((facility, idx) => (
          <div key={idx} className="flex justify-between items-center border-b border-slate-700/50 pb-2">
            <div className="overflow-hidden">
              <p className="text-white text-sm truncate">{facility.facility}</p>
              <p className="text-xs text-gray-400 truncate">{facility.notes}</p>
            </div>
            <div className={`text-xs px-2 py-1 rounded whitespace-nowrap ml-2 ${
              facility.status === "Operational" ? "bg-green-500/20 text-green-300" : 
              facility.status === "Maintenance" ? "bg-amber-500/20 text-amber-300" : 
              "bg-red-500/20 text-red-300"
            }`}>
              {facility.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Events Calendar component
const EventsCalendar = () => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 overflow-hidden">
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Upcoming Events</h3>
      <div className="space-y-3 overflow-y-auto max-h-[calc(100%-2rem)]">
        {[
          { date: "Jun 10", event: "Science Fair", location: "Science Building" },
          { date: "Jun 15", event: "Career Day", location: "Main Hall" },
          { date: "Jun 17", event: "Alumni Meet", location: "Auditorium" },
          { date: "Jun 20", event: "Graduation Ceremony", location: "Stadium" },
          { date: "Jun 25", event: "Summer Program Orientation", location: "Conference Room A" },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center space-x-3">
            <div className="bg-blue-900/30 text-cyan-400 text-xs rounded-md p-1 w-16 text-center shrink-0">
              {item.date}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm truncate">{item.event}</p>
              <p className="text-xs text-gray-400 truncate">{item.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const staffItems = [
  {
    title: "Document Management",
    description: "Access and organize institutional documents",
    header: <DocumentManagement />,
    icon: <IconFileText className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "Resource Booking",
    description: "Manage facilities and equipment scheduling",
    header: <ResourceBooking />,
    icon: <IconDeviceLaptop className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "Facility Status",
    description: "Monitor facility conditions and maintenance",
    header: <FacilityStatus />,
    icon: <IconBuildingCommunity className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "Events Calendar",
    description: "Track and manage upcoming institutional events",
    header: <EventsCalendar />,
    icon: <IconCalendarEvent className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "Report Generator",
    description: "Create administrative reports and analyses",
    header: <Skeleton className="bg-gradient-to-br from-blue-900 to-cyan-900 border-cyan-800/50" />,
    icon: <IconChartBar className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "AI Document Assistant",
    description: "Analyze, summarize, and create documents",
    header: <Skeleton className="bg-gradient-to-br from-blue-900 to-cyan-900 border-cyan-800/50" />,
    icon: <IconBrain className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "Inventory Management",
    description: "Track and manage academic resources",
    header: <Skeleton className="bg-gradient-to-br from-blue-900 to-cyan-900 border-cyan-800/50" />,
    icon: <IconBook className="h-4 w-4 text-cyan-400" />,
  },
];