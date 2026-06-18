import { baseApi } from "./baseApi";

const wishlistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Get my wishlist (full populated with products) */
    getMyWishlist: build.query({
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
          url: "/wishlist/",
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["wishlist"],
    }),

    /** Check if a product is in wishlist (for heart icon state) */
    checkInWishlist: build.query({
      query: (productId: string) => ({
        url: `/wishlist/check/${productId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, productId) => [
        { type: "wishlist", id: `check-${productId}` },
      ],
    }),

    /** Add product to wishlist */
    addToWishlist: build.mutation({
      query: (productId: string) => ({
        url: `/wishlist/add/${productId}`,
        method: "POST",
      }),
      invalidatesTags: ["wishlist"],
    }),

    /** Remove product from wishlist */
    removeFromWishlist: build.mutation({
      query: (productId: string) => ({
        url: `/wishlist/remove/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["wishlist"],
    }),

    /** Clear entire wishlist */
    clearWishlist: build.mutation({
      query: () => ({
        url: "/wishlist/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["wishlist"],
    }),
  }),
});

export const {
  useGetMyWishlistQuery,
  useCheckInWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
} = wishlistApi;
