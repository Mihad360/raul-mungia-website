import { baseApi } from "./baseApi";

const cartApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Get my cart (raw items, populated) */
    getMyCart: build.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && typeof args === "object") {
          Object.entries(args).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              params.append(key, String(value));
            }
          });
        }
        return {
          url: "/cart/",
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["cart"],
    }),

    /**
     * Get cart summary with totals, stock checks, bulk discount, coupon, etc.
     * Use this for checkout preview / cart page totals panel.
     * Optional args: { couponCode?: string }
     */
    getCartSummary: build.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && typeof args === "object") {
          Object.entries(args).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              params.append(key, String(value));
            }
          });
        }
        return {
          url: "/cart/summary",
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["cart"],
    }),

    /** Get cart item count (for navbar badge) */
    getCartCount: build.query({
      query: () => ({
        url: "/cart/count",
        method: "GET",
      }),
      providesTags: ["cart"],
    }),

    /** Add product to cart */
    addToCart: build.mutation({
      query: (data: { productId: string; size: string; quantity: number }) => ({
        url: "/cart/add",
        method: "POST",
        data, // ✅ was `body: data` — now `data`
      }),
      invalidatesTags: ["cart"],
    }),

    updateCartItem: build.mutation({
      query: ({ itemId, ...body }: { itemId: string; quantity: number }) => ({
        url: `/cart/item/${itemId}`,
        method: "PATCH",
        data: body, // ✅ was `body` — now `data: body`
      }),
      invalidatesTags: ["cart"],
    }),

    /** Remove specific item from cart */
    removeCartItem: build.mutation({
      query: (itemId: string) => ({
        url: `/cart/item/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cart"],
    }),

    /** Clear entire cart */
    clearCart: build.mutation({
      query: () => ({
        url: "/cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["cart"],
    }),
  }),
});

export const {
  useGetMyCartQuery,
  useGetCartSummaryQuery,
  useGetCartCountQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;
