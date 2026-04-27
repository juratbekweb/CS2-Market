import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDashboardSnapshot } from "@/lib/store";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snapshot = await getDashboardSnapshot(session.user);
  return NextResponse.json({ snapshot });
}
