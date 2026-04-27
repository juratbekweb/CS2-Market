import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { buyListing, createListing, getMarketplaceData } from "@/lib/store";

const buySchema = z.object({
  action: z.literal("BUY"),
  listingId: z.string().min(1),
});

const sellSchema = z.object({
  action: z.literal("SELL"),
  skinId: z.string().min(1),
  askPrice: z.number().positive(),
});

export async function GET() {
  const session = await auth();
  const listings = await getMarketplaceData(session?.user);
  return NextResponse.json({ listings });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const body = await request.json();

  try {
    if (body.action === "BUY") {
      const payload = buySchema.parse(body);
      const result = await buyListing(session.user, payload.listingId);
      return NextResponse.json(result);
    }

    if (body.action === "SELL") {
      const payload = sellSchema.parse(body);
      const result = await createListing(session.user, payload.skinId, payload.askPrice);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Listing request failed" }, { status: 400 });
  }
}
