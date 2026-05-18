import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateServerSeed, hashServerSeed, generateRoll } from "@/lib/provably-fair";
import { calculateUpgrade, executeUpgrade } from "@/lib/upgrade-engine";
import { upgradeExecuteSchema } from "@/lib/validators";
import { checkRateLimit, getIdentifier } from "@/lib/rate-limit";

/**
 * POST /api/upgrade/execute
 * Execute an upgrade with provably fair outcome
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
    const parsed = upgradeExecuteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { inputItemId, targetItemId, clientSeed } = parsed.data;
    const useMock = !process.env.DATABASE_URL;

    // Get platform settings
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

    // Get item data
    let inputValue = 0;
    let targetValue = 0;
    let inputSkinName = "";
    let targetSkinName = "";
    let targetSkinId = "";

    if (useMock) {
      const { mockInventory, mockSkins } = await import("@/lib/data/mock-store");
      const invItem = mockInventory.find((i) => i.id === inputItemId && i.userId === session.user.id && !i.isListed);
      if (!invItem) {
        return NextResponse.json({ error: "Item not found in inventory" }, { status: 400 });
      }
      const inputSkin = mockSkins.find((s) => s.id === invItem.skinId);
      inputValue = invItem.currentValue;
      inputSkinName = inputSkin?.name ?? "Unknown";

      const targetSkin = mockSkins.find((s) => s.id === targetItemId);
      if (!targetSkin) {
        return NextResponse.json({ error: "Target item not found" }, { status: 400 });
      }
      targetValue = targetSkin.price;
      targetSkinName = targetSkin.name;
      targetSkinId = targetSkin.id;
    } else {
      const invItem = await prisma.inventoryItem.findFirst({
        where: { id: inputItemId, userId: session.user.id, isListed: false },
        include: { skin: true },
      });
      if (!invItem) {
        return NextResponse.json({ error: "Item not found in inventory" }, { status: 400 });
      }
      inputValue = Number(invItem.currentValue);
      inputSkinName = invItem.skin.name;

      const targetSkin = await prisma.skin.findUnique({ where: { id: targetItemId } });
      if (!targetSkin) {
        return NextResponse.json({ error: "Target item not found" }, { status: 400 });
      }
      targetValue = Number(targetSkin.price);
      targetSkinName = targetSkin.name;
      targetSkinId = targetSkin.id;
    }

    // Calculate chance
    const calculation = calculateUpgrade({ itemAValue: inputValue, itemBValue: targetValue, houseEdge, maxMultiplier });
    if (!calculation.isValid) {
      return NextResponse.json({ error: "Invalid upgrade: multiplier too high or values invalid" }, { status: 400 });
    }

    // Generate provably fair roll
    const serverSeed = generateServerSeed();
    const serverSeedHash = hashServerSeed(serverSeed);
    const nonce = Date.now();
    const roll = generateRoll(serverSeed, clientSeed, nonce);

    // Determine outcome
    const won = executeUpgrade(calculation.chance, roll);

    if (useMock) {
      // Mock mode: manipulate in-memory data
      const { mockInventory, mockTransactions } = await import("@/lib/data/mock-store");

      if (won) {
        // Remove input item, add target item
        const idx = mockInventory.findIndex((i) => i.id === inputItemId);
        if (idx >= 0) mockInventory.splice(idx, 1);
        mockInventory.unshift({
          id: `inv-upgrade-${Date.now()}`,
          userId: session.user.id,
          skinId: targetSkinId,
          acquisition: targetValue,
          currentValue: targetValue,
          isListed: false,
          createdAt: new Date(),
        });
        mockTransactions.unshift({
          id: `txn-upgrade-win-${Date.now()}`,
          userId: session.user.id,
          type: "UPGRADE_WIN",
          amount: targetValue - inputValue,
          description: `Won upgrade: ${inputSkinName} → ${targetSkinName}`,
          createdAt: new Date(),
        });
      } else {
        // Remove input item
        const idx = mockInventory.findIndex((i) => i.id === inputItemId);
        if (idx >= 0) mockInventory.splice(idx, 1);
        mockTransactions.unshift({
          id: `txn-upgrade-lose-${Date.now()}`,
          userId: session.user.id,
          type: "UPGRADE_LOSS",
          amount: -inputValue,
          description: `Lost upgrade: ${inputSkinName} → ${targetSkinName}`,
          createdAt: new Date(),
        });
      }
    } else {
      // Database mode: atomic transaction
      if (won) {
        await prisma.$transaction([
          // Remove input item from inventory
          prisma.inventoryItem.delete({ where: { id: inputItemId } }),
          // Add target item to inventory
          prisma.inventoryItem.create({
            data: {
              userId: session.user.id,
              skinId: targetSkinId,
              acquisition: targetValue,
              currentValue: targetValue,
            },
          }),
          // Record upgrade
          prisma.upgrade.create({
            data: {
              userId: session.user.id,
              inputItemId,
              inputValue,
              targetItemId: targetSkinId,
              targetValue,
              chance: calculation.chance,
              houseEdge,
              rollValue: roll,
              result: "WIN",
              serverSeed,
              clientSeed,
              nonce,
            },
          }),
          // Record transaction
          prisma.transaction.create({
            data: {
              userId: session.user.id,
              type: "UPGRADE_WIN",
              amount: targetValue - inputValue,
              description: `Won upgrade: ${inputSkinName} → ${targetSkinName}`,
              metadata: { serverSeedHash, roll, chance: calculation.chance },
            },
          }),
        ]);
      } else {
        await prisma.$transaction([
          prisma.inventoryItem.delete({ where: { id: inputItemId } }),
          prisma.upgrade.create({
            data: {
              userId: session.user.id,
              inputItemId,
              inputValue,
              targetItemId: targetSkinId,
              targetValue,
              chance: calculation.chance,
              houseEdge,
              rollValue: roll,
              result: "LOSE",
              serverSeed,
              clientSeed,
              nonce,
            },
          }),
          prisma.transaction.create({
            data: {
              userId: session.user.id,
              type: "UPGRADE_LOSS",
              amount: -inputValue,
              description: `Lost upgrade: ${inputSkinName} → ${targetSkinName}`,
              metadata: { serverSeedHash, roll, chance: calculation.chance },
            },
          }),
        ]);
      }
    }

    return NextResponse.json({
      result: won ? "WIN" : "LOSE",
      roll,
      chance: calculation.chance,
      multiplier: calculation.multiplier,
      serverSeedHash,
      serverSeed, // Reveal after the game
      clientSeed,
      nonce,
      inputItem: { id: inputItemId, name: inputSkinName, value: inputValue },
      targetItem: { id: targetSkinId, name: targetSkinName, value: targetValue },
    });
  } catch (error) {
    console.error("Upgrade execute error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
