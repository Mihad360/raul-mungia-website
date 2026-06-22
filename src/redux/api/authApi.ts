import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    loginUser: build.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: ["auth"],
    }),

    signUpUser: build.mutation({
      query: (data) => ({
        url: "/auth/create",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: ["auth"],
    }),

    forgetPassword: build.mutation({
      query: (data) => ({
        url: "/auth/forget-password",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: ["auth"],
    }),

    verifyOtp: build.mutation({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: ["auth"],
    }),

    resetPassword: build.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: ["auth"],
    }),

    changePassword: build.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: ["auth"],
    }),

    resendOtp: build.mutation({
      query: (email) => ({
        url: `/auth/resend-otp/${email}`,
        method: "POST",
      }),
      invalidatesTags: ["auth"],
    }),

    /** Get currently logged-in user's profile */
    getMyProfile: build.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["auth", "user"],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useSignUpUserMutation,
  useForgetPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useResendOtpMutation,
  useGetMyProfileQuery,
} = authApi;
