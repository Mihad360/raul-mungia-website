"use client";

// import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import AuthCard from "@/components/auth/AuthCard";

type TVerifyOtpForm = {
  otp: string;
};

const VerifyOtpPage = () => {
  // const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TVerifyOtpForm>();

  const onSubmit = async (data: TVerifyOtpForm) => {
    console.log("OTP entered:", data.otp);
    // TODO: call API to verify OTP
    // router.push("/reset-password");
  };

  return (
    <AuthCard subtitle="Reset Your Password">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* OTP */}
        <div>
          <input
            {...register("otp", {
              required: "OTP is required",
              minLength: { value: 5, message: "OTP must be 5 digits" },
              maxLength: { value: 5, message: "OTP must be 5 digits" },
              pattern: {
                value: /^\d{5}$/,
                message: "OTP must contain only numbers",
              },
            })}
            type="text"
            maxLength={5}
            placeholder="Enter Your 5 digit OTP"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition placeholder-gray-400"
          />
          {errors.otp && (
            <p className="text-xs text-[#C70A24] mt-1">{errors.otp.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg text-white font-semibold text-base transition-opacity hover:opacity-90 active:opacity-80 mt-1"
          style={{ backgroundColor: "#C70A24" }}
        >
          Verify Code
        </button>
      </form>
    </AuthCard>
  );
};

export default VerifyOtpPage;
