"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { User, Mail, Phone, GraduationCap, BookOpen, Save } from "lucide-react";

type Profile = {
  email: string;
  role: string;
  studentProfile: {
    fullName: string;
    major: string | null;
    year: number | null;
    gpa: number | null;
    skills: string;
    phone: string | null;
    bio: string | null;
    university: string;
  } | null;
};

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({ fullName: "", major: "", year: "", gpa: "", skills: "", phone: "", bio: "" });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data: Profile) => {
        setProfile(data);
        if (data.studentProfile) {
          const p = data.studentProfile;
          setForm({
            fullName: p.fullName ?? "",
            major: p.major ?? "",
            year: p.year?.toString() ?? "",
            gpa: p.gpa?.toString() ?? "",
            skills: p.skills ?? "",
            phone: p.phone ?? "",
            bio: p.bio ?? "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    // In production: PUT /api/profile with form data
  };

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading profile...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Keep your profile up to date for better internship matches</p>
      </div>

      {/* Account info */}
      <Card className="border border-gray-200">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><User size={15} /> Account</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600"><Mail size={14} />{profile?.email}</div>
          <div className="flex items-center gap-2 text-gray-600"><GraduationCap size={14} />{profile?.studentProfile?.university}</div>
        </CardContent>
      </Card>

      {/* Editable profile */}
      <Card className="border border-gray-200">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><BookOpen size={15} /> Academic Profile</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Full Name</label>
                <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Phone</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+250 7XX XXX XXX" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Major</label>
                <Input value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} placeholder="e.g. Computer Science" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Year of Study</label>
                <Input type="number" min={1} max={5} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="e.g. 3" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">GPA</label>
                <Input type="number" step="0.1" min={0} max={4} value={form.gpa} onChange={(e) => setForm({ ...form, gpa: e.target.value })} placeholder="e.g. 3.7" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Skills (comma-separated)</label>
                <Input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Python, SQL..." />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-gray-700">Bio</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="A short description about yourself..."
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap text-xs text-gray-500">
              {form.skills.split(",").filter(Boolean).map((s) => (
                <span key={s} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s.trim()}</span>
              ))}
            </div>

            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 flex gap-2">
              <Save size={14} />
              {saved ? "Saved!" : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
