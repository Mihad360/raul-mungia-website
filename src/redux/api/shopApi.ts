import { baseApi } from "./baseApi";

const shopApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ─── PRODUCTS ─────────────────────────────────────────────
    /** Get all products (with optional filters: search, category, price range, etc.) */
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

      transformResponse: (response) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },

      providesTags: ["product"],
    }),

    /** Get single product by ID */
    getProductById: build.query({
      query: (id: string) => ({
        url: `/product/${id}`, // ✅ Matches GET /product/:id
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "product", id }],
    }),

    /** Get products by category */
    getProductsByCategory: build.query({
      query: (categoryId: string) => ({
        url: `/product/category/${categoryId}`, // ✅ Matches GET /product/category/:categoryId
        method: "GET",
      }),
      providesTags: (_result, _error, categoryId) => [
        { type: "product", id: `category-${categoryId}` },
      ],
    }),

    /** Get related products for a given product */
    getRelatedProducts: build.query({
      query: (productId: string) => ({
        url: `/product/${productId}/related`, // ✅ Matches GET /product/:id/related
        method: "GET",
      }),
      providesTags: (_result, _error, productId) => [
        { type: "product", id: `related-${productId}` },
      ],
    }),

    /** Get featured / best-selling products (homepage) */
    getFeaturedProducts: build.query({
      query: () => ({
        url: "/products/featured", // ⚠️ You'll need to add this route to your backend
        method: "GET",
      }),
      providesTags: ["product"],
    }),

    // ─── CATEGORIES ────────────────────────────────────────────

    /** Get all categories */
    getAllCategories: build.query({
      query: () => ({
        url: "/categories", // ⚠️ You'll need to add this route to your backend
        method: "GET",
      }),
      providesTags: ["category"],
    }),

    /** Get single category by ID */
    getCategoryById: build.query({
      query: (id: string) => ({
        url: `/categories/${id}`, // ⚠️ You'll need to add this route to your backend
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "category", id }],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useGetRelatedProductsQuery,
  useGetFeaturedProductsQuery,
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
} = shopApi;
