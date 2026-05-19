"use client";

import { TrendingUp, DollarSign, Users, Package } from "lucide-react";
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
          className={`w-12 h-12 rounded-lg flex items-center justify-center text-white`}
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

// Sales & Revenue Trends Chart
const SalesRevenueChart = () => {
  const data = [
    { month: "Jan", sales: 14000, revenue: 0 },
    { month: "Feb", sales: 10500, revenue: 0 },
    { month: "Mar", sales: 7000, revenue: 0 },
    { month: "Apr", sales: 3500, revenue: 0 },
    { month: "May", sales: 0, revenue: 0 },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Sales & Revenue Trends
      </h3>
      <div className="h-80 w-full">
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
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#salesGradient)"
              name="Sales"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              name="Revenue"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Comprehensive business insights and performance metrics
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Sales"
          value="29,800"
          icon={TrendingUp}
          color="#3b82f6"
        />
        <KPICard
          title="Revenue"
          value="$59,600"
          icon={DollarSign}
          color="#10b981"
        />
        <KPICard title="Customers" value="1,245" icon={Users} color="#a855f7" />
        <KPICard
          title="Products Sold"
          value="3,892"
          icon={Package}
          color="#f59e0b"
        />
      </div>

      {/* Sales & Revenue Trends + Revenue by Product - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart - takes 2 columns */}
        <div className="lg:col-span-2">
          <SalesRevenueChart />
        </div>

        {/* Revenue by Product - takes 1 column */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue by Product
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-700">BFC-17:</span>
              <span className="text-sm font-semibold text-gray-900"></span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-700">BFC-27:</span>
              <span className="text-sm font-semibold text-gray-900"></span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-700">TC-17:</span>
              <span className="text-sm font-semibold text-gray-900"></span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">T-tratinex-17:</span>
              <span className="text-sm font-semibold text-gray-900"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
