/**
 * Simple in-memory rate limiter for API routes.
 * For production, replace this with Redis / Upstash.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULTS: Record<string, RateLimitConfig> = {
  api: { maxRequests: 120, windowMs: 60_000 },
  admin: { maxRequests: 30, windowMs: 60_000 },
  auth: { maxRequests: 10, windowMs: 60_000 },
  trade: { maxRequests: 15, windowMs: 60_000 },
  wallet: { maxRequests: 15, windowMs: 60_000 },
  market: { maxRequests: 60, windowMs: 60_000 },
  upgrade: { maxRequests: 20, windowMs: 60_000 },
  caseOpen: { maxRequests: 30, windowMs: 60_000 },
};

export function checkRateLimit(
  identifier: string,
  category: keyof typeof DEFAULTS = "api",
): { limited: false } | { limited: true; retryAfter: number } {
  const config = DEFAULTS[category] ?? DEFAULTS.api;
  const key = `${category}:${identifier}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { limited: false };
  }

  if (entry.count >= config.maxRequests) {
    return {
      limited: true,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count++;
  return { limited: false };
}

export function getIdentifier(request: Request | { headers: Headers }, userId?: string): string {
  if (userId) return userId;

  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const realIp = request.headers.get("x-real-ip") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || realIp.trim() || "unknown";

  return ip;
}
