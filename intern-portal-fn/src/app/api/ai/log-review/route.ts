import { NextRequest, NextResponse } from "next/server";
import { claude, MODEL } from "@/lib/claude";

export async function POST(req: NextRequest) {
  const { log, weekNumber } = await req.json();

  const message = await claude.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a university internship supervisor reviewing a student's weekly progress log. Give constructive, encouraging feedback.

Week ${weekNumber} Log:
${log}

Provide feedback in JSON format:
{
  "overallScore": 78,
  "summary": "One sentence overall assessment",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "suggestions": "2-3 sentences of actionable advice for next week",
  "readyToSubmit": true
}

Return ONLY the JSON, no markdown.`,
      },
    ],
  });

  const text = (message.content[0] as { type: string; text: string }).text;

  try {
    const feedback = JSON.parse(text);
    return NextResponse.json({ feedback });
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
  }
}
