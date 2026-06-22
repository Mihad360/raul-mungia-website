/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

const adminApiV3 = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ═══════════════ DASHBOARD ═══════════════
    getDashboardStats: build.query({
      query: () => ({
        url: "/admin/dashboard/stats",
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),

    getDashboardRevenueOverview: build.query({
      query: (args: Record<string, unknown> = {}) => {
        const params = new URLSearchParams();
        Object.entries(args).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });
        return {
          url: "/admin/dashboard/revenue-overview",
          method: "GET",
          params,
        };
      },
      providesTags: ["dashboard"],
    }),

    getDashboardTopProducts: build.query({
      query: (args: Record<string, unknown> = {}) => {
        const params = new URLSearchParams();
        Object.entries(args).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });
        return {
          url: "/admin/dashboard/top-products",
          method: "GET",
          params,
        };
      },
      providesTags: ["dashboard"],
    }),

    // ═══════════════ ANALYTICS ═══════════════
    getAnalyticsStats: build.query({
      query: (args: Record<string, unknown> = {}) => {
        const params = new URLSearchParams();
        Object.entries(args).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });
        return {
          url: "/admin/analytics/stats",
          method: "GET",
          params,
        };
      },
      providesTags: ["analytics"],
    }),

    getSalesRevenueTrends: build.query({
      query: (args: Record<string, unknown> = {}) => {
        const params = new URLSearchParams();
        Object.entries(args).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });
        return {
          url: "/admin/analytics/sales-revenue-trends",
          method: "GET",
          params,
        };
      },
      providesTags: ["analytics"],
    }),

    getRevenueByProduct: build.query({
      query: (args: Record<string, unknown> = {}) => {
        const params = new URLSearchParams();
        Object.entries(args).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });
        return {
          url: "/admin/analytics/revenue-by-product",
          method: "GET",
          params,
        };
      },
      providesTags: ["analytics"],
    }),

    // ═══════════════ REVENUE ═══════════════
    getRevenueStats: build.query({
      query: () => ({
        url: "/admin/revenue/stats",
        method: "GET",
      }),
      providesTags: ["revenue"],
    }),

    getRevenueChart: build.query({
      query: (args: Record<string, unknown> = {}) => {
        const params = new URLSearchParams();
        Object.entries(args).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });
        return {
          url: "/admin/revenue/chart",
          method: "GET",
          params,
        };
      },
      providesTags: ["revenue"],
    }),

    getRecentTransactions: build.query({
      query: (args: Record<string, unknown> = {}) => {
        const params = new URLSearchParams();
        Object.entries(args).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });
        return {
          url: "/admin/revenue/recent-transactions",
          method: "GET",
          params,
        };
      },
      providesTags: ["revenue", "transaction"],
    }),
  }),
});

export const {
  // Dashboard
  useGetDashboardStatsQuery,
  useGetDashboardRevenueOverviewQuery,
  useGetDashboardTopProductsQuery,
  // Analytics
  useGetAnalyticsStatsQuery,
  useGetSalesRevenueTrendsQuery,
  useGetRevenueByProductQuery,
  // Revenue
  useGetRevenueStatsQuery,
  useGetRevenueChartQuery,
  useGetRecentTransactionsQuery,
} = adminApiV3;
