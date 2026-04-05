import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, unauthorized, forbidden } from "@/lib/auth";

// GET /api/applications — returns applications for the current user's role
export async function GET(req: NextRequest) {
  const payload = getTokenFromRequest(req);
  if (!payload) return unauthorized();

  if (payload.role === "STUDENT") {
    const profile = await prisma.studentProfile.findUnique({ where: { userId: payload.userId } });
    if (!profile) return NextResponse.json([], { status: 200 });

    const applications = await prisma.application.findMany({
      where: { studentId: profile.id },
      include: { internship: { include: { company: true } } },
      orderBy: { appliedAt: "desc" },
    });
    return NextResponse.json(applications);
  }

  if (payload.role === "COMPANY") {
    const company = await prisma.companyProfile.findUnique({ where: { userId: payload.userId } });
    if (!company) return NextResponse.json([], { status: 200 });

    const applications = await prisma.application.findMany({
      where: { internship: { companyId: company.id } },
      include: {
        student: true,
        internship: { select: { title: true } },
      },
      orderBy: { appliedAt: "desc" },
    });
    return NextResponse.json(applications);
  }

  if (payload.role === "ADMIN") {
    const applications = await prisma.application.findMany({
      include: {
        student: true,
        internship: { include: { company: true } },
      },
      orderBy: { appliedAt: "desc" },
    });
    return NextResponse.json(applications);
  }

  return forbidden();
}

// POST /api/applications — student applies to an internship
export async function POST(req: NextRequest) {
  const payload = getTokenFromRequest(req);
  if (!payload) return unauthorized();
  if (payload.role !== "STUDENT") return forbidden();

  const profile = await prisma.studentProfile.findUnique({ where: { userId: payload.userId } });
  if (!profile) return NextResponse.json({ error: "Student profile not found" }, { status: 404 });

  const { internshipId, coverLetter } = await req.json();
  if (!internshipId) return NextResponse.json({ error: "internshipId is required" }, { status: 400 });

  const existing = await prisma.application.findUnique({
    where: { studentId_internshipId: { studentId: profile.id, internshipId } },
  });
  if (existing) return NextResponse.json({ error: "Already applied" }, { status: 409 });

  const application = await prisma.application.create({
    data: { studentId: profile.id, internshipId, coverLetter },
  });

  // Notify student
  await prisma.notification.create({
    data: {
      userId: payload.userId,
      type: "APPLICATION_SUBMITTED",
      title: "Application Submitted",
      message: "Your application has been submitted successfully.",
    },
  });

  return NextResponse.json(application, { status: 201 });
}
