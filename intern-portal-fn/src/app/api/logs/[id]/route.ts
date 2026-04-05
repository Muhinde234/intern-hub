import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, unauthorized, forbidden } from "@/lib/auth";

// PATCH /api/logs/:id — supervisor adds review comment
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = getTokenFromRequest(req);
  if (!payload) return unauthorized();
  if (payload.role !== "SUPERVISOR" && payload.role !== "ADMIN") return forbidden();

  const { aiFeedback, status } = await req.json();

  const log = await prisma.weeklyLog.update({
    where: { id },
    data: {
      aiFeedback,
      status: status ?? "REVIEWED",
      reviewedAt: new Date(),
    },
    include: { student: { include: { user: true } } },
  });

  // Notify student
  await prisma.notification.create({
    data: {
      userId: log.student.userId,
      type: "LOG_REVIEWED",
      title: "Weekly Log Reviewed",
      message: `Your Week ${log.weekNumber} log has been reviewed by your supervisor.`,
    },
  });

  return NextResponse.json(log);
}
