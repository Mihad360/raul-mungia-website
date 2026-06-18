"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetCartSummaryQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from "@/redux/api/cartApi";

// ─── Same shape as cart page ───────────────────────────────────
interface ICartItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    mainImage: string;
  };
  size: string;
  quantity: number;
  price: number;
  lineTotal: number;
  available: boolean;
}

interface ICartSummary {
  items: ICartItem[];
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
  couponDiscountAmount: number;
  bulkDiscountAmount: number;
  shippingCost: number;
  total: number;
  hasUnavailableItems: boolean;
  freeShippingEligible: boolean;
}

type TCartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CartDrawer = ({ isOpen, onClose }: TCartDrawerProps) => {
  const [busyItemId, setBusyItemId] = useState<string | null>(null);

  // Skip the API call when drawer is closed — saves requests
  const {
    data: summaryData,
    isLoading,
    isError,
  } = useGetCartSummaryQuery({ couponCode: undefined }, { skip: !isOpen });

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();

  const summary: ICartSummary | undefined = summaryData?.data;
  const items: ICartItem[] = summary?.items || [];
  const subtotal = summary?.subtotal ?? 0;
  const total = summary?.total ?? 0;
  const totalDiscount =
    (summary?.couponDiscountAmount ?? 0) + (summary?.bulkDiscountAmount ?? 0);

  // ─── Handlers ──────────────────────────────────────────────────
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Shopping Cart
            {summary && summary.totalQuantity > 0 && (
              <span className="ml-2 text-sm text-gray-500 font-normal">
                ({summary.totalQuantity})
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 size={32} className="text-gray-400 animate-spin" />
            </div>
          )}

          {/* Error state */}
          {!isLoading && isError && (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <AlertCircle size={48} className="text-gray-300 mb-3" />
              <p className="text-gray-600 text-sm">Failed to load your cart</p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <ShoppingBag size={64} className="text-gray-200 stroke-1 mb-4" />
              <p className="text-gray-600 text-sm mb-6">
                No products in the cart.
              </p>
              <Link
                href="/shop"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer"
                style={{ backgroundColor: "#C70A24" }}
              >
                Return to Shop
              </Link>
            </div>
          )}

          {/* Items list */}
          {!isLoading && !isError && items.length > 0 && (
            <div className="p-4 space-y-3">
              {items.map((item) => {
                const isBusy = busyItemId === item._id;
                return (
                  <div
                    key={item._id}
                    className={`flex gap-3 p-3 rounded-lg border transition-opacity ${
                      isBusy ? "opacity-50 pointer-events-none" : ""
                    } ${
                      !item.available
                        ? "border-red-200 bg-red-50"
                        : "border-gray-100"
                    }`}
                  >
                    {/* Image */}
                    <Link
                      href={`/shop/product/${item.product._id}`}
                      onClick={onClose}
                      className="w-16 h-16 bg-gray-50 rounded relative overflow-hidden flex-shrink-0"
                    >
                      {item.product.mainImage && (
                        <Image
                          src={item.product.mainImage}
                          alt={item.product.title}
                          fill
                          className="object-contain p-1"
                        />
                      )}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={`/shop/product/${item.product._id}`}
                            onClick={onClose}
                            className="text-sm font-semibold text-gray-900 hover:text-[#C70A24] transition-colors line-clamp-1"
                          >
                            {item.product.title}
                          </Link>
                          <p className="text-xs text-gray-500">
                            Size: {item.size}
                          </p>
                          {!item.available && (
                            <p className="text-xs text-red-600 font-medium mt-1">
                              Unavailable
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          disabled={isBusy}
                          className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Qty controls */}
                        <div className="inline-flex items-center gap-1.5 border border-gray-200 rounded-md px-1.5 py-0.5">
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity - 1)
                            }
                            disabled={isBusy || item.quantity <= 1}
                            className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed p-0.5"
                            aria-label="Decrease"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-medium w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                            disabled={isBusy}
                            className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed p-0.5"
                            aria-label="Increase"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Line total */}
                        <p
                          className="text-sm font-bold"
                          style={{ color: "#C70A24" }}
                        >
                          ${item.lineTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer — only when items exist */}
        {!isLoading && !isError && items.length > 0 && (
          <div className="border-t border-gray-100 p-6 space-y-3 bg-gray-50">
            {/* Subtotal */}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {/* Total discount (if any) */}
            {totalDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>− ${totalDiscount.toFixed(2)}</span>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
              <span className="text-gray-900">Total</span>
              <span style={{ color: "#C70A24" }}>${total.toFixed(2)}</span>
            </div>

            {summary?.freeShippingEligible ? (
              <p className="text-xs text-green-600 text-center font-medium">
                ✓ Free shipping unlocked
              </p>
            ) : (
              <p className="text-xs text-gray-500 text-center">
                Shipping calculated at checkout
              </p>
            )}

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <Link
                href="/cart"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm text-center hover:bg-white transition-colors cursor-pointer"
              >
                View Cart
              </Link>
              <Link
                href="/cart/checkout"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg text-white font-semibold text-sm text-center transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer"
                style={{ backgroundColor: "#C70A24" }}
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
