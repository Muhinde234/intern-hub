import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, unauthorized, forbidden } from "@/lib/auth";

// GET /api/internships/:id
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const internship = await prisma.internship.findUnique({
    where: { id },
    include: {
      company: true,
      _count: { select: { applications: true } },
    },
  });
  if (!internship) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(internship);
}

// PATCH /api/internships/:id — company owner only
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = getTokenFromRequest(req);
  if (!payload) return unauthorized();

  const internship = await prisma.internship.findUnique({
    where: { id },
    include: { company: true },
  });
  if (!internship) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (internship.company.userId !== payload.userId) return forbidden();

  const data = await req.json();
  const updated = await prisma.internship.update({
    where: { id },
    data: {
      ...data,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
    },
  });
  return NextResponse.json(updated);
}

// DELETE /api/internships/:id — company owner only
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = getTokenFromRequest(req);
  if (!payload) return unauthorized();

  const internship = await prisma.internship.findUnique({
    where: { id },
    include: { company: true },
  });
  if (!internship) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (internship.company.userId !== payload.userId) return forbidden();

  await prisma.internship.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
