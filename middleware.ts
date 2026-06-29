import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { isUserBlocked } from "@/lib/store";
import { checkRateLimit, getIdentifier } from "@/lib/rate-limit";

// Routes requiring authentication
const PROTECTED_ROUTES = [
  "/dashboard",
  "/inventory",
  "/wallet",
  "/orders",
];

// Routes requiring ADMIN role
const ADMIN_ROUTES = ["/admin"];

// Routes blocked for authenticated users
const AUTH_ROUTES = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isRateLimitedRoute =
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/wallet") ||
    pathname.startsWith("/api/trade") ||
    pathname.startsWith("/api/market");

  if (isRateLimitedRoute) {
    const category = pathname.startsWith("/api/auth")
      ? "auth"
      : pathname.startsWith("/api/admin")
        ? "admin"
        : pathname.startsWith("/api/wallet")
          ? "wallet"
          : pathname.startsWith("/api/trade")
            ? "trade"
            : "market";

    const rateLimitResult = checkRateLimit(getIdentifier(request), category);
    if (rateLimitResult.limited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.retryAfter),
            "X-RateLimit-Limit": String(category === "auth" ? 10 : category === "admin" ? 30 : 60),
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }
  }

  // Block banned/malicious user agents
  const ua = request.headers.get("user-agent") || "";
  const suspiciousPatterns = [/sqlmap/i, /nikto/i, /masscan/i, /zgrab/i];
  if (suspiciousPatterns.some(p => p.test(ua))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Basic path traversal protection
  if (pathname.includes("..") || pathname.includes("%2e%2e")) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const isProtected =
    PROTECTED_ROUTES.some(route => pathname.startsWith(route)) ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/wallet") ||
    pathname.startsWith("/api/trade");
  const isAdmin = ADMIN_ROUTES.some(route => pathname.startsWith(route)) || pathname.startsWith("/api/admin");
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

  if (isProtected || isAdmin) {
    const session = await auth();

    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const blocked = await isUserBlocked(session.user.id ?? null);
    if (blocked) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Access denied. Your account is blocked." }, { status: 403 });
      }

      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isAdmin && session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Download-Options", "noopen");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com https://steamcommunity-a.akamaihd.net https://economy.csgo.steamstatic.com https://cdn.akamai.steamstatic.com; font-src 'self' data:; connect-src 'self' https:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; upgrade-insecure-requests;"
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
