/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

const adminApiV2 = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ═══════════════ ORDERS ═══════════════
    getAllOrdersAdmin: build.query({
      query: (args: Record<string, unknown> = {}) => {
        const params = new URLSearchParams();
        Object.entries(args).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });
        return {
          url: "/admin/orders",
          method: "GET",
          params,
        };
      },
      providesTags: ["order"],
    }),

    getSingleOrderAdmin: build.query({
      query: (id: string) => ({
        url: `/admin/order/${id}`,
        method: "GET",
      }),
      providesTags: ["order"],
    }),

    confirmManualPayment: build.mutation({
      query: ({ id, body }: { id: string; body?: Record<string, any> }) => ({
        url: `/admin/order/${id}/confirm-payment`,
        method: "PATCH",
        data: body || {},
      }),
      invalidatesTags: ["order", "transaction"],
    }),

    cancelOrderByAdmin: build.mutation({
      query: ({
        id,
        body,
      }: {
        id: string;
        body: { cancellationReason: string };
      }) => ({
        url: `/admin/order/${id}/cancel`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["order"],
    }),

    processRefund: build.mutation({
      query: ({
        id,
        body,
      }: {
        id: string;
        body: { amount?: number; reason: string };
      }) => ({
        url: `/admin/order/${id}/refund`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["order", "transaction"],
    }),

    markOrderAsShipped: build.mutation({
      query: ({
        id,
        body,
      }: {
        id: string;
        body: {
          trackingNumber: string;
          shippingLabelUrl?: string;
          shippingMethod?: string;
        };
      }) => ({
        url: `/admin/order/${id}/ship`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["order"],
    }),

    generateShippingLabel: build.mutation({
      query: (id: string) => ({
        url: `/admin/order/${id}/generate-label`,
        method: "PATCH",
        data: {},
      }),
      invalidatesTags: ["order"],
    }),

    refreshTrackingInfo: build.mutation({
      query: (id: string) => ({
        url: `/admin/order/${id}/refresh-tracking`,
        method: "PATCH",
        data: {},
      }),
      invalidatesTags: ["order"],
    }),

    markOrderAsDelivered: build.mutation({
      query: (id: string) => ({
        url: `/admin/order/${id}/deliver`,
        method: "PATCH",
        data: {},
      }),
      invalidatesTags: ["order"],
    }),

    updateOrderAdminNote: build.mutation({
      query: ({ id, body }: { id: string; body: { adminNote: string } }) => ({
        url: `/admin/order/${id}/admin-note`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["order"],
    }),

    // ═══════════════ TRANSACTIONS ═══════════════
    getAllTransactionsAdmin: build.query({
      query: (args: Record<string, unknown> = {}) => {
        const params = new URLSearchParams();
        Object.entries(args).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });
        return {
          url: "/admin/transactions",
          method: "GET",
          params,
        };
      },
      providesTags: ["transaction"],
    }),

    getSingleTransactionAdmin: build.query({
      query: (id: string) => ({
        url: `/admin/transaction/${id}`,
        method: "GET",
      }),
      providesTags: ["transaction"],
    }),
    markOrderReadyForPickup: build.mutation({
      query: (id: string) => ({
        url: `/admin/order/${id}/mark-ready-for-pickup`,
        method: "PATCH",
        data: {},
      }),
      invalidatesTags: ["order"],
    }),
  }),
});

export const {
  // Orders
  useGetAllOrdersAdminQuery,
  useGetSingleOrderAdminQuery,
  useConfirmManualPaymentMutation,
  useCancelOrderByAdminMutation,
  useProcessRefundMutation,
  useMarkOrderAsShippedMutation,
  useGenerateShippingLabelMutation,
  useRefreshTrackingInfoMutation,
  useMarkOrderAsDeliveredMutation,
  useUpdateOrderAdminNoteMutation,
  // Transactions
  useGetAllTransactionsAdminQuery,
  useGetSingleTransactionAdminQuery,
  useMarkOrderReadyForPickupMutation,
} = adminApiV2;
