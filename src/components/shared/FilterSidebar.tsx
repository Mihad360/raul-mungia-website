"use client";

import { useState } from "react";

type TFilterSidebarProps = {
  onPriceChange?: (min: number, max: number) => void;
  onCategoryChange?: (categories: string[]) => void;
  onSizeChange?: (sizes: string[]) => void;
};

const categories = ["BPC-157", "GHK-CU", "PUR-3R", "PUR-2T"];
const sizes = ["10 mg", "20 mg", "30 mg", "40 mg"];

const FilterSidebar = ({
  onPriceChange,
  onCategoryChange,
  onSizeChange,
}: TFilterSidebarProps) => {
  const [priceRange, setPriceRange] = useState(250);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const handleCategoryToggle = (cat: string) => {
    const updated = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(updated);
    onCategoryChange?.(updated);
  };

  const handleSizeToggle = (size: string) => {
    const updated = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(updated);
    onSizeChange?.(updated);
  };

  return (
    <aside className="w-full md:w-56 flex-shrink-0">
      {/* Price filter */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Filter By price
        </h3>
        <div className="space-y-3">
          {/* Slider */}
          <input
            type="range"
            min="0"
            max="500"
            value={priceRange}
            onChange={(e) => {
              setPriceRange(Number(e.target.value));
              onPriceChange?.(0, Number(e.target.value));
            }}
            className="w-full h-1 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #C70A24 0%, #C70A24 ${
                (priceRange / 500) * 100
              }%, #e5e7eb ${(priceRange / 500) * 100}%, #e5e7eb 100%)`,
            }}
          />

          {/* Price display */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Price: $0-${priceRange}</span>
            <button
              className="px-3 py-1 rounded-full text-white text-xs font-semibold"
              style={{ backgroundColor: "#C70A24" }}
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Filter By Category
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryToggle(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategories.includes(cat)
                  ? "text-white"
                  : "text-gray-600 bg-gray-100 hover:bg-gray-200"
              }`}
              style={
                selectedCategories.includes(cat)
                  ? { backgroundColor: "#C70A24" }
                  : {}
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Size filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">By Size</h3>
        <div className="flex flex-col gap-2">
          {sizes.map((size, idx) => (
            <label
              key={size}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedSizes.includes(size)}
                onChange={() => handleSizeToggle(size)}
                className="w-4 h-4 accent-[#C70A24] cursor-pointer"
              />
              <span className="text-xs text-gray-700">{size}</span>
              <span className="text-xs text-gray-400 ml-auto">0{idx + 1}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
