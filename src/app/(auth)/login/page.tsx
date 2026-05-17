"use client";

import AuthCard from "@/components/auth/AuthCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type TLoginForm = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginForm>();

  const onSubmit = async (data: TLoginForm) => {
    console.log("Login data:", data);
    // TODO: dispatch login action / call API
    // After success, redirect based on role:
    // router.push("/dashboard") or router.push("/admin/dashboard")
  };

  return (
    <AuthCard subtitle="Welcome to our Company">
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

        {/* Password */}
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
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition placeholder-gray-400"
          />
          {errors.password && (
            <p className="text-xs text-[#C70A24] mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Forgot password */}
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg text-white font-semibold text-base transition-opacity hover:opacity-90 active:opacity-80 mt-1"
          style={{ backgroundColor: "#C70A24" }}
        >
          Login
        </button>

        {/* Register link */}
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
