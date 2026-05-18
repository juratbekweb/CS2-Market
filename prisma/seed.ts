import { PrismaClient, TransactionType } from "@prisma/client";
import {
  mockFavorites,
  mockInventory,
  mockListings,
  mockNotifications,
  mockPriceHistory,
  mockSkins,
  mockTransactions,
  mockUsers,
  platformSettings,
} from "../lib/data/mock-store";
import { mockCases, mockCaseItemsData } from "../lib/data/mock-cases";

const prisma = new PrismaClient();

async function main() {
  await prisma.favorite.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.caseItem.deleteMany();
  await prisma.case.deleteMany();

  await prisma.platformSetting.upsert({
    where: { key: "commissionRate" },
    update: { value: String(platformSettings.commissionRate) },
    create: { key: "commissionRate", value: String(platformSettings.commissionRate) },
  });

  for (const user of mockUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        steamId: user.steamId,
        balance: user.balance,
        totalProfit: user.totalProfit,
        isBlocked: user.isBlocked,
      },
      create: user,
    });
  }

  for (const skin of mockSkins) {
    await prisma.skin.upsert({
      where: { slug: skin.slug },
      update: skin,
      create: skin,
    });
  }

  // Seed case item skins
  for (const caseData of Object.values(mockCaseItemsData)) {
    for (const item of caseData) {
      await prisma.skin.upsert({
        where: { id: item.skinId },
        update: {
          name: item.name,
          category: item.category,
          rarity: item.rarity,
          exterior: "Factory New",
          wear: 0.05,
          price: item.price,
          image: item.image,
          finishStyle: "Standard",
          description: "Case drop skin",
          collection: "Case Collection",
          liquidityScore: 50,
          slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        },
        create: {
          id: item.skinId,
          slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          name: item.name,
          category: item.category,
          rarity: item.rarity,
          exterior: "Factory New",
          wear: 0.05,
          price: item.price,
          image: item.image,
          finishStyle: "Standard",
          description: "Case drop skin",
          collection: "Case Collection",
          liquidityScore: 50,
        },
      });
    }
  }

  // Seed Cases
  for (const c of mockCases) {
    await prisma.case.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        price: c.price,
        image: c.image,
        isActive: c.isActive,
      },
      create: {
        id: c.id,
        slug: c.slug,
        name: c.name,
        price: c.price,
        image: c.image,
        isActive: c.isActive,
      },
    });

    const caseItems = mockCaseItemsData[c.slug as keyof typeof mockCaseItemsData];
    if (caseItems) {
      for (const item of caseItems) {
        await prisma.caseItem.create({
          data: {
            caseId: c.id,
            skinId: item.skinId,
            rarity: item.rarity,
            dropRate: item.dropRate,
          },
        });
      }
    }
  }

  const seller = await prisma.user.findFirstOrThrow({
    where: { email: mockUsers[1].email },
  });

  for (const listing of mockListings) {
    const skin = await prisma.skin.findUniqueOrThrow({ where: { slug: listing.skinSlug } });
    await prisma.listing.create({
      data: {
        sellerId: seller.id,
        skinId: skin.id,
        askPrice: listing.askPrice,
        status: listing.status,
        createdAt: listing.createdAt,
      },
    });
  }

  for (const favorite of mockFavorites) {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: mockUsers.find((item) => item.id === favorite.userId)?.email } });
    const skin = await prisma.skin.findUniqueOrThrow({ where: { id: favorite.skinId } }).catch(async () => {
      const source = mockSkins.find((item) => item.id === favorite.skinId)!;
      return prisma.skin.findUniqueOrThrow({ where: { slug: source.slug } });
    });
    await prisma.favorite.create({
      data: {
        userId: user.id,
        skinId: skin.id,
      },
    });
  }

  for (const item of mockInventory) {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: mockUsers.find((entry) => entry.id === item.userId)?.email } });
    const source = mockSkins.find((entry) => entry.id === item.skinId)!;
    const skin = await prisma.skin.findUniqueOrThrow({ where: { slug: source.slug } });
    await prisma.inventoryItem.create({
      data: {
        userId: user.id,
        skinId: skin.id,
        acquisition: item.acquisition,
        currentValue: item.currentValue,
        isListed: item.isListed,
        createdAt: item.createdAt,
      },
    });
  }

  for (const transaction of mockTransactions) {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: mockUsers.find((entry) => entry.id === transaction.userId)?.email } });
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: transaction.type as TransactionType,
        amount: transaction.amount,
        description: transaction.description,
        createdAt: transaction.createdAt,
      },
    });
  }

  for (const notification of mockNotifications) {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: mockUsers.find((entry) => entry.id === notification.userId)?.email } });
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: notification.title,
        body: notification.body,
        createdAt: new Date(notification.createdAt),
      },
    });
  }

  for (const [slug, points] of Object.entries(mockPriceHistory)) {
    const skin = await prisma.skin.findUnique({ where: { slug } });
    if (!skin) continue;

    await prisma.pricePoint.deleteMany({ where: { skinId: skin.id } });
    await prisma.pricePoint.createMany({
      data: points.map((point) => ({
        skinId: skin.id,
        date: new Date(point.date),
        value: point.value,
      })),
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
