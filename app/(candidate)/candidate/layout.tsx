"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/ui/app-sidebar";
import { Header } from "@/components/header";
import { Home, FileText, Calendar, MessageSquare, HelpCircle, Settings, Search, Briefcase } from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/candidate/dashboard", icon: "Home" },
  { title: "Find Jobs", href: "/candidate/jobs", icon: "Search" },
  { title: "Applied Jobs", href: "/candidate/applications", icon: "Briefcase" },
  { title: "My CV", href: "/candidate/cv", icon: "FileText" },
  { title: "Interviews", href: "/candidate/interviews", icon: "Calendar" },
  { title: "Feedback", href: "/candidate/feedback", icon: "MessageSquare" },
  { title: "Help Center", href: "/candidate/help", icon: "HelpCircle" },
  { title: "Settings", href: "/candidate/settings", icon: "Settings" },
];

const iconMap = {
  Home,
  Search,
  Briefcase,
  FileText,
  Calendar,
  MessageSquare,
  HelpCircle,
  Settings,
};

export default function CandidateLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar 
        items={sidebarItems} 
        userType="candidate" 
        iconMap={iconMap}
      />
      <div className="flex-1 flex flex-col ml-64">
        <Header userType="candidate" />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
