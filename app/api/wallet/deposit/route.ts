import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { depositFunds } from "@/lib/store";
import { checkRateLimit, getIdentifier } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const rl = checkRateLimit(getIdentifier(req, session.user.id), "wallet");
  if (rl.limited) return NextResponse.json({ error: "Rate limited", retryAfter: rl.retryAfter }, { status: 429 });

  try {
    const { amount } = await req.json();
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    if (amount > 10000) return NextResponse.json({ error: "Max deposit is $10,000" }, { status: 400 });
    
    const result = await depositFunds(session.user, amount);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
