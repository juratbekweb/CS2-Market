import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getIdentifier } from "@/lib/rate-limit";

const DAILY_AMOUNTS = [0.05, 0.10, 0.20, 0.30, 0.50, 0.75, 1.00];

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Auth required" }, { status: 401 });

    const limit = checkRateLimit(getIdentifier(request, session.user.id), "api");
    if (limit.limited) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

    const useMock = !process.env.DATABASE_URL;
    if (useMock) {
      return NextResponse.json({ amount: 0.05, day: 1, balance: 100 });
    }

    const lastBonus = await prisma.dailyBonus.findFirst({
      where: { userId: session.user.id }, orderBy: { claimedAt: "desc" },
    });
    const now = new Date();
    if (lastBonus) {
      const hrs = (now.getTime() - lastBonus.claimedAt.getTime()) / 3600000;
      if (hrs < 20) return NextResponse.json({ error: "Already claimed" }, { status: 400 });
    }
    let streak = 1;
    if (lastBonus) {
      const hrs = (now.getTime() - lastBonus.claimedAt.getTime()) / 3600000;
      if (hrs < 48) streak = lastBonus.day + 1;
    }
    const amount = DAILY_AMOUNTS[Math.min(streak - 1, 6)];
    await prisma.$transaction([
      prisma.dailyBonus.create({ data: { userId: session.user.id, amount, day: streak } }),
      prisma.wallet.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id, balance: amount },
        update: { balance: { increment: amount } }
      }),
      prisma.transaction.create({ data: { userId: session.user.id, type: "DAILY_BONUS", amount, description: `Daily bonus day ${streak}` } }),
    ]);
    const wallet = await prisma.wallet.findUnique({ where: { userId: session.user.id } });
    return NextResponse.json({ amount, day: streak, balance: wallet ? Number(wallet.balance) : 0 });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Auth required" }, { status: 401 });
    if (!process.env.DATABASE_URL) return NextResponse.json({ canClaim: true, streak: 0, nextAmount: 0.05 });
    const last = await prisma.dailyBonus.findFirst({ where: { userId: session.user.id }, orderBy: { claimedAt: "desc" } });
    if (!last) return NextResponse.json({ canClaim: true, streak: 0, nextAmount: 0.05 });
    const hrs = (Date.now() - last.claimedAt.getTime()) / 3600000;
    const canClaim = hrs >= 20;
    const streak = hrs < 48 ? last.day : 0;
    return NextResponse.json({ canClaim, streak, nextAmount: DAILY_AMOUNTS[Math.min(streak, 6)] });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
