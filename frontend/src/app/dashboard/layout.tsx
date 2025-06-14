// src/app/dashboard/layout.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconDashboard,
  IconBooks,
  IconUsers,
  IconSettings,
  IconLogout,
  IconChartBar,
  IconBrain,
  IconCalendar,
  IconFileText,
} from "@tabler/icons-react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { UserRole } from "@/lib/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const role = user?.role || 'student';

  // Role-specific navigation links
  const getNavLinks = () => {
    const commonLinks = [
      {
        label: "Dashboard",
        href: `/dashboard/${role}`,
        icon: <IconDashboard className="h-5 w-5 shrink-0 text-cyan-400" />,
      },
      {
        label: "Calendar",
        href: `/dashboard/${role}/calendar`,
        icon: <IconCalendar className="h-5 w-5 shrink-0 text-cyan-400" />,
      },
      {
        label: "Settings",
        href: `/dashboard/${role}/settings`,
        icon: <IconSettings className="h-5 w-5 shrink-0 text-cyan-400" />,
      },
      {
        label: "Logout",
        href: "#",
        icon: <IconLogout className="h-5 w-5 shrink-0 text-cyan-400" />,
        onClick: logout,
      },
    ];

    // Role-specific links
    const roleLinks: Record<string, any[]> = {
      student: [
        {
          label: "My Courses",
          href: `/dashboard/${role}/courses`,
          icon: <IconBooks className="h-5 w-5 shrink-0 text-cyan-400" />,
        },
        {
          label: "AI Tutor",
          href: `/dashboard/${role}/tutor`,
          icon: <IconBrain className="h-5 w-5 shrink-0 text-cyan-400" />,
        },
      ],
      faculty: [
        {
          label: "My Classes",
          href: `/dashboard/${role}/classes`,
          icon: <IconUsers className="h-5 w-5 shrink-0 text-cyan-400" />,
        },
        {
          label: "AI Tools",
          href: `/dashboard/${role}/tools`,
          icon: <IconBrain className="h-5 w-5 shrink-0 text-cyan-400" />,
        },
        {
          label: "Gradebook",
          href: `/dashboard/${role}/grades`,
          icon: <IconChartBar className="h-5 w-5 shrink-0 text-cyan-400" />,
        },
      ],
      admin: [
        {
          label: "Users",
          href: `/dashboard/${role}/users`,
          icon: <IconUsers className="h-5 w-5 shrink-0 text-cyan-400" />,
        },
        {
          label: "Analytics",
          href: `/dashboard/${role}/analytics`,
          icon: <IconChartBar className="h-5 w-5 shrink-0 text-cyan-400" />,
        },
        {
          label: "Reports",
          href: `/dashboard/${role}/reports`,
          icon: <IconFileText className="h-5 w-5 shrink-0 text-cyan-400" />,
        },
      ],
      staff: [
        {
          label: "Documents",
          href: `/dashboard/${role}/documents`,
          icon: <IconFileText className="h-5 w-5 shrink-0 text-cyan-400" />,
        },
        {
          label: "Resources",
          href: `/dashboard/${role}/resources`,
          icon: <IconChartBar className="h-5 w-5 shrink-0 text-cyan-400" />,
        },
      ],
      super_admin: [
        {
          label: "System",
          href: `/dashboard/${role}/system`,
          icon: <IconSettings className="h-5 w-5 shrink-0 text-cyan-400" />,
        },
        {
          label: "Users",
          href: `/dashboard/${role}/users`,
          icon: <IconUsers className="h-5 w-5 shrink-0 text-cyan-400" />,
        },
        {
          label: "Analytics",
          href: `/dashboard/${role}/analytics`,
          icon: <IconChartBar className="h-5 w-5 shrink-0 text-cyan-400" />,
        },
      ],
    };

    return [...(roleLinks[role as UserRole] || []), ...commonLinks];
  };

  const Logo = () => {
    return (
      <Link
        href={`/dashboard/${role}`}
        className="relative z-20 flex items-center space-x-2 py-3 text-sm font-normal text-white"
      >
        <div className="h-7 w-7 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-gradient-to-r from-cyan-500 to-blue-600" />
        <span className="font-medium whitespace-pre text-white">
          Academic AI
        </span>
      </Link>
    );
  };

  const LogoIcon = () => {
    return (
      <Link
        href={`/dashboard/${role}`}
        className="relative z-20 flex items-center space-x-2 py-3 text-sm font-normal text-white"
      >
        <div className="h-7 w-7 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-gradient-to-r from-cyan-500 to-blue-600" />
      </Link>
    );
  };

  const links = getNavLinks();

  return (
    <ProtectedLayout>
      <div className="min-h-screen max-h-screen overflow-hidden bg-gradient-to-b from-blue-900 to-black">
        <div className="flex h-screen">
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10 bg-slate-900/90 dark:bg-slate-900/90 border-r border-white/10 h-full">
              <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                {open ? <Logo /> : <LogoIcon />}
                <div className="mt-8 flex flex-col gap-2">
                  {links.map((link, idx) => (
                    <SidebarLink key={idx} link={link} />
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <SidebarLink
                  link={{
                    label: `${user?.name || "User"}`,
                    href: "#",
                    icon: (
                      <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    ),
                  }}
                />
                <div className="mt-2 px-3">
                  <div className="text-xs text-gray-400">{role.charAt(0).toUpperCase() + role.slice(1)} Role</div>
                </div>
              </div>
            </SidebarBody>
          </Sidebar>

          <main className="flex-1 overflow-auto">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedLayout>
  );
}