import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, unauthorized, forbidden } from "@/lib/auth";

// GET /api/reports — admin only, FR8 analytics
export async function GET(req: NextRequest) {
  const payload = getTokenFromRequest(req);
  if (!payload) return unauthorized();
  if (payload.role !== "ADMIN") return forbidden();

  const [
    totalStudents,
    totalCompanies,
    totalInternships,
    totalApplications,
    totalPlacements,
    pendingPlacements,
    approvedPlacements,
    totalLogs,
    totalEvaluations,
    applicationsByStatus,
    placementsByStatus,
    avgEvalScore,
    recentActivity,
  ] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.companyProfile.count(),
    prisma.internship.count(),
    prisma.application.count(),
    prisma.placement.count(),
    prisma.placement.count({ where: { status: "PENDING" } }),
    prisma.placement.count({ where: { status: "APPROVED" } }),
    prisma.weeklyLog.count(),
    prisma.evaluation.count(),
    prisma.application.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.placement.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.evaluation.aggregate({ _avg: { overallScore: true } }),
    prisma.application.findMany({
      take: 5,
      orderBy: { appliedAt: "desc" },
      include: {
        student: { select: { fullName: true } },
        internship: { select: { title: true } },
      },
    }),
  ]);

  return NextResponse.json({
    overview: {
      totalStudents,
      totalCompanies,
      totalInternships,
      totalApplications,
      totalPlacements,
      pendingPlacements,
      approvedPlacements,
      totalLogs,
      totalEvaluations,
      avgEvaluationScore: avgEvalScore._avg.overallScore ?? 0,
    },
    applicationsByStatus: applicationsByStatus.map((s) => ({
      status: s.status,
      count: s._count.id,
    })),
    placementsByStatus: placementsByStatus.map((s) => ({
      status: s.status,
      count: s._count.id,
    })),
    recentApplications: recentActivity,
  });
}
