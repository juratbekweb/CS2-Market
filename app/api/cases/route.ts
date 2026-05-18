import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { mockCases } from "@/lib/data/mock-cases";

/**
 * GET /api/cases
 * List all active cases
 */
export async function GET() {
  try {
    const useMock = !process.env.DATABASE_URL;

    if (useMock) {
      return NextResponse.json({ cases: mockCases });
    }

    const cases = await prisma.case.findMany({
      where: { isActive: true },
      include: {
        items: { include: { skin: true }, orderBy: { dropRate: "asc" } },
        _count: { select: { openings: true } },
      },
      orderBy: { price: "asc" },
    });

    return NextResponse.json({
      cases: cases.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        price: Number(c.price),
        image: c.image,
        isActive: c.isActive,
        itemCount: c.items.length,
        totalOpened: c._count.openings,
        bestDrop: c.items.length > 0
          ? c.items.reduce((best, item) => (Number(item.skin.price) > Number(best.skin.price) ? item : best)).skin.name
          : null,
        bestDropValue: c.items.length > 0
          ? Number(c.items.reduce((best, item) => (Number(item.skin.price) > Number(best.skin.price) ? item : best)).skin.price)
          : 0,
      })),
    });
  } catch (error) {
    console.error("List cases error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
