import { baseApi } from "./baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Get all categories (with optional filters: search, page, limit, etc.) */
    getAllCategories: build.query({
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
          url: "/category/",
          method: "GET",
          params,
        };
      },

      transformResponse: (response) => ({
        data: response.data,
        meta: response.meta,
      }),

      providesTags: ["category"],
    }),

    /** Get single category by ID */
    getCategoryById: build.query({
      query: (id: string) => ({
        url: `/category/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "category", id }],
    }),
  }),
});

export const { useGetAllCategoriesQuery, useGetCategoryByIdQuery } =
  categoryApi;
