import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, unauthorized } from "@/lib/auth";

// GET /api/notifications — get current user's notifications
export async function GET(req: NextRequest) {
  const payload = getTokenFromRequest(req);
  if (!payload) return unauthorized();

  const notifications = await prisma.notification.findMany({
    where: { userId: payload.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(notifications);
}

// PATCH /api/notifications — mark all as read
export async function PATCH(req: NextRequest) {
  const payload = getTokenFromRequest(req);
  if (!payload) return unauthorized();

  await prisma.notification.updateMany({
    where: { userId: payload.userId, read: false },
    data: { read: true },
  });

  return NextResponse.json({ success: true });
}
