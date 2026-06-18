"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthCard from "@/components/auth/AuthCard";
import { useForgetPasswordMutation } from "@/redux/api/authApi";

type TForgotPasswordForm = {
  email: string;
};

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TForgotPasswordForm>();

  const onSubmit = async (data: TForgotPasswordForm) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();

      // Save email so verify-otp page can read it
      localStorage.setItem("resetEmail", data.email);

      toast.success("OTP sent to your email");
      router.push("/verify-otp");
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <AuthCard subtitle="Reset Your Password">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* Email */}
        <div>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email",
              },
            })}
            type="email"
            placeholder="Enter Your Email"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition placeholder-gray-400 disabled:opacity-60"
          />
          {errors.email && (
            <p className="text-xs text-[#C70A24] mt-1">
              {errors.email.message}
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
          {isLoading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </AuthCard>
  );
};

export default ForgotPasswordPage;
