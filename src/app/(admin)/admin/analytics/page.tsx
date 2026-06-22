/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { TrendingUp, DollarSign, Users, Package, Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  useGetAnalyticsStatsQuery,
  useGetSalesRevenueTrendsQuery,
  useGetRevenueByProductQuery,
} from "@/redux/api/adminApiV3";

// ─── Helpers ──────────────────────────────────────────────────
const formatCurrency = (value: number) =>
  `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const SectionLoader = () => (
  <div className="flex items-center justify-center py-16">
    <Loader2 size={28} className="animate-spin text-gray-400" />
  </div>
);

// ─── KPI Card ─────────────────────────────────────────────────
const KPICard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: any;
  color: string;
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
          style={{ backgroundColor: color }}
        >
          <Icon size={24} />
        </div>
      </div>
      <p className="text-sm text-gray-600 font-medium mb-2">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

// ─── Sales & Revenue Chart ────────────────────────────────────
const SalesRevenueChart = ({
  data,
  isLoading,
}: {
  data: any[];
  isLoading: boolean;
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Sales & Revenue Trends
      </h3>
      <div className="h-80 w-full">
        {isLoading ? (
          <SectionLoader />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="revenueGradient2"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={
                  ((value: any, name: string) => {
                    const numValue =
                      typeof value === "number" ? value : Number(value) || 0;
                    // Sales is a count, Revenue is currency
                    if (name === "Sales") {
                      return [numValue.toLocaleString(), ""];
                    }
                    return [formatCurrency(numValue), ""];
                  }) as any
                }
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#revenueGradient2)"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#salesGradient)"
                name="Sales"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

// ─── Revenue by Product (Side Panel) ──────────────────────────
const RevenueByProductPanel = ({
  data,
  isLoading,
}: {
  data: any;
  isLoading: boolean;
}) => {
  const products = data?.products || [];

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Revenue by Product
      </h3>
      {isLoading ? (
        <SectionLoader />
      ) : products.length === 0 ? (
        <div className="py-12 text-center">
          <Package size={36} className="mx-auto text-gray-300 mb-2 stroke-1" />
          <p className="text-sm text-gray-500">No sales yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product: any) => (
            <div
              key={product.productId}
              className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
            >
              <div className="relative w-9 h-9 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                {product.mainImage ? (
                  <Image
                    src={product.mainImage}
                    alt={product.productName}
                    fill
                    className="object-contain p-0.5"
                    sizes="36px"
                  />
                ) : (
                  <Package
                    size={16}
                    className="text-gray-300 absolute inset-0 m-auto"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {product.productCode}
                </p>
                <p className="text-xs text-gray-500">
                  {product.percentOfTotal}% of total
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(product.revenue)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { data: statsResponse, isLoading: statsLoading } =
    useGetAnalyticsStatsQuery({});
  const { data: trendsResponse, isLoading: trendsLoading } =
    useGetSalesRevenueTrendsQuery({ months: 5 });
  const { data: byProductResponse, isLoading: byProductLoading } =
    useGetRevenueByProductQuery({ limit: 10 });

  const stats = statsResponse?.data;
  const trends = trendsResponse?.data || [];
  const byProduct = byProductResponse?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Comprehensive business insights and performance metrics
        </p>
      </div>

      {/* KPI Cards Grid */}
      {statsLoading ? (
        <div className="bg-white rounded-lg border border-gray-100">
          <SectionLoader />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Sales"
            value={(stats?.totalSales || 0).toLocaleString()}
            icon={TrendingUp}
            color="#3b82f6"
          />
          <KPICard
            title="Revenue"
            value={formatCurrency(stats?.revenue || 0)}
            icon={DollarSign}
            color="#10b981"
          />
          <KPICard
            title="Customers"
            value={(stats?.customers || 0).toLocaleString()}
            icon={Users}
            color="#a855f7"
          />
          <KPICard
            title="Products Sold"
            value={(stats?.productsSold || 0).toLocaleString()}
            icon={Package}
            color="#f59e0b"
          />
        </div>
      )}

      {/* Sales & Revenue Trends + Revenue by Product */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesRevenueChart data={trends} isLoading={trendsLoading} />
        </div>
        <div>
          <RevenueByProductPanel
            data={byProduct}
            isLoading={byProductLoading}
          />
        </div>
      </div>
    </div>
  );
}
