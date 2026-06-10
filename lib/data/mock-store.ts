
import type { ListingStatus, Role } from "@prisma/client";
import type { SkinCard } from "@/types/market";

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

export const mockSkins: SkinCard[] = [
  {
    id: "skin-1",
    slug: "karambit-fade",
    name: "Karambit | Fade",
    description: "The Karambit Fade is a highly sought-after knife featuring a beautiful gradient of pink, purple, and yellow.",
    category: "Knife",
    rarity: "EPIC",
    exterior: "Factory New",
    wear: 0.01,
    finishStyle: "Anodized Multicolored",
    collection: "The Arms Deal Collection",
    price: 2500.00,
    image: "/skins/karambit-fade.png",
    liquidityScore: 98,
    favorite: false,
  },
  {
    id: "skin-2",
    slug: "ak-47-redline",
    name: "AK-47 | Redline",
    description: "A classic AK-47 skin with a carbon fiber pattern and striking red accents.",
    category: "Rifle",
    rarity: "RARE",
    exterior: "Field-Tested",
    wear: 0.22,
    finishStyle: "Custom Paint Job",
    collection: "The Phoenix Collection",
    price: 25.50,
    image: "/skins/rifle.png",
    liquidityScore: 100,
    favorite: false,
  },
  {
    id: "skin-3",
    slug: "awp-dragon-lore",
    name: "AWP | Dragon Lore",
    description: "The holy grail of AWP skins, featuring a fire-breathing dragon.",
    category: "Sniper Rifle",
    rarity: "LEGENDARY",
    exterior: "Factory New",
    wear: 0.04,
    finishStyle: "Custom Paint Job",
    collection: "The Cobblestone Collection",
    price: 12500.00,
    image: "/skins/awp-dragon-lore.png",
    liquidityScore: 90,
    favorite: false,
  },
  {
    id: "skin-4",
    slug: "glock-18-candy-apple",
    name: "Glock-18 | Candy Apple",
    description: "A bright red pistol for those who prefer an aggressive aesthetic.",
    category: "Pistol",
    rarity: "COMMON",
    exterior: "Minimal Wear",
    wear: 0.08,
    finishStyle: "Anodized Multicolored",
    collection: "The Train Collection",
    price: 1.50,
    image: "/skins/pistol.png",
    liquidityScore: 99,
    favorite: false,
  },
  {
    id: "skin-5",
    slug: "sport-gloves-vice",
    name: "Sport Gloves | Vice",
    description: "Vibrant neon pink and blue athletic gloves.",
    category: "Gloves",
    rarity: "EPIC",
    exterior: "Field-Tested",
    wear: 0.24,
    finishStyle: "Custom",
    collection: "The Clutch Collection",
    price: 1100.00,
    image: "/skins/sport-gloves-vice.webp",
    liquidityScore: 95,
    favorite: false,
  },
  {
    id: "skin-6",
    slug: "sticker-titan-holo",
    name: "Sticker | Titan (Holo) | Katowice 2014",
    description: "One of the most expensive and legendary stickers in the game.",
    category: "Sticker",
    rarity: "LEGENDARY",
    exterior: "Factory New",
    wear: 0.00,
    finishStyle: "Holo",
    collection: "Katowice 2014",
    price: 55000.00,
    image: "/skins/sticker.png",
    liquidityScore: 85,
    favorite: false,
  },
  {
    id: "skin-7",
    slug: "agent-darryl",
    name: "Sir Bloody Miami Darryl | The Professionals",
    description: "A highly sought after Master Agent with a distinctive mask.",
    category: "Agent",
    rarity: "EPIC",
    exterior: "Factory New",
    wear: 0.00,
    finishStyle: "Custom",
    collection: "Shattered Web Agents",
    price: 45.00,
    image: "/skins/agent.png",
    liquidityScore: 92,
    favorite: false,
  },
];

export const mockListings: Array<{
  id: string;
  skinSlug: string;
  sellerId: string;
  askPrice: number;
  status: ListingStatus;
  createdAt: Date;
}> = [
  { id: "listing-1", skinSlug: "karambit-fade", sellerId: "admin-user", askPrice: 2525, status: "ACTIVE", createdAt: new Date("2026-04-24T11:00:00Z") },
  { id: "listing-2", skinSlug: "ak-47-redline", sellerId: "admin-user", askPrice: 25.75, status: "ACTIVE", createdAt: new Date("2026-04-25T08:12:00Z") },
  { id: "listing-3", skinSlug: "awp-dragon-lore", sellerId: "admin-user", askPrice: 12400, status: "ACTIVE", createdAt: new Date("2026-04-25T06:44:00Z") },
  { id: "listing-4", skinSlug: "sport-gloves-vice", sellerId: "admin-user", askPrice: 1150, status: "ACTIVE", createdAt: new Date("2026-04-23T17:30:00Z") },
  { id: "listing-5", skinSlug: "sticker-titan-holo", sellerId: "admin-user", askPrice: 56000, status: "ACTIVE", createdAt: new Date("2026-04-24T14:18:00Z") },
  { id: "listing-6", skinSlug: "agent-darryl", sellerId: "admin-user", askPrice: 46, status: "ACTIVE", createdAt: new Date("2026-04-24T14:20:00Z") },
];

export const mockFavorites = [
  { userId: "demo-user", skinId: "skin-2" },
  { userId: "demo-user", skinId: "skin-5" },
  { userId: "demo-user", skinId: "skin-7" },
];

export const mockInventory = [
  { id: "inv-1", userId: "demo-user", skinId: "skin-4", acquisition: 1.20, currentValue: 1.50, isListed: false, createdAt: new Date("2026-04-15T12:00:00Z") },
  { id: "inv-2", userId: "demo-user", skinId: "skin-6", acquisition: 50000, currentValue: 55000, isListed: true, createdAt: new Date("2026-04-11T09:00:00Z") },
  { id: "inv-3", userId: "demo-user", skinId: "skin-7", acquisition: 40, currentValue: 45, isListed: false, createdAt: new Date("2026-04-09T09:00:00Z") },
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
