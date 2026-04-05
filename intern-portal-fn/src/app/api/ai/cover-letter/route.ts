import { NextRequest, NextResponse } from "next/server";
import { claude, MODEL } from "@/lib/claude";

export async function POST(req: NextRequest) {
  const { student, internship } = await req.json();

  const message = await claude.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a professional career coach helping a university student write a cover letter for an internship.

Student Profile:
${JSON.stringify(student, null, 2)}

Internship they are applying to:
${JSON.stringify(internship, null, 2)}

Write a compelling, personalized cover letter (3 short paragraphs). Be specific about how the student's skills match the role. Keep it professional and enthusiastic. Do not use generic filler sentences. Return only the cover letter text.`,
      },
    ],
  });

  const coverLetter = (message.content[0] as { type: string; text: string }).text;
  return NextResponse.json({ coverLetter });
}
