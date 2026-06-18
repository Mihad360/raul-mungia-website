"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthCard from "@/components/auth/AuthCard";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { clearClientToken, getClientToken } from "@/lib/auth/cookies.client";

type TResetPasswordForm = {
  password: string;
  confirmPassword: string;
};

const ResetPasswordPage = () => {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TResetPasswordForm>();

  // eslint-disable-next-line react-hooks/incompatible-library
  const password = watch("password");

  // Guard: must have token from verify-otp step
  useEffect(() => {
    const token = getClientToken();
    if (!token) {
      toast.error("Please verify your OTP first");
      router.push("/forgot-password");
    }
  }, [router]);

  const onSubmit = async (data: TResetPasswordForm) => {
    try {
      await resetPassword({ newPassword: data.password }).unwrap();

      // Cleanup — clear everything used in the flow
      localStorage.removeItem("resetEmail");
      clearClientToken();

      toast.success("Password updated successfully. Please log in.");
      router.push("/login");
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to update password");
    }
  };

  return (
    <AuthCard subtitle="Set Your New Password">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* New password */}
        <div>
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type="password"
            placeholder="Enter Your New Password"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition placeholder-gray-400 disabled:opacity-60"
          />
          {errors.password && (
            <p className="text-xs text-[#C70A24] mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <input
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            type="password"
            placeholder="Re-Enter Your New Password"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition placeholder-gray-400 disabled:opacity-60"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-[#C70A24] mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-lg text-white font-semibold text-base transition-opacity hover:opacity-90 active:opacity-80 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#C70A24" }}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </AuthCard>
  );
};

export default ResetPasswordPage;
