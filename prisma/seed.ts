import { PrismaClient } from "@prisma/client";
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

const prisma = new PrismaClient();

async function main() {
  await prisma.favorite.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.listing.deleteMany();

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
        type: transaction.type,
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
