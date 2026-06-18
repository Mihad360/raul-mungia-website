import { baseApi } from "./baseApi";

const shopApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ─── PRODUCTS ─────────────────────────────────────────────
    /** Get all products with filters */
    getAllProducts: build.query({
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
          url: "/product/",
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["product"],
    }),

    /** Get single product by ID */
    getProductById: build.query({
      query: (id: string) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "product", id }],
    }),

    /** Get products by category */
    getProductsByCategory: build.query({
      query: (categoryId: string) => ({
        url: `/product/category/${categoryId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, categoryId) => [
        { type: "product", id: `category-${categoryId}` },
      ],
    }),

    /** Get related products */
    getRelatedProducts: build.query({
      query: (productId: string) => ({
        url: `/product/${productId}/related`,
        method: "GET",
      }),
      providesTags: (_result, _error, productId) => [
        { type: "product", id: `related-${productId}` },
      ],
    }),

    /** Get featured / best-selling products */
    getFeaturedProducts: build.query({
      query: () => ({
        url: "/products/featured",
        method: "GET",
      }),
      providesTags: ["product"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useGetRelatedProductsQuery,
  useGetFeaturedProductsQuery,
} = shopApi;
