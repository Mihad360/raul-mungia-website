import { baseApi } from "./baseApi";

const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitContactMessage: builder.mutation({
      query: (body: { name: string; email: string; message: string }) => ({
        url: "/contact/",
        method: "POST",
        contentType: "application/json",
        data: body,
      }),
    }),
  }),
});

export const { useSubmitContactMessageMutation } = contactApi;
