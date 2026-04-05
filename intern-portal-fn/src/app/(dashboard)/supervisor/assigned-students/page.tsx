"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { GraduationCap, BookOpen, Star, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

type WeeklyLog = {
  id: string;
  weekNumber: number;
  content: string;
  status: string;
  aiScore: number | null;
  submittedAt: string | null;
  student: { fullName: string };
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  DRAFT:     { label: "Draft",     color: "bg-gray-100 text-gray-600",    icon: Clock },
  SUBMITTED: { label: "Submitted", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  REVIEWED:  { label: "Reviewed",  color: "bg-green-100 text-green-700",   icon: CheckCircle },
};

export default function SupervisorAssignedStudentsPage() {
  const [logs, setLogs] = useState<WeeklyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    fetch("/api/logs", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setLogs(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, [token]);

  const pendingLogs = logs.filter((l) => l.status === "SUBMITTED");
  const reviewedLogs = logs.filter((l) => l.status === "REVIEWED");

  const LogCard = ({ log }: { log: WeeklyLog }) => {
    const cfg = statusConfig[log.status] ?? statusConfig.SUBMITTED;
    const Icon = cfg.icon;
    return (
      <Card className="border border-gray-200">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <GraduationCap size={14} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">{log.student.fullName}</p>
                <p className="text-xs text-gray-500">Week {log.weekNumber} · {log.submittedAt ? new Date(log.submittedAt).toLocaleDateString() : "Not submitted"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {log.aiScore && (
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{log.aiScore}/100</span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${cfg.color}`}>
                <Icon size={11} /> {cfg.label}
              </span>
            </div>
          </div>

          <button
            onClick={() => setExpanded(expanded === log.id ? null : log.id)}
            className="text-xs text-blue-600 hover:underline"
          >
            {expanded === log.id ? "Hide" : "Read"} log content
          </button>

          {expanded === log.id && (
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap leading-relaxed">{log.content}</p>
          )}

          {log.status === "SUBMITTED" && (
            <Link href="/supervisor/evaluations">
              <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700 text-xs mt-1">
                <Star size={12} className="mr-1" /> Write Evaluation
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
        <p className="text-gray-500 text-sm mt-1">Review weekly logs and monitor intern progress</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : logs.length === 0 ? (
        <Card className="border border-gray-200">
          <CardContent className="py-12 text-center text-gray-400">No student logs yet.</CardContent>
        </Card>
      ) : (
        <>
          {pendingLogs.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                <BookOpen size={14} /> Awaiting Review ({pendingLogs.length})
              </h2>
              {pendingLogs.map((log) => <LogCard key={log.id} log={log} />)}
            </div>
          )}

          {reviewedLogs.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                <CheckCircle size={14} className="text-green-600" /> Reviewed Logs ({reviewedLogs.length})
              </h2>
              {reviewedLogs.map((log) => <LogCard key={log.id} log={log} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
