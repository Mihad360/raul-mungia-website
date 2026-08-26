import { clearClientToken, setClientToken } from "./cookies.client";

/**
 * Handle successful login
 * - Saves token to cookie
 * - Caller handles redirect
 */
export function handleLoginSuccess(token: string): void {
  if (!token || token === "undefined" || token === "null") {
    throw new Error("Login succeeded but no access token was returned");
  }
  setClientToken(token);
}

/**
 * Handle logout
 * - Clears token cookie
 * - Caller handles redirect
 */
export function handleLogout(): void {
  clearClientToken();
}
