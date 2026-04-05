"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Plus, MapPin, Clock, Users, X } from "lucide-react";

type Internship = {
  id: string;
  title: string;
  description: string;
  skills: string;
  location: string;
  duration: string;
  deadline: string;
  isOpen: boolean;
  _count: { applications: number };
};

export default function CompanyPostingsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", skills: "", location: "", duration: "", deadline: "" });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    fetch("/api/internships", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setInternships(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/internships", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const newInternship = await res.json();
      setInternships((prev) => [{ ...newInternship, _count: { applications: 0 } }, ...prev]);
      setShowForm(false);
      setForm({ title: "", description: "", skills: "", location: "", duration: "", deadline: "" });
    }
    setSubmitting(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Postings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your internship opportunities</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 text-white hover:bg-blue-700 flex gap-2">
          <Plus size={16} /> New Posting
        </Button>
      </div>

      {showForm && (
        <Card className="border border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">New Internship Posting</CardTitle>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Title *</label>
                  <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Frontend Developer Intern" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Location</label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Kigali, Rwanda" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Duration</label>
                  <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 3 months" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Deadline *</label>
                  <Input required type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-medium text-gray-700">Skills (comma-separated)</label>
                  <Input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="e.g. React, TypeScript, Node.js" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-medium text-gray-700">Description *</label>
                  <textarea
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Describe the internship role and responsibilities..."
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={submitting} className="bg-blue-600 text-white hover:bg-blue-700">
                  {submitting ? "Posting..." : "Post Internship"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading postings...</p>
      ) : internships.length === 0 ? (
        <Card className="border border-dashed border-gray-300">
          <CardContent className="py-12 text-center text-gray-400">No postings yet. Create your first one.</CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {internships.map((i) => (
            <Card key={i.id} className="border border-gray-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{i.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${i.isOpen ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {i.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                      {i.location && <span className="flex items-center gap-1"><MapPin size={11} />{i.location}</span>}
                      {i.duration && <span className="flex items-center gap-1"><Clock size={11} />{i.duration}</span>}
                      <span className="flex items-center gap-1"><Users size={11} />{i._count.applications} applicant{i._count.applications !== 1 ? "s" : ""}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{i.description}</p>
                    <div className="flex gap-1 flex-wrap">
                      {i.skills.split(",").filter(Boolean).map((s) => (
                        <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s.trim()}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 shrink-0">Deadline: {new Date(i.deadline).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
