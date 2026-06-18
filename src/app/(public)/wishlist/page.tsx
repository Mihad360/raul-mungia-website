"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, X, ShoppingCart, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Loader } from "@/components/shared/Loader";
import {
  useGetMyWishlistQuery,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
} from "@/redux/api/wishlistApi";
import { useAddToCartMutation } from "@/redux/api/cartApi";

// ─── Actual backend response shape ─────────────────────────────
interface IProductVariant {
  _id: string;
  size: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  weight: number;
}

interface IWishlistProduct {
  _id: string;
  title: string;
  productCode: string;
  category: { _id: string; name: string; description: string | null };
  categoryName: string;
  variants: IProductVariant[];
  description: string;
  additionalInformation: string | null;
  compliance: string | null;
  mainImage: string;
  images: string[];
  lowStockThreshold: number;
  isActive: boolean;
  isDeleted: boolean;
}

interface IWishlist {
  _id: string;
  user: string;
  products: IWishlistProduct[];
  createdAt: string;
  updatedAt: string;
}

const WishlistPage = () => {
  const router = useRouter();
  const [busyProductId, setBusyProductId] = useState<string | null>(null);

  // ─── Queries ───────────────────────────────────────────────────
  const {
    data: wishlistData,
    isLoading,
    isError,
  } = useGetMyWishlistQuery(undefined);

  const wishlist: IWishlist | undefined = wishlistData?.data;
  const products: IWishlistProduct[] = wishlist?.products || [];

  // ─── Mutations ─────────────────────────────────────────────────
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [clearWishlist, { isLoading: isClearing }] = useClearWishlistMutation();
  const [addToCart] = useAddToCartMutation();

  // ─── Handlers ──────────────────────────────────────────────────
  const handleRemove = async (productId: string) => {
    try {
      setBusyProductId(productId);
      await removeFromWishlist(productId).unwrap();
      toast.success("Removed from wishlist");
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to remove from wishlist");
    } finally {
      setBusyProductId(null);
    }
  };

  const handleQuickAddToCart = async (product: IWishlistProduct) => {
    const defaultVariant = product.variants?.[0];
    if (!defaultVariant) {
      toast.error("No variants available — please pick from product page");
      router.push(`/shop/product/${product._id}`);
      return;
    }
    if (defaultVariant.stock === 0) {
      toast.error("Default size is out of stock — check other sizes");
      router.push(`/shop/product/${product._id}`);
      return;
    }

    try {
      setBusyProductId(product._id);
      await addToCart({
        productId: product._id,
        size: defaultVariant.size,
        quantity: 1,
      }).unwrap();
      toast.success(`Added ${product.title} (${defaultVariant.size}) to cart`);
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to add to cart");
    } finally {
      setBusyProductId(null);
    }
  };

  const handleClearWishlist = async () => {
    if (!confirm("Are you sure you want to clear your entire wishlist?"))
      return;
    try {
      await clearWishlist(undefined).unwrap();
      toast.success("Wishlist cleared");
    } catch {
      toast.error("Failed to clear wishlist");
    }
  };

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

      {/* Loading state */}
      {isLoading && (
        <section className="max-w-7xl mx-auto px-6 py-20 flex justify-center items-center">
          <Loader size="lg" />
        </section>
      )}

      {/* Error state */}
      {!isLoading && isError && (
        <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col justify-center items-center">
          <AlertCircle size={48} className="text-gray-300 mb-3" />
          <p className="text-gray-600 mb-2">Failed to load your wishlist</p>
          <Link href="/shop" className="text-[#C70A24] hover:underline mt-2">
            Continue Shopping
          </Link>
        </section>
      )}

      {/* Empty state */}
      {!isLoading && !isError && products.length === 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20 min-h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Heart size={80} className="text-gray-200 stroke-1" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              This wishlist is empty.
            </h2>
            <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
              You don&apos;t have any products in the wishlist yet. You will
              find a lot of interesting products on our &quot;Shop&quot; page.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer"
              style={{ backgroundColor: "#C70A24" }}
            >
              Return to Shop
            </Link>
          </div>
        </section>
      )}

      {/* Wishlist items grid */}
      {!isLoading && !isError && products.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-20">
          {/* Top row — count + clear */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              {products.length} {products.length === 1 ? "item" : "items"} in
              your wishlist
            </p>
            <button
              onClick={handleClearWishlist}
              disabled={isClearing}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isClearing ? "Clearing..." : "Clear All"}
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => {
              const lowestPrice = product.variants?.length
                ? Math.min(...product.variants.map((v) => v.price))
                : 0;
              const defaultVariant = product.variants?.[0];
              const allOutOfStock =
                product.variants?.length > 0 &&
                product.variants.every((v) => v.stock === 0);
              const isBusy = busyProductId === product._id;

              return (
                <div
                  key={product._id}
                  className={`bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all group relative ${
                    isBusy ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {/* Remove (X) button — top right */}
                  <button
                    onClick={() => handleRemove(product._id)}
                    disabled={isBusy}
                    className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-white transition-colors cursor-pointer shadow-sm disabled:cursor-not-allowed"
                    aria-label="Remove from wishlist"
                  >
                    <X size={16} />
                  </button>

                  {/* Image — clickable to product detail */}
                  <Link
                    href={`/shop/product/${product._id}`}
                    className="block bg-gray-50 h-44 p-4 group-hover:bg-gray-100 transition-colors relative"
                  >
                    {product.mainImage ? (
                      <Image
                        src={product.mainImage}
                        alt={product.title}
                        fill
                        className="object-contain p-4"
                      />
                    ) : (
                      <div className="flex items-end justify-center h-full">
                        <div
                          className="w-16 h-32 rounded-t-lg shadow-md"
                          style={{
                            background:
                              "linear-gradient(180deg, #9ca3af 0%, #6b7280 30%, #374151 100%)",
                            borderTop: "5px solid #C70A24",
                          }}
                        />
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="px-3 py-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <Link href={`/shop/product/${product._id}`}>
                          <p className="text-sm font-semibold text-gray-900 hover:text-[#C70A24] transition-colors truncate">
                            {product.title}
                          </p>
                        </Link>
                        <p className="text-xs text-gray-400">
                          {defaultVariant?.size || ""}
                        </p>
                      </div>
                      <p
                        className="text-sm font-bold ml-2 whitespace-nowrap"
                        style={{ color: "#C70A24" }}
                      >
                        ${lowestPrice.toFixed(2)}
                      </p>
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={() => handleQuickAddToCart(product)}
                      disabled={isBusy || allOutOfStock}
                      className="w-full mt-2 py-2 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ backgroundColor: "#C70A24" }}
                    >
                      <ShoppingCart size={14} />
                      {allOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
};

export default WishlistPage;
