import { NextRequest, NextResponse } from "next/server";
import { claude, MODEL } from "@/lib/claude";

export async function POST(req: NextRequest) {
  const { student, internships } = await req.json();

  const prompt = `You are an internship matching expert for a university portal. Given a student profile and a list of available internships, rank the top matches and explain why each is a good fit.

Student Profile:
${JSON.stringify(student, null, 2)}

Available Internships:
${JSON.stringify(internships, null, 2)}

Respond with a JSON array of ranked matches (best first), including only the internship id, a matchScore (0-100), a short matchReason (2 sentences max), and 3 keyStrengths as strings. Format:
[
  {
    "id": "internship_id",
    "matchScore": 92,
    "matchReason": "Your skills in React align perfectly with their tech stack...",
    "keyStrengths": ["React expertise", "Problem-solving background", "Team collaboration experience"]
  }
]

Return ONLY the JSON array, no markdown, no extra text.`;

  const message = await claude.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = (message.content[0] as { type: string; text: string }).text;

  try {
    const matches = JSON.parse(text);
    return NextResponse.json({ matches });
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
  }
}
