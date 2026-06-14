"use client";

import Cookies from "js-cookie";
import { AUTH_CONFIG } from "./auth.config";

/**
 * Client-side cookie utilities
 * Use in Client Components, axios interceptor, etc.
 */

/** Get the access token (client-side) */
export function getClientToken(): string | null {
  return Cookies.get(AUTH_CONFIG.TOKEN_COOKIE_KEY) || null;
}

/** Set the access token after login */
export function setClientToken(token: string): void {
  Cookies.set(AUTH_CONFIG.TOKEN_COOKIE_KEY, token, {
    expires: AUTH_CONFIG.COOKIE_EXPIRES_DAYS,
    path: AUTH_CONFIG.COOKIE_PATH,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

/** Clear the access token (logout) */
export function clearClientToken(): void {
  Cookies.remove(AUTH_CONFIG.TOKEN_COOKIE_KEY, {
    path: AUTH_CONFIG.COOKIE_PATH,
  });
}
