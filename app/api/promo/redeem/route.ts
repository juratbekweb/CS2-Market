import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redeemPromoSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Auth required" }, { status: 401 });
    const body = await request.json();
    const parsed = redeemPromoSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Promo codes require database" }, { status: 400 });
    }

    const promo = await prisma.promoCode.findUnique({ where: { code: parsed.data.code.toUpperCase() } });
    if (!promo || !promo.isActive) return NextResponse.json({ error: "Invalid promo code" }, { status: 404 });
    if (promo.expiresAt && promo.expiresAt < new Date()) return NextResponse.json({ error: "Promo code expired" }, { status: 400 });
    if (promo.usedCount >= promo.maxUses) return NextResponse.json({ error: "Promo code fully redeemed" }, { status: 400 });

    const existing = await prisma.promoRedemption.findUnique({
      where: { userId_promoCodeId: { userId: session.user.id, promoCodeId: promo.id } },
    });
    if (existing) return NextResponse.json({ error: "Already redeemed this code" }, { status: 400 });

    await prisma.$transaction([
      prisma.promoRedemption.create({ data: { userId: session.user.id, promoCodeId: promo.id } }),
      prisma.promoCode.update({ where: { id: promo.id }, data: { usedCount: { increment: 1 } } }),
      prisma.user.update({ where: { id: session.user.id }, data: { balance: { increment: promo.amount } } }),
      prisma.transaction.create({
        data: { userId: session.user.id, type: "PROMO_REDEEM", amount: Number(promo.amount), description: `Promo code: ${promo.code}` },
      }),
    ]);

    const u = await prisma.user.findUnique({ where: { id: session.user.id } });
    return NextResponse.json({ amount: Number(promo.amount), balance: u ? Number(u.balance) : 0 });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
