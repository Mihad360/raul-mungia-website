import { NextRequest, NextResponse } from "next/server";
import { AUTH_CONFIG } from "@/lib/auth/auth.config";
import { decodeJwt } from "./utils/jwt";

const PROTECTED_ROUTES = [
  "/cart/checkout",
  "/wishlist",
  "/account",
  "/orders",
  "/profile",
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

  // 🔍 DEBUG — remove after fixing
  console.log("─────────────────────────────");
  console.log("📍 PROXY HIT:", pathname);
  console.log(
    "🍪 Token:",
    token ? `EXISTS (${token.substring(0, 20)}...)` : "NONE",
  );
  console.log("⏰ Expired:", isExpired);
  console.log("✅ isLoggedIn:", isLoggedIn);
  console.log("🛡️  Route flags:", { isProtected, isAdminRoute, isAuthRoute });

  if (token && isExpired) {
    console.log("➡️  REDIRECT: expired token → /login");
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete(AUTH_CONFIG.TOKEN_COOKIE_KEY);
    return res;
  }

  if ((isProtected || isAdminRoute) && !isLoggedIn) {
    console.log("➡️  REDIRECT: not logged in, protected route → /login");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isLoggedIn) {
    console.log("➡️  REDIRECT: logged in, auth route → /");
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAdminRoute && isLoggedIn && !isAdmin) {
    console.log("➡️  REDIRECT: not admin, admin route → /");
    return NextResponse.redirect(new URL("/", request.url));
  }

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
