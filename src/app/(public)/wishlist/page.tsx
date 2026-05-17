/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import Link from "next/link";
import { Heart } from "lucide-react";

const WishlistPage = () => {
  // TODO: Replace with Redux selector
  // const wishlist = useAppSelector(selectWishlist);
  const wishlist: any[] = [];

  return (
    <main className="min-h-screen bg-white">

      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Wishlist</h1>
        <p className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>{" "}
          / Wishlist
        </p>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-20 min-h-96 flex items-center justify-center">
        {wishlist.length === 0 ? (
          <div className="text-center">
            {/* Empty state icon */}
            <div className="flex justify-center mb-6">
              <Heart size={80} className="text-gray-200 stroke-1" />
            </div>

            {/* Empty message */}
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              This wishlist is empty.
            </h2>
            <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
              You don't have any products in the wishlist yet. You will find a
              lot of interesting products on our "Shop" page.
            </p>

            {/* CTA button */}
            <Link
              href="/shop"
              className="inline-block px-6 py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer"
              style={{ backgroundColor: "#C70A24" }}
            >
              Return to Shop
            </Link>
          </div>
        ) : (
          // Wishlist items grid (future implementation)
          <div className="w-full">{/* TODO: Render wishlist items here */}</div>
        )}
      </section>

    </main>
  );
};

export default WishlistPage;
