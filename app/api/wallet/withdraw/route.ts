import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { withdrawFunds } from "@/lib/store";

const schema = z.object({ amount: z.number().positive() });

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  try {
    const { amount } = schema.parse(await request.json());
    const result = await withdrawFunds(session.user, amount);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Withdrawal failed" }, { status: 400 });
  }
}
