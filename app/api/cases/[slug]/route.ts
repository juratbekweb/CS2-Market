import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CaseItemDrop } from "@/lib/case-engine";

import { mockCaseItemsData } from "@/lib/data/mock-cases";

// Map mockCaseItemsData to the format expected by the frontend
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

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const useMock = !process.env.DATABASE_URL;

    if (useMock) {
      const items = mockCaseItems[slug];
      if (!items) {
        return NextResponse.json({ error: "Case not found" }, { status: 404 });
      }
      return NextResponse.json({ items });
    }

    const caseData = await prisma.case.findUnique({
      where: { slug },
      include: { items: { include: { skin: true } } },
    });

    if (!caseData || !caseData.isActive) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const items: CaseItemDrop[] = caseData.items.map((item) => ({
      id: item.id,
      skinId: item.skinId,
      name: item.skin.name,
      image: item.skin.image,
      rarity: item.rarity as CaseItemDrop["rarity"],
      dropRate: item.dropRate,
      value: Number(item.skin.price),
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Get case items error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
