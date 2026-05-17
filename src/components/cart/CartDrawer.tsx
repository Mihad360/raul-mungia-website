/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { X } from "lucide-react";

type TCartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CartDrawer = ({ isOpen, onClose }: TCartDrawerProps) => {
  // TODO: Replace with Redux selector
  // const cartItems = useAppSelector(selectCartItems);
  const cartItems: any[] = [];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              {/* Empty cart icon */}
              <div className="text-5xl mb-4">🛒</div>
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
          ) : (
            // Cart items list (future implementation)
            <div>
              {/* TODO: Render cart items here with quantity, price, remove button */}
            </div>
          )}
        </div>

        {/* Footer - checkout button (only if items exist) */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 p-6 space-y-3">
            <div className="flex justify-between text-sm font-semibold">
              <span>Total:</span>
              <span>$0.00</span>
            </div>
            <button
              className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer"
              style={{ backgroundColor: "#C70A24" }}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
