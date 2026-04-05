import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, unauthorized, forbidden } from "@/lib/auth";

// PATCH /api/placements/:id — admin approves/rejects
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = getTokenFromRequest(req);
  if (!payload) return unauthorized();
  if (payload.role !== "ADMIN") return forbidden();

  const { status } = await req.json();

  const placement = await prisma.placement.update({
    where: { id },
    data: {
      status,
      approvedAt: status === "APPROVED" ? new Date() : undefined,
    },
    include: { student: { include: { user: true } }, internship: true },
  });

  // Notify student
  await prisma.notification.create({
    data: {
      userId: placement.student.userId,
      type: "PLACEMENT_UPDATE",
      title: `Placement ${status}`,
      message: `Your placement at "${placement.internship.title}" has been ${status.toLowerCase()}.`,
    },
  });

  return NextResponse.json(placement);
}
