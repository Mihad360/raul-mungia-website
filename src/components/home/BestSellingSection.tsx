/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "../ui/ProductCard";
import { useGetAllProductsQuery } from "@/redux/api/shopApi";
import { Loader } from "@/components/shared/Loader";

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

// Extract unique categories from products (dynamic)
const getUniqueCategories = (products: IProduct[]): string[] => {
  const categories = new Set<string>();
  products.forEach((product) => {
    if (product.category?.name) {
      categories.add(product.category.name);
    } else if (product.categoryName) {
      categories.add(product.categoryName);
    }
  });
  return Array.from(categories);
};

const BestSellingSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [allCategories, setAllCategories] = useState<string[]>([]);

  // Fetch products (you might want to add a "best selling" flag or sort by sales)
  const { data, isLoading, isError } = useGetAllProductsQuery({
    page: 1,
    limit: 50, // Get enough products to show categories
    sort: "-salesCount", // Sort by best selling (if you have sales count field)
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allProducts: IProduct[] = data?.data || [];

  // Extract unique categories when products load
  useEffect(() => {
    if (allProducts.length > 0) {
      const categories = getUniqueCategories(allProducts);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAllCategories(categories);
      // Set first category as active if none selected
      if (categories.length > 0 && !activeCategory) {
        setActiveCategory(categories[0]);
      }
    }
  }, [allProducts, activeCategory]);

  // Filter products by category
  const filteredProducts = allProducts.filter((product) => {
    const productCategory = product.category?.name || product.categoryName;
    return productCategory === activeCategory;
  });

  // Get best selling (top 12) - you can sort by rating, sales, or just take first 12
  const bestSellingProducts = [...filteredProducts]
    .sort((a, b) => {
      // You can add custom sorting logic here
      // Example: sort by salesCount or rating if available
      return (b as any).salesCount - (a as any).salesCount || 0;
    })
    .slice(0, 12);

  if (isLoading) {
    return (
      <section className="w-full bg-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center items-center py-20">
            <Loader size="lg" />
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full bg-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-20">
            <p className="text-gray-600 mb-2">Failed to load products</p>
            <p className="text-sm text-gray-400">
              Please try refreshing the page
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (allProducts.length === 0) {
    return null; // Don't show section if no products
  }

  return (
    <section className="w-full bg-white py-14">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <h2
            className="text-2xl font-bold text-gray-900 leading-snug"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Best Selling
            <br />
            products
          </h2>

          {/* Category tabs - Dynamic from API */}
          {allCategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  style={
                    activeCategory === cat ? { backgroundColor: "#C70A24" } : {}
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product grid */}
        {bestSellingProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bestSellingProducts.map((product) => {
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
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this category</p>
          </div>
        )}

        {/* View more */}
        <div className="flex justify-center mt-10">
          <Link
            href="/shop"
            className="px-6 py-2.5 rounded-lg border text-sm font-semibold transition-colors hover:bg-[#C70A24] hover:text-white hover:border-[#C70A24]"
            style={{ borderColor: "#C70A24", color: "#C70A24" }}
          >
            View More Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellingSection;
