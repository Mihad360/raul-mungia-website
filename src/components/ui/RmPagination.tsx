// RmPagination.tsx
"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";

type TRmPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
};

const RmPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = false,
}: TRmPaginationProps) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: number[] = [];
    const max = 5;

    let start = Math.max(1, currentPage - Math.floor(max / 2));
    let end = start + max - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - max + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {/* Previous button */}
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#C70A24] hover:text-white transition"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>
      )}

      {/* First page button */}
      {showFirstLast && currentPage > 3 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-8 h-8 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100 transition"
          >
            1
          </button>
          <span className="text-gray-400">...</span>
        </>
      )}

      {/* Page numbers */}
      {getPages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 rounded-full text-sm font-medium transition ${
            page === currentPage
              ? "bg-[#C70A24] text-white"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Last page button */}
      {showFirstLast && currentPage < totalPages - 2 && (
        <>
          <span className="text-gray-400">...</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-8 h-8 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100 transition"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next button */}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#C70A24] hover:text-white transition"
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
};

export default RmPagination;
