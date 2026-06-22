import { baseApi } from "./baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /* ===================== CATEGORY ===================== */
    createCategory: build.mutation({
      query: (body) => ({
        url: "/admin/category/create",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["category"],
    }),
    updateCategory: build.mutation({
      query: ({ id, body }) => ({
        url: `/admin/category/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["category"],
    }),
    deleteCategory: build.mutation({
      query: (id) => ({
        url: `/admin/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),

    /* ===================== PRODUCT (admin) ===================== */
    getAllProductsAdmin: build.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              params.append(key, String(value));
            }
          });
        }
        return { url: "/admin/product", method: "GET", params };
      },
      providesTags: ["product"],
    }),
    createProduct: build.mutation({
      query: (formData) => ({
        url: "/admin/product/create",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["product"],
    }),
    updateProduct: build.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/product/${id}`,
        method: "PATCH",
        data: formData,
      }),
      invalidatesTags: ["product"],
    }),
    deleteProduct: build.mutation({
      query: (id) => ({
        url: `/admin/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),

    /* ===================== COUPON ===================== */
    getAllCouponsAdmin: build.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              params.append(key, String(value));
            }
          });
        }
        return { url: "/admin/coupons", method: "GET", params };
      },
      providesTags: ["coupon"],
    }),
    getSingleCouponAdmin: build.query({
      query: (id) => ({ url: `/admin/coupon/${id}`, method: "GET" }),
      providesTags: ["coupon"],
    }),
    createCoupon: build.mutation({
      query: (body) => ({
        url: "/admin/coupon/create",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["coupon"],
    }),
    updateCoupon: build.mutation({
      query: ({ id, body }) => ({
        url: `/admin/coupon/update/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["coupon"],
    }),
    deleteCoupon: build.mutation({
      query: (id) => ({
        url: `/admin/coupon/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coupon"],
    }),

    /* ===================== BLOG ===================== */
    getAllBlogsAdmin: build.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              params.append(key, String(value));
            }
          });
        }
        return { url: "/admin/blogs", method: "GET", params };
      },
      providesTags: ["blog"],
    }),
    createBlog: build.mutation({
      query: (formData) => ({
        url: "/admin/blog/create",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["blog"],
    }),
    updateBlog: build.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/blog/${id}`,
        method: "PATCH",
        data: formData,
      }),
      invalidatesTags: ["blog"],
    }),
    deleteBlog: build.mutation({
      query: (id) => ({
        url: `/admin/blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blog"],
    }),

    /* ===================== FAQ ===================== */
    getAllFaqsAdmin: build.query({
      query: () => ({ url: "/admin/faqs", method: "GET" }),
      providesTags: ["faq"],
    }),
    createFaq: build.mutation({
      query: (body) => ({
        url: "/admin/faq/create",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["faq"],
    }),
    updateFaq: build.mutation({
      query: ({ id, body }) => ({
        url: `/admin/faq/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["faq"],
    }),
    deleteFaq: build.mutation({
      query: (id) => ({
        url: `/admin/faq/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["faq"],
    }),

    /* ===================== CERTIFICATION ===================== */
    getAllCertificationsAdmin: build.query({
      query: () => ({ url: "/admin/certificates", method: "GET" }),
      providesTags: ["certification"],
    }),
    createCertification: build.mutation({
      query: (formData) => ({
        url: "/admin/certificate/create",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["certification"],
    }),
    updateCertification: build.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/certificate/${id}`,
        method: "PATCH",
        data: formData,
      }),
      invalidatesTags: ["certification"],
    }),
    deleteCertification: build.mutation({
      query: (id) => ({
        url: `/admin/certificate/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["certification"],
    }),

    /* ===================== DISCLAIMER ===================== */
    createDisclaimer: build.mutation({
      query: (body) => ({
        url: "/admin/disclaimer/create",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["disclaimer"],
    }),
    updateDisclaimer: build.mutation({
      query: (body) => ({
        url: "/admin/disclaimer/update",
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["disclaimer"],
    }),
    updateShippingPolicy: build.mutation({
      query: (body) => ({
        url: "/admin/shipping-policy",
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["shipping-policy"],
    }),
    /* ===================== EXPLORE PURITY ===================== */
    createExplorePurity: build.mutation({
      query: (body) => ({
        url: "/admin/explore-purity/create",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["explorePurity"],
    }),
    updateExplorePurity: build.mutation({
      query: (body) => ({
        url: "/admin/explore-purity/update",
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["explorePurity"],
    }),

    /* ===================== DISCOUNT ===================== */
    getAllDiscountsAdmin: build.query({
      query: () => ({ url: "/admin/discounts", method: "GET" }),
      providesTags: ["discount"],
    }),
    getSingleDiscountAdmin: build.query({
      query: (id) => ({ url: `/admin/discount/${id}`, method: "GET" }),
      providesTags: ["discount"],
    }),
    createDiscount: build.mutation({
      query: (body) => ({
        url: "/admin/discount/create",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["discount"],
    }),
    updateDiscount: build.mutation({
      query: ({ id, body }) => ({
        url: `/admin/discount/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["discount"],
    }),
    deleteDiscount: build.mutation({
      query: (id) => ({
        url: `/admin/discount/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["discount"],
    }),

    /* ===================== PAYMENT METHOD ===================== */
    getAllPaymentMethodsAdmin: build.query({
      query: () => ({ url: "/admin/payment-methods", method: "GET" }),
      providesTags: ["paymentMethod"],
    }),
    getSinglePaymentMethodAdmin: build.query({
      query: (id) => ({ url: `/admin/payment-method/${id}`, method: "GET" }),
      providesTags: ["paymentMethod"],
    }),
    createPaymentMethod: build.mutation({
      query: (body) => ({
        url: "/admin/payment-method/create",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["paymentMethod"],
    }),
    updatePaymentMethod: build.mutation({
      query: ({ id, body }) => ({
        url: `/admin/payment-method/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["paymentMethod"],
    }),
    deletePaymentMethod: build.mutation({
      query: (id) => ({
        url: `/admin/payment-method/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["paymentMethod"],
    }),
    /* ===================== ABOUT ===================== */
    createAbout: build.mutation({
      query: (body) => ({
        url: "/about/create",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["about"],
    }),
    updateAbout: build.mutation({
      query: (body) => ({
        url: "/about/update",
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["about"],
    }),

    /* ===================== PRIVACY ===================== */
    createPrivacy: build.mutation({
      query: (body) => ({
        url: "/privacy/create",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["privacy"],
    }),
    updatePrivacy: build.mutation({
      query: (body) => ({
        url: "/privacy/update",
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["privacy"],
    }),

    /* ===================== TERMS ===================== */
    createTerms: build.mutation({
      query: (body) => ({
        url: "/term/create",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["terms"],
    }),
    updateTerms: build.mutation({
      query: (body) => ({
        url: "/term/update",
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["terms"],
    }),
  }),
});

export const {
  // Category
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,

  // Product
  useGetAllProductsAdminQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,

  // Coupon
  useGetAllCouponsAdminQuery,
  useGetSingleCouponAdminQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,

  // Blog
  useGetAllBlogsAdminQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,

  // FAQ
  useGetAllFaqsAdminQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,

  // Certification
  useGetAllCertificationsAdminQuery,
  useCreateCertificationMutation,
  useUpdateCertificationMutation,
  useDeleteCertificationMutation,

  // Disclaimer
  useCreateDisclaimerMutation,
  useUpdateDisclaimerMutation,
  useUpdateShippingPolicyMutation,

  // Explore Purity
  useCreateExplorePurityMutation,
  useUpdateExplorePurityMutation,

  // Discount
  useGetAllDiscountsAdminQuery,
  useGetSingleDiscountAdminQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,

  // Payment Method
  useGetAllPaymentMethodsAdminQuery,
  useGetSinglePaymentMethodAdminQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  // About
  useCreateAboutMutation,
  useUpdateAboutMutation,
  // Privacy
  useCreatePrivacyMutation,
  useUpdatePrivacyMutation,
  // Terms
  useCreateTermsMutation,
  useUpdateTermsMutation,
} = adminApi;
