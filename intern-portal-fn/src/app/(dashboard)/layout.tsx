"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Users, FileText, BarChart3, Briefcase,
  ClipboardList, BookOpen, Star, Bell,
  LogOut, Menu, GraduationCap
} from "lucide-react";

const NAV: Record<string, { label: string; href: string; icon: React.ElementType }[]> = {
  ADMIN: [
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Placements", href: "/admin/placements", icon: ClipboardList },
    { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  ],
  COMPANY: [
    { label: "My Postings", href: "/company/postings", icon: Briefcase },
    { label: "Applicants", href: "/company/applicants", icon: Users },
  ],
  STUDENT: [
    { label: "Internships", href: "/student/internships", icon: Briefcase },
    { label: "Applications", href: "/student/applications", icon: FileText },
    { label: "Weekly Logs", href: "/student/logs", icon: BookOpen },
    { label: "Profile", href: "/student/profile", icon: Users },
  ],
  SUPERVISOR: [
    { label: "My Students", href: "/supervisor/assigned-students", icon: GraduationCap },
    { label: "Evaluations", href: "/supervisor/evaluations", icon: Star },
  ],
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  COMPANY: "Company",
  STUDENT: "Student",
  SUPERVISOR: "Supervisor",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role") ?? "";
    const storedEmail = localStorage.getItem("email") ?? "";
    setRole(storedRole);
    setEmail(storedEmail);

    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
  }, [router]);

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const navItems = NAV[role] ?? [];

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-blue-900 text-white w-64 shrink-0">
      {/* Logo area */}
      <div className="flex flex-col items-center gap-2 px-6 pt-6 pb-5 border-b border-blue-800">
        <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-md">
          <Image
            src="/image/intern-logo.png"
            alt="InternHub Logo"
            width={72}
            height={72}
            className="object-contain"
          />
        </div>
        <div className="text-center">
          <h1 className="text-base font-bold tracking-wide text-white">InternHub</h1>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/15 text-blue-100 mt-0.5 inline-block">
            {ROLE_LABELS[role] ?? ""} Portal
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-white text-blue-900 shadow-sm"
                  : "text-blue-100 hover:bg-blue-800/70 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-4 py-4 border-t border-blue-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white shrink-0">
            {email?.[0]?.toUpperCase() ?? "U"}
          </div>
          <p className="text-xs text-blue-200 truncate flex-1">{email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-blue-300 hover:text-white transition-colors w-full px-2 py-1.5 rounded-lg hover:bg-blue-800/60"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="flex">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between md:px-6">
          <button
            className="md:hidden p-1 rounded text-gray-600 hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <Link href="/api/notifications" className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell size={18} className="text-gray-600" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
              {email?.[0]?.toUpperCase() ?? "U"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
