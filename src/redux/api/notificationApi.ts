import { baseApi } from "./baseApi";

interface IGetNotificationsParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: string;
}

const notificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyNotifications: build.query({
      query: (params?: IGetNotificationsParams) => ({
        url: "/notification/",
        method: "GET",
        params,
      }),
      providesTags: ["notification"],
    }),

    getUnreadCount: build.query({
      query: () => ({
        url: "/notification/unread-count",
        method: "GET",
      }),
      providesTags: ["notification"],
    }),

    markNotificationAsRead: build.mutation({
      query: (id: string) => ({
        url: `/notification/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["notification"],
    }),

    markAllNotificationsAsRead: build.mutation({
      query: () => ({
        url: `/notification/read-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["notification"],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationApi;
