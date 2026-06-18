"use client";

import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";

type TFilters = {
  category: string;
  minPrice: number;
  maxPrice: number;
};

type TFilterSidebarProps = {
  filters: TFilters;
  onFiltersChange: (filters: TFilters) => void;
};

interface ICategory {
  _id: string;
  name: string;
  description?: string | null;
}

const FilterSidebar = ({ filters, onFiltersChange }: TFilterSidebarProps) => {
  const { data: categoriesData, isLoading: catLoading } =
    useGetAllCategoriesQuery(undefined);
  console.log(categoriesData);
  const categories: ICategory[] = categoriesData?.data || [];

  const handleCategoryClick = (categoryName: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === categoryName ? "" : categoryName,
    });
  };

  const handlePriceChange = (value: number) => {
    onFiltersChange({ ...filters, maxPrice: value });
  };

  const handleClearAll = () => {
    onFiltersChange({ category: "", minPrice: 0, maxPrice: 500 });
  };

  return (
    <aside className="w-full md:w-56 flex-shrink-0">
      {/* Header with clear button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
        {(filters.category || filters.maxPrice < 500) && (
          <button
            onClick={handleClearAll}
            className="text-xs text-[#C70A24] hover:underline cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Price filter */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Filter By price
        </h3>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="500"
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            className="w-full h-1 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #C70A24 0%, #C70A24 ${
                (filters.maxPrice / 500) * 100
              }%, #e5e7eb ${(filters.maxPrice / 500) * 100}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>
              Price: ${filters.minPrice}–${filters.maxPrice}
            </span>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Filter By Category
        </h3>
        {catLoading ? (
          <p className="text-xs text-gray-400">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="text-xs text-gray-400">No categories found</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategoryClick(cat.name)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  filters.category === cat._id
                    ? "text-white"
                    : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                }`}
                style={
                  filters.category === cat.name
                    ? { backgroundColor: "#C70A24" }
                    : {}
                }
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;
