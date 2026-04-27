import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { updateCommissionRate } from "@/lib/store";

const schema = z.object({
  commissionRate: z.number().min(0).max(0.3),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const { commissionRate } = schema.parse(await request.json());
    const result = await updateCommissionRate(commissionRate);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not update settings" }, { status: 400 });
  }
}
