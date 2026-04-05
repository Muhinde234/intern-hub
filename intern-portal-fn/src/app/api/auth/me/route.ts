import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, unauthorized } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const payload = getTokenFromRequest(req);
  if (!payload) return unauthorized();

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      studentProfile: true,
      companyProfile: true,
      supervisorProfile: true,
    },
  });

  if (!user) return unauthorized();
  return NextResponse.json(user);
}
