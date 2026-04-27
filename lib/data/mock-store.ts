import type { ListingStatus, Role } from "@prisma/client";

export const platformSettings = {
  commissionRate: 0.08,
};

export const mockUsers: Array<{
  id: string;
  name: string;
  email: string;
  image: string;
  avatar: string;
  steamId: string | null;
  balance: number;
  totalProfit: number;
  role: Role;
  isBlocked: boolean;
}> = [
  {
    id: "demo-user",
    name: "Ava Mercer",
    email: "ava@nightmarket.gg",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    steamId: "76561198000000001",
    balance: 1245.5,
    totalProfit: 312.4,
    role: "USER",
    isBlocked: false,
  },
  {
    id: "admin-user",
    name: "Miles Rowan",
    email: "admin@nightmarket.gg",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    steamId: "76561198000000002",
    balance: 9450,
    totalProfit: 2210,
    role: "ADMIN",
    isBlocked: false,
  },
  {
    id: "blocked-user",
    name: "Kai Voss",
    email: "blocked@nightmarket.gg",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    steamId: null,
    balance: 200,
    totalProfit: -88,
    role: "USER",
    isBlocked: true,
  },
];

export const mockSkins = [
  {
    id: "skin-1",
    slug: "karambit-fade",
    name: "Karambit | Fade",
    category: "Knife",
    rarity: "Covert",
    exterior: "Factory New",
    wear: 0.01,
    price: 2499,
    image: "/skins/karambit-fade.png",
    finishStyle: "Full Fade 94%",
    description: "Collector-grade Karambit with a clean fade and startup-level liquidity.",
    collection: "Spectrum",
    liquidityScore: 97,
  },
  {
    id: "skin-2",
    slug: "ak-47-redline",
    name: "AK-47 | Redline",
    category: "Rifle",
    rarity: "Classified",
    exterior: "Field-Tested",
    wear: 0.15,
    price: 126.5,
    image: "/skins/ak-47-redline.png",
    finishStyle: "4x holo ready",
    description: "High-demand Redline with stable turnover and strong buy-side depth.",
    collection: "Phoenix",
    liquidityScore: 88,
  },
  {
    id: "skin-3",
    slug: "awp-dragon-lore",
    name: "AWP | Dragon Lore",
    category: "Rifle",
    rarity: "Covert",
    exterior: "Minimal Wear",
    wear: 0.08,
    price: 4380,
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAZh7PLfYQJW7dWxq4yCkP_gfe7Xzz8IvZB3j-vEoY-jjQ3m_hA_YDj1dYCRelE8ZwrRr1Tsxr26jJ67vMubn3M17iVw4HfYz0vgwUYbHg1v0Q/600fx450f",
    finishStyle: "Legend-tier flex",
    description: "Signature flagship asset for premium collectors and featured listings.",
    collection: "Cobblestone",
    liquidityScore: 76,
  },
  {
    id: "skin-4",
    slug: "m4a1-s-printstream",
    name: "M4A1-S | Printstream",
    category: "Rifle",
    rarity: "Covert",
    exterior: "Minimal Wear",
    wear: 0.07,
    price: 364,
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAZh7PLfYQJJ6dizq4mNnP7xDLfYkWNF18l4jeHVu9SmjQGy-0VtMGmgJtTGdQQ5YQ6B_1Trkuvsm9W-ut2XnyM1uSYi5n3D30vgAM76aeI/600fx450f",
    finishStyle: "Pearlescent",
    description: "A clean monochrome rifle with premium demand from active buyers.",
    collection: "Broken Fang",
    liquidityScore: 84,
  },
  {
    id: "skin-5",
    slug: "usp-s-neo-noir",
    name: "USP-S | Neo-Noir",
    category: "Pistol",
    rarity: "Classified",
    exterior: "Minimal Wear",
    wear: 0.08,
    price: 61,
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FAZh7PLfYQJM6dW1nY6PnOOgZ7rNmlRD18hwj-z--YXygED6_xJqMWiiJ4eQJwI8YFrR-QPrxrzphJbttM7JzSRk73I8pSGK6QmI1g/600fx450f",
    finishStyle: "Comic neon",
    description: "Watchlist favorite with strong repeat demand and steady price history.",
    collection: "Danger Zone",
    liquidityScore: 81,
  },
  {
    id: "skin-6",
    slug: "sport-gloves-vice",
    name: "Sport Gloves | Vice",
    category: "Gloves",
    rarity: "Covert",
    exterior: "Battle-Scarred",
    wear: 0.58,
    price: 782,
    image: "/skins/sport-gloves-vice.webp",
    finishStyle: "Neon statement",
    description: "Bold glove pair that anchors premium inventory and social proof.",
    collection: "Clutch",
    liquidityScore: 69,
  },
  {
    id: "skin-7",
    slug: "skeleton-knife-slaughter",
    name: "Skeleton Knife | Slaughter",
    category: "Knife",
    rarity: "Covert",
    exterior: "Minimal Wear",
    wear: 0.08,
    price: 1180,
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotb2lcA1fwOP3YQJSvYmzkYy0nv_nIITdn2xZ_Isg2r6Qo4j23QDjqhZtZTz6d4KddAE8Zl7Z8lS5wLzpg8S9tMzAzXM26HQn5n2LnkG2hRtIcKUx0A/600fx450f",
    finishStyle: "Slaughter web",
    description: "Modern knife silhouette with a strong premium-market velocity.",
    collection: "Fracture",
    liquidityScore: 86,
  },
  {
    id: "skin-8",
    slug: "desert-eagle-code-red",
    name: "Desert Eagle | Code Red",
    category: "Pistol",
    rarity: "Covert",
    exterior: "Factory New",
    wear: 0.04,
    price: 98,
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAZh7PLfYQJK9dS1nY6PnOOgZ7rNmlRD18hwj-z--YXygED6_xc9N2ylJ4fDclRrMlyE8wLoqLy-nMfpv52fmyBivCFw7WGdwULn/600fx450f",
    finishStyle: "Track-day red",
    description: "Popular Deagle with a fast-moving mid-ticket buyer pool.",
    collection: "Horizon",
    liquidityScore: 79,
  },
] as const;

