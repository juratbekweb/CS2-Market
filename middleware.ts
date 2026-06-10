import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

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

  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAdmin = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

  if (isProtected || isAdmin) {
    const session = await auth();

    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user is blocked (from session token, would need custom session logic)
    // For now we check ADMIN only
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
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
