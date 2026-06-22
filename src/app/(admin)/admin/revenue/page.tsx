/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Loader2,
  Receipt,
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
  useGetRevenueStatsQuery,
  useGetRevenueChartQuery,
  useGetRevenueByProductQuery,
  useGetRecentTransactionsQuery,
} from "@/redux/api/adminApiV3";

// ─── Helpers ──────────────────────────────────────────────────
const formatCurrency = (value: number) =>
  `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatTxnDate = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
};

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
  trend,
  color,
}: {
  title: string;
  value: string;
  icon: any;
  trend: number;
  color: string;
}) => {
  const isPositive = trend >= 0;
  const trendColor = isPositive ? "text-green-600" : "text-red-600";

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
          style={{ backgroundColor: color }}
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

// ─── Revenue Chart (3 lines) ──────────────────────────────────
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
        Revenue, Profit & Expenses Overview
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
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
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
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#revGradient)"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#profGradient)"
                name="Profit"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#expGradient)"
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

// ─── Revenue by Product (Horizontal Bars) ─────────────────────
const RevenueByProduct = ({
  data,
  isLoading,
}: {
  data: any;
  isLoading: boolean;
}) => {
  const products = data?.products || [];
  const maxAmount = products.length
    ? Math.max(...products.map((p: any) => p.revenue))
    : 0;

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
          <p className="text-sm text-gray-500">No revenue data yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {products.map((product: any) => (
              <div key={product.productId}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 truncate flex-1 pr-2">
                    {product.productName}{" "}
                    <span className="text-gray-400">
                      ({product.productCode})
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(product.revenue)}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${maxAmount > 0 ? (product.revenue / maxAmount) * 100 : 0}%`,
                      backgroundColor: "#C70A24",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500">
            <span>Total Revenue:</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(data?.totalRevenue || 0)}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Recent Transactions ──────────────────────────────────────
const RecentTransactions = ({
  transactions,
  isLoading,
}: {
  transactions: any[];
  isLoading: boolean;
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "failed":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const capitalize = (s: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Transactions
      </h3>
      {isLoading ? (
        <SectionLoader />
      ) : transactions.length === 0 ? (
        <div className="py-12 text-center">
          <Receipt size={36} className="mx-auto text-gray-300 mb-2 stroke-1" />
          <p className="text-sm text-gray-500">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((txn) => (
            <div
              key={txn._id}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {txn.title}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-gray-400 font-mono">
                    {txn.orderNumber}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">
                    {formatTxnDate(txn.createdAt)}
                  </span>
                  {txn.customer?.name && (
                    <>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400 truncate">
                        {txn.customer.name}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                <span
                  className={`text-sm font-semibold ${
                    txn.type === "refund" ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  {txn.type === "refund" ? "−" : ""}
                  {formatCurrency(txn.amount)}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    txn.status,
                  )}`}
                >
                  {capitalize(txn.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────
export default function RevenuePage() {
  const { data: statsResponse, isLoading: statsLoading } =
    useGetRevenueStatsQuery({});
  const { data: chartResponse, isLoading: chartLoading } =
    useGetRevenueChartQuery({ months: 6 });
  const { data: byProductResponse, isLoading: byProductLoading } =
    useGetRevenueByProductQuery({ limit: 4 });
  const { data: txnsResponse, isLoading: txnsLoading } =
    useGetRecentTransactionsQuery({ limit: 5 });

  const stats = statsResponse?.data;
  const chart = chartResponse?.data || [];
  const byProduct = byProductResponse?.data;
  const transactions = txnsResponse?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Revenue Management
        </h1>
        <p className="text-gray-600">
          Track and analyze your financial performance
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
            title="Total Revenue"
            value={formatCurrency(stats?.totalRevenue?.total || 0)}
            icon={DollarSign}
            trend={stats?.totalRevenue?.percentChange || 0}
            color="#3b82f6"
          />
          <KPICard
            title="Net Profit"
            value={formatCurrency(stats?.netProfit?.total || 0)}
            icon={TrendingUp}
            trend={stats?.netProfit?.percentChange || 0}
            color="#10b981"
          />
          <KPICard
            title="Total Expenses"
            value={formatCurrency(stats?.totalExpenses?.total || 0)}
            icon={TrendingDown}
            trend={stats?.totalExpenses?.percentChange || 0}
            color="#ef4444"
          />
          <KPICard
            title="Profit Margin"
            value={`${(stats?.profitMargin?.total || 0).toFixed(1)}%`}
            icon={ArrowUpRight}
            trend={stats?.profitMargin?.percentChange || 0}
            color="#a855f7"
          />
        </div>
      )}

      {/* Revenue Chart */}
      <RevenueChart data={chart} isLoading={chartLoading} />

      {/* Two Column: Revenue by Product + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueByProduct data={byProduct} isLoading={byProductLoading} />
        <RecentTransactions
          transactions={transactions}
          isLoading={txnsLoading}
        />
      </div>
    </div>
  );
}
