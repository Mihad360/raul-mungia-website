"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "../ui/ProductCard";

const categories = ["BPC-157", "GHK-CU", "PUR-3R", "PUR-2T"];

const allProducts = [
  {
    id: 1,
    category: "BPC-157",
    name: "BPC-157",
    variant: "5 mg / Vial",
    price: "$49.99",
  },
  {
    id: 2,
    category: "BPC-157",
    name: "BPC-157",
    variant: "5 mg / Vial",
    price: "$49.99",
  },
  {
    id: 3,
    category: "BPC-157",
    name: "BPC-157",
    variant: "5 mg / Vial",
    price: "$49.99",
  },
  {
    id: 4,
    category: "BPC-157",
    name: "BPC-157",
    variant: "5 mg / Vial",
    price: "$49.99",
  },
  {
    id: 5,
    category: "BPC-157",
    name: "BPC-157",
    variant: "5 mg / Vial",
    price: "$49.99",
  },
  {
    id: 6,
    category: "BPC-157",
    name: "TB-500",
    variant: "5 mg / Vial",
    price: "$39.99",
  },
  {
    id: 7,
    category: "BPC-157",
    name: "MK-677",
    variant: "30 mg / Bottle",
    price: "$59.99",
  },
  {
    id: 8,
    category: "BPC-157",
    name: "LGD-4033",
    variant: "10 mg / Capsule",
    price: "$69.99",
  },
  {
    id: 9,
    category: "BPC-157",
    name: "BPC-157",
    variant: "5 mg / Vial",
    price: "$49.99",
  },
  {
    id: 10,
    category: "BPC-157",
    name: "CJC-1295",
    variant: "2 mg / Vial",
    price: "$39.99",
  },
  {
    id: 11,
    category: "BPC-157",
    name: "Ipamorelin",
    variant: "5 mg / Vial",
    price: "$44.99",
  },
  {
    id: 12,
    category: "BPC-157",
    name: "Melanotan II",
    variant: "10 mg / Vial",
    price: "$54.99",
  },
  {
    id: 13,
    category: "GHK-CU",
    name: "GHK-CU",
    variant: "5 mg / Vial",
    price: "$44.99",
  },
  {
    id: 14,
    category: "PUR-3R",
    name: "PUR-3R",
    variant: "10 mg / Vial",
    price: "$54.99",
  },
  {
    id: 15,
    category: "PUR-2T",
    name: "PUR-2T",
    variant: "10 mg / Vial",
    price: "$59.99",
  },
];

const BestSellingSection = () => {
  const [activeCategory, setActiveCategory] = useState("BPC-157");

  const filtered = allProducts.filter((p) => p.category === activeCategory);

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

          {/* Category tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
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
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.slice(0, 12).map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              variant={product.variant}
              price={product.price}
            />
          ))}
        </div>

        {/* View more */}
        <div className="flex justify-center mt-10">
          <Link
            href="/shop"
            className="px-6 py-2.5 rounded-lg border text-sm font-semibold text-gray-700 hover:border-gray-400 transition-colors"
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
