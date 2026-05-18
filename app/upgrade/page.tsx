import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import UpgradePageClient from "./upgrade-client";

export const metadata = {
  title: "Upgrade | NightMarket",
  description: "Upgrade your skins",
};

export default async function UpgradePage() {
  const session = await auth();

  type InventoryItem = { id: string; skinId: string; currentValue: number; skin: { id: string; name: string; image: string; rarity: string; category: string; exterior: string } | null };
  type TargetSkin = { id: string; name: string; image: string; price: number; rarity: string; category: string };
  type HistoryItem = { id: number | string; user: string; roll: number; input: { name: string; image: string; price: number }; target: { name: string; image: string; price: number }; chance: string; status: string };

  let inventoryItems: InventoryItem[] = [];
  let targetSkins: TargetSkin[] = [];
  let formattedHistory: HistoryItem[] = [];

  const useMock = !process.env.DATABASE_URL;

  if (useMock) {
    const { mockInventory, mockSkins } = await import("@/lib/data/mock-store");
    
    if (session?.user) {
      const userInv = mockInventory.filter(i => i.userId === session.user?.id && !i.isListed);
      inventoryItems = userInv.map(item => {
        const skin = mockSkins.find(s => s.id === item.skinId);
        return {
          id: item.id,
          skinId: item.skinId,
          currentValue: Number(item.currentValue),
          skin: skin ? {
            id: skin.id,
            name: skin.name,
            image: skin.image,
            rarity: skin.rarity,
            category: skin.category,
            exterior: skin.exterior,
          } : null
        };
      }).filter(i => i.skin !== null);
    }
    
    targetSkins = mockSkins.map(skin => ({
      id: skin.id,
      name: skin.name,
      image: skin.image,
      price: Number(skin.price),
      rarity: skin.rarity,
      category: skin.category,
    })).sort((a, b) => b.price - a.price);

    // Mock history
    formattedHistory = [
      { id: 1, user: "LCDreamer", roll: 0.02, input: { name: "AK-47 | Redline", image: "/skins/ak-47-redline.png", price: 45 }, target: { name: "Karambit | Fade", image: "/skins/karambit-fade.png", price: 2499 }, chance: "1.8", status: "win" },
      { id: 2, user: "Alex202", roll: 0.09, input: { name: "Sport Gloves | Vice", image: "/skins/sport-gloves-vice.webp", price: 782 }, target: { name: "Sport Gloves | Pandora's Box", image: "/skins/sport-gloves-pandoras-box.webp", price: 1250 }, chance: "62.5", status: "win" },
    ];
  } else {
    // DB Mode
    if (session?.user) {
      const rawInv = await prisma.inventoryItem.findMany({
        where: { userId: session.user.id, isListed: false },
        include: { skin: true },
      });
      
      inventoryItems = rawInv.map(item => ({
        id: item.id,
        skinId: item.skinId,
        currentValue: Number(item.currentValue),
        skin: {
          id: item.skin.id,
          name: item.skin.name,
          image: item.skin.image,
          rarity: item.skin.rarity,
          category: item.skin.category,
          exterior: item.skin.exterior,
        }
      }));
    }

    const allSkins = await prisma.skin.findMany({
      orderBy: { price: 'desc' }
    });
    
    targetSkins = allSkins.map(skin => ({
      id: skin.id,
      name: skin.name,
      image: skin.image,
      price: Number(skin.price),
      rarity: skin.rarity,
      category: skin.category,
    }));

    const recentUpgrades = await prisma.upgrade.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, image: true } }
      }
    });
    
    formattedHistory = await Promise.all(recentUpgrades.map(async (u) => {
      const inputSkin = await prisma.skin.findUnique({ where: { id: u.inputItemId } });
      const targetSkin = await prisma.skin.findUnique({ where: { id: u.targetItemId } });
      
      return {
        id: u.id,
        user: u.user?.name || "Anonymous",
        roll: u.rollValue,
        chance: (u.chance * 100).toFixed(1),
        status: u.result.toLowerCase(),
        input: {
          name: inputSkin?.name || "Unknown",
          image: inputSkin?.image || "/skins/placeholder.png",
          price: Number(u.inputValue)
        },
        target: {
          name: targetSkin?.name || "Unknown",
          image: targetSkin?.image || "/skins/placeholder.png",
          price: Number(u.targetValue)
        }
      };
    }));
  }

  return (
    <UpgradePageClient 
      initialInventory={inventoryItems as any} 
      initialTargets={targetSkins as any}
      initialHistory={formattedHistory as any}
    />
  );
}