export const mockListings: Array<{
  id: string;
  skinSlug: string;
  sellerId: string;
  askPrice: number;
  status: ListingStatus;
  createdAt: Date;
}> = [
  { id: "listing-1", skinSlug: "karambit-fade", sellerId: "admin-user", askPrice: 2525, status: "ACTIVE", createdAt: new Date("2026-04-24T11:00:00Z") },
  { id: "listing-2", skinSlug: "ak-47-redline", sellerId: "admin-user", askPrice: 128.75, status: "ACTIVE", createdAt: new Date("2026-04-25T08:12:00Z") },
  { id: "listing-3", skinSlug: "m4a1-s-printstream", sellerId: "admin-user", askPrice: 369, status: "ACTIVE", createdAt: new Date("2026-04-25T06:44:00Z") },
  { id: "listing-4", skinSlug: "sport-gloves-vice", sellerId: "admin-user", askPrice: 801, status: "ACTIVE", createdAt: new Date("2026-04-23T17:30:00Z") },
  { id: "listing-5", skinSlug: "desert-eagle-code-red", sellerId: "admin-user", askPrice: 101, status: "ACTIVE", createdAt: new Date("2026-04-24T14:18:00Z") },
];

export const mockFavorites = [
  { userId: "demo-user", skinId: "skin-2" },
  { userId: "demo-user", skinId: "skin-5" },
  { userId: "demo-user", skinId: "skin-7" },
];

export const mockInventory = [
  { id: "inv-1", userId: "demo-user", skinId: "skin-4", acquisition: 290, currentValue: 364, isListed: false, createdAt: new Date("2026-04-15T12:00:00Z") },
  { id: "inv-2", userId: "demo-user", skinId: "skin-8", acquisition: 84, currentValue: 98, isListed: true, createdAt: new Date("2026-04-11T09:00:00Z") },
  { id: "inv-3", userId: "demo-user", skinId: "skin-5", acquisition: 56, currentValue: 61, isListed: false, createdAt: new Date("2026-04-09T09:00:00Z") },
];

export const mockTransactions = [
  { id: "txn-1", userId: "demo-user", type: "DEPOSIT", amount: 900, description: "Card deposit", createdAt: new Date("2026-04-01T12:00:00Z") },
  { id: "txn-2", userId: "demo-user", type: "PURCHASE", amount: -364, description: "Bought M4A1-S | Printstream", createdAt: new Date("2026-04-15T13:05:00Z") },
  { id: "txn-3", userId: "demo-user", type: "SALE", amount: 98, description: "Sold Desert Eagle | Code Red", createdAt: new Date("2026-04-21T19:30:00Z") },
  { id: "txn-4", userId: "demo-user", type: "COMMISSION", amount: -7.84, description: "Marketplace commission", createdAt: new Date("2026-04-21T19:31:00Z") },
];

export const mockNotifications = [
  { id: "notif-1", userId: "demo-user", title: "Buy order filled", body: "Your M4A1-S | Printstream purchase was completed instantly.", createdAt: "2026-04-15T13:05:00Z" },
  { id: "notif-2", userId: "demo-user", title: "Steam connected", body: "Trading is now unlocked for your account.", createdAt: "2026-04-10T09:30:00Z" },
  { id: "notif-3", userId: "demo-user", title: "Price alert", body: "AK-47 | Redline moved up 6.4% in the last 7 days.", createdAt: "2026-04-25T07:00:00Z" },
];

export const mockPriceHistory: Record<string, Array<{ date: string; value: number }>> = {
  "karambit-fade": [
    { date: "Apr 19", value: 2410 },
    { date: "Apr 20", value: 2438 },
    { date: "Apr 21", value: 2452 },
    { date: "Apr 22", value: 2478 },
    { date: "Apr 23", value: 2460 },
    { date: "Apr 24", value: 2490 },
    { date: "Apr 25", value: 2499 },
  ],
  "ak-47-redline": [
    { date: "Apr 19", value: 118 },
    { date: "Apr 20", value: 119 },
    { date: "Apr 21", value: 121 },
    { date: "Apr 22", value: 122.8 },
    { date: "Apr 23", value: 124.1 },
    { date: "Apr 24", value: 125.2 },
    { date: "Apr 25", value: 126.5 },
  ],
  "m4a1-s-printstream": [
    { date: "Apr 19", value: 352 },
    { date: "Apr 20", value: 350 },
    { date: "Apr 21", value: 355 },
    { date: "Apr 22", value: 359 },
    { date: "Apr 23", value: 361 },
    { date: "Apr 24", value: 363 },
    { date: "Apr 25", value: 364 },
  ],
};

export const mockBalanceTrend = [
  { date: "Apr 19", value: 782 },
  { date: "Apr 20", value: 940 },
  { date: "Apr 21", value: 1038 },
  { date: "Apr 22", value: 982 },
  { date: "Apr 23", value: 1170 },
  { date: "Apr 24", value: 1208 },
  { date: "Apr 25", value: 1245.5 },
];
