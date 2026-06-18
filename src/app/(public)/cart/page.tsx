"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, ShoppingBag, Tag, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Loader } from "@/components/shared/Loader";
import {
  useGetCartSummaryQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} from "@/redux/api/cartApi";
import { couponStorage } from "@/utils/couponStorage";

// ─── Actual backend response shape ─────────────────────────────
interface ICartItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    productCode: string;
    mainImage: string;
    category?: { _id: string; name: string; description: string | null };
    categoryName?: string;
  };
  size: string;
  quantity: number;
  price: number;
  lineTotal: number;
  available: boolean;
}

interface IAppliedCoupon {
  _id?: string;
  code: string;
  discountPercent: number;
}

interface IAppliedDiscount {
  _id?: string;
  name?: string;
  discountPercent?: number;
}

interface ICartSummary {
  items: ICartItem[];
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
  appliedCoupon: IAppliedCoupon | null;
  couponDiscountAmount: number;
  subtotalAfterCoupon: number;
  appliedDiscount: IAppliedDiscount | null;
  bulkDiscountAmount: number;
  subtotalAfterAllDiscounts: number;
  shippingCost: number;
  total: number;
  hasUnavailableItems: boolean;
  freeShippingEligible: boolean;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
}

const CartPage = () => {
  const router = useRouter();

  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [busyItemId, setBusyItemId] = useState<string | null>(null);

  // ─── Restore coupon from localStorage on mount ──────────────
  useEffect(() => {
    const stored = couponStorage.get();
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAppliedCouponCode(stored);
      setCouponInput(stored);
    }
  }, []);

  const {
    data: summaryData,
    isLoading: summaryLoading,
    isFetching: summaryFetching,
    isError: summaryError,
  } = useGetCartSummaryQuery({
    couponCode: appliedCouponCode || undefined,
  });

  const summary: ICartSummary | undefined = summaryData?.data;
  const cartItems: ICartItem[] = summary?.items || [];

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();

  const subtotal = summary?.subtotal ?? 0;
  const bulkDiscountAmount = summary?.bulkDiscountAmount ?? 0;
  const couponDiscountAmount = summary?.couponDiscountAmount ?? 0;
  const shippingCost = summary?.shippingCost ?? 0;
  const total = summary?.total ?? 0;
  const hasUnavailableItems = summary?.hasUnavailableItems ?? false;

  const freeShippingEligible = summary?.freeShippingEligible ?? false;
  const freeShippingThreshold = summary?.freeShippingThreshold ?? 150;
  const amountToFreeShipping =
    summary?.amountToFreeShipping ?? freeShippingThreshold;
  const freeShippingProgress =
    freeShippingThreshold > 0
      ? Math.min(100, (subtotal / freeShippingThreshold) * 100)
      : 0;

  const couponFailed = !!(
    appliedCouponCode &&
    !summaryFetching &&
    summary &&
    !summary.appliedCoupon
  );

  const handleQuantityChange = async (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      setBusyItemId(itemId);
      await updateCartItem({ itemId, quantity: newQty }).unwrap();
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to update quantity");
    } finally {
      setBusyItemId(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setBusyItemId(itemId);
      await removeCartItem(itemId).unwrap();
      toast.success("Item removed from cart");
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to remove item");
    } finally {
      setBusyItemId(null);
    }
  };

  // ─── Coupon: persist to localStorage ────────────────────────
  const handleApplyCoupon = () => {
    const code = couponInput.trim();
    if (!code) {
      toast.error("Please enter a coupon code");
      return;
    }
    setAppliedCouponCode(code);
    couponStorage.set(code);
  };

  const handleRemoveCoupon = () => {
    setAppliedCouponCode("");
    setCouponInput("");
    couponStorage.remove();
  };

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return;
    try {
      await clearCart(undefined).unwrap();
      setAppliedCouponCode("");
      setCouponInput("");
      couponStorage.remove();
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (hasUnavailableItems) {
      toast.error("Please remove unavailable items before checkout");
      return;
    }
    router.push("/cart/checkout");
  };

  if (summaryLoading) {
    return (
      <main className="min-h-screen bg-white flex justify-center items-center">
        <Loader size="lg" />
      </main>
    );
  }

  if (summaryError) {
    return (
      <main className="min-h-screen bg-white flex flex-col justify-center items-center py-20">
        <AlertCircle size={48} className="text-gray-300 mb-3" />
        <p className="text-gray-600 mb-2">Failed to load your cart</p>
        <Link href="/shop" className="text-[#C70A24] hover:underline mt-2">
          Continue Shopping
        </Link>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="flex justify-center mb-6">
            <ShoppingBag size={80} className="text-gray-200 stroke-1" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Your cart is empty
          </h1>
          <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
            Looks like you haven&apos;t added any products yet. Browse our shop
            to find something you&apos;ll love.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer"
            style={{ backgroundColor: "#C70A24" }}
          >
            Return to Shop
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center gap-4 text-sm font-medium">
          <span className="font-semibold" style={{ color: "#C70A24" }}>
            Shopping Cart
          </span>
          <span className="text-gray-400">→</span>
          <span className="text-gray-600">Checkout</span>
          <span className="text-gray-400">→</span>
          <span className="text-gray-600">Order Complete</span>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {hasUnavailableItems && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700">
                  Some items in your cart are no longer available. Please remove
                  them before checkout.
                </span>
              </div>
            )}

            {!freeShippingEligible ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg">ⓘ</span>
                  <span className="text-sm text-gray-700 flex-1">
                    You only need{" "}
                    <strong>${amountToFreeShipping.toFixed(2)}</strong> more for
                    free shipping
                  </span>
                  <Link
                    href="/shop"
                    className="text-sm font-medium hover:underline cursor-pointer"
                    style={{ color: "#C70A24" }}
                  >
                    Continue Shopping
                  </Link>
                </div>
                <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      backgroundColor: "#C70A24",
                      width: `${freeShippingProgress}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <span className="text-lg">✓</span>
                <span className="text-sm text-green-700 font-medium">
                  You&apos;ve qualified for free shipping!
                </span>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 font-semibold text-gray-900">
                      Product
                    </th>
                    <th className="text-left py-3 font-semibold text-gray-900">
                      Price
                    </th>
                    <th className="text-left py-3 font-semibold text-gray-900">
                      Quantity
                    </th>
                    <th className="text-left py-3 font-semibold text-gray-900">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    const isBusy = busyItemId === item._id;
                    return (
                      <tr
                        key={item._id}
                        className={`border-b border-gray-100 transition-opacity ${
                          isBusy ? "opacity-50" : ""
                        } ${!item.available ? "bg-red-50" : ""}`}
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              disabled={isBusy}
                              className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer disabled:cursor-not-allowed"
                              aria-label="Remove item"
                            >
                              <X size={18} />
                            </button>
                            <div className="w-14 h-14 bg-gray-100 rounded relative overflow-hidden flex-shrink-0">
                              {item.product.mainImage && (
                                <Image
                                  src={item.product.mainImage}
                                  alt={item.product.title}
                                  fill
                                  className="object-contain p-1"
                                />
                              )}
                            </div>
                            <div>
                              <Link
                                href={`/shop/product/${item.product._id}`}
                                className="font-medium text-gray-900 hover:text-[#C70A24] transition-colors"
                              >
                                {item.product.title}
                              </Link>
                              <p className="text-xs text-gray-500">
                                Size: {item.size}
                              </p>
                              {!item.available && (
                                <p className="text-xs text-red-600 font-medium mt-1">
                                  Currently unavailable
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-gray-900 font-medium">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="py-4">
                          <div className="inline-flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  item.quantity - 1,
                                )
                              }
                              disabled={isBusy || item.quantity <= 1}
                              className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  item.quantity + 1,
                                )
                              }
                              disabled={isBusy}
                              className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </td>
                        <td
                          className="py-4 font-semibold"
                          style={{ color: "#C70A24" }}
                        >
                          ${item.lineTotal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-3">
              {summary?.appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Tag size={18} className="text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">
                        {summary.appliedCoupon.code} applied
                      </p>
                      <p className="text-xs text-green-600">
                        You saved ${couponDiscountAmount.toFixed(2)} (
                        {summary.appliedCoupon.discountPercent}% off)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-sm text-red-600 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : couponFailed ? (
                <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={18} className="text-red-600" />
                    <div>
                      <p className="font-semibold text-red-800">
                        Coupon &quot;{appliedCouponCode}&quot; could not be
                        applied
                      </p>
                      <p className="text-xs text-red-600">
                        It may be invalid, expired, or not valid for this cart
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-sm text-gray-700 hover:underline cursor-pointer"
                  >
                    Try another
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon Code"
                    disabled={summaryFetching}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors disabled:opacity-60"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={summaryFetching || !couponInput.trim()}
                    className="px-6 py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#C70A24" }}
                  >
                    {summaryFetching ? "..." : "Apply Coupon"}
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleClearCart}
                disabled={isClearing}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isClearing ? "Clearing..." : "Clear Cart"}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 h-fit sticky top-20">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Cart Totals
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Subtotal ({summary?.totalQuantity ?? 0} items)
                </span>
                <span className="font-medium text-gray-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {bulkDiscountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">
                    Bulk discount
                    {summary?.appliedDiscount?.name &&
                      ` (${summary.appliedDiscount.name})`}
                  </span>
                  <span className="font-medium text-green-600">
                    − ${bulkDiscountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              {couponDiscountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">
                    Coupon ({summary?.appliedCoupon?.code})
                  </span>
                  <span className="font-medium text-green-600">
                    − ${couponDiscountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm pt-4 border-t border-gray-200">
                <span className="text-gray-600">
                  Shipping
                  {shippingCost === 0 && (
                    <span className="text-green-600 ml-1">
                      {freeShippingEligible
                        ? "(FREE)"
                        : "(Calculated at checkout)"}
                    </span>
                  )}
                </span>
                <span className="font-medium text-gray-900">
                  ${shippingCost.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200">
                <span className="text-gray-900">Total</span>
                <span style={{ color: "#C70A24" }}>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={summaryFetching || hasUnavailableItems}
              className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#C70A24" }}
            >
              {hasUnavailableItems
                ? "Resolve issues to checkout"
                : "Proceed to Checkout"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CartPage;
