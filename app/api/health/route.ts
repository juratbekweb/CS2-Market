import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const isMockMode = !process.env.DATABASE_URL;
  let dbStatus = "disconnected";

  if (!isMockMode) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = "connected";
    } catch {
      dbStatus = "error";
    }
  }

  return NextResponse.json({
    status: "ok",
    mode: isMockMode ? "mock" : "live",
    database: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
}
