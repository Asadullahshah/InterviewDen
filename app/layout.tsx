import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ScreeningProvider } from "@/app/context/screening-context";
import {
  Home,
  Users,
  Briefcase,
  ClipboardCheck,
  BarChart2,
  HelpCircle,
  Settings,
} from "lucide-react"; // Import icons

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InterviewDen - AI-Powered Recruitment Platform",
  description:
    "Streamline your recruitment process with AI-driven interviews and candidate assessments",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ScreeningProvider>
            {children}
          </ScreeningProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/company/dashboard",
    icon: Home, // Pass the component reference
  },
  {
    title: "Candidates",
    href: "/company/candidates",
    icon: Users,
  },
  {
    title: "Jobs",
    href: "/company/jobs",
    icon: Briefcase,
  },
  {
    title: "Tests",
    href: "/company/tests",
    icon: ClipboardCheck,
  },
  {
    title: "Analytics",
    href: "/company/analytics",
    icon: BarChart2,
  },
  {
    title: "Help Center",
    href: "/company/help",
    icon: HelpCircle,
  },
  {
    title: "Settings",
    href: "/company/settings",
    icon: Settings,
  },
];
