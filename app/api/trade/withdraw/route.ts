import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getIdentifier } from "@/lib/rate-limit";

/**
 * POST /api/trade/withdraw
 * Initiate a skin withdrawal (bot → user)
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Auth required" }, { status: 401 });

    const limit = checkRateLimit(getIdentifier(request, session.user.id), "trade");
    if (limit.limited) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

    const body = await request.json();
    const { inventoryItemIds } = body;

    if (!inventoryItemIds?.length) return NextResponse.json({ error: "No items selected" }, { status: 400 });

    const useMock = !process.env.DATABASE_URL;
    const botUrl = process.env.BOT_API_URL || "http://localhost:5001";
    const botKey = process.env.BOT_API_KEY || "change-this";

    let tradeUrl = "";
    let totalValue = 0;

    if (useMock) {
      tradeUrl = "https://steamcommunity.com/tradeoffer/new/?partner=123&token=abc";
    } else {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!user?.tradeUrl) return NextResponse.json({ error: "Set your trade URL first" }, { status: 400 });
      tradeUrl = user.tradeUrl;

      // Verify items belong to user
      const items = await prisma.inventoryItem.findMany({
        where: { id: { in: inventoryItemIds }, userId: session.user.id, isListed: false },
      });
      if (items.length !== inventoryItemIds.length) {
        return NextResponse.json({ error: "Some items not found or listed" }, { status: 400 });
      }
      totalValue = items.reduce((s, i) => s + Number(i.currentValue), 0);
    }

    // Call bot service
    let tradeId = `mock-withdraw-${Date.now()}`;
    try {
      const botRes = await fetch(`${botUrl}/trade/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-bot-key": botKey },
        body: JSON.stringify({ tradeUrl, assetIds: inventoryItemIds }),
      });
      if (botRes.ok) {
        const botData = await botRes.json();
        tradeId = botData.tradeId;
      }
    } catch { /* Bot unavailable */ }

    if (!useMock) {
      await prisma.trade.create({
        data: {
          userId: session.user.id,
          steamTradeId: tradeId,
          direction: "WITHDRAWAL",
          status: "PENDING",
          items: inventoryItemIds.map((id: string) => ({ inventoryItemId: id })),
          totalValue,
          tradeUrl,
        },
      });
    }

    return NextResponse.json({ tradeId, status: "PENDING" });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
