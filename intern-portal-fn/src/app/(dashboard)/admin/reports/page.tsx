"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Users, Briefcase, FileText, Star, ClipboardList, BookOpen } from "lucide-react";

type ReportData = {
  overview: {
    totalStudents: number;
    totalCompanies: number;
    totalInternships: number;
    totalApplications: number;
    totalPlacements: number;
    pendingPlacements: number;
    approvedPlacements: number;
    totalLogs: number;
    totalEvaluations: number;
    avgEvaluationScore: number;
  };
  applicationsByStatus: { status: string; count: number }[];
  placementsByStatus: { status: string; count: number }[];
  recentApplications: { id: string; student: { fullName: string }; internship: { title: string } }[];
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-400",
  SHORTLISTED: "bg-blue-400",
  ACCEPTED: "bg-green-400",
  REJECTED: "bg-red-400",
  APPROVED: "bg-green-400",
  ONGOING: "bg-blue-500",
  COMPLETED: "bg-gray-400",
};

export default function AdminReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/reports", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-gray-500 text-sm">Loading report...</div>;
  if (!data) return <div className="p-6 text-gray-500 text-sm">No data available.</div>;

  const { overview } = data;

  const stats = [
    { label: "Students", value: overview.totalStudents, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Companies", value: overview.totalCompanies, icon: Briefcase, color: "text-purple-600 bg-purple-50" },
    { label: "Internships", value: overview.totalInternships, icon: Briefcase, color: "text-indigo-600 bg-indigo-50" },
    { label: "Applications", value: overview.totalApplications, icon: FileText, color: "text-orange-600 bg-orange-50" },
    { label: "Placements", value: overview.totalPlacements, icon: ClipboardList, color: "text-green-600 bg-green-50" },
    { label: "Weekly Logs", value: overview.totalLogs, icon: BookOpen, color: "text-teal-600 bg-teal-50" },
    { label: "Evaluations", value: overview.totalEvaluations, icon: Star, color: "text-yellow-600 bg-yellow-50" },
    { label: "Avg Score", value: `${overview.avgEvaluationScore.toFixed(0)}/100`, icon: Star, color: "text-pink-600 bg-pink-50" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Summary of internship portal activity</p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border border-gray-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${color}`}>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Applications by status */}
        <Card className="border border-gray-200">
          <CardHeader><CardTitle className="text-base">Applications by Status</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data.applicationsByStatus.map(({ status, count }) => {
              const total = overview.totalApplications || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{status}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${statusColors[status] ?? "bg-gray-400"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent applications */}
        <Card className="border border-gray-200">
          <CardHeader><CardTitle className="text-base">Recent Applications</CardTitle></CardHeader>
          <CardContent>
            {data.recentApplications.length === 0 ? (
              <p className="text-sm text-gray-400">No applications yet.</p>
            ) : (
              <ul className="space-y-3">
                {data.recentApplications.map((a) => (
                  <li key={a.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-800">{a.student.fullName}</span>
                    <span className="text-gray-500 text-xs">{a.internship.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Placement summary */}
      <Card className="border border-gray-200">
        <CardHeader><CardTitle className="text-base">Placement Status Summary</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-yellow-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-yellow-700">{overview.pendingPlacements}</p>
            <p className="text-xs text-yellow-600 mt-1">Awaiting Approval</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-green-700">{overview.approvedPlacements}</p>
            <p className="text-xs text-green-600 mt-1">Approved</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-blue-700">{overview.totalPlacements}</p>
            <p className="text-xs text-blue-600 mt-1">Total Placements</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
