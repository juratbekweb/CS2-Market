import { ListingStatus, Role, TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  mockBalanceTrend,
  mockFavorites,
  mockInventory,
  mockListings,
  mockNotifications,
  mockPriceHistory,
  mockSkins,
  mockTransactions,
  mockUsers,
  platformSettings,
} from "@/lib/data/mock-store";
import { currency } from "@/lib/utils";

const useMock = !process.env.DATABASE_URL;

type SessionUser = {
  email?: string | null;
  role?: Role;
};

export async function getCommissionRate() {
  if (useMock) return platformSettings.commissionRate;
  const setting = await prisma.platformSetting.findUnique({ where: { key: "commissionRate" } });
  return setting ? Number(setting.value) : 0.08;
}

export async function getCurrentUserByEmail(email?: string | null) {
  if (!email) return null;

  if (useMock) {
    return mockUsers.find((user) => user.email === email) ?? null;
  }

  return prisma.user.findUnique({ where: { email } });
}

export async function getMarketplaceData(sessionUser?: SessionUser) {
  const viewer = await getCurrentUserByEmail(sessionUser?.email);

  if (useMock) {
    const favorites = new Set(
      viewer ? mockFavorites.filter((item) => item.userId === viewer.id).map((item) => item.skinId) : [],
    );

    return mockListings
      .filter((listing) => listing.status === "ACTIVE")
      .map((listing) => {
        const skin = mockSkins.find((item) => item.slug === listing.skinSlug)!;
        const seller = mockUsers.find((user) => user.id === listing.sellerId)!;
        return {
          id: listing.id,
          askPrice: listing.askPrice,
          createdAt: listing.createdAt.toISOString(),
          sellerName: seller.name,
          sellerSteamConnected: Boolean(seller.steamId),
          status: listing.status,
          skin: {
            ...skin,
            favorite: favorites.has(skin.id),
          },
        };
      });
  }

  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    include: { seller: true, skin: true },
    orderBy: { createdAt: "desc" },
  });

  const favoriteIds = viewer
    ? new Set((await prisma.favorite.findMany({ where: { userId: viewer.id } })).map((item) => item.skinId))
    : new Set<string>();

  return listings.map((listing) => ({
    id: listing.id,
    askPrice: Number(listing.askPrice),
    createdAt: listing.createdAt.toISOString(),
    sellerName: listing.seller.name ?? "Seller",
    sellerSteamConnected: Boolean(listing.seller.steamId),
    status: listing.status,
    skin: {
      id: listing.skin.id,
      slug: listing.skin.slug,
      name: listing.skin.name,
      category: listing.skin.category,
      rarity: listing.skin.rarity,
      exterior: listing.skin.exterior,
      wear: listing.skin.wear,
      price: Number(listing.skin.price),
      image: listing.skin.image,
      finishStyle: listing.skin.finishStyle,
      description: listing.skin.description,
      collection: listing.skin.collection,
      liquidityScore: listing.skin.liquidityScore,
      favorite: favoriteIds.has(listing.skin.id),
    },
  }));
}

