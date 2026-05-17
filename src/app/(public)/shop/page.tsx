"use client";

import { useState } from "react";
import FilterSidebar from "@/components/shared/FilterSidebar";
import ProductCard from "@/components/ui/ProductCard";
import BlogSection from "@/components/home/BlogSection";
import CTABanner from "@/components/home/CTABanner";

const allProducts = [
  { id: 1, name: "BPC-157", variant: "5 mg / Vial", price: "$49.99" },
  { id: 2, name: "BPC-157", variant: "5 mg / Vial", price: "$49.99" },
  { id: 3, name: "BPC-157", variant: "5 mg / Vial", price: "$49.99" },
  { id: 4, name: "BPC-157", variant: "5 mg / Vial", price: "$49.99" },
  { id: 5, name: "BPC-157", variant: "5 mg / Vial", price: "$49.99" },
  { id: 6, name: "TB-500", variant: "5 mg / Vial", price: "$39.99" },
  { id: 7, name: "MK-677", variant: "30 mg / Bottle", price: "$59.99" },
  { id: 8, name: "LGD-4033", variant: "10 mg / Capsule", price: "$69.99" },
  { id: 9, name: "BPC-157", variant: "5 mg / Vial", price: "$49.99" },
  { id: 10, name: "CJC-1295", variant: "2 mg / Vial", price: "$39.99" },
  { id: 11, name: "Ipamorelin", variant: "5 mg / Vial", price: "$44.99" },
  { id: 12, name: "Melanotan II", variant: "10 mg / Vial", price: "$54.99" },
];

const ShopPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("default");
  const itemsPerPage = 9;

  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const displayedProducts = allProducts.slice(
    startIdx,
    startIdx + itemsPerPage,
  );

  return (
    <main className="min-h-screen bg-white">
      {/* <Navbar /> */}

      {/* Shop header */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Shop</h1>
            <p className="text-sm text-gray-500">
              Showing 1–{Math.min(startIdx + itemsPerPage, allProducts.length)}{" "}
              of {allProducts.length} results
            </p>
          </div>

          {/* Sorting dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 hover:border-gray-300 transition-colors outline-none focus:border-[#C70A24]"
          >
            <option value="default">Default sorting</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </section>

      {/* Main content — filters + products */}
      <div className="max-w-7xl mx-auto px-6 pb-14">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar filters */}
          <FilterSidebar />

          {/* Product grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id} // Add this
                  name={product.name}
                  variant={product.variant}
                  price={product.price}
                />
              ))}
            </div>

            {/* "View More Products" button at bottom */}
            <div className="flex justify-center mt-10">
              <button
                className="px-6 py-2.5 rounded-lg border text-sm font-semibold hover:border-gray-400 transition-colors"
                style={{ borderColor: "#C70A24", color: "#C70A24" }}
              >
                View More Products
              </button>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {/* Previous button */}
              {currentPage > 1 && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#C70A24] hover:text-white transition"
                  aria-label="Previous page"
                >
                  ←
                </button>
              )}

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition ${
                      page === currentPage
                        ? "bg-[#C70A24] text-white"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              {/* Next button */}
              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#C70A24] hover:text-white transition"
                  aria-label="Next page"
                >
                  →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <BlogSection />
      <CTABanner />
    </main>
  );
};

export default ShopPage;
