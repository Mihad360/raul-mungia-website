const STORAGE_KEY = "raul_applied_coupon";

/**
 * Persists the applied coupon code between cart and checkout pages.
 * Cleared when:
 *   - User removes coupon
 *   - User clears cart
 *   - Order is successfully placed (TODO when order API is wired)
 */
export const couponStorage = {
  get(): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(STORAGE_KEY) || "";
  },
  set(code: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, code);
  },
  remove(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