export async function getSkinBySlug(slug: string, sessionUser?: SessionUser) {
  const viewer = await getCurrentUserByEmail(sessionUser?.email);

  if (useMock) {
    const skin = mockSkins.find((item) => item.slug === slug);
    if (!skin) return null;

    const favorite = Boolean(viewer && mockFavorites.find((item) => item.userId === viewer.id && item.skinId === skin.id));
    const activeListing = mockListings
      .filter((listing) => listing.skinSlug === slug && listing.status === "ACTIVE")
      .sort((a, b) => a.askPrice - b.askPrice)[0];

    return {
      ...skin,
      favorite,
      activeListingId: activeListing?.id ?? null,
      activeAskPrice: activeListing?.askPrice ?? skin.price,
      history: mockPriceHistory[slug] ?? [],
      related: mockSkins.filter((item) => item.slug !== slug).slice(0, 4),
    };
  }

  const skin = await prisma.skin.findUnique({
    where: { slug },
    include: { pricePoints: { orderBy: { date: "asc" } } },
  });

  if (!skin) return null;

  const favorite = viewer
    ? Boolean(await prisma.favorite.findFirst({ where: { userId: viewer.id, skinId: skin.id } }))
    : false;
  const activeListing = await prisma.listing.findFirst({
    where: { skinId: skin.id, status: "ACTIVE" },
    orderBy: { askPrice: "asc" },
  });
  const related = await prisma.skin.findMany({
    where: { category: skin.category, id: { not: skin.id } },
    take: 4,
  });

  return {
    id: skin.id,
    slug: skin.slug,
    name: skin.name,
    category: skin.category,
    rarity: skin.rarity,
    exterior: skin.exterior,
    wear: skin.wear,
    price: Number(skin.price),
    image: skin.image,
    finishStyle: skin.finishStyle,
    description: skin.description,
    collection: skin.collection,
    liquidityScore: skin.liquidityScore,
    favorite,
    activeListingId: activeListing?.id ?? null,
    activeAskPrice: activeListing ? Number(activeListing.askPrice) : Number(skin.price),
    history: skin.pricePoints.map((point) => ({
      date: point.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Number(point.value),
    })),
    related: related.map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      category: item.category,
      rarity: item.rarity,
      exterior: item.exterior,
      wear: item.wear,
      price: Number(item.price),
      image: item.image,
      finishStyle: item.finishStyle,
      description: item.description,
      collection: item.collection,
      liquidityScore: item.liquidityScore,
    })),
  };
}

export async function getDashboardSnapshot(sessionUser?: SessionUser) {
  const user = await getCurrentUserByEmail(sessionUser?.email);
  if (!user) return null;

  if (useMock) {
    const inventory = mockInventory.filter((item) => item.userId === user.id);
    const watchlist = mockFavorites.filter((item) => item.userId === user.id).length;
    const realized = mockTransactions
      .filter((item) => item.userId === user.id && item.type === "SALE")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return {
      user,
      kpis: [
        { label: "Wallet balance", value: currency(Number(user.balance)), helper: "Instant purchasing power" },
        { label: "Portfolio value", value: currency(inventory.reduce((sum, item) => sum + item.currentValue, 0)), helper: "Marked to active bids" },
        { label: "Realized profit", value: currency(Number(user.totalProfit)), helper: `${watchlist} items on watchlist` },
        { label: "Trade volume", value: currency(realized), helper: "30-day completed sales" },
      ],
      notifications: mockNotifications.filter((item) => item.userId === user.id),
      transactions: mockTransactions.filter((item) => item.userId === user.id),
      balanceTrend: mockBalanceTrend,
    };
  }

  const [inventory, notifications, transactions] = await Promise.all([
    prisma.inventoryItem.findMany({ where: { userId: user.id } }),
    prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.transaction.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  return {
    user,
    kpis: [
      { label: "Wallet balance", value: currency(Number(user.balance)), helper: "Instant purchasing power" },
      { label: "Portfolio value", value: currency(inventory.reduce((sum, item) => sum + Number(item.currentValue), 0)), helper: "Marked to market" },
      { label: "Realized profit", value: currency(Number(user.totalProfit)), helper: `${notifications.length} fresh notifications` },
      { label: "Trade count", value: String(transactions.length), helper: "Recent transaction log" },
    ],
    notifications,
    transactions: transactions.map((item) => ({ ...item, amount: Number(item.amount) })),
    balanceTrend: [],
  };
}

export async function getInventorySnapshot(sessionUser?: SessionUser) {
  const user = await getCurrentUserByEmail(sessionUser?.email);
  if (!user) return null;

  if (useMock) {
    return mockInventory
      .filter((item) => item.userId === user.id)
      .map((item) => ({
        ...item,
        skin: mockSkins.find((skin) => skin.id === item.skinId)!,
        pnl: item.currentValue - item.acquisition,
      }));
  }

  const inventory = await prisma.inventoryItem.findMany({
    where: { userId: user.id },
    include: { skin: true },
    orderBy: { createdAt: "desc" },
  });

  return inventory.map((item) => ({
    ...item,
    acquisition: Number(item.acquisition),
    currentValue: Number(item.currentValue),
    pnl: Number(item.currentValue) - Number(item.acquisition),
  }));
}

export async function getWalletSnapshot(sessionUser?: SessionUser) {
  const user = await getCurrentUserByEmail(sessionUser?.email);
  if (!user) return null;

  if (useMock) {
    return {
      user,
      transactions: mockTransactions.filter((item) => item.userId === user.id),
      trend: mockBalanceTrend,
    };
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return {
    user,
    transactions: transactions.map((item) => ({ ...item, amount: Number(item.amount) })),
    trend: [],
  };
}

export async function getAdminSnapshot() {
  if (useMock) {
    return {
      users: mockUsers,
      listings: mockListings,
      transactions: mockTransactions,
      commissionRate: platformSettings.commissionRate,
    };
  }

  const [users, listings, transactions, commissionRate] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.listing.findMany({ include: { skin: true, seller: true }, orderBy: { createdAt: "desc" } }),
    prisma.transaction.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    getCommissionRate(),
  ]);

  return { users, listings, transactions, commissionRate };
}

export async function toggleFavorite(sessionUser: SessionUser, skinId: string) {
  const user = await getCurrentUserByEmail(sessionUser.email);
  if (!user) throw new Error("Authentication required");

  if (useMock) {
    const existing = mockFavorites.find((item) => item.userId === user.id && item.skinId === skinId);
    if (existing) {
      mockFavorites.splice(mockFavorites.indexOf(existing), 1);
      return { favorite: false };
    }

    mockFavorites.push({ userId: user.id, skinId });
    return { favorite: true };
  }

  const existing = await prisma.favorite.findFirst({ where: { userId: user.id, skinId } });
  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { favorite: false };
  }

  await prisma.favorite.create({ data: { userId: user.id, skinId } });
  return { favorite: true };
}

