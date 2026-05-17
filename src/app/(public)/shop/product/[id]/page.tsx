"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";

const ProductDetailPage = ({ params }: { params: { id: string } }) => {
  const [selectedSize, setSelectedSize] = useState("10 mg");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const product = {
    id: 1,
    name: "T-Trizenix",
    price: "$49.99",
    originalPrice: "$69.99",
    rating: 4.5,
    reviews: 128,
    description:
      "GHK-Cu is a naturally-occurring copper complex of the tripeptide glycine-histidine-lysine. The peptide has a strong affinity for copper and has been found in human plasma. In laboratory research settings, GHK-Cu has been shown to promote wound healing, and increase skin elasticity and firmness.",
    features: [
      "Batch-Verified Purity 99%",
      "Third-Party Certified",
      "Our 99% Guarantee Independent test bath Full refund",
    ],
    sizes: ["10 mg", "50 mg", "100 mg"],
    images: [
      "/product-main.jpg",
      "/product-thumb-1.jpg",
      "/product-thumb-2.jpg",
      "/product-cert.jpg",
    ],
    descriptionText: `We strive to provide products that surpass standard purity levels, ensuring your laboratory has access to reliable materials for critical research.

GHK-Cu is a naturally-occurring copper complex of the tripeptide glycine-histidine-lysine. The peptide has a strong affinity for copper and has been found in human plasma. In laboratory research settings, GHK-Cu has been shown to promote wound healing, and increase skin elasticity and firmness.

Current scientific literature explores GHK-Cu's burgeoning relevance in aging and longevity related to axonal growth, sensorimotor tone, and enzyme regulation. It is thought of interest to measure immune and inflammatory markers.

We strive to provide products that surpass standard purity levels, ensuring your laboratory has access to reliable materials for critical research.

GHK-Cu is a naturally-occurring copper complex of the tripeptide glycine-histidine-lysine. The peptide has a strong affinity for copper and has been found in human plasma. In laboratory research settings, GHK-Cu has been shown to promote wound healing, and increase skin elasticity and firmness.

Current scientific literature explores GHK-Cu's burgeoning relevance in aging and longevity related to axonal growth, sensorimotor tone, and enzyme regulation.`,
  };

  const allRelatedProducts = [
    { id: 2, name: "BPC-157", variant: "5 mg / Vial", price: "$49.99" },
    { id: 3, name: "BPC-357", variant: "5 mg / Vial", price: "$49.99" },
    { id: 4, name: "BPC-157", variant: "5 mg / Vial", price: "$49.99" },
    { id: 5, name: "BPC-157", variant: "5 mg / Vial", price: "$49.99" },
    { id: 6, name: "TB-500", variant: "5 mg / Vial", price: "$39.99" },
    { id: 7, name: "MK-677", variant: "30 mg / Bottle", price: "$59.99" },
    { id: 8, name: "LGD-4033", variant: "10 mg / Capsule", price: "$69.99" },
  ];

  // Pagination logic
  const itemsPerPage = 4;
  const totalPages = Math.ceil(allRelatedProducts.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const displayedProducts = allRelatedProducts.slice(
    startIdx,
    startIdx + itemsPerPage,
  );

  const handleAddToCart = () => {
    console.log(`Added ${quantity}x ${product.name} (${selectedSize}) to cart`);
  };

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700 cursor-pointer">
          Home
        </Link>{" "}
        / Research Peptides /{" "}
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      {/* Product section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left — Images */}
          <div>
            {/* Main image */}
            <div className="bg-gray-100 rounded-xl aspect-square flex items-center justify-center mb-4 overflow-hidden">
              <div
                className="w-32 h-40 rounded-lg shadow-xl"
                style={{
                  background:
                    "linear-gradient(180deg, #9ca3af 0%, #6b7280 30%, #374151 100%)",
                  borderTop: "6px solid #C70A24",
                }}
              />
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((_, idx) => (
                <div
                  key={idx}
                  className="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:border-2 border-gray-300 transition-colors"
                />
              ))}
            </div>
          </div>

          {/* Right — Info */}
          <div>
            {/* Title & price */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold" style={{ color: "#C70A24" }}>
                {product.price}
              </span>
              <span className="text-lg text-gray-400 line-through">
                {product.originalPrice}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Features */}
            <div className="space-y-2 mb-6">
              {product.features.map((feature, idx) => (
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
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border transition-all cursor-pointer font-medium text-sm ${
                      selectedSize === size
                        ? "border-[#C70A24] text-[#C70A24] bg-red-50"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to cart */}
            <div className="flex gap-3 mb-6">
              {/* Quantity */}
              <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer font-bold"
                >
                  −
                </button>
                <span className="text-sm font-medium w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer"
                style={{ backgroundColor: "#C70A24" }}
              >
                Add to cart
              </button>

              {/* Wishlist button */}
              <button
                onClick={handleAddToWishlist}
                className="px-6 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
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

            {/* Promo badges */}
            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg">
                <span className="text-2xl">🏷️</span>
                <div className="text-xs">
                  <p className="font-semibold text-gray-900">Save 10%</p>
                  <p className="text-gray-600">Buy 3-5 Products</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg">
                <span className="text-2xl">🏷️</span>
                <div className="text-xs">
                  <p className="font-semibold text-gray-900">Save 15%</p>
                  <p className="text-gray-600">Buy 6+ Products</p>
                </div>
              </div>
            </div>
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

        {/* Tab content */}
        <div className="space-y-6">
          {activeTab === "description" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Information
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.descriptionText}
              </p>
            </div>
          )}
          {activeTab === "additional" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Information
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.descriptionText}
              </p>
            </div>
          )}
          {activeTab === "compliance" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Compliance
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.descriptionText}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Related products with pagination */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Related Products
        </h2>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              variant={product.variant}
              price={product.price}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2">
          {/* Previous button */}
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#C70A24] hover:text-white transition-colors cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-[#C70A24] text-white"
                  : "text-gray-500 hover:bg-gray-100 cursor-pointer"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next button */}
          {currentPage < totalPages && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#C70A24] hover:text-white transition-colors cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProductDetailPage;
