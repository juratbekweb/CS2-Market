import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/** GET /api/referral — Get user's referral info */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Auth required" }, { status: 401 });

    if (!process.env.DATABASE_URL) {
      const code = `NM${session.user.id.slice(0, 6).toUpperCase()}`;
      return NextResponse.json({ referralCode: code, totalReferred: 0, totalEarned: 0 });
    }

    let user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Generate referral code if not exists
    if (!user.referralCode) {
      const code = `NM${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
      user = await prisma.user.update({ where: { id: session.user.id }, data: { referralCode: code } });
    }

    const referrals = await prisma.referral.findMany({ where: { referrerId: session.user.id } });
    const totalEarned = referrals.reduce((s, r) => s + Number(r.commission), 0);

    return NextResponse.json({
      referralCode: user.referralCode,
      totalReferred: referrals.length,
      totalEarned: Math.round(totalEarned * 100) / 100,
    });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
