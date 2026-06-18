import { baseApi } from "./baseApi";

const shippingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get available shipping rates from FedEx
    getShippingRates: builder.mutation({
      query: (data) => ({
        url: "/shipping/rates",
        method: "POST",
        data,
      }),
    }),

    // Validate shipping address via FedEx
    validateShippingAddress: builder.mutation({
      query: (data) => ({
        url: "/shipping/validate-address",
        method: "POST",
        data,
      }),
    }),

    // Track a shipment by tracking number
    trackShipment: builder.query({
      query: (trackingNumber) => ({
        url: `/shipping/track/${trackingNumber}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetShippingRatesMutation,
  useValidateShippingAddressMutation,
  useTrackShipmentQuery,
  useLazyTrackShipmentQuery,
} = shippingApi;
