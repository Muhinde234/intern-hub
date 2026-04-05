"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Sparkles, MapPin, Building2, Clock, Star } from "lucide-react";

const STUDENT_PROFILE = {
  name: "Alice Uwimana",
  skills: ["React", "TypeScript", "Node.js", "Python", "SQL"],
  year: 3,
  major: "Computer Science",
  interests: ["Web Development", "Data Engineering", "AI/ML"],
  gpa: 3.7,
};

const INTERNSHIPS = [
  {
    id: "1",
    title: "Frontend Developer Intern",
    company: "TechRwanda Ltd",
    location: "Kigali, Rwanda",
    duration: "3 months",
    description: "Build modern web UIs using React and TypeScript. Work with an agile team on real client projects.",
    skills: ["React", "TypeScript", "CSS", "REST APIs"],
    deadline: "2026-05-01",
  },
  {
    id: "2",
    title: "Data Engineering Intern",
    company: "Africa Data Corp",
    location: "Nairobi, Kenya (Remote)",
    duration: "4 months",
    description: "Design and maintain data pipelines. Work with Python, SQL, and cloud technologies.",
    skills: ["Python", "SQL", "Airflow", "AWS"],
    deadline: "2026-04-20",
  },
  {
    id: "3",
    title: "Full Stack Developer Intern",
    company: "StartupHub Africa",
    location: "Kigali, Rwanda",
    duration: "3 months",
    description: "Work across the full stack on a SaaS product used by 10,000+ users across Africa.",
    skills: ["Node.js", "React", "PostgreSQL", "Docker"],
    deadline: "2026-05-15",
  },
  {
    id: "4",
    title: "AI Research Intern",
    company: "Irembo Innovation Lab",
    location: "Kigali, Rwanda",
    duration: "6 months",
    description: "Research and prototype AI solutions for government digital services.",
    skills: ["Python", "Machine Learning", "NLP", "Research"],
    deadline: "2026-04-30",
  },
];

type MatchResult = {
  id: string;
  matchScore: number;
  matchReason: string;
  keyStrengths: string[];
};

export default function StudentInternshipsPage() {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState<Set<string>>(new Set());

  const getMatchForId = (id: string) => matches.find((m) => m.id === id);

  const runAIMatch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student: STUDENT_PROFILE, internships: INTERNSHIPS }),
      });
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sortedInternships = matches.length
    ? [...INTERNSHIPS].sort((a, b) => {
        const ma = getMatchForId(a.id)?.matchScore ?? 0;
        const mb = getMatchForId(b.id)?.matchScore ?? 0;
        return mb - ma;
      })
    : INTERNSHIPS;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Internships</h1>
          <p className="text-gray-500 text-sm mt-1">Browse and apply to internship opportunities</p>
        </div>
        <Button
          onClick={runAIMatch}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2"
        >
          <Sparkles size={16} />
          {loading ? "Matching..." : "AI Match Me"}
        </Button>
      </div>

      {matches.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <strong>AI Matching Complete!</strong> Internships are now ranked by best fit for your profile.
        </div>
      )}

      <div className="space-y-4">
        {sortedInternships.map((internship) => {
          const match = getMatchForId(internship.id);
          return (
            <Card key={internship.id} className={`border ${match ? "border-blue-300 shadow-md" : "border-gray-200"}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{internship.title}</CardTitle>
                    <CardDescription className="flex items-center gap-3 mt-1 text-gray-500">
                      <span className="flex items-center gap-1"><Building2 size={13} />{internship.company}</span>
                      <span className="flex items-center gap-1"><MapPin size={13} />{internship.location}</span>
                      <span className="flex items-center gap-1"><Clock size={13} />{internship.duration}</span>
                    </CardDescription>
                  </div>
                  {match && (
                    <div className="shrink-0">
                      <div className={`text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1 ${match.matchScore >= 85 ? "bg-green-100 text-green-800" : match.matchScore >= 70 ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-600"}`}>
                        <Star size={12} />
                        {match.matchScore}% match
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{internship.description}</p>
                <div className="flex flex-wrap gap-2">
                  {internship.skills.map((skill) => (
                    <span key={skill} className={`text-xs px-2 py-1 rounded-full ${STUDENT_PROFILE.skills.includes(skill) ? "bg-blue-100 text-blue-700 font-medium" : "bg-gray-100 text-gray-600"}`}>
                      {skill}
                    </span>
                  ))}
                </div>

                {match && (
                  <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                    <p className="text-sm text-blue-800">{match.matchReason}</p>
                    <div className="flex flex-wrap gap-2">
                      {match.keyStrengths.map((s) => (
                        <span key={s} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">✓ {s}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-gray-400">Deadline: {internship.deadline}</span>
                  <Button
                    size="sm"
                    onClick={() => setApplied((prev) => new Set(prev).add(internship.id))}
                    disabled={applied.has(internship.id)}
                    className={applied.has(internship.id) ? "bg-green-100 text-green-700 border border-green-300" : "bg-blue-600 text-white hover:bg-blue-700"}
                  >
                    {applied.has(internship.id) ? "Applied ✓" : "Apply Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
