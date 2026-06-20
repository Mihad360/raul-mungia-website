import { baseApi } from "./baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    placeOrder: build.mutation({
      query: (body) => ({
        url: "/order/place",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["order", "cart"],
    }),

    getMyOrders: build.query({
      query: (args: Record<string, unknown> = {}) => {
        const params = new URLSearchParams();
        Object.entries(args).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });
        return {
          url: "/order/my-orders",
          method: "GET",
          params,
        };
      },
      providesTags: ["order"],
    }),

    getMyLatestOrder: build.query({
      query: () => ({ url: "/order/my-orders/latest", method: "GET" }),
      providesTags: ["order"],
    }),

    getMySingleOrder: build.query({
      query: (id: string) => ({
        url: `/order/my-orders/${id}`,
        method: "GET",
      }),
      providesTags: ["order"],
    }),

    cancelMyOrder: build.mutation({
      query: ({ id, reason }: { id: string; reason: string }) => ({
        url: `/order/my-orders/${id}/cancel`,
        method: "PATCH",
        data: { cancellationReason: reason },
      }),
      invalidatesTags: ["order"],
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useGetMyOrdersQuery,
  useGetMyLatestOrderQuery,
  useGetMySingleOrderQuery,
  useCancelMyOrderMutation,
} = orderApi;
