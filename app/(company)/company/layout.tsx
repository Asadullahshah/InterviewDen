"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/ui/app-sidebar";
import { Home, Users, Briefcase, Calendar, FileText, BarChart, HelpCircle, Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const iconMap = {
  Home,
  Users,
  Briefcase,
  Calendar,
  FileText,
  BarChart,
  HelpCircle,
  Settings,
  User,
  LogOut,
};

export default function CompanyLayout({ children }: { children: ReactNode }) {
  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/company/dashboard",
      icon: "Home",
    },
    {
      title: "Candidates",
      href: "/company/candidates",
      icon: "Users",
    },
    {
      title: "Jobs",
      href: "/company/jobs",
      icon: "Briefcase",
    },
    {
      title: "Tests",
      href: "/company/tests",
      icon: "FileText",
    },
    {
      title: "Analytics",
      href: "/company/analytics",
      icon: "BarChart",
    },
    {
      title: "Settings",
      href: "/company/settings",
      icon: "Settings",
    },
    {
      title: "Profile",
      href: "/company/profile",
      icon: "User",
    }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        items={sidebarItems}
        userType="company"
        aiAssistantTitle="Recruitment Assistant"
        iconMap={iconMap}
      >
        <div className="flex-1" />
        <div className="flex flex-col gap-2">
          <Button variant="ghost" className="w-full justify-start gap-2 text-violet-100 hover:text-white hover:bg-violet-700" asChild>
            <Link href="/company/help">
              <HelpCircle className="h-4 w-4" />
              Help Center
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50" asChild>
            <Link href="/login">
              <LogOut className="h-4 w-4" />
              Logout
            </Link>
          </Button>
        </div>
      </Sidebar>
      <main className="flex-1 overflow-y-auto ml-64">
        <div className="container mx-auto py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
