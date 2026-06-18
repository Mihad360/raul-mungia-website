import { baseApi } from "./baseApi";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Blog
    getAllBlogs: builder.query({
      query: () => ({ url: "/blog/", method: "GET" }),
      providesTags: ["blog"],
    }),
    getSingleBlog: builder.query({
      query: (id) => ({ url: `/blog/${id}`, method: "GET" }),
      providesTags: ["blog"],
    }),

    // FAQ
    getAllFaqs: builder.query({
      query: () => ({ url: "/faq/", method: "GET" }),
      providesTags: ["faq"],
    }),
    getSingleFaq: builder.query({
      query: (id) => ({ url: `/faq/${id}`, method: "GET" }),
      providesTags: ["faq"],
    }),

    // Certification
    getAllCertifications: builder.query({
      query: () => ({ url: "/certificate/", method: "GET" }),
      providesTags: ["certification"],
    }),
    getSingleCertification: builder.query({
      query: (id) => ({ url: `/certificate/${id}`, method: "GET" }),
      providesTags: ["certification"],
    }),

    // Disclaimer (read-only public)
    getDisclaimer: builder.query({
      query: () => ({ url: "/disclaimer/", method: "GET" }),
      providesTags: ["disclaimer"],
    }),

    // Explore Purity (read-only public)
    getExplorePurity: builder.query({
      query: () => ({ url: "/explore-purity", method: "GET" }),
      providesTags: ["explorePurity"],
    }),

    // About (read-only public)
    getAllAbout: builder.query({
      query: () => ({ url: "/about/", method: "GET" }),
      providesTags: ["about"],
    }),

    // Privacy (read-only public)
    getAllPrivacy: builder.query({
      query: () => ({ url: "/privacy/", method: "GET" }),
      providesTags: ["privacy"],
    }),

    // Terms (read-only public)
    getAllTerms: builder.query({
      query: () => ({ url: "/term/", method: "GET" }),
      providesTags: ["terms"],
    }),
  }),
});

export const {
  // Blog
  useGetAllBlogsQuery,
  useGetSingleBlogQuery,

  // FAQ
  useGetAllFaqsQuery,
  useGetSingleFaqQuery,

  // Certification
  useGetAllCertificationsQuery,
  useGetSingleCertificationQuery,

  // Disclaimer
  useGetDisclaimerQuery,

  // Explore Purity
  useGetExplorePurityQuery,

  // About
  useGetAllAboutQuery,

  // Privacy
  useGetAllPrivacyQuery,

  // Terms
  useGetAllTermsQuery,
} = settingsApi;
