"use client";

import AuthCard from "@/components/auth/AuthCard";
import { Loader } from "@/components/shared/Loader";
import { useSignUpUserMutation } from "@/redux/api/authApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type TRegisterForm = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const [registerUser, { isLoading }] = useSignUpUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterForm>();

  const onSubmit = async (data: TRegisterForm) => {
    try {
      const response = await registerUser(data).unwrap();

      if (response?.success) {
        // Save email + flow type for the verify-otp page
        localStorage.setItem("pendingEmail", data.email);
        localStorage.setItem("verifyFlow", "register");

        toast.success(
          response?.message ||
            "Account created! Please check your email for the verification code.",
        );
        router.push("/verify-otp");
      } else {
        toast.error(response?.message || "Failed to create account");
      }
    } catch (error: unknown) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to create account. Please try again.";
      toast.error(message);
    }
  };

  return (
    <AuthCard subtitle="Welcome to our Company">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* Name */}
        <div>
          <input
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            type="text"
            placeholder="Enter Your Name"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.name && (
            <p className="text-xs text-[#C70A24] mt-1">{errors.name.message}</p>
          )}
        </div>

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
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
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
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.password && (
            <p className="text-xs text-[#C70A24] mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-lg text-white font-semibold text-base transition-opacity hover:opacity-90 active:opacity-80 mt-1 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ backgroundColor: "#C70A24" }}
        >
          {isLoading ? (
            <>
              <Loader size="sm" color="#ffffff" />
              Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-1">
          Already have an Account?{" "}
          <Link
            href="/login"
            className="font-medium hover:underline"
            style={{ color: "#C70A24" }}
          >
            Login
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;
