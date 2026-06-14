/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
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

// KPI Card Component
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
  trend: string;
  color: string;
}) => {
  const isPositive = !trend.includes("-");
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center text-white`}
          style={{ backgroundColor: color }}
        >
          <Icon size={24} />
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}
        >
          {isPositive ? "↑" : "↓"} {trend.replace("-", "")}
        </div>
      </div>
      <p className="text-sm text-gray-600 font-medium mb-2">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

// Revenue Chart Component
const RevenueChart = () => {
  const data = [
    { month: "Jan", revenue: 45000, profit: 18000, expenses: 27000 },
    { month: "Feb", revenue: 52000, profit: 21000, expenses: 31000 },
    { month: "Mar", revenue: 58000, profit: 24000, expenses: 34000 },
    { month: "Apr", revenue: 65000, profit: 28000, expenses: 37000 },
    { month: "May", revenue: 71000, profit: 32000, expenses: 39000 },
    { month: "Jun", revenue: 78000, profit: 35000, expenses: 43000 },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Revenue, Profit & Expenses Overview
      </h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
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
                  return [`$${numValue.toLocaleString()}`, ""];
                }) as any
              }
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#profitGradient)"
              name="Profit"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#expensesGradient)"
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Revenue by Product Component (Horizontal Bar)
const RevenueByProduct = () => {
  const products = [
    { name: "Premium Package", amount: 299 },
    { name: "Enterprise Suite", amount: 89000 },
    { name: "Standard Plan", amount: 599 },
    { name: "Basic Package", amount: 450 },
  ];

  const maxAmount = Math.max(...products.map((p) => p.amount));

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Revenue by Product
      </h3>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700">{product.name}</span>
              <span className="text-sm font-semibold text-gray-900">
                ${product.amount.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{ width: `${(product.amount / maxAmount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-400">0</span>
        <span className="text-xs text-gray-400">25,000</span>
        <span className="text-xs text-gray-400">50,000</span>
        <span className="text-xs text-gray-400">75,000</span>
        <span className="text-xs text-gray-400">100,000</span>
      </div>
    </div>
  );
};

// Recent Transactions Component
const RecentTransactions = () => {
  const transactions = [
    {
      id: "TXN-001",
      title: "Premium Package Sale",
      date: "2026-05-09 14:32",
      amount: "$299.00",
      status: "Completed",
    },
    {
      id: "TXN-002",
      title: "Server Hosting Fee",
      date: "2026-05-09 12:15",
      amount: "$89.00",
      status: "Completed",
    },
    {
      id: "TXN-003",
      title: "Enterprise Suite Sale",
      date: "2026-05-08 16:45",
      amount: "$599.00",
      status: "Completed",
    },
    {
      id: "TXN-004",
      title: "Marketing Campaign",
      date: "2026-05-08 09:20",
      amount: "$450.00",
      status: "Completed",
    },
    {
      id: "TXN-005",
      title: "Standard Plan Sale",
      date: "2026-05-07 11:30",
      amount: "$149.00",
      status: "Pending",
    },
  ];

  const getStatusColor = (status: string) => {
    return status === "Completed"
      ? "text-green-600 bg-green-50"
      : "text-yellow-600 bg-yellow-50";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Transactions
      </h3>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">
                {transaction.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400">{transaction.id}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-400">
                  {transaction.date}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-900">
                {transaction.amount}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}
              >
                {transaction.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function RevenuePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Revenue Management
        </h1>
        <p className="text-gray-600">
          Track and analyze your financial performance
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value="$297,000"
          icon={DollarSign}
          trend="+23.5%"
          color="#3b82f6"
        />
        <KPICard
          title="Net Profit"
          value="$127,000"
          icon={TrendingUp}
          trend="+18.2%"
          color="#10b981"
        />
        <KPICard
          title="Total Expenses"
          value="$170,000"
          icon={TrendingDown}
          trend="+12.3%"
          color="#ef4444"
        />
        <KPICard
          title="Profit Margin"
          value="42.8%"
          icon={ArrowUpRight}
          trend="+15.8%"
          color="#a855f7"
        />
      </div>

      {/* Revenue Chart */}
      <RevenueChart />

      {/* Two Column Layout for Revenue by Product and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueByProduct />
        <RecentTransactions />
      </div>
    </div>
  );
}
