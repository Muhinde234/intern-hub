import { PrismaClient } from "../src/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.resolve(__dirname, "..", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  console.log("🌱 Seeding database...");

  const hash = (pw: string) => bcrypt.hash(pw, 10);

  // ── Admin ──────────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@internhub.rw" },
    update: {},
    create: {
      email: "admin@internhub.rw",
      password: await hash("Admin@1234"),
      role: "ADMIN",
    },
  });
  console.log("✅ Admin:", admin.email);

  // ── Company ────────────────────────────────────────────────────────────────
  const companyUser = await prisma.user.upsert({
    where: { email: "hr@techrwanda.rw" },
    update: {},
    create: {
      email: "hr@techrwanda.rw",
      password: await hash("Company@1234"),
      role: "COMPANY",
      companyProfile: {
        create: {
          companyName: "TechRwanda Ltd",
          industry: "Software",
          website: "https://techrwanda.rw",
          location: "Kigali, Rwanda",
          description: "Leading software company in East Africa.",
        },
      },
    },
    include: { companyProfile: true },
  });
  console.log("✅ Company:", companyUser.email);

  const company = companyUser.companyProfile!;

  // ── Internships ────────────────────────────────────────────────────────────
  const intern1 = await prisma.internship.upsert({
    where: { id: "internship-1" },
    update: {},
    create: {
      id: "internship-1",
      companyId: company.id,
      title: "Frontend Developer Intern",
      description: "Build modern web UIs using React and TypeScript with an agile team.",
      skills: "React,TypeScript,CSS,REST APIs",
      location: "Kigali, Rwanda",
      duration: "3 months",
      deadline: new Date("2026-06-01"),
    },
  });

  const intern2 = await prisma.internship.upsert({
    where: { id: "internship-2" },
    update: {},
    create: {
      id: "internship-2",
      companyId: company.id,
      title: "Full Stack Developer Intern",
      description: "Work across the full stack on a SaaS product used by 10,000+ users.",
      skills: "Node.js,React,PostgreSQL,Docker",
      location: "Kigali, Rwanda",
      duration: "3 months",
      deadline: new Date("2026-06-15"),
    },
  });
  console.log("✅ Internships seeded");

  // ── Supervisor ─────────────────────────────────────────────────────────────
  const supervisorUser = await prisma.user.upsert({
    where: { email: "supervisor@internhub.rw" },
    update: {},
    create: {
      email: "supervisor@internhub.rw",
      password: await hash("Super@1234"),
      role: "SUPERVISOR",
      supervisorProfile: {
        create: {
          fullName: "Dr. Jean Bosco Niyomugabo",
          department: "Computer Science",
          phone: "+250 788 000 001",
        },
      },
    },
    include: { supervisorProfile: true },
  });
  console.log("✅ Supervisor:", supervisorUser.email);

  const supervisor = supervisorUser.supervisorProfile!;

  // ── Student ────────────────────────────────────────────────────────────────
  const studentUser = await prisma.user.upsert({
    where: { email: "alice@student.ur.ac.rw" },
    update: {},
    create: {
      email: "alice@student.ur.ac.rw",
      password: await hash("Student@1234"),
      role: "STUDENT",
      studentProfile: {
        create: {
          fullName: "Alice Uwimana",
          major: "Computer Science",
          year: 3,
          gpa: 3.7,
          skills: "React,TypeScript,Node.js,Python,SQL",
          phone: "+250 788 123 456",
          bio: "Passionate software engineering student focused on web development.",
        },
      },
    },
    include: { studentProfile: true },
  });
  console.log("✅ Student:", studentUser.email);

  const student = studentUser.studentProfile!;

  // ── Application ────────────────────────────────────────────────────────────
  const application = await prisma.application.upsert({
    where: {
      studentId_internshipId: { studentId: student.id, internshipId: intern1.id },
    },
    update: {},
    create: {
      studentId: student.id,
      internshipId: intern1.id,
      status: "ACCEPTED",
      coverLetter: "I am excited to apply for the Frontend Developer Intern role...",
    },
  });
  console.log("✅ Application seeded");

  // ── Placement ──────────────────────────────────────────────────────────────
  const placement = await prisma.placement.upsert({
    where: {
      studentId_internshipId: { studentId: student.id, internshipId: intern1.id },
    },
    update: {},
    create: {
      studentId: student.id,
      internshipId: intern1.id,
      supervisorId: supervisor.id,
      status: "ONGOING",
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-06-01"),
      approvedAt: new Date("2026-02-25"),
    },
  });
  console.log("✅ Placement seeded");

  // ── Weekly Logs ────────────────────────────────────────────────────────────
  await prisma.weeklyLog.upsert({
    where: { placementId_weekNumber: { placementId: placement.id, weekNumber: 1 } },
    update: {},
    create: {
      placementId: placement.id,
      studentId: student.id,
      supervisorId: supervisor.id,
      weekNumber: 1,
      content: "Completed onboarding, set up development environment, and met the team.",
      aiScore: 82,
      status: "REVIEWED",
      submittedAt: new Date("2026-03-08"),
      reviewedAt: new Date("2026-03-09"),
    },
  });

  await prisma.weeklyLog.upsert({
    where: { placementId_weekNumber: { placementId: placement.id, weekNumber: 2 } },
    update: {},
    create: {
      placementId: placement.id,
      studentId: student.id,
      supervisorId: supervisor.id,
      weekNumber: 2,
      content: "Worked on authentication module using JWT, fixed 3 bugs, attended sprint review.",
      aiScore: 90,
      status: "SUBMITTED",
      submittedAt: new Date("2026-03-15"),
    },
  });
  console.log("✅ Weekly logs seeded");

  // ── Notifications ──────────────────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      {
        userId: studentUser.id,
        type: "PLACEMENT_UPDATE",
        title: "Placement Approved",
        message: 'Your placement at "Frontend Developer Intern" has been approved.',
        read: true,
      },
      {
        userId: studentUser.id,
        type: "LOG_REVIEWED",
        title: "Weekly Log Reviewed",
        message: "Your Week 1 log has been reviewed by your supervisor.",
        read: false,
      },
      {
        userId: supervisorUser.id,
        type: "LOG_SUBMITTED",
        title: "Weekly Log Submitted",
        message: "Alice Uwimana submitted Week 2 log for your review.",
        read: false,
      },
    ],
  });
  console.log("✅ Notifications seeded");

  console.log("\n🎉 Seed complete! Demo accounts:");
  console.log("   Admin:      admin@internhub.rw     / Admin@1234");
  console.log("   Company:    hr@techrwanda.rw        / Company@1234");
  console.log("   Supervisor: supervisor@internhub.rw / Super@1234");
  console.log("   Student:    alice@student.ur.ac.rw  / Student@1234");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
