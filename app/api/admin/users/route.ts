import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { toggleUserBlock } from "@/lib/store";

const schema = z.object({
  userId: z.string().min(1),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const { userId } = schema.parse(await request.json());
    const result = await toggleUserBlock(userId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "User update failed" }, { status: 400 });
  }
}
