import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password, role, fullName, companyName } = await req.json();

  if (!email || !password || !role) {
    return NextResponse.json({ error: "email, password and role are required" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      role,
      // Create the matching role profile
      ...(role === "STUDENT" && {
        studentProfile: { create: { fullName: fullName ?? email } },
      }),
      ...(role === "COMPANY" && {
        companyProfile: { create: { companyName: companyName ?? "My Company" } },
      }),
      ...(role === "SUPERVISOR" && {
        supervisorProfile: { create: { fullName: fullName ?? email } },
      }),
    },
  });

  const token = signToken({ userId: user.id, role: user.role, email: user.email });

  return NextResponse.json({ token, role: user.role, email: user.email }, { status: 201 });
}
