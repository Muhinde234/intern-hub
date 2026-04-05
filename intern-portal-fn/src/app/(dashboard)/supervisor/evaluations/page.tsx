"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Sparkles, User, CheckCircle } from "lucide-react";

const STUDENTS = [
  {
    id: "s1",
    name: "Alice Uwimana",
    internship: "Frontend Developer Intern",
    company: "TechRwanda Ltd",
    weeksCompleted: 10,
    logsSubmitted: 9,
    avgLogScore: 85,
    projectsCompleted: 3,
    attendance: "98%",
  },
  {
    id: "s2",
    name: "Bob Nkurunziza",
    internship: "Data Engineering Intern",
    company: "Africa Data Corp",
    weeksCompleted: 10,
    logsSubmitted: 8,
    avgLogScore: 72,
    projectsCompleted: 2,
    attendance: "90%",
  },
];

const CRITERIA = [
  "Technical skills application",
  "Communication and teamwork",
  "Punctuality and professionalism",
  "Problem-solving ability",
  "Initiative and creativity",
];

type EvalResult = {
  technicalSkills: { score: number; comment: string };
  communication: { score: number; comment: string };
  professionalism: { score: number; comment: string };
  overallAchievement: { score: number; comment: string };
  grade: string;
  recommendation: string;
};

export default function SupervisorEvaluationsPage() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<EvalResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const generateEvaluation = async (student: (typeof STUDENTS)[0]) => {
    setLoading(true);
    setEvaluation(null);
    try {
      const res = await fetch("/api/ai/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student, criteria: CRITERIA }),
      });
      const data = await res.json();
      setEvaluation(data.evaluation);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) =>
    score >= 85 ? "text-green-700 bg-green-50" : score >= 70 ? "text-yellow-700 bg-yellow-50" : "text-red-700 bg-red-50";

  const student = STUDENTS.find((s) => s.id === selectedStudent);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Evaluations</h1>
        <p className="text-gray-500 text-sm mt-1">Generate AI-assisted evaluations for your assigned students</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {STUDENTS.map((s) => (
          <Card
            key={s.id}
            onClick={() => { setSelectedStudent(s.id); setEvaluation(null); }}
            className={`cursor-pointer border transition-all ${selectedStudent === s.id ? "border-blue-400 shadow-md bg-blue-50/30" : "border-gray-200 hover:border-blue-200"}`}
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.internship}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-gray-50 rounded p-1">
                  <div className="font-bold text-gray-800">{s.logsSubmitted}/{s.weeksCompleted}</div>
                  <div className="text-gray-500">Logs</div>
                </div>
                <div className="bg-gray-50 rounded p-1">
                  <div className="font-bold text-gray-800">{s.avgLogScore}</div>
                  <div className="text-gray-500">Avg Score</div>
                </div>
                <div className="bg-gray-50 rounded p-1">
                  <div className="font-bold text-gray-800">{s.attendance}</div>
                  <div className="text-gray-500">Attend.</div>
                </div>
              </div>
              {saved.has(s.id) && (
                <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle size={12} /> Evaluation saved</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {student && (
        <Card className="border border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Evaluating: {student.name}</span>
              <Button
                onClick={() => generateEvaluation(student)}
                disabled={loading}
                className="bg-blue-600 text-white hover:bg-blue-700 flex gap-2"
              >
                <Sparkles size={15} />
                {loading ? "Generating..." : "Generate AI Evaluation"}
              </Button>
            </CardTitle>
          </CardHeader>

          {loading && (
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                Claude is drafting the evaluation...
              </div>
            </CardContent>
          )}

          {evaluation && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Technical Skills", data: evaluation.technicalSkills },
                  { label: "Communication", data: evaluation.communication },
                  { label: "Professionalism", data: evaluation.professionalism },
                  { label: "Overall Achievement", data: evaluation.overallAchievement },
                ].map(({ label, data }) => (
                  <div key={label} className="border border-gray-200 rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-600 uppercase">{label}</p>
                      <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${scoreColor(data.score)}`}>
                        {data.score}/100
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{data.comment}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-blue-800">Final Grade</p>
                  <span className="text-2xl font-bold text-blue-700">{evaluation.grade}</span>
                </div>
                <p className="text-sm text-blue-800">{evaluation.recommendation}</p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setSaved((prev) => new Set(prev).add(student.id));
                    setSelectedStudent(null);
                    setEvaluation(null);
                  }}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  <CheckCircle size={15} className="mr-2" /> Submit Evaluation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => generateEvaluation(student)}
                  className="text-blue-600 border-blue-300"
                >
                  <Sparkles size={15} className="mr-1" /> Regenerate
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