export async function depositFunds(sessionUser: SessionUser, amount: number) {
  const user = await getCurrentUserByEmail(sessionUser.email);
  if (!user) throw new Error("Authentication required");
  if (amount <= 0) throw new Error("Amount must be positive");

  if (useMock) {
    const mockUser = user as (typeof mockUsers)[number];
    mockUser.balance += amount;
    mockTransactions.unshift({
      id: `txn-${Date.now()}`,
      userId: mockUser.id,
      type: "DEPOSIT",
      amount,
      description: "Mock deposit",
      createdAt: new Date(),
    });
    mockBalanceTrend.push({
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: mockUser.balance,
    });
    return { balance: mockUser.balance };
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      balance: { increment: amount },
      transactions: {
        create: { amount, type: TransactionType.DEPOSIT, description: "Wallet deposit" },
      },
    },
  });

  return { balance: Number(updated.balance) };
}

export async function withdrawFunds(sessionUser: SessionUser, amount: number) {
  const user = await getCurrentUserByEmail(sessionUser.email);
  if (!user) throw new Error("Authentication required");
  if (amount <= 0) throw new Error("Amount must be positive");
  if (Number(user.balance) < amount) throw new Error("Insufficient balance");

  if (useMock) {
    const mockUser = user as (typeof mockUsers)[number];
    mockUser.balance -= amount;
    mockTransactions.unshift({
      id: `txn-${Date.now()}`,
      userId: mockUser.id,
      type: "WITHDRAWAL",
      amount: -amount,
      description: "Mock withdrawal",
      createdAt: new Date(),
    });
    return { balance: mockUser.balance };
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      balance: { decrement: amount },
      transactions: {
        create: { amount: -amount, type: TransactionType.WITHDRAWAL, description: "Wallet withdrawal" },
      },
    },
  });

  return { balance: Number(updated.balance) };
}

