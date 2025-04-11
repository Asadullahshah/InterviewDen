"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/ui/app-sidebar";
import { Header } from "@/components/header";
import { Home, Users, Briefcase, Calendar, FileText, BarChart, HelpCircle, Settings, User, LogOut } from "lucide-react";

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
    },
    {
      title: "Help Center",
      href: "/company/help",
      icon: "HelpCircle",
    },
    {
      title: "Logout",
      href: "/login",
      icon: "LogOut",
      className: "text-red-500 hover:text-red-600",
    }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        items={sidebarItems}
        userType="company"
        aiAssistantTitle="Recruitment Assistant"
        iconMap={iconMap}
      />
      <div className="flex-1">
        <Header userType="company" />
        <main className="overflow-y-auto ml-64">
          <div className="container mx-auto py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
