"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { CheckCircle, XCircle, Clock, Building2, GraduationCap } from "lucide-react";

type Placement = {
  id: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  student: { fullName: string };
  internship: { title: string; company: { companyName: string } };
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING:   { label: "Pending",   color: "bg-yellow-100 text-yellow-700", icon: Clock },
  APPROVED:  { label: "Approved",  color: "bg-green-100 text-green-700",   icon: CheckCircle },
  REJECTED:  { label: "Rejected",  color: "bg-red-100 text-red-700",       icon: XCircle },
  ONGOING:   { label: "Ongoing",   color: "bg-blue-100 text-blue-700",     icon: CheckCircle },
  COMPLETED: { label: "Completed", color: "bg-gray-100 text-gray-600",     icon: CheckCircle },
};

export default function AdminPlacementsPage() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    fetch("/api/placements", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setPlacements(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [token]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const res = await fetch(`/api/placements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setPlacements((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
    }
    setUpdating(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Placement Approvals</h1>
        <p className="text-gray-500 text-sm mt-1">Review and approve student internship placements</p>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading placements...</p>
      ) : placements.length === 0 ? (
        <Card className="border border-gray-200">
          <CardContent className="py-12 text-center text-gray-400">No placements found.</CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {placements.map((p) => {
            const cfg = statusConfig[p.status] ?? statusConfig.PENDING;
            const Icon = cfg.icon;
            return (
              <Card key={p.id} className="border border-gray-200">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={15} className="text-blue-600" />
                        <span className="font-semibold text-gray-800">{p.student.fullName}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${cfg.color}`}>
                          <Icon size={11} />{cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Building2 size={13} />
                        <span>{p.internship.title} · {p.internship.company.companyName}</span>
                      </div>
                      {p.startDate && (
                        <p className="text-xs text-gray-400">
                          {new Date(p.startDate).toLocaleDateString()} – {p.endDate ? new Date(p.endDate).toLocaleDateString() : "TBD"}
                        </p>
                      )}
                    </div>

                    {p.status === "PENDING" && (
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => updateStatus(p.id, "APPROVED")}
                          disabled={updating === p.id}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle size={13} className="mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(p.id, "REJECTED")}
                          disabled={updating === p.id}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <XCircle size={13} className="mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
