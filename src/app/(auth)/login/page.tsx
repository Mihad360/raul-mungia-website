"use client";

import AuthCard from "@/components/auth/AuthCard";
import { Loader } from "@/components/shared/Loader";
import { getFcmToken } from "@/hook/useFcmToken";
import { handleLoginSuccess } from "@/lib/auth/auth.handlers";
import { useLoginUserMutation } from "@/redux/api/authApi";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type TLoginForm = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginForm>();

  const onSubmit = async (data: TLoginForm) => {
    try {
      // Get FCM token (silent fail if denied — login still proceeds)
      const fcmToken = await getFcmToken();

      const res = await loginUser({ ...data, fcmToken }).unwrap();

      const token = res?.data?.accessToken || res?.data?.token;
      console.log("Calling setClientToken...");
      handleLoginSuccess(token);
      toast.success("Welcome back!");
      router.push(redirectTo);
      router.refresh();
    } catch (error: unknown) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Invalid email or password";
      toast.error(message);
    }
  };

  return (
    <AuthCard subtitle="Welcome to our Company">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.email && (
            <p className="text-xs text-[#C70A24] mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

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
            placeholder="Enter Your Password"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.password && (
            <p className="text-xs text-[#C70A24] mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="text-sm text-gray-500 -mt-1">
          Forget Password?{" "}
          <Link
            href="/forgot-password"
            className="font-medium hover:underline"
            style={{ color: "#C70A24" }}
          >
            Reset Now
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-lg text-white font-semibold text-base transition-opacity hover:opacity-90 active:opacity-80 mt-1 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ backgroundColor: "#C70A24" }}
        >
          {isLoading ? (
            <>
              <Loader size="sm" color="#ffffff" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-1">
          Don&apos;t have an Account?{" "}
          <Link
            href="/register"
            className="font-medium hover:underline"
            style={{ color: "#C70A24" }}
          >
            Register Now
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default LoginPage;
