"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthCard from "@/components/auth/AuthCard";
import { useChangePasswordMutation } from "@/redux/api/authApi";
import { setClientToken, getClientToken } from "@/lib/auth/cookies.client";

type TChangePasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const ChangePasswordPage = () => {
  const router = useRouter();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<TChangePasswordForm>();

  // eslint-disable-next-line react-hooks/incompatible-library
  const newPassword = watch("newPassword");

  // Guard: ensure user is logged in
  useEffect(() => {
    const token = getClientToken();
    if (!token) {
      toast.error("Please log in to change your password");
      router.push("/login");
    }
  }, [router]);

  const onSubmit = async (data: TChangePasswordForm) => {
    try {
      const response = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      // Extract new token from response
      const newToken =
        response?.data?.accessToken || response?.data?.token || response?.token;

      if (newToken) {
        // Update the token in cookies with the new one
        setClientToken(newToken);
      }

      toast.success("Password changed successfully!");
      reset(); // Clear form fields

      // Optional: redirect after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to change password");
    }
  };

  const togglePasswordVisibility = (field: string) => {
    if (field === "current") setShowCurrentPassword(!showCurrentPassword);
    if (field === "new") setShowNewPassword(!showNewPassword);
    if (field === "confirm") setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <AuthCard subtitle="Keep your account secure">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  {...register("currentPassword", {
                    required: "Current password is required",
                  })}
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition placeholder-gray-400 disabled:opacity-60 pr-12"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-xs text-[#C70A24] mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        "Password must contain uppercase, lowercase, and number",
                    },
                  })}
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition placeholder-gray-400 disabled:opacity-60 pr-12"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-[#C70A24] mt-1">
                  {errors.newPassword.message}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Password must be at least 6 characters with uppercase,
                lowercase, and number
              </p>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  {...register("confirmNewPassword", {
                    required: "Please confirm your new password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition placeholder-gray-400 disabled:opacity-60 pr-12"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className="text-xs text-[#C70A24] mt-1">
                  {errors.confirmNewPassword.message}
                </p>
              )}
            </div>

            {/* Password Strength Indicator (Optional) */}
            {newPassword && newPassword.length > 0 && (
              <div className="mt-1">
                <div className="flex gap-1 h-1">
                  <div
                    className={`flex-1 rounded-full transition-all ${
                      newPassword.length >= 6 ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`flex-1 rounded-full transition-all ${
                      /[A-Z]/.test(newPassword) ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`flex-1 rounded-full transition-all ${
                      /[a-z]/.test(newPassword) ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`flex-1 rounded-full transition-all ${
                      /\d/.test(newPassword) ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Password strength:{" "}
                  {newPassword.length >= 6 &&
                  /[A-Z]/.test(newPassword) &&
                  /[a-z]/.test(newPassword) &&
                  /\d/.test(newPassword)
                    ? "Strong"
                    : newPassword.length >= 6
                      ? "Medium"
                      : "Weak"}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg text-white font-semibold text-base transition-all hover:opacity-90 active:scale-[0.98] mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#C70A24" }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Changing Password...
                </div>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        </AuthCard>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
