"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthCard from "@/components/auth/AuthCard";
import { useVerifyOtpMutation } from "@/redux/api/authApi";
import { setClientToken } from "@/lib/auth/cookies.client";
import { getFcmToken } from "@/hook/useFcmToken";

type TVerifyOtpForm = {
  otp: string;
};

type TVerifyFlow = "register" | "reset";

const VerifyOtpPage = () => {
  const router = useRouter();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [flow, setFlow] = useState<TVerifyFlow | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TVerifyOtpForm>();

  // Guard: detect which flow we're in (register or reset)
  useEffect(() => {
    const pendingEmail = localStorage.getItem("pendingEmail");
    const resetEmail = localStorage.getItem("resetEmail");
    const verifyFlow = localStorage.getItem("verifyFlow") as TVerifyFlow | null;

    if (pendingEmail && verifyFlow === "register") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFlow("register");
    } else if (resetEmail) {
      setFlow("reset");
    } else {
      toast.error("Please start the process from the beginning");
      router.push("/login");
    }
  }, [router]);

  const onSubmit = async (data: TVerifyOtpForm) => {
    // Pick the right email based on flow
    const email =
      flow === "register"
        ? localStorage.getItem("pendingEmail")
        : localStorage.getItem("resetEmail");

    if (!email) {
      toast.error("Session expired. Please try again.");
      router.push(flow === "register" ? "/register" : "/forgot-password");
      return;
    }

    try {
      // Get FCM token (silent fail if denied)
      const fcmToken = await getFcmToken();

      const response = await verifyOtp({
        email,
        otp: data.otp,
        fcmToken,
      }).unwrap();

      const token =
        response?.data?.accessToken || response?.data?.token || response?.token;

      if (!token) {
        throw new Error("No token received from server");
      }

      // Save token (user is logged in after OTP verification)
      setClientToken(token);

      toast.success("OTP verified successfully");

      // Branch based on flow
      if (flow === "register") {
        // Cleanup register flow keys
        localStorage.removeItem("pendingEmail");
        localStorage.removeItem("verifyFlow");
        router.push("/");
        router.refresh();
      } else {
        // Reset flow keeps resetEmail for the reset-password page
        router.push("/reset-password");
      }
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Invalid or expired OTP");
    }
  };

  return (
    <AuthCard
      subtitle={
        flow === "register" ? "Verify Your Email" : "Reset Your Password"
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <p className="text-xs text-gray-500 -mt-1">
          We&apos;ve sent a 6-digit code to your email. Enter it below to
          continue.
        </p>

        <div>
          <input
            {...register("otp", {
              required: "OTP is required",
              minLength: { value: 6, message: "OTP must be 6 digits" },
              maxLength: { value: 6, message: "OTP must be 6 digits" },
              pattern: {
                value: /^\d{6}$/,
                message: "OTP must contain only numbers",
              },
            })}
            type="text"
            maxLength={6}
            inputMode="numeric"
            placeholder="Enter Your 6 digit OTP"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition placeholder-gray-400 disabled:opacity-60"
          />
          {errors.otp && (
            <p className="text-xs text-[#C70A24] mt-1">{errors.otp.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !flow}
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