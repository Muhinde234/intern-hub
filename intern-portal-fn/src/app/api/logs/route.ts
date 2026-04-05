import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, unauthorized, forbidden } from "@/lib/auth";

// GET /api/logs — student sees their own; supervisor sees assigned students'
export async function GET(req: NextRequest) {
  const payload = getTokenFromRequest(req);
  if (!payload) return unauthorized();

  if (payload.role === "STUDENT") {
    const profile = await prisma.studentProfile.findUnique({ where: { userId: payload.userId } });
    if (!profile) return NextResponse.json([], { status: 200 });

    const logs = await prisma.weeklyLog.findMany({
      where: { studentId: profile.id },
      orderBy: { weekNumber: "desc" },
    });
    return NextResponse.json(logs);
  }

  if (payload.role === "SUPERVISOR") {
    const profile = await prisma.supervisorProfile.findUnique({ where: { userId: payload.userId } });
    if (!profile) return NextResponse.json([], { status: 200 });

    const logs = await prisma.weeklyLog.findMany({
      where: { supervisorId: profile.id },
      include: { student: true },
      orderBy: { submittedAt: "desc" },
    });
    return NextResponse.json(logs);
  }

  if (payload.role === "ADMIN") {
    const logs = await prisma.weeklyLog.findMany({
      include: { student: true, supervisor: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(logs);
  }

  return forbidden();
}

// POST /api/logs — student creates/saves a weekly log
export async function POST(req: NextRequest) {
  const payload = getTokenFromRequest(req);
  if (!payload) return unauthorized();
  if (payload.role !== "STUDENT") return forbidden();

  const profile = await prisma.studentProfile.findUnique({ where: { userId: payload.userId } });
  if (!profile) return NextResponse.json({ error: "Student profile not found" }, { status: 404 });

  const { placementId, weekNumber, content, aiScore, aiFeedback, submit } = await req.json();

  const existing = await prisma.weeklyLog.findUnique({
    where: { placementId_weekNumber: { placementId, weekNumber } },
  });

  const data = {
    content,
    aiScore,
    aiFeedback,
    status: submit ? "SUBMITTED" : "DRAFT",
    submittedAt: submit ? new Date() : null,
  } as const;

  let log;
  if (existing) {
    log = await prisma.weeklyLog.update({ where: { id: existing.id }, data });
  } else {
    const placement = await prisma.placement.findUnique({ where: { id: placementId } });
    log = await prisma.weeklyLog.create({
      data: {
        placementId,
        studentId: profile.id,
        supervisorId: placement?.supervisorId ?? undefined,
        weekNumber,
        ...data,
      },
    });
  }

  // Notify supervisor if submitted
  if (submit && log.supervisorId) {
    const supervisor = await prisma.supervisorProfile.findUnique({ where: { id: log.supervisorId } });
    if (supervisor) {
      await prisma.notification.create({
        data: {
          userId: supervisor.userId,
          type: "LOG_SUBMITTED",
          title: "Weekly Log Submitted",
          message: `${profile.fullName} submitted Week ${weekNumber} log for your review.`,
        },
      });
    }
  }

  return NextResponse.json(log, { status: 201 });
}
