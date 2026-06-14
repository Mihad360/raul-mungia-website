/**
 * Shared auth configuration
 * Used by both server + client code
 */

export const AUTH_CONFIG = {
  /** Cookie name for the JWT access token */
  TOKEN_COOKIE_KEY: "accessToken",

  /** Cookie expiry in days */
  COOKIE_EXPIRES_DAYS: 7,

  /** Cookie path (root = app-wide) */
  COOKIE_PATH: "/",
};
