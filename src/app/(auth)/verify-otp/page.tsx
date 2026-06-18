"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthCard from "@/components/auth/AuthCard";
import { useVerifyOtpMutation } from "@/redux/api/authApi";
import { setClientToken } from "@/lib/auth/cookies.client";

type TVerifyOtpForm = {
  otp: string;
};

const VerifyOtpPage = () => {
  const router = useRouter();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TVerifyOtpForm>();

  // Guard: redirect if no email in storage (user landed here directly)
  useEffect(() => {
    const email = localStorage.getItem("resetEmail");
    if (!email) {
      toast.error("Please enter your email first");
      router.push("/forgot-password");
    }
  }, [router]);

  const onSubmit = async (data: TVerifyOtpForm) => {
    const email = localStorage.getItem("resetEmail");

    if (!email) {
      toast.error("Session expired. Please try again.");
      router.push("/forgot-password");
      return;
    }

    try {
      const response = await verifyOtp({
        email,
        otp: data.otp,
      }).unwrap();

      // Extract token (backend returns { data: { accessToken } } or similar)
      const token =
        response?.data?.accessToken || response?.data?.token || response?.token;

      if (!token) {
        throw new Error("No token received from server");
      }

      // Store token in cookie (used by axiosBaseQuery for next call)
      setClientToken(token);

      toast.success("OTP verified successfully");
      router.push("/reset-password");
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Invalid or expired OTP");
    }
  };

  return (
    <AuthCard subtitle="Reset Your Password">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* OTP */}
        <div>
          <input
            {...register("otp", {
              required: "OTP is required",
              minLength: { value: 6, message: "OTP must be 5 digits" },
              maxLength: { value: 6, message: "OTP must be 5 digits" },
              pattern: {
                value: /^\d{6}$/,
                message: "OTP must contain only numbers",
              },
            })}
            type="text"
            maxLength={6}
            inputMode="numeric"
            placeholder="Enter Your 5 digit OTP"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition placeholder-gray-400 disabled:opacity-60"
          />
          {errors.otp && (
            <p className="text-xs text-[#C70A24] mt-1">{errors.otp.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-lg text-white font-semibold text-base transition-opacity hover:opacity-90 active:opacity-80 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#C70A24" }}
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </button>
      </form>
    </AuthCard>
  );
};

export default VerifyOtpPage;
