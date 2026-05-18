/**
 * Input validators using Zod
 * Prevents SQL injection, XSS, and invalid data
 */

import { z } from "zod";

// ─── Trade URL ────────────────────────────────────────
export const tradeUrlSchema = z
  .string()
  .regex(
    /^https:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=\d+&token=[a-zA-Z0-9_-]+$/,
    "Invalid Steam trade URL format",
  );

// ─── Wallet ───────────────────────────────────────────
export const depositSchema = z.object({
  amount: z.number().positive("Amount must be positive").max(100000, "Maximum deposit is $100,000"),
});

export const withdrawSchema = z.object({
  amount: z.number().positive("Amount must be positive").max(50000, "Maximum withdrawal is $50,000"),
});

// ─── Upgrade ──────────────────────────────────────────
export const upgradeCalculateSchema = z.object({
  inputItemId: z.string().min(1, "Input item ID is required"),
  targetItemId: z.string().min(1, "Target item ID is required"),
});

export const upgradeExecuteSchema = z.object({
  inputItemId: z.string().min(1),
  targetItemId: z.string().min(1),
  clientSeed: z.string().min(8, "Client seed must be at least 8 characters").max(64),
});

// ─── Case ─────────────────────────────────────────────
export const caseOpenSchema = z.object({
  caseSlug: z.string().min(1, "Case slug is required"),
  clientSeed: z.string().min(8).max(64),
});

// ─── Listing ──────────────────────────────────────────
export const createListingSchema = z.object({
  skinId: z.string().min(1),
  askPrice: z.number().positive().max(1000000),
});

export const buyListingSchema = z.object({
  listingId: z.string().min(1),
});

// ─── Admin ────────────────────────────────────────────
export const updateSettingsSchema = z.object({
  key: z.enum(["commissionRate", "houseEdge", "maxMultiplier", "dailyBonusBase"]),
  value: z.string().min(1),
});

export const createPromoSchema = z.object({
  code: z.string().min(3).max(20).regex(/^[A-Z0-9_-]+$/i, "Code must be alphanumeric"),
  amount: z.number().positive().max(1000),
  maxUses: z.number().int().positive().max(100000),
  expiresAt: z.string().datetime().optional(),
});

export const createCaseSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  price: z.number().positive(),
  image: z.string().url(),
  items: z.array(
    z.object({
      skinId: z.string().min(1),
      rarity: z.enum(["COMMON", "RARE", "EPIC", "LEGENDARY"]),
      dropRate: z.number().min(0.001).max(1),
    }),
  ).min(2, "Case must have at least 2 items"),
});

// ─── Referral ─────────────────────────────────────────
export const redeemPromoSchema = z.object({
  code: z.string().min(3).max(20),
});

export const setTradeUrlSchema = z.object({
  tradeUrl: tradeUrlSchema,
});

// ─── Sanitization ─────────────────────────────────────
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
