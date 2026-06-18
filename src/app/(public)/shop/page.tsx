"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import FilterSidebar from "@/components/shared/FilterSidebar";
import ProductCard from "@/components/ui/ProductCard";
import CTABanner from "@/components/home/CTABanner";
import { useGetAllProductsQuery } from "@/redux/api/shopApi";
import { useAddToCartMutation } from "@/redux/api/cartApi";
import { Loader } from "@/components/shared/Loader";
import RmPagination from "@/components/ui/RmPagination";
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
  categoryName: string;
  variants: IProductVariant[];
  description: string;
  mainImage: string;
  images: string[];
  isActive: boolean;
}

const ITEMS_PER_PAGE = 9;

const ShopPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("default");
  const [filters, setFilters] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 500,
  });
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  const [addToCart] = useAddToCartMutation();

  const sortMap: Record<string, string> = {
    default: "",
    "price-low": "variants.price",
    "price-high": "-variants.price",
    newest: "-createdAt",
  };

  const queryArgs = {
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sort: sortMap[sortBy] || undefined,
    categoryName: filters.category || undefined,
    minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
    maxPrice: filters.maxPrice < 500 ? filters.maxPrice : undefined,
  };

  const { data, isLoading, isFetching, isError } =
    useGetAllProductsQuery(queryArgs);

  const products: IProduct[] = data?.data || [];
  const meta = data?.meta || {
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPage: 1,
  };

  const startIdx = (meta.page - 1) * meta.limit;
  const showingFrom = products.length > 0 ? startIdx + 1 : 0;
  const showingTo = startIdx + products.length;

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  /** Quick add — uses first variant + qty 1 */
  const handleQuickAddToCart = async (product: IProduct) => {
    // Auth check
    const token = getClientToken();
    if (!token) {
      toast.error("Please log in to add items to cart");
      router.push("/login");
      return;
    }

    // Prevent rapid double-clicks
    if (addingProductId) return;

    const defaultVariant = product.variants[0];
    if (!defaultVariant) {
      toast.error("No variants available for this product");
      return;
    }
    if (defaultVariant.stock === 0) {
      toast.error("This product is out of stock");
      return;
    }

    try {
      setAddingProductId(product._id);
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
      setAddingProductId(null);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Shop</h1>
            <p className="text-sm text-gray-500">
              {isLoading ? (
                "Loading products..."
              ) : meta.total > 0 ? (
                <>
                  Showing {showingFrom}–{showingTo} of {meta.total} results
                </>
              ) : (
                "No products available"
              )}
            </p>
          </div>

          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 hover:border-gray-300 transition-colors outline-none focus:border-[#C70A24] disabled:opacity-60 cursor-pointer"
          >
            <option value="default">Default sorting</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-14">
        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          <div className="flex-1">
            {isLoading && (
              <div className="flex justify-center items-center py-20">
                <Loader size="lg" />
              </div>
            )}

            {!isLoading && isError && (
              <div className="text-center py-20">
                <p className="text-gray-600 mb-2">Failed to load products</p>
                <p className="text-sm text-gray-400">
                  Please try refreshing the page
                </p>
              </div>
            )}

            {!isLoading && !isError && products.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-600 mb-2">No products found</p>
                <p className="text-sm text-gray-400">
                  Try adjusting your filters
                </p>
              </div>
            )}

            {!isLoading && !isError && products.length > 0 && (
              <>
                <div
                  className={`grid grid-cols-2 md:grid-cols-3 gap-4 transition-opacity ${
                    isFetching ? "opacity-60" : "opacity-100"
                  }`}
                >
                  {products.map((product) => {
                    const lowestPrice = Math.min(
                      ...product.variants.map((v) => v.price),
                    );
                    const defaultSize = product.variants[0]?.size || "";

                    return (
                      <ProductCard
                        key={product._id}
                        id={product._id}
                        name={product.title}
                        variant={defaultSize}
                        price={`$${lowestPrice.toFixed(2)}`}
                        image={product.mainImage}
                        onAddToCart={() => handleQuickAddToCart(product)}
                      />
                    );
                  })}
                </div>

                <RmPagination
                  currentPage={meta.page}
                  totalPages={meta.totalPage}
                  onPageChange={setCurrentPage}
                  showFirstLast
                />
              </>
            )}
          </div>
        </div>
      </div>
      <CTABanner />
    </main>
  );
};

export default ShopPage;
