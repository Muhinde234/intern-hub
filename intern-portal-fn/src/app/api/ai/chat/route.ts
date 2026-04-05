import { NextRequest } from "next/server";
import { claude, MODEL } from "@/lib/claude";

export async function POST(req: NextRequest) {
  const { messages, userRole } = await req.json();

  const systemPrompt = `You are InternAI, a helpful assistant embedded in the Intern Hub portal — a university internship management system. You help ${userRole || "users"} navigate the portal, understand processes, and succeed in their internships.

You can help with:
- Explaining how to apply for internships
- Advising on writing weekly progress logs
- Guidance on evaluation criteria and grading
- Tips for professional development during internships
- Answering questions about portal features
- Career advice for interns

Be concise, friendly, and encouraging. If asked about specific data (like application status), explain that you don't have access to live data but guide them on where to find it in the portal.`;

  const stream = await claude.messages.stream({
    model: MODEL,
    max_tokens: 512,
    system: systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
