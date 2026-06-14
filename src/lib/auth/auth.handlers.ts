import { clearClientToken, setClientToken } from "./cookies.client";

/**
 * Handle successful login
 * - Saves token to cookie
 * - Caller handles redirect
 */
export function handleLoginSuccess(token: string): void {
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
