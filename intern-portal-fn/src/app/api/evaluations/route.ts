import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, unauthorized, forbidden } from "@/lib/auth";

// GET /api/evaluations
export async function GET(req: NextRequest) {
  const payload = getTokenFromRequest(req);
  if (!payload) return unauthorized();

  if (payload.role === "STUDENT") {
    const profile = await prisma.studentProfile.findUnique({ where: { userId: payload.userId } });
    if (!profile) return NextResponse.json([], { status: 200 });

    const evals = await prisma.evaluation.findMany({
      where: { studentId: profile.id },
      include: { supervisor: true },
    });
    return NextResponse.json(evals);
  }

  if (payload.role === "SUPERVISOR") {
    const profile = await prisma.supervisorProfile.findUnique({ where: { userId: payload.userId } });
    if (!profile) return NextResponse.json([], { status: 200 });

    const evals = await prisma.evaluation.findMany({
      where: { supervisorId: profile.id },
      include: { student: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(evals);
  }

  if (payload.role === "ADMIN") {
    const evals = await prisma.evaluation.findMany({
      include: { student: true, supervisor: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(evals);
  }

  return forbidden();
}

// POST /api/evaluations — supervisor creates evaluation
export async function POST(req: NextRequest) {
  const payload = getTokenFromRequest(req);
  if (!payload) return unauthorized();
  if (payload.role !== "SUPERVISOR" && payload.role !== "ADMIN") return forbidden();

  const profile = await prisma.supervisorProfile.findUnique({ where: { userId: payload.userId } });
  if (!profile) return NextResponse.json({ error: "Supervisor profile not found" }, { status: 404 });

  const {
    placementId, studentId,
    technicalScore, communicationScore, professionalismScore, overallScore,
    grade, technicalComment, communicationComment, professionalismComment,
    overallComment, recommendation, submit,
  } = await req.json();

  const evaluation = await prisma.evaluation.upsert({
    where: { placementId },
    create: {
      placementId, studentId, supervisorId: profile.id,
      technicalScore, communicationScore, professionalismScore, overallScore,
      grade, technicalComment, communicationComment, professionalismComment,
      overallComment, recommendation,
      status: submit ? "SUBMITTED" : "DRAFT",
      submittedAt: submit ? new Date() : undefined,
    },
    update: {
      technicalScore, communicationScore, professionalismScore, overallScore,
      grade, technicalComment, communicationComment, professionalismComment,
      overallComment, recommendation,
      status: submit ? "SUBMITTED" : "DRAFT",
      submittedAt: submit ? new Date() : undefined,
    },
  });

  if (submit) {
    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: { user: true },
    });
    if (student) {
      await prisma.notification.create({
        data: {
          userId: student.userId,
          type: "EVALUATION_READY",
          title: "Evaluation Submitted",
          message: `Your supervisor has submitted your internship evaluation. Grade: ${grade}`,
        },
      });
    }
  }

  return NextResponse.json(evaluation, { status: 201 });
}
