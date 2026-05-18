import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/** GET /api/trade/history — User's trade history */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Auth required" }, { status: 401 });

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ trades: [] });
    }

    const trades = await prisma.trade.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      trades: trades.map(t => ({
        id: t.id,
        steamTradeId: t.steamTradeId,
        direction: t.direction,
        status: t.status,
        totalValue: Number(t.totalValue),
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      })),
    });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
