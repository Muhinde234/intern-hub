"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Users, Building2, GraduationCap, Shield } from "lucide-react";

type User = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  studentProfile?: { fullName: string } | null;
  companyProfile?: { companyName: string } | null;
  supervisorProfile?: { fullName: string } | null;
};

const roleConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  STUDENT: { label: "Student", icon: GraduationCap, color: "bg-blue-100 text-blue-700" },
  COMPANY: { label: "Company", icon: Building2, color: "bg-purple-100 text-purple-700" },
  SUPERVISOR: { label: "Supervisor", icon: Users, color: "bg-green-100 text-green-700" },
  ADMIN: { label: "Admin", icon: Shield, color: "bg-red-100 text-red-700" },
};

function displayName(u: User) {
  return u.studentProfile?.fullName ?? u.companyProfile?.companyName ?? u.supervisorProfile?.fullName ?? u.email;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(() => {
        // In production, fetch all users from a dedicated admin endpoint
        // For now, we'll display a helpful mock while that endpoint is added
        setUsers([
          { id: "1", email: "admin@internhub.rw", role: "ADMIN", createdAt: new Date().toISOString() },
          { id: "2", email: "hr@techrwanda.rw", role: "COMPANY", createdAt: new Date().toISOString(), companyProfile: { companyName: "TechRwanda Ltd" } },
          { id: "3", email: "supervisor@internhub.rw", role: "SUPERVISOR", createdAt: new Date().toISOString(), supervisorProfile: { fullName: "Dr. Jean Bosco Niyomugabo" } },
          { id: "4", email: "alice@student.ur.ac.rw", role: "STUDENT", createdAt: new Date().toISOString(), studentProfile: { fullName: "Alice Uwimana" } },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    ALL: users.length,
    STUDENT: users.filter((u) => u.role === "STUDENT").length,
    COMPANY: users.filter((u) => u.role === "COMPANY").length,
    SUPERVISOR: users.filter((u) => u.role === "SUPERVISOR").length,
    ADMIN: users.filter((u) => u.role === "ADMIN").length,
  };

  const filtered = filter === "ALL" ? users : users.filter((u) => u.role === filter);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage all registered users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(["STUDENT", "COMPANY", "SUPERVISOR", "ADMIN"] as const).map((role) => {
          const cfg = roleConfig[role];
          const Icon = cfg.icon;
          return (
            <Card key={role} className="border border-gray-200">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${cfg.color}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{counts[role]}</p>
                  <p className="text-xs text-gray-500">{cfg.label}s</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["ALL", "STUDENT", "COMPANY", "SUPERVISOR", "ADMIN"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === r ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {r === "ALL" ? "All" : roleConfig[r].label + "s"} ({counts[r]})
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading users...</p>
      ) : (
        <Card className="border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-gray-600 font-medium">Name</th>
                  <th className="text-left px-5 py-3 text-gray-600 font-medium">Email</th>
                  <th className="text-left px-5 py-3 text-gray-600 font-medium">Role</th>
                  <th className="text-left px-5 py-3 text-gray-600 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const cfg = roleConfig[u.role];
                  const Icon = cfg.icon;
                  return (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">{displayName(u)}</td>
                      <td className="px-5 py-3 text-gray-500">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
                          <Icon size={11} /> {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
