import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateServerSeed, hashServerSeed, generateRoll } from "@/lib/provably-fair";
import { selectDrop, type CaseItemDrop, generateSpinnerReel } from "@/lib/case-engine";
import { caseOpenSchema } from "@/lib/validators";
import { checkRateLimit, getIdentifier } from "@/lib/rate-limit";

import { mockCaseItemsData } from "@/lib/data/mock-cases";

// Map mockCaseItemsData to the format expected by selectDrop
const mockCaseItems: Record<string, CaseItemDrop[]> = {};
for (const [slug, items] of Object.entries(mockCaseItemsData)) {
  mockCaseItems[slug] = items.map((item) => ({
    id: `ci-${item.skinId}`,
    skinId: item.skinId,
    name: item.name,
    image: item.image,
    rarity: item.rarity as CaseItemDrop["rarity"],
    dropRate: item.dropRate,
    value: item.price,
  }));
}

/**
 * POST /api/cases/open
 * Open a case with provably fair outcome
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const limit = checkRateLimit(getIdentifier(request, session.user.id), "caseOpen");
    if (limit.limited) {
      return NextResponse.json({ error: "Rate limited", retryAfter: limit.retryAfter }, { status: 429 });
    }

    const body = await request.json();
    const parsed = caseOpenSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { caseSlug, clientSeed } = parsed.data;
    const useMock = !process.env.DATABASE_URL;

    // Generate provably fair roll
    const serverSeed = generateServerSeed();
    const serverSeedHash = hashServerSeed(serverSeed);
    const nonce = Date.now();
    const roll = generateRoll(serverSeed, clientSeed, nonce);

    if (useMock) {
      // Mock mode
      const items = mockCaseItems[caseSlug];
      if (!items) {
        return NextResponse.json({ error: "Case not found" }, { status: 404 });
      }

      const casePrice = caseSlug === "phantom-collection" ? 4.99
        : caseSlug === "neon-rush" ? 2.49
        : caseSlug === "dragon-lore" ? 9.99
        : 0.99;

      // Check balance
      const { mockUsers, mockTransactions } = await import("@/lib/data/mock-store");
      const mockUser = mockUsers.find((u) => u.id === session.user.id);
      if (!mockUser || mockUser.balance < casePrice) {
        return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
      }

      // Select winning item
      const wonItem = selectDrop(items, roll);

      // Deduct balance
      mockUser.balance -= casePrice;

      // Add to inventory
      const { mockInventory } = await import("@/lib/data/mock-store");
      mockInventory.unshift({
        id: `inv-${Date.now()}`,
        userId: session.user.id,
        skinId: wonItem.skinId,
        acquisition: wonItem.value,
        currentValue: wonItem.value,
        isListed: false,
        createdAt: new Date(),
      });

      mockTransactions.unshift({
        id: `txn-case-${Date.now()}`,
        userId: session.user.id,
        type: "CASE_OPEN",
        amount: -casePrice,
        description: `Opened ${caseSlug}`,
        createdAt: new Date(),
      });

      if (wonItem.value > 0) {
        mockTransactions.unshift({
          id: `txn-case-win-${Date.now()}`,
          userId: session.user.id,
          type: "CASE_WIN",
          amount: wonItem.value,
          description: `Won ${wonItem.name}`,
          createdAt: new Date(),
        });
      }

      // Generate spinner reel
      const reel = generateSpinnerReel(items, wonItem);

      return NextResponse.json({
        won: wonItem,
        reel,
        roll,
        serverSeedHash,
        serverSeed,
        clientSeed,
        nonce,
        newBalance: mockUser.balance,
      });
    }

    // Database mode
    const caseData = await prisma.case.findUnique({
      where: { slug: caseSlug },
      include: { items: { include: { skin: true } } },
    });

    if (!caseData || !caseData.isActive) {
      return NextResponse.json({ error: "Case not found or inactive" }, { status: 404 });
    }

    // Check user balance
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || Number(user.balance) < Number(caseData.price)) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Map to CaseItemDrop
    const items: CaseItemDrop[] = caseData.items.map((item) => ({
      id: item.id,
      skinId: item.skinId,
      name: item.skin.name,
      image: item.skin.image,
      rarity: item.rarity as CaseItemDrop["rarity"],
      dropRate: item.dropRate,
      value: Number(item.skin.price),
    }));

    // Select winning item
    const wonItem = selectDrop(items, roll);
    const casePrice = Number(caseData.price);

    // Atomic transaction
    await prisma.$transaction([
      // Deduct case price
      prisma.user.update({
        where: { id: session.user.id },
        data: { balance: { decrement: casePrice } },
      }),
      // Add won skin to inventory
      prisma.inventoryItem.create({
        data: {
          userId: session.user.id,
          skinId: wonItem.skinId,
          acquisition: wonItem.value,
          currentValue: wonItem.value,
        },
      }),
      // Record case opening
      prisma.caseOpening.create({
        data: {
          userId: session.user.id,
          caseId: caseData.id,
          wonSkinId: wonItem.skinId,
          wonValue: wonItem.value,
          serverSeed,
          clientSeed,
          nonce,
          rollValue: roll,
        },
      }),
      // Record transactions
      prisma.transaction.create({
        data: {
          userId: session.user.id,
          type: "CASE_OPEN",
          amount: -casePrice,
          description: `Opened ${caseData.name}`,
        },
      }),
      prisma.transaction.create({
        data: {
          userId: session.user.id,
          type: "CASE_WIN",
          amount: wonItem.value,
          description: `Won ${wonItem.name} from ${caseData.name}`,
        },
      }),
    ]);

    const updatedUser = await prisma.user.findUnique({ where: { id: session.user.id } });

    // Generate spinner reel
    const reel = generateSpinnerReel(items, wonItem);

    return NextResponse.json({
      won: wonItem,
      reel,
      roll,
      serverSeedHash,
      serverSeed,
      clientSeed,
      nonce,
      newBalance: updatedUser ? Number(updatedUser.balance) : 0,
    });
  } catch (error) {
    console.error("Case open error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
