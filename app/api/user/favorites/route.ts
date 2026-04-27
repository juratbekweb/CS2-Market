import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { toggleFavorite } from "@/lib/store";

const schema = z.object({ skinId: z.string().min(1) });

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  try {
    const { skinId } = schema.parse(await request.json());
    const result = await toggleFavorite(session.user, skinId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not update favorite" }, { status: 400 });
  }
}
