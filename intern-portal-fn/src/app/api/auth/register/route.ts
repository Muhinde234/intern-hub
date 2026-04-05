import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, role, fullName, companyName } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: "email, password and role are required" }, { status: 400 });
    }

    const validRoles = ["STUDENT", "COMPANY", "SUPERVISOR", "ADMIN"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Step 1: create the user
    const user = await prisma.user.create({
      data: { email, password: hashed, role },
    });

    // Step 2: create the role-specific profile separately
    if (role === "STUDENT") {
      await prisma.studentProfile.create({
        data: { userId: user.id, fullName: fullName ?? email },
      });
    } else if (role === "COMPANY") {
      await prisma.companyProfile.create({
        data: { userId: user.id, companyName: companyName ?? fullName ?? "My Company" },
      });
    } else if (role === "SUPERVISOR") {
      await prisma.supervisorProfile.create({
        data: { userId: user.id, fullName: fullName ?? email },
      });
    }

    const token = signToken({ userId: user.id, role: user.role, email: user.email });

    return NextResponse.json({ token, role: user.role, email: user.email }, { status: 201 });
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
