import { baseApi } from "./baseApi";

const discountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get active discount (for banner/display)
    getActiveDiscount: builder.query({
      query: () => ({
        url: "/discount/active",
        method: "GET",
      }),
      providesTags: ["discount"],
    }),

    // Calculate discount at checkout
    calculateDiscount: builder.mutation({
      query: (data) => ({
        url: "/discount/calculate",
        method: "POST",
        data, // ✅ was `body: data`
      }),
      invalidatesTags: ["discount"],
    }),
  }),
});

export const { useGetActiveDiscountQuery, useCalculateDiscountMutation } =
  discountApi;
