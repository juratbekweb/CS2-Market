import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getMarketplaceData } from "@/lib/store";

export async function GET() {
  const session = await auth();
  const listings = await getMarketplaceData(session?.user);
  return NextResponse.json({ listings }, { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } });
}
