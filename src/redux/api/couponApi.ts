import { baseApi } from "./baseApi";

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get available active coupons (for "Available Offers" UI)
    getAvailableCoupons: builder.query({
      query: () => ({
        url: "/coupon/available",
        method: "GET",
      }),
      providesTags: ["coupon"],
    }),

    // Validate a coupon at checkout
    validateCoupon: builder.mutation({
      query: (data) => ({
        url: "/coupon/validate",
        method: "POST",
        data, // ✅ was `body: data`
      }),
      invalidatesTags: ["coupon"],
    }),
  }),
});

export const { useGetAvailableCouponsQuery, useValidateCouponMutation } =
  couponApi;
