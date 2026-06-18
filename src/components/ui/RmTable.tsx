// RmTable.tsx
"use client";

import React from "react";

type Column<T> = {
  key: keyof T | string;
  title: string;
  render?: (record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: "left" | "center" | "right";
  className?: string;
};

type RmTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  rowClassName?: string | ((record: T, index: number) => string);
  onRowClick?: (record: T, index: number) => void;
  bordered?: boolean;
  striped?: boolean;
  hover?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RmTable = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyText = "No data found",
  rowClassName,
  onRowClick,
  bordered = false,
  striped = true,
  hover = true,
}: RmTableProps<T>) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-400 text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex justify-center items-center py-12 text-gray-400 text-sm">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className={`w-full ${bordered ? "border border-gray-200" : ""}`}>
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col.key as string}
                className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide ${
                  col.align === "center"
                    ? "text-center"
                    : col.align === "right"
                      ? "text-right"
                      : "text-left"
                } ${col.className || ""}`}
                style={{ width: col.width }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const rowClickable = onRowClick ? "cursor-pointer" : "";
            const bgColor =
              striped && rowIndex % 2 === 1 ? "bg-gray-50/50" : "";
            const hoverClass = hover ? "hover:bg-gray-50" : "";
            const customRowClass =
              typeof rowClassName === "function"
                ? rowClassName(row, rowIndex)
                : rowClassName || "";

            return (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row, rowIndex)}
                className={`border-b border-gray-100 last:border-0 transition-colors ${bgColor} ${hoverClass} ${rowClickable} ${customRowClass}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key as string}
                    className={`px-4 py-3.5 text-sm ${
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                          ? "text-right"
                          : "text-left"
                    }`}
                  >
                    {col.render
                      ? col.render(row, rowIndex)
                      : (row[col.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RmTable;
