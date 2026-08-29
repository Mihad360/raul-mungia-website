import { baseApi } from "./baseApi";

interface IGetContactMessagesParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
}

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

    getAllContactMessages: builder.query({
      query: (params?: IGetContactMessagesParams) => ({
        url: "/contact/",
        method: "GET",
        params,
      }),
      providesTags: ["contact"],
    }),

    replyToContactMessage: builder.mutation({
      query: ({
        id,
        ...body
      }: {
        id: string;
        message: string;
        subject?: string;
      }) => ({
        url: `/contact/${id}/reply`,
        method: "POST",
        contentType: "application/json",
        data: body,
      }),
      invalidatesTags: ["contact"],
    }),

    markContactMessageRead: builder.mutation({
      query: (id: string) => ({
        url: `/contact/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["contact", "notification"],
    }),
  }),
});

export const {
  useSubmitContactMessageMutation,
  useGetAllContactMessagesQuery,
  useReplyToContactMessageMutation,
  useMarkContactMessageReadMutation,
} = contactApi;
