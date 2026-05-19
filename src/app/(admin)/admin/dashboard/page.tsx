/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DollarSign, ShoppingCart, Users, XCircle } from "lucide-react";
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

// KPI Card Component (same as before)
const KPICard = ({
  icon: Icon,
  title,
  value,
  trend,
  bgColor,
  trendColor,
}: {
  icon: any;
  title: string;
  value: string;
  trend: number;
  bgColor: string;
  trendColor: string;
}) => {
  const isPositive = trend >= 0;

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

// Real Revenue Chart Component with Recharts
const RevenueChart = () => {
  // Sample data - replace with real API data
  const data = [
    { month: "Jan", revenue: 4200, expenses: 2800 },
    { month: "Feb", revenue: 4800, expenses: 3000 },
    { month: "Mar", revenue: 5200, expenses: 3200 },
    { month: "Apr", revenue: 5800, expenses: 3500 },
    { month: "May", revenue: 6200, expenses: 3800 },
    { month: "Jun", revenue: 6800, expenses: 4000 },
    { month: "Jul", revenue: 7200, expenses: 4200 },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Revenue Overview
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Monthly revenue and expenses tracking
      </p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#374151" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#374151" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
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
              formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              labelFormatter={(label) => `${label}`}
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
      </div>
    </div>
  );
};

// Top Products Component (same as before)
const TopProducts = () => {
  const products = [
    { id: 1, name: "BRC-17", sales: "234 sales", amount: "$69,966" },
    { id: 2, name: "GRC-20", sales: "189 sales", amount: "$28,161" },
    { id: 3, name: "TX-30", sales: "156 sales", amount: "$93,444" },
    { id: 4, name: "TX-30", sales: "156 sales", amount: "$93,444" },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Products</h3>
      <p className="text-sm text-gray-500 mb-6">
        Best performing products this month
      </p>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
          >
            <div>
              <p className="font-semibold text-gray-900">{product.name}</p>
              <p className="text-xs text-gray-500">{product.sales}</p>
            </div>
            <p className="font-semibold text-gray-900">{product.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DashboardPage() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          icon={DollarSign}
          title="Total Revenue"
          value="$45,231"
          trend={20.1}
          bgColor="#10b981"
          trendColor="text-green-600"
        />
        <KPICard
          icon={ShoppingCart}
          title="Total Orders"
          value="1,245"
          trend={15.3}
          bgColor="#3b82f6"
          trendColor="text-green-600"
        />
        <KPICard
          icon={Users}
          title="Total Customers"
          value="892"
          trend={8.7}
          bgColor="#a855f7"
          trendColor="text-green-600"
        />
        <KPICard
          icon={XCircle}
          title="Total Cancel Order"
          value="200"
          trend={2.4}
          bgColor="#ef4444"
          trendColor="text-green-600"
        />
      </div>

      {/* Charts and Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - 2 columns */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Top Products - 1 column */}
        <div>
          <TopProducts />
        </div>
      </div>
    </div>
  );
}
