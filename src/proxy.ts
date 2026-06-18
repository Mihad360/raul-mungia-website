import { NextRequest, NextResponse } from "next/server";
import { AUTH_CONFIG } from "@/lib/auth/auth.config";
import { decodeJwt } from "./utils/jwt";

const PROTECTED_ROUTES = [
  "/cart/checkout",
  "/wishlist",
  "/account",
  "/orders",
  "/profile",
  "/change-password", // Add change-password as protected route
];

const ADMIN_ROUTES = ["/admin"];

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
  "/password-updated",
];

// Routes that should be accessible even when logged in (for password reset flow)
const ALLOWED_AUTH_ROUTES_WHEN_LOGGED_IN = [
  "/reset-password",
  "/verify-otp",
  "/password-updated",
];

const ADMIN_ROLES = ["admin", "super_admin"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_CONFIG.TOKEN_COOKIE_KEY)?.value;
  const { pathname } = request.nextUrl;

  const payload = token ? decodeJwt(token) : null;
  const isExpired = payload?.exp ? payload.exp * 1000 < Date.now() : false;
  const isLoggedIn = !!token && !isExpired;
  const isAdmin = !!payload?.role && ADMIN_ROLES.includes(payload.role);

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  // Check if current route is allowed even when logged in
  const isAllowedAuthRoute = ALLOWED_AUTH_ROUTES_WHEN_LOGGED_IN.some(
    (r) => pathname === r || pathname.startsWith(r),
  );

  // 🔍 DEBUG — remove after fixing
  console.log("─────────────────────────────");
  console.log("📍 PROXY HIT:", pathname);
  console.log(
    "🍪 Token:",
    token ? `EXISTS (${token.substring(0, 20)}...)` : "NONE",
  );
  console.log("⏰ Expired:", isExpired);
  console.log("✅ isLoggedIn:", isLoggedIn);
  console.log("🛡️  Route flags:", {
    isProtected,
    isAdminRoute,
    isAuthRoute,
    isAllowedAuthRoute,
  });

  if (token && isExpired) {
    console.log("➡️  REDIRECT: expired token → /login");
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete(AUTH_CONFIG.TOKEN_COOKIE_KEY);
    return res;
  }

  // Protected routes require login
  if (isProtected && !isLoggedIn) {
    console.log("➡️  REDIRECT: not logged in, protected route → /login");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes require admin role
  if (isAdminRoute && isLoggedIn && !isAdmin) {
    console.log("➡️  REDIRECT: not admin, admin route → /");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Auth routes redirect to home if logged in (except allowed routes)
  if (isAuthRoute && isLoggedIn && !isAllowedAuthRoute) {
    console.log("➡️  REDIRECT: logged in, auth route → /");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Handle admin root redirect
  if (pathname === "/admin" && isLoggedIn && isAdmin) {
    console.log("➡️  REDIRECT: /admin → /admin/dashboard");
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  console.log("✅ PASS THROUGH");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
