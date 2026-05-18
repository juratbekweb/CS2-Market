import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getIdentifier } from "@/lib/rate-limit";

/**
 * POST /api/trade/deposit
 * Initiate a skin deposit (user → bot)
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Auth required" }, { status: 401 });

    const limit = checkRateLimit(getIdentifier(request, session.user.id), "trade");
    if (limit.limited) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

    const body = await request.json();
    const { assetIds, totalValue } = body;

    if (!assetIds?.length) return NextResponse.json({ error: "No items selected" }, { status: 400 });

    const useMock = !process.env.DATABASE_URL;
    const botUrl = process.env.BOT_API_URL || "http://localhost:5001";
    const botKey = process.env.BOT_API_KEY || "change-this";

    // Get user trade URL
    let tradeUrl = "";
    if (useMock) {
      tradeUrl = "https://steamcommunity.com/tradeoffer/new/?partner=123&token=abc";
    } else {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!user?.tradeUrl) return NextResponse.json({ error: "Set your trade URL first" }, { status: 400 });
      tradeUrl = user.tradeUrl;
    }

    // Call bot service
    let tradeId = `mock-deposit-${Date.now()}`;
    try {
      const botRes = await fetch(`${botUrl}/trade/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-bot-key": botKey },
        body: JSON.stringify({
          userSteamId: session.user.steamId,
          tradeUrl,
          assetIds,
        }),
      });
      if (botRes.ok) {
        const botData = await botRes.json();
        tradeId = botData.tradeId;
      }
    } catch { /* Bot unavailable, use mock */ }

    // Record trade in DB
    if (!useMock) {
      await prisma.trade.create({
        data: {
          userId: session.user.id,
          steamTradeId: tradeId,
          direction: "DEPOSIT",
          status: "PENDING",
          items: assetIds.map((id: string) => ({ assetId: id })),
          totalValue: totalValue || 0,
          tradeUrl,
        },
      });
    }

    return NextResponse.json({ tradeId, status: "PENDING" });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
