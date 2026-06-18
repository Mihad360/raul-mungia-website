import { baseApi } from "./baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              params.append(key, String(value));
            }
          });
        }
        return { url: "/users/", method: "GET", params };
      },
      providesTags: ["user"],
    }),

    editProfile: builder.mutation({
      query: (formData) => ({
        url: "/users/edit-profile",
        method: "PATCH",
        data: formData,
      }),
      invalidatesTags: ["user", "auth"],
    }),
  }),
});

export const { useGetUsersQuery, useEditProfileMutation } = userApi;
