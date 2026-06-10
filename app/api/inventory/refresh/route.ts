import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { fetchSteamInventory } from "@/lib/steam";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.steamId) {
    return NextResponse.json({ error: "Steam account not connected" }, { status: 400 });
  }

  try {
    const steamInventory = await fetchSteamInventory(user.steamId);
    
    const inventoryItems = [];
    
    for (const item of steamInventory) {
      if (!item.name) continue;
      
      // Find skin by name
      let skin = await prisma.skin.findFirst({ where: { name: item.name } });
      
      if (!skin) {
        // Create skin on the fly if it doesn't exist
        skin = await prisma.skin.create({
          data: {
            slug: item.marketName?.toLowerCase().replace(/[^a-z0-9]/g, "-") || `skin-${Date.now()}`,
            name: item.name,
            category: item.type || "Other",
            rarity: item.rarity || "Consumer Grade",
            exterior: item.exterior || "Not Painted",
            wear: 0.0,
            price: 0.0, 
            image: item.image || "",
            finishStyle: "Solid Color",
            description: "Automatically created from Steam inventory",
            collection: "Steam",
            liquidityScore: 50,
          },
        }).catch(() => null); // Ignore errors if slug duplicates
        
        if (!skin) {
          // Retry finding if creation failed (maybe created by parallel loop)
          skin = await prisma.skin.findFirst({ where: { name: item.name } });
        }
      }
      
      if (skin) {
        inventoryItems.push({
          userId: user.id,
          skinId: skin.id,
          acquisition: skin.price,
          currentValue: skin.price,
        });
      }
    }
    
    if (inventoryItems.length > 0) {
      await prisma.$transaction([
        // Clear old inventory items that are not listed
        prisma.inventoryItem.deleteMany({ where: { userId: user.id, isListed: false } }),
        // Create new ones
        prisma.inventoryItem.createMany({ data: inventoryItems }),
      ]);
    }

    return NextResponse.json({ success: true, count: inventoryItems.length });
  } catch (error) {
    console.error("Failed to refresh inventory:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
