import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/trade/webhook
 * Called by the bot service when a trade status changes
 */
export async function POST(request: Request) {
  try {
    const secret = request.headers.get("x-webhook-secret");
    const expectedSecret = process.env.BOT_WEBHOOK_SECRET || "webhook-secret-change-me";

    if (secret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { steamTradeId, status, items } = body;

    if (!steamTradeId || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ ok: true, mock: true });
    }

    // Find the trade
    const trade = await prisma.trade.findUnique({ where: { steamTradeId } });
    if (!trade) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }

    // Update trade status
    await prisma.trade.update({
      where: { id: trade.id },
      data: { status },
    });

    // Handle accepted deposits — credit user balance
    if (status === "ACCEPTED" && trade.direction === "DEPOSIT") {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: trade.userId },
          data: { balance: { increment: trade.totalValue } },
        }),
        prisma.transaction.create({
          data: {
            userId: trade.userId,
            type: "DEPOSIT",
            amount: Number(trade.totalValue),
            description: `Skin deposit via trade #${steamTradeId}`,
            metadata: { steamTradeId, items },
          },
        }),
        prisma.notification.create({
          data: {
            userId: trade.userId,
            title: "Deposit Accepted",
            body: `Your deposit of $${Number(trade.totalValue).toFixed(2)} has been credited.`,
          },
        }),
      ]);
    }

    // Handle accepted withdrawals — remove items from inventory
    if (status === "ACCEPTED" && trade.direction === "WITHDRAWAL") {
      const tradeItems = trade.items as Array<{ inventoryItemId?: string }>;
      const itemIds = tradeItems.map(i => i.inventoryItemId).filter(Boolean) as string[];

      if (itemIds.length > 0) {
        await prisma.$transaction([
          prisma.inventoryItem.deleteMany({ where: { id: { in: itemIds } } }),
          prisma.transaction.create({
            data: {
              userId: trade.userId,
              type: "WITHDRAWAL",
              amount: -Number(trade.totalValue),
              description: `Skin withdrawal via trade #${steamTradeId}`,
            },
          }),
          prisma.notification.create({
            data: {
              userId: trade.userId,
              title: "Withdrawal Complete",
              body: `Your skins have been sent to your Steam account.`,
            },
          }),
        ]);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
