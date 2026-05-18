import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/leaderboard */
export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      // Mock leaderboard
      return NextResponse.json({
        traders: [
          { rank: 1, name: "ShadowTrader", avatar: null, volume: 12450.00 },
          { rank: 2, name: "NeonKing", avatar: null, volume: 9800.50 },
          { rank: 3, name: "PixelMaster", avatar: null, volume: 7200.00 },
          { rank: 4, name: "CryptoCS", avatar: null, volume: 5100.25 },
          { rank: 5, name: "SkinCollector", avatar: null, volume: 3890.00 },
        ],
        upgraders: [
          { rank: 1, name: "LuckyShot", avatar: null, profit: 890.00 },
          { rank: 2, name: "RiskTaker", avatar: null, profit: 650.50 },
          { rank: 3, name: "UpgradeKing", avatar: null, profit: 420.00 },
        ],
      });
    }

    // Top traders by volume (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const traders = await prisma.transaction.groupBy({
      by: ["userId"],
      where: { type: { in: ["PURCHASE", "SALE"] }, createdAt: { gte: thirtyDaysAgo } },
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
      take: 10,
    });

    const traderUsers = await prisma.user.findMany({
      where: { id: { in: traders.map((t) => t.userId) } },
      select: { id: true, name: true, avatar: true },
    });

    const traderMap = new Map(traderUsers.map((u) => [u.id, u]));

    return NextResponse.json({
      traders: traders.map((t, i) => ({
        rank: i + 1,
        name: traderMap.get(t.userId)?.name ?? "Anonymous",
        avatar: traderMap.get(t.userId)?.avatar ?? null,
        volume: Math.abs(Number(t._sum.amount ?? 0)),
      })),
      upgraders: [],
    });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
