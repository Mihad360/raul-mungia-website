/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import {
  DollarSign,
  ShoppingCart,
  Users,
  XCircle,
  Loader2,
  Package,
} from "lucide-react";
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
  useGetDashboardStatsQuery,
  useGetDashboardRevenueOverviewQuery,
  useGetDashboardTopProductsQuery,
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
  icon: Icon,
  title,
  value,
  trend,
  bgColor,
}: {
  icon: any;
  title: string;
  value: string;
  trend: number;
  bgColor: string;
}) => {
  const isPositive = trend >= 0;
  const trendColor = isPositive ? "text-green-600" : "text-red-600";

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
          style={{ backgroundColor: bgColor }}
        >
          <Icon size={24} />
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(trend)}%
        </div>
      </div>
      <p className="text-sm text-gray-600 font-medium mb-2">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

// ─── Revenue Chart ────────────────────────────────────────────
const RevenueChart = ({
  data,
  isLoading,
}: {
  data: any[];
  isLoading: boolean;
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Revenue Overview
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Monthly revenue and expenses tracking
      </p>
      <div className="h-64 w-full">
        {isLoading ? (
          <SectionLoader />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#374151" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#374151" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="expensesGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
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
                  ((value: any) => {
                    const numValue =
                      typeof value === "number" ? value : Number(value) || 0;
                    return [formatCurrency(numValue), ""];
                  }) as any
                }
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#374151"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#dc2626"
                strokeWidth={2}
                fill="url(#expensesGradient)"
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

// ─── Top Products ─────────────────────────────────────────────
const TopProducts = ({
  products,
  isLoading,
}: {
  products: any[];
  isLoading: boolean;
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Products</h3>
      <p className="text-sm text-gray-500 mb-6">
        Best performing products this month
      </p>

      {isLoading ? (
        <SectionLoader />
      ) : products.length === 0 ? (
        <div className="py-12 text-center">
          <Package size={36} className="mx-auto text-gray-300 mb-2 stroke-1" />
          <p className="text-sm text-gray-500">No sales yet this month</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.productId}
              className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0"
            >
              <div className="relative w-10 h-10 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                {product.mainImage ? (
                  <Image
                    src={product.mainImage}
                    alt={product.productName}
                    fill
                    className="object-contain p-0.5"
                    sizes="40px"
                  />
                ) : (
                  <Package
                    size={18}
                    className="text-gray-300 absolute inset-0 m-auto"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {product.productCode}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {product.totalQuantitySold} sales
                </p>
              </div>
              <p className="font-semibold text-gray-900 text-sm">
                {formatCurrency(product.totalRevenue)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: statsResponse, isLoading: statsLoading } =
    useGetDashboardStatsQuery({});
  const { data: chartResponse, isLoading: chartLoading } =
    useGetDashboardRevenueOverviewQuery({ months: 7 });
  const { data: topResponse, isLoading: topLoading } =
    useGetDashboardTopProductsQuery({ limit: 5 });

  const stats = statsResponse?.data;
  const chartData = chartResponse?.data || [];
  const topProducts = topResponse?.data || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, Admin
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your business today.
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
            icon={DollarSign}
            title="Total Revenue"
            value={formatCurrency(stats?.totalRevenue?.total || 0)}
            trend={stats?.totalRevenue?.percentChange || 0}
            bgColor="#10b981"
          />
          <KPICard
            icon={ShoppingCart}
            title="Total Orders"
            value={(stats?.totalOrders?.total || 0).toLocaleString()}
            trend={stats?.totalOrders?.percentChange || 0}
            bgColor="#3b82f6"
          />
          <KPICard
            icon={Users}
            title="Total Customers"
            value={(stats?.totalCustomers?.total || 0).toLocaleString()}
            trend={stats?.totalCustomers?.percentChange || 0}
            bgColor="#a855f7"
          />
          <KPICard
            icon={XCircle}
            title="Total Cancel Order"
            value={(stats?.totalCancelledOrders?.total || 0).toLocaleString()}
            trend={stats?.totalCancelledOrders?.percentChange || 0}
            bgColor="#ef4444"
          />
        </div>
      )}

      {/* Charts and Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={chartData} isLoading={chartLoading} />
        </div>
        <div>
          <TopProducts products={topProducts} isLoading={topLoading} />
        </div>
      </div>
    </div>
  );
}
