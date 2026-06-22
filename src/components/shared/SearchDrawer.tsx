"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Search as SearchIcon, Package } from "lucide-react";
import { useGetAllProductsQuery } from "@/redux/api/shopApi";

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Variant {
  size: string;
  price: number;
  originalPrice?: number;
  stock: number;
}

interface Product {
  _id: string;
  title: string;
  productCode: string;
  mainImage: string;
  variants: Variant[];
  category?: { name: string };
  categoryName?: string;
}

// Lightweight debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const SearchDrawer = ({ isOpen, onClose }: SearchDrawerProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedTerm = useDebounce(searchTerm.trim(), 300);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch only when 2+ chars typed
  const { data, isFetching } = useGetAllProductsQuery(
    { searchTerm: debouncedTerm, limit: 6 },
    { skip: debouncedTerm.length < 2 },
  );

  const products: Product[] = data?.data || [];
  const totalResults = data?.meta?.total || 0;

  // Reset on close
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isOpen) setSearchTerm("");
  }, [isOpen]);

  // Auto-focus on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleViewAllClick = () => {
    router.push(`/shop?searchTerm=${encodeURIComponent(debouncedTerm)}`);
    onClose();
  };

  const getLowestPrice = (variants: Variant[]) => {
    if (!variants || variants.length === 0) return 0;
    return Math.min(...variants.map((v) => v.price));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Search Input ─── */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <SearchIcon
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for BPC-157, GHK-CU, peptides..."
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C70A24] focus:ring-2 focus:ring-[#C70A24]/10 text-sm transition-all"
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
              aria-label="Close search"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ─── Results Area ─── */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Initial empty state */}
          {!debouncedTerm && (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                <SearchIcon size={22} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                Start typing to search
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Find products by name, code, or description
              </p>
            </div>
          )}

          {/* Loading skeletons */}
          {debouncedTerm && isFetching && (
            <div className="p-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                  </div>
                  <div className="w-12 h-4 bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {debouncedTerm && !isFetching && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                <Package size={22} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                No products found for &ldquo;{debouncedTerm}&rdquo;
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Try a different keyword or check the spelling
              </p>
            </div>
          )}

          {/* Results list */}
          {debouncedTerm && !isFetching && products.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50/50">
                Products
              </div>
              <div className="p-2">
                {products.map((product) => {
                  const lowestPrice = getLowestPrice(product.variants);
                  const categoryName =
                    product.categoryName || product.category?.name;

                  return (
                    <Link
                      key={product._id}
                      href={`/shop/product/${product._id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.mainImage ? (
                          <Image
                            src={product.mainImage}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={20} className="text-gray-300" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-[#C70A24] transition-colors truncate">
                          {product.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">
                            {product.productCode}
                          </span>
                          {categoryName && (
                            <>
                              <span className="text-xs text-gray-300">•</span>
                              <span className="text-xs text-gray-500 truncate">
                                {categoryName}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="text-sm font-bold text-[#C70A24] flex-shrink-0 ml-2">
                        ${lowestPrice.toFixed(2)}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* View all results button */}
              {totalResults > products.length && (
                <button
                  onClick={handleViewAllClick}
                  className="w-full px-4 py-3 text-sm font-semibold text-[#C70A24] hover:bg-gray-50 transition-colors border-t border-gray-100 cursor-pointer"
                >
                  View all {totalResults} results →
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer hint bar */}
        {debouncedTerm && products.length > 0 && (
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end text-xs text-gray-500">
            <span>Esc to close</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDrawer;
