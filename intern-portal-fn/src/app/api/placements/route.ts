import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, unauthorized, forbidden } from "@/lib/auth";

// GET /api/placements
export async function GET(req: NextRequest) {
  const payload = getTokenFromRequest(req);
  if (!payload) return unauthorized();

  if (payload.role === "STUDENT") {
    const profile = await prisma.studentProfile.findUnique({ where: { userId: payload.userId } });
    if (!profile) return NextResponse.json([], { status: 200 });

    const placements = await prisma.placement.findMany({
      where: { studentId: profile.id },
      include: { internship: { include: { company: true } } },
    });
    return NextResponse.json(placements);
  }

  if (payload.role === "ADMIN") {
    const placements = await prisma.placement.findMany({
      include: {
        student: true,
        internship: { include: { company: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(placements);
  }

  return forbidden();
}

// POST /api/placements — admin creates a placement after reviewing application
export async function POST(req: NextRequest) {
  const payload = getTokenFromRequest(req);
  if (!payload) return unauthorized();
  if (payload.role !== "ADMIN") return forbidden();

  const { studentId, internshipId, supervisorId, startDate, endDate } = await req.json();

  const placement = await prisma.placement.create({
    data: {
      studentId,
      internshipId,
      supervisorId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      status: "PENDING",
    },
  });

  // Notify student
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: { user: true },
  });
  if (student) {
    await prisma.notification.create({
      data: {
        userId: student.userId,
        type: "PLACEMENT_CREATED",
        title: "Placement Submitted for Approval",
        message: "Your internship placement has been submitted and is awaiting approval.",
      },
    });
  }

  return NextResponse.json(placement, { status: 201 });
}