export async function buyListing(sessionUser: SessionUser, listingId: string) {
  const user = await getCurrentUserByEmail(sessionUser.email);
  if (!user) throw new Error("Authentication required");
  if (!user.steamId) throw new Error("Connect Steam before trading");

  const commissionRate = await getCommissionRate();

  if (useMock) {
    const mockUser = user as (typeof mockUsers)[number];
    const listing = mockListings.find((item) => item.id === listingId && item.status === "ACTIVE");
    if (!listing) throw new Error("Listing unavailable");
    if (mockUser.balance < listing.askPrice) throw new Error("Insufficient wallet balance");

    const seller = mockUsers.find((item) => item.id === listing.sellerId)!;
    const skin = mockSkins.find((item) => item.slug === listing.skinSlug)!;
    const commission = Number((listing.askPrice * commissionRate).toFixed(2));

    mockUser.balance -= listing.askPrice;
    seller.balance += listing.askPrice - commission;
    listing.status = "SOLD";

    mockInventory.unshift({
      id: `inv-${Date.now()}`,
      userId: mockUser.id,
      skinId: skin.id,
      acquisition: listing.askPrice,
      currentValue: skin.price,
      isListed: false,
      createdAt: new Date(),
    });

    mockTransactions.unshift(
      {
        id: `txn-${Date.now()}-buyer`,
        userId: mockUser.id,
        type: "PURCHASE",
        amount: -listing.askPrice,
        description: `Bought ${skin.name}`,
        createdAt: new Date(),
      },
      {
        id: `txn-${Date.now()}-seller`,
        userId: seller.id,
        type: "SALE",
        amount: listing.askPrice - commission,
        description: `Sold ${skin.name}`,
        createdAt: new Date(),
      },
    );

    return { balance: mockUser.balance };
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { skin: true, seller: true },
  });

  if (!listing || listing.status !== ListingStatus.ACTIVE) throw new Error("Listing unavailable");
  if (Number(user.balance) < Number(listing.askPrice)) throw new Error("Insufficient wallet balance");

  const commission = Number(listing.askPrice) * commissionRate;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        balance: { decrement: listing.askPrice },
        transactions: {
          create: {
            type: TransactionType.PURCHASE,
            amount: -Number(listing.askPrice),
            description: `Bought ${listing.skin.name}`,
          },
        },
        inventoryItems: {
          create: {
            skinId: listing.skinId,
            acquisition: listing.askPrice,
            currentValue: listing.skin.price,
          },
        },
      },
    }),
    prisma.user.update({
      where: { id: listing.sellerId },
      data: {
        balance: { increment: Number(listing.askPrice) - commission },
        totalProfit: { increment: Number(listing.askPrice) - commission },
        transactions: {
          createMany: {
            data: [
              {
                type: TransactionType.SALE,
                amount: Number(listing.askPrice) - commission,
                description: `Sold ${listing.skin.name}`,
              },
              {
                type: TransactionType.COMMISSION,
                amount: -commission,
                description: `Commission charged on ${listing.skin.name}`,
              },
            ],
          },
        },
      },
    }),
    prisma.listing.update({
      where: { id: listing.id },
      data: { status: ListingStatus.SOLD, soldAt: new Date() },
    }),
  ]);

  return { ok: true };
}

export async function createListing(sessionUser: SessionUser, skinId: string, askPrice: number) {
  const user = await getCurrentUserByEmail(sessionUser.email);
  if (!user) throw new Error("Authentication required");
  if (!user.steamId) throw new Error("Connect Steam before trading");

  if (useMock) {
    const inventoryItem = mockInventory.find((item) => item.userId === user.id && item.skinId === skinId && !item.isListed);
    if (!inventoryItem) throw new Error("Skin not found in inventory");
    const skin = mockSkins.find((item) => item.id === skinId)!;
    inventoryItem.isListed = true;
    mockListings.unshift({
      id: `listing-${Date.now()}`,
      sellerId: user.id,
      skinSlug: skin.slug,
      askPrice,
      status: "ACTIVE",
      createdAt: new Date(),
    });
    return { ok: true };
  }

  const inventoryItem = await prisma.inventoryItem.findFirst({ where: { userId: user.id, skinId, isListed: false } });
  if (!inventoryItem) throw new Error("Skin not found in inventory");

  await prisma.$transaction([
    prisma.inventoryItem.update({
      where: { id: inventoryItem.id },
      data: { isListed: true },
    }),
    prisma.listing.create({
      data: {
        sellerId: user.id,
        skinId,
        askPrice,
      },
    }),
  ]);

  return { ok: true };
}

export async function updateCommissionRate(value: number) {
  if (useMock) {
    platformSettings.commissionRate = value;
    return { value };
  }

  await prisma.platformSetting.upsert({
    where: { key: "commissionRate" },
    update: { value: String(value) },
    create: { key: "commissionRate", value: String(value) },
  });

  return { value };
}

export async function toggleUserBlock(userId: string) {
  if (useMock) {
    const user = mockUsers.find((item) => item.id === userId);
    if (!user) throw new Error("User not found");
    user.isBlocked = !user.isBlocked;
    return { blocked: user.isBlocked };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isBlocked: !user.isBlocked },
  });

  return { blocked: updated.isBlocked };
}
