import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, unauthorized, forbidden } from "@/lib/auth";

// PATCH /api/applications/:id — company updates status (shortlist/accept/reject)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = getTokenFromRequest(req);
  if (!payload) return unauthorized();
  if (payload.role !== "COMPANY" && payload.role !== "ADMIN") return forbidden();

  const { status } = await req.json();

  const application = await prisma.application.update({
    where: { id },
    data: { status },
    include: { student: { include: { user: true } }, internship: true },
  });

  // Notify student of status change
  await prisma.notification.create({
    data: {
      userId: application.student.userId,
      type: "APPLICATION_UPDATE",
      title: "Application Status Updated",
      message: `Your application for "${application.internship.title}" has been updated to: ${status}.`,
    },
  });

  return NextResponse.json(application);
}
