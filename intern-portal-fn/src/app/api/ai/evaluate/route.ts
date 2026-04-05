import { NextRequest, NextResponse } from "next/server";
import { claude, MODEL } from "@/lib/claude";

export async function POST(req: NextRequest) {
  const { student, criteria } = await req.json();

  const message = await claude.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a supervisor at a company completing a formal internship evaluation for a university student. Based on the student data and evaluation criteria provided, draft a professional evaluation report.

Student & Performance Data:
${JSON.stringify(student, null, 2)}

Evaluation Criteria:
${JSON.stringify(criteria, null, 2)}

Write a professional evaluation covering:
1. Technical Skills performance
2. Communication & Teamwork
3. Professionalism & Punctuality
4. Overall Achievement
5. Recommended grade (A/B/C/D)
6. Final recommendation (1-2 sentences)

Format as JSON:
{
  "technicalSkills": { "score": 85, "comment": "..." },
  "communication": { "score": 80, "comment": "..." },
  "professionalism": { "score": 90, "comment": "..." },
  "overallAchievement": { "score": 85, "comment": "..." },
  "grade": "B+",
  "recommendation": "..."
}

Return ONLY the JSON.`,
      },
    ],
  });

  const text = (message.content[0] as { type: string; text: string }).text;

  try {
    const evaluation = JSON.parse(text);
    return NextResponse.json({ evaluation });
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
  }
}
