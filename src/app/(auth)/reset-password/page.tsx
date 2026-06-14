"use client";

// import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import AuthCard from "@/components/auth/AuthCard";

type TResetPasswordForm = {
  password: string;
  confirmPassword: string;
};

const ResetPasswordPage = () => {
  // const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TResetPasswordForm>();

  // eslint-disable-next-line react-hooks/incompatible-library
  const password = watch("password");

  const onSubmit = async (data: TResetPasswordForm) => {
    console.log("New password set:", data.password);
    // TODO: call API to update password
    // router.push("/password-updated");
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
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition placeholder-gray-400"
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
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition placeholder-gray-400"
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
          className="w-full py-3 rounded-lg text-white font-semibold text-base transition-opacity hover:opacity-90 active:opacity-80 mt-1"
          style={{ backgroundColor: "#C70A24" }}
        >
          Update Password
        </button>
      </form>
    </AuthCard>
  );
};

export default ResetPasswordPage;
