"use client";

import { useForm } from "react-hook-form";
import AuthCard from "@/components/auth/AuthCard";

type TForgotPasswordForm = {
  email: string;
};

const ForgotPasswordPage = () => {
  // const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TForgotPasswordForm>();

  const onSubmit = async (data: TForgotPasswordForm) => {
    console.log("Send OTP to:", data.email);
    // TODO: call API to send OTP
    // router.push("/verify-otp");
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
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition placeholder-gray-400"
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
          className="w-full py-3 rounded-lg text-white font-semibold text-base transition-opacity hover:opacity-90 active:opacity-80 mt-1"
          style={{ backgroundColor: "#C70A24" }}
        >
          Send OTP
        </button>
      </form>
    </AuthCard>
  );
};

export default ForgotPasswordPage;
