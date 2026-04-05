"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { User, CheckCircle, XCircle, Clock, Star } from "lucide-react";

type Application = {
  id: string;
  status: string;
  appliedAt: string;
  coverLetter?: string;
  student: { fullName: string; major?: string; gpa?: number; skills?: string };
  internship: { title: string };
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING:     { label: "Pending",     color: "bg-yellow-100 text-yellow-700", icon: Clock },
  SHORTLISTED: { label: "Shortlisted", color: "bg-blue-100 text-blue-700",     icon: Star },
  ACCEPTED:    { label: "Accepted",    color: "bg-green-100 text-green-700",   icon: CheckCircle },
  REJECTED:    { label: "Rejected",    color: "bg-red-100 text-red-700",       icon: XCircle },
};

export default function CompanyApplicantsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    fetch("/api/applications", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setApplications(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, [token]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    }
    setUpdating(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
        <p className="text-gray-500 text-sm mt-1">Review and manage student applications to your internships</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading applicants...</p>
      ) : applications.length === 0 ? (
        <Card className="border border-gray-200">
          <CardContent className="py-12 text-center text-gray-400">No applications yet.</CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const cfg = statusConfig[app.status] ?? statusConfig.PENDING;
            const Icon = cfg.icon;
            return (
              <Card key={app.id} className="border border-gray-200">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <User size={15} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{app.student.fullName}</p>
                        <p className="text-xs text-gray-500">{app.internship.title} · Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {app.student.major && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{app.student.major}</span>}
                          {app.student.gpa && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">GPA {app.student.gpa}</span>}
                          {app.student.skills?.split(",").slice(0, 3).map((s) => (
                            <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s.trim()}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${cfg.color}`}>
                      <Icon size={11} /> {cfg.label}
                    </span>
                  </div>

                  {app.coverLetter && (
                    <div>
                      <button
                        onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {expanded === app.id ? "Hide" : "View"} Cover Letter
                      </button>
                      {expanded === app.id && (
                        <p className="mt-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">{app.coverLetter}</p>
                      )}
                    </div>
                  )}

                  {(app.status === "PENDING" || app.status === "SHORTLISTED") && (
                    <div className="flex gap-2 pt-1">
                      {app.status === "PENDING" && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(app.id, "SHORTLISTED")} disabled={updating === app.id} className="text-blue-600 border-blue-300 text-xs">
                          <Star size={12} className="mr-1" /> Shortlist
                        </Button>
                      )}
                      <Button size="sm" onClick={() => updateStatus(app.id, "ACCEPTED")} disabled={updating === app.id} className="bg-green-600 text-white hover:bg-green-700 text-xs">
                        <CheckCircle size={12} className="mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(app.id, "REJECTED")} disabled={updating === app.id} className="text-red-600 border-red-300 text-xs">
                        <XCircle size={12} className="mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
