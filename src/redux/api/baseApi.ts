import { createApi } from "@reduxjs/toolkit/query/react";
import { envConfig } from "../../config/envConfig";
import { axiosBaseQuery } from "@/lib/axios/axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "api",
  tagTypes: [
    "auth",
    "user",
    "admin",
    "product",
    "category",
    "cart",
    "wishlist",
    "coupon",
    "discount",
    "paymentMethod",
    "order",
    "transaction",
    "shipping",
    "blog",
    "faq",
    "certification",
    "disclaimer",
    "explorePurity",
    "notification",
    "about",
    "privacy",
    "terms",
    "revenue",
    "analytics",
    "dashboard",
    "shipping-policy",
  ],
  baseQuery: axiosBaseQuery({
    baseUrl: envConfig.baseApi as string,
  }),
  endpoints: () => ({}),
});
