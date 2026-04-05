"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Sparkles, Copy, CheckCircle, Clock, XCircle } from "lucide-react";

const APPLICATIONS = [
  { id: "a1", title: "Frontend Developer Intern", company: "TechRwanda Ltd", status: "pending", appliedDate: "2026-03-28" },
  { id: "a2", title: "Data Engineering Intern", company: "Africa Data Corp", status: "approved", appliedDate: "2026-03-20" },
  { id: "a3", title: "Full Stack Developer Intern", company: "StartupHub Africa", status: "rejected", appliedDate: "2026-03-15" },
];

const STUDENT = {
  name: "Alice Uwimana",
  skills: ["React", "TypeScript", "Node.js", "Python", "SQL"],
  year: 3,
  major: "Computer Science",
  gpa: 3.7,
  projects: ["Built a student management system", "Contributed to open-source React component library"],
};

const INTERNSHIP_DETAILS: Record<string, { title: string; company: string; skills: string[]; description: string }> = {
  "Apply for New": {
    title: "Software Engineering Intern",
    company: "Rwanda Innovation Lab",
    skills: ["React", "Node.js", "Problem Solving"],
    description: "Build innovative tools for African startups.",
  },
};

const statusConfig = {
  pending: { label: "Under Review", icon: Clock, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  approved: { label: "Approved", icon: CheckCircle, color: "text-green-600 bg-green-50 border-green-200" },
  rejected: { label: "Not Selected", icon: XCircle, color: "text-red-500 bg-red-50 border-red-200" },
};

export default function StudentApplicationsPage() {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateCoverLetter = async (title: string, company: string) => {
    setLoading(true);
    setCoverLetter("");
    try {
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: STUDENT,
          internship: { title, company, skills: ["React", "TypeScript", "Node.js"], description: "Build great software products." },
        }),
      });
      const data = await res.json();
      setCoverLetter(data.coverLetter);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-500 text-sm mt-1">Track your applications and generate AI cover letters</p>
      </div>

      <div className="space-y-3">
        {APPLICATIONS.map((app) => {
          const status = statusConfig[app.status as keyof typeof statusConfig];
          const Icon = status.icon;
          return (
            <Card key={app.id} className="border border-gray-200">
              <CardContent className="flex items-center justify-between py-4 px-5">
                <div>
                  <p className="font-semibold text-gray-800">{app.title}</p>
                  <p className="text-sm text-gray-500">{app.company} · Applied {app.appliedDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border flex items-center gap-1 ${status.color}`}>
                    <Icon size={12} /> {status.label}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedApp(app.id);
                      setCoverLetter("");
                    }}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50 text-xs"
                  >
                    <Sparkles size={12} className="mr-1" /> Cover Letter
                  </Button>
                </div>
              </CardContent>

              {selectedApp === app.id && (
                <CardContent className="border-t border-gray-100 pt-4 space-y-3">
                  {!coverLetter && !loading && (
                    <Button
                      onClick={() => generateCoverLetter(app.title, app.company)}
                      className="bg-blue-600 text-white hover:bg-blue-700 flex gap-2"
                    >
                      <Sparkles size={15} />
                      Generate AI Cover Letter
                    </Button>
                  )}
                  {loading && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                      Writing your cover letter...
                    </div>
                  )}
                  {coverLetter && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">AI-Generated Cover Letter</p>
                        <Button size="sm" variant="outline" onClick={handleCopy} className="text-xs">
                          <Copy size={12} className="mr-1" />
                          {copied ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {coverLetter}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateCoverLetter(app.title, app.company)}
                        className="text-blue-600 border-blue-300 hover:bg-blue-50 text-xs flex gap-1"
                      >
                        <Sparkles size={12} /> Regenerate
                      </Button>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* New Application Card */}
      <Card className="border-2 border-dashed border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="text-base text-blue-700">Apply to a New Internship</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">Head over to the <strong>Internships</strong> tab to browse available opportunities and apply directly.</p>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => window.location.href = "/student/internships"}
          >
            Browse Internships
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
