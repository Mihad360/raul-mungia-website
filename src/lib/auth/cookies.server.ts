import "server-only";
import { cookies } from "next/headers";
import { AUTH_CONFIG } from "./auth.config";

/**
 * Server-side cookie utilities
 * Use in Server Components, Server Actions, API Routes
 */

/** Get the access token (server-side) */
export async function getServerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(AUTH_CONFIG.TOKEN_COOKIE_KEY);
  return tokenCookie?.value || null;
}
