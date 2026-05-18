import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/upgrade/history
 * Get user's upgrade history
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const useMock = !process.env.DATABASE_URL;

    if (useMock) {
      // Return mock data
      return NextResponse.json({ upgrades: [] });
    }

    const upgrades = await prisma.upgrade.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      upgrades: upgrades.map((u) => ({
        id: u.id,
        inputValue: Number(u.inputValue),
        targetValue: Number(u.targetValue),
        chance: u.chance,
        rollValue: u.rollValue,
        result: u.result,
        houseEdge: u.houseEdge,
        serverSeed: u.serverSeed,
        clientSeed: u.clientSeed,
        nonce: u.nonce,
        createdAt: u.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Upgrade history error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
