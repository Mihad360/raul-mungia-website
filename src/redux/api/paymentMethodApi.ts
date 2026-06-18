import { baseApi } from "./baseApi";

const paymentMethodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get active payment methods for checkout
    getActivePaymentMethods: builder.query({
      query: () => ({
        url: "/payment-method/active",
        method: "GET",
      }),
      providesTags: ["paymentMethod"],
    }),
  }),
});

export const { useGetActivePaymentMethodsQuery } = paymentMethodApi;
