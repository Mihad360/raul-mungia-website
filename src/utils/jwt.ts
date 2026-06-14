/**
 * Decode JWT WITHOUT verification (for UX route guards only)
 */
export function decodeJwt(
  token: string,
): { role?: string; exp?: number } | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
