"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Percent,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import ProductCard from "@/components/ui/ProductCard";
import {
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
} from "@/redux/api/shopApi";
import { useGetActiveDiscountQuery } from "@/redux/api/discountApi";
import { useGetAvailableCouponsQuery } from "@/redux/api/couponApi";
import { useAddToCartMutation } from "@/redux/api/cartApi";
import {
  useCheckInWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/redux/api/wishlistApi";
import { Loader } from "@/components/shared/Loader";
import { getClientToken } from "@/lib/auth/cookies.client";

interface IProductVariant {
  _id: string;
  size: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  weight: number;
}

interface IProduct {
  _id: string;
  title: string;
  productCode: string;
  category: { _id: string; name: string; description: string | null };
  variants: IProductVariant[];
  description: string;
  additionalInformation: string | null;
  compliance: string | null;
  mainImage: string;
  images: string[];
  lowStockThreshold: number;
  isActive: boolean;
}

interface DiscountTier {
  minQuantity: number;
  maxQuantity: number | null;
  discountPercent: number;
}

interface ActiveDiscount {
  _id: string;
  name: string;
  description: string;
  tiers: DiscountTier[];
  isActive: boolean;
}

interface AvailableCoupon {
  _id: string;
  code: string;
  discountPercent: number;
  expiryDate: string;
}

const ProductDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const router = useRouter();

  // ─── Auth state (client-only to avoid hydration mismatch) ─────
  const [isClient, setIsClient] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setIsClient(true), []);
  const isLoggedIn = isClient ? !!getClientToken() : false;

  // ─── Queries ───────────────────────────────────────────────────
  const { data: productData, isLoading, isError } = useGetProductByIdQuery(id);
  const product: IProduct | undefined = productData?.data;

  const { data: activeDiscountData } = useGetActiveDiscountQuery(undefined);
  const { data: availableCouponsData } = useGetAvailableCouponsQuery(undefined);

  const activeDiscount: ActiveDiscount | undefined = activeDiscountData?.data;
  const availableCoupons: AvailableCoupon[] = availableCouponsData?.data || [];

  // Wishlist check — only when logged in & product loaded
  const { data: wishlistCheckData } = useCheckInWishlistQuery(id, {
    skip: !product || !isLoggedIn,
  });
  const isWishlisted: boolean =
    wishlistCheckData?.data?.inWishlist ??
    wishlistCheckData?.data?.isInWishlist ??
    false;

  // ─── Mutations ─────────────────────────────────────────────────
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addToWishlist, { isLoading: isAddingWishlist }] =
    useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingWishlist }] =
    useRemoveFromWishlistMutation();

  const isWishlistMutating = isAddingWishlist || isRemovingWishlist;

  // ─── Local state ───────────────────────────────────────────────
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [activeImage, setActiveImage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCouponModal, setShowCouponModal] = useState(false);

  // Set defaults on product load
  useEffect(() => {
    if (product) {
      if (product.variants[0]) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedVariantId(product.variants[0]._id);
      }
      setActiveImage(product.mainImage);
    }
  }, [product]);

  const selectedVariant = product?.variants.find(
    (v) => v._id === selectedVariantId,
  );

  // ─── Bulk discount calculations ────────────────────────────────
  const calculateBulkDiscount = (qty: number): number => {
    if (!activeDiscount?.tiers) return 0;
    const tier = activeDiscount.tiers.find(
      (t) =>
        qty >= t.minQuantity &&
        (t.maxQuantity === null || qty <= t.maxQuantity),
    );
    return tier?.discountPercent || 0;
  };

  const calculateFinalPrice = () => {
    if (!selectedVariant)
      return {
        subtotal: 0,
        discountPercent: 0,
        discountAmount: 0,
        finalPrice: 0,
      };
    const subtotal = selectedVariant.price * quantity;
    const discountPercent = calculateBulkDiscount(quantity);
    const discountAmount = (subtotal * discountPercent) / 100;
    const finalPrice = subtotal - discountAmount;
    return { subtotal, discountPercent, discountAmount, finalPrice };
  };

  const { subtotal, discountPercent, discountAmount, finalPrice } =
    calculateFinalPrice();

  // ─── Auth helper ───────────────────────────────────────────────
  const requireAuth = (action: string): boolean => {
    const token = getClientToken();
    if (!token) {
      toast.error(`Please log in to ${action}`);
      router.push("/login");
      return false;
    }
    return true;
  };

  // ─── Handlers ──────────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!requireAuth("add items to cart")) return;
    if (!product || !selectedVariant) {
      toast.error("Please select a size");
      return;
    }
    if (selectedVariant.stock < quantity) {
      toast.error(`Only ${selectedVariant.stock} available in stock`);
      return;
    }

    try {
      await addToCart({
        productId: product._id,
        size: selectedVariant.size,
        quantity,
      }).unwrap();

      if (discountPercent > 0) {
        toast.success(
          `Added to cart! You saved ${discountPercent}% with bulk discount!`,
        );
      } else {
        toast.success(
          `Added ${quantity}× ${product.title} (${selectedVariant.size}) to cart`,
        );
      }
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to add to cart");
    }
  };

  const handleToggleWishlist = async () => {
    if (!requireAuth("use wishlist")) return;
    if (!product || isWishlistMutating) return;

    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product._id).unwrap();
        toast.success("Added to wishlist");
      }
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to update wishlist");
    }
  };

  const handleCopyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code ${code} copied to clipboard!`);
  };

  const getCouponExpiryStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysLeft = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 3600 * 24),
    );
    if (daysLeft < 0) return "Expired";
    if (daysLeft <= 3) return `Expires in ${daysLeft} days`;
    return `Valid until ${expiry.toLocaleDateString()}`;
  };

  // Related products
  const { data: relatedData } = useGetRelatedProductsQuery(id, {
    skip: !product,
  });
  const allRelatedProducts: IProduct[] = relatedData?.data || [];
  const itemsPerPage = 4;
  const totalPages = Math.ceil(allRelatedProducts.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const displayedProducts = allRelatedProducts.slice(
    startIdx,
    startIdx + itemsPerPage,
  );

  // ─── Loading & error states ────────────────────────────────────
  if (isLoading) {
    return (
      <main className="min-h-screen bg-white flex justify-center items-center">
        <Loader size="lg" />
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="min-h-screen bg-white flex flex-col justify-center items-center py-20">
        <p className="text-gray-600 mb-2">Product not found</p>
        <Link href="/shop" className="text-[#C70A24] hover:underline">
          ← Back to shop
        </Link>
      </main>
    );
  }

  const allImages = [product.mainImage, ...(product.images || [])];

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700 cursor-pointer">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/shop" className="hover:text-gray-700 cursor-pointer">
          Shop
        </Link>{" "}
        / <span className="text-gray-900 font-medium">{product.title}</span>
      </div>

      {/* Bulk discount banner */}
      {activeDiscount &&
        activeDiscount.tiers &&
        activeDiscount.tiers.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 mb-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-2">
                  <Percent className="text-green-700" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {activeDiscount.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {activeDiscount.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeDiscount.tiers.map((tier, idx) => (
                      <div
                        key={idx}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          quantity >= tier.minQuantity &&
                          (tier.maxQuantity === null ||
                            quantity <= tier.maxQuantity)
                            ? "bg-green-600 text-white"
                            : "bg-white text-gray-700 border border-gray-200"
                        }`}
                      >
                        {tier.maxQuantity
                          ? `${tier.minQuantity}-${tier.maxQuantity} items`
                          : `${tier.minQuantity}+ items`}
                        {" → "}
                        {tier.discountPercent}% OFF
                      </div>
                    ))}
                  </div>
                </div>
                <ShoppingBag className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        )}

      {/* Product section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left — Images */}
          <div>
            <div className="bg-gray-100 rounded-xl aspect-square flex items-center justify-center mb-4 overflow-hidden relative">
              <Image
                src={activeImage || product.mainImage}
                alt={product.title}
                fill
                className="object-contain p-8"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square bg-gray-100 rounded-lg cursor-pointer transition-all overflow-hidden relative ${
                    activeImage === img
                      ? "border-2 border-[#C70A24]"
                      : "border border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} ${idx + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right — Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            <p className="text-sm text-gray-500 mb-4">
              {product.category?.name} • {product.productCode}
            </p>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                {discountPercent > 0 ? (
                  <>
                    <span
                      className="text-3xl font-bold"
                      style={{ color: "#C70A24" }}
                    >
                      ${(finalPrice / quantity).toFixed(2)}
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        /each
                      </span>
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      ${selectedVariant?.price.toFixed(2)}
                    </span>
                    {selectedVariant?.originalPrice &&
                      selectedVariant.originalPrice > selectedVariant.price && (
                        <span className="text-lg text-gray-400 line-through ml-2">
                          Was: ${selectedVariant.originalPrice.toFixed(2)}
                        </span>
                      )}
                    <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                      {discountPercent}% OFF
                    </span>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <span
                      className="text-3xl font-bold"
                      style={{ color: "#C70A24" }}
                    >
                      ${selectedVariant?.price.toFixed(2)}
                    </span>
                    {selectedVariant?.originalPrice &&
                      selectedVariant.originalPrice > selectedVariant.price && (
                        <span className="text-lg text-gray-400 line-through">
                          ${selectedVariant.originalPrice.toFixed(2)}
                        </span>
                      )}
                  </div>
                )}
              </div>

              {/* Subtotal panel */}
              {quantity > 1 && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal ({quantity} items):
                    </span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  {selectedVariant?.originalPrice &&
                    selectedVariant.originalPrice > selectedVariant.price && (
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Original subtotal:</span>
                        <span className="line-through">
                          $
                          {(selectedVariant.originalPrice * quantity).toFixed(
                            2,
                          )}
                        </span>
                      </div>
                    )}
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Bulk discount ({discountPercent}%):</span>
                      <span>- ${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span style={{ color: "#C70A24" }}>
                      ${finalPrice.toFixed(2)}
                    </span>
                  </div>
                  {discountPercent > 0 && (
                    <p className="text-xs text-green-600 mt-2">
                      ✨ You saved ${discountAmount.toFixed(2)} with bulk
                      purchase!
                    </p>
                  )}
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Features */}
            <div className="space-y-2 mb-6">
              {[
                "Batch-Verified Purity 99%",
                "Third-Party Certified",
                "Our 99% Guarantee — Independent test bath, Full refund",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#C70A24] text-lg font-bold mt-0.5">
                    ●
                  </span>
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>

            {/* Size selector */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-900 mb-3 block">
                Size
              </label>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant._id}
                    onClick={() => {
                      setSelectedVariantId(variant._id);
                      // Reset qty if it exceeds the new variant's stock
                      if (quantity > variant.stock && variant.stock > 0) {
                        setQuantity(variant.stock);
                      }
                    }}
                    disabled={variant.stock === 0}
                    className={`px-4 py-2 rounded-lg border transition-all font-medium text-sm ${
                      selectedVariantId === variant._id
                        ? "border-[#C70A24] text-[#C70A24] bg-red-50"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    } ${variant.stock === 0 ? "opacity-40 cursor-not-allowed line-through" : "cursor-pointer"}`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
              {selectedVariant && (
                <p className="text-xs text-gray-500 mt-2">
                  {selectedVariant.stock > 0
                    ? `${selectedVariant.stock} in stock`
                    : "Out of stock"}
                </p>
              )}
            </div>

            {/* Quantity & Add to cart */}
            <div className="flex gap-3 mb-6">
              <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isAddingToCart}
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <span className="text-sm font-medium w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(selectedVariant?.stock || 999, quantity + 1),
                    )
                  }
                  disabled={
                    quantity >= (selectedVariant?.stock || 0) || isAddingToCart
                  }
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={
                  !selectedVariant ||
                  selectedVariant.stock === 0 ||
                  isAddingToCart
                }
                className="flex-1 py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#C70A24" }}
              >
                {isAddingToCart
                  ? "Adding..."
                  : selectedVariant?.stock === 0
                    ? "Out of Stock"
                    : "Add to cart"}
              </button>

              <button
                onClick={handleToggleWishlist}
                disabled={isWishlistMutating}
                className="px-6 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer disabled:opacity-60"
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Heart
                  size={20}
                  className={
                    isWishlisted
                      ? "fill-[#C70A24] text-[#C70A24]"
                      : "text-gray-400"
                  }
                />
              </button>
            </div>

            {/* Available coupons trigger */}
            {availableCoupons.length > 0 && (
              <div className="border-t border-gray-100 pt-4 mt-4">
                <button
                  onClick={() => setShowCouponModal(true)}
                  className="flex items-center gap-2 text-sm text-[#C70A24] hover:underline cursor-pointer w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Ticket size={16} />
                    <span>Available Coupons & Offers</span>
                  </div>
                  <span className="bg-red-50 text-[#C70A24] px-2 py-0.5 rounded-full text-xs font-semibold">
                    {availableCoupons.length}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-200">
        <div className="flex gap-8 mb-8 border-b border-gray-200">
          {["description", "additional", "compliance"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-medium transition-colors cursor-pointer capitalize ${
                activeTab === tab
                  ? "text-[#C70A24] border-b-2 border-[#C70A24]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "additional"
                ? "Additional Information"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {activeTab === "description" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Description
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
          {activeTab === "additional" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Information
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.additionalInformation ||
                  "No additional information available."}
              </p>
            </div>
          )}
          {activeTab === "compliance" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Compliance
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.compliance || "No compliance information available."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Related products */}
      {allRelatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {displayedProducts.map((p) => {
              const lowestPrice = Math.min(...p.variants.map((v) => v.price));
              const defaultSize = p.variants[0]?.size || "";
              return (
                <ProductCard
                  key={p._id}
                  id={p._id}
                  name={p.title}
                  variant={defaultSize}
                  price={`$${lowestPrice.toFixed(2)}`}
                  image={p.mainImage}
                />
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#C70A24] hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                      page === currentPage
                        ? "bg-[#C70A24] text-white"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#C70A24] hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </section>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Available Coupons
              </h3>
              <button
                onClick={() => setShowCouponModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-3">
              {availableCoupons.map((coupon) => (
                <div
                  key={coupon._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono font-bold">
                          {coupon.code}
                        </code>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          {coupon.discountPercent}% OFF
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {getCouponExpiryStatus(coupon.expiryDate)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopyCouponCode(coupon.code)}
                      className="text-sm bg-[#C70A24] text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductDetailPage;
