import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, unauthorized, forbidden } from "@/lib/auth";

// GET /api/internships — public, list all open internships
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const open = searchParams.get("open");

  const internships = await prisma.internship.findMany({
    where: open === "true" ? { isOpen: true } : undefined,
    include: {
      company: { select: { companyName: true, location: true } },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(internships);
}

// POST /api/internships — company only
export async function POST(req: NextRequest) {
  const payload = getTokenFromRequest(req);
  if (!payload) return unauthorized();
  if (payload.role !== "COMPANY") return forbidden();

  const company = await prisma.companyProfile.findUnique({
    where: { userId: payload.userId },
  });
  if (!company) return NextResponse.json({ error: "Company profile not found" }, { status: 404 });

  const { title, description, skills, location, duration, deadline } = await req.json();

  if (!title || !description || !deadline) {
    return NextResponse.json({ error: "title, description and deadline are required" }, { status: 400 });
  }

  const internship = await prisma.internship.create({
    data: {
      companyId: company.id,
      title,
      description,
      skills: skills ?? "",
      location,
      duration,
      deadline: new Date(deadline),
    },
  });

  return NextResponse.json(internship, { status: 201 });
}
