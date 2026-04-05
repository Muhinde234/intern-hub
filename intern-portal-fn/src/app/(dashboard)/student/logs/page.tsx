"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Sparkles, CheckCircle, AlertCircle, Send } from "lucide-react";

type Feedback = {
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  suggestions: string;
  readyToSubmit: boolean;
};

const PAST_LOGS = [
  { week: 1, preview: "Completed onboarding, set up dev environment, met the team.", score: 82, submitted: true },
  { week: 2, preview: "Worked on authentication module, fixed 3 bugs, attended sprint review.", score: 90, submitted: true },
];

export default function StudentLogsPage() {
  const [currentLog, setCurrentLog] = useState("");
  const [weekNumber, setWeekNumber] = useState(3);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const getAIFeedback = async () => {
    if (!currentLog.trim()) return;
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/ai/log-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ log: currentLog, weekNumber }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Weekly Progress Logs</h1>
        <p className="text-gray-500 text-sm mt-1">Document your weekly activities and get AI feedback before submitting</p>
      </div>

      {/* Past logs */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Submitted Logs</h2>
        {PAST_LOGS.map((log) => (
          <Card key={log.week} className="border border-gray-200">
            <CardContent className="flex items-center justify-between py-3 px-4">
              <div>
                <span className="font-medium text-gray-800">Week {log.week}</span>
                <p className="text-xs text-gray-500 mt-0.5">{log.preview}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${log.score >= 85 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {log.score}/100
                </span>
                <CheckCircle size={16} className="text-green-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New log */}
      <Card className="border border-blue-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span>Week {weekNumber} Log</span>
            <span className="text-xs font-normal bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Draft</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={currentLog}
            onChange={(e) => setCurrentLog(e.target.value)}
            placeholder="Describe what you worked on this week: tasks completed, challenges faced, skills learned, meetings attended, and goals for next week..."
            className="w-full h-40 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex gap-3">
            <Button
              onClick={getAIFeedback}
              disabled={loading || !currentLog.trim()}
              variant="outline"
              className="flex gap-2 border-blue-400 text-blue-700 hover:bg-blue-50"
            >
              <Sparkles size={15} />
              {loading ? "Reviewing..." : "Get AI Feedback"}
            </Button>
            <Button
              onClick={() => setSubmitted(true)}
              disabled={submitted || !currentLog.trim()}
              className="flex gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send size={15} />
              {submitted ? "Submitted!" : "Submit Log"}
            </Button>
          </div>

          {/* AI Feedback Panel */}
          {feedback && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Sparkles size={15} className="text-blue-500" /> AI Feedback
                </h3>
                <div className={`text-lg font-bold px-3 py-1 rounded-full ${feedback.overallScore >= 85 ? "bg-green-100 text-green-700" : feedback.overallScore >= 70 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                  {feedback.overallScore}/100
                </div>
              </div>

              <p className="text-sm text-gray-700 italic">{feedback.summary}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-green-700 uppercase mb-1">Strengths</p>
                  <ul className="space-y-1">
                    {feedback.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-1">
                        <CheckCircle size={13} className="text-green-500 mt-0.5 shrink-0" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-yellow-700 uppercase mb-1">To Improve</p>
                  <ul className="space-y-1">
                    {feedback.improvements.map((s, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-1">
                        <AlertCircle size={13} className="text-yellow-500 mt-0.5 shrink-0" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-blue-700 mb-1">Suggestions for Next Week</p>
                <p className="text-sm text-blue-800">{feedback.suggestions}</p>
              </div>

              {feedback.readyToSubmit ? (
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle size={13} /> Your log looks good and is ready to submit!
                </p>
              ) : (
                <p className="text-xs text-yellow-600 font-medium flex items-center gap-1">
                  <AlertCircle size={13} /> Consider incorporating the feedback above before submitting.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
