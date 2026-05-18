import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateUpgrade } from "@/lib/upgrade-engine";
import { upgradeCalculateSchema } from "@/lib/validators";
import { checkRateLimit, getIdentifier } from "@/lib/rate-limit";

/**
 * POST /api/upgrade/calculate
 * Preview upgrade chance without executing
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const limit = checkRateLimit(getIdentifier(request, session.user.id), "upgrade");
    if (limit.limited) {
      return NextResponse.json({ error: "Rate limited", retryAfter: limit.retryAfter }, { status: 429 });
    }

    const body = await request.json();
    const parsed = upgradeCalculateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { inputItemId, targetItemId } = parsed.data;

    // Get platform settings
    const useMock = !process.env.DATABASE_URL;
    let houseEdge = 0.10;
    let maxMultiplier = 10;

    if (!useMock) {
      const [edgeSetting, multSetting] = await Promise.all([
        prisma.platformSetting.findUnique({ where: { key: "houseEdge" } }),
        prisma.platformSetting.findUnique({ where: { key: "maxMultiplier" } }),
      ]);
      if (edgeSetting) houseEdge = Number(edgeSetting.value);
      if (multSetting) maxMultiplier = Number(multSetting.value);
    }

    // Get item values (from inventory or skins)
    let inputValue = 0;
    let targetValue = 0;

    if (useMock) {
      const { mockInventory, mockSkins } = await import("@/lib/data/mock-store");
      const invItem = mockInventory.find((i) => i.id === inputItemId && i.userId === session.user.id);
      if (invItem) inputValue = invItem.currentValue;
      const targetSkin = mockSkins.find((s) => s.id === targetItemId);
      if (targetSkin) targetValue = targetSkin.price;
    } else {
      const invItem = await prisma.inventoryItem.findFirst({
        where: { id: inputItemId, userId: session.user.id },
        include: { skin: true },
      });
      if (invItem) inputValue = Number(invItem.currentValue);

      const targetSkin = await prisma.skin.findUnique({ where: { id: targetItemId } });
      if (targetSkin) targetValue = Number(targetSkin.price);
    }

    if (inputValue <= 0 || targetValue <= 0) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    const calculation = calculateUpgrade({
      itemAValue: inputValue,
      itemBValue: targetValue,
      houseEdge,
      maxMultiplier,
    });

    return NextResponse.json(calculation);
  } catch (error) {
    console.error("Upgrade calculate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
