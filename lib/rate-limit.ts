/**
 * Simple in-memory rate limiter for API routes
 * For production, use Redis-based rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
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
  api: { maxRequests: 100, windowMs: 60_000 },
  auth: { maxRequests: 10, windowMs: 60_000 },
  upgrade: { maxRequests: 20, windowMs: 60_000 },
  caseOpen: { maxRequests: 30, windowMs: 60_000 },
  trade: { maxRequests: 10, windowMs: 60_000 },
  wallet: { maxRequests: 10, windowMs: 60_000 },
};

/**
 * Check if a request is rate limited
 * @returns null if allowed, or { retryAfter } if limited
 */
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

/**
 * Helper to get IP or user identifier from request headers
 */
export function getIdentifier(request: Request, userId?: string): string {
  if (userId) return userId;
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  return ip;
}
