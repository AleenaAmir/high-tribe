"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import GlobalInput from "@/components/global/GlobalInput";
import GlobalAuthModal from "@/components/global/GlobalAuthModal";

import Link from "next/link";

interface SignUpModalScreenProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: Partial<SignUpForm>;
  onSubmit: (data: SignUpForm) => void;
}

const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(15, "Password must not exceed 15 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/^\S*$/, "Password must not contain spaces"),
    confirmPassword: z.string(),
    agreeToTerms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the Terms & Condition" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpForm = z.infer<typeof signUpSchema>;

const SignUpModalScreen = ({
  isOpen,
  onClose,
  initialValues,
  onSubmit,
}: SignUpModalScreenProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    defaultValues: initialValues,
  });

  const handleClose = () => {
    // Reset form when closing
    reset();

    onClose();
  };

  return (
    <GlobalAuthModal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-[428px]"
    >
      <div className="flex flex-col items-center w-full max-w-md mx-auto p-0">
        <div className="flex flex-col items-center w-full">
          <div className="text-2xl font-extrabold text-[#181818] mb-2 text-center leading-tight">
            High
            <br />
            Tribe
          </div>
          <div className="text-[22px] font-semibold text-[#181818] text-center mb-1">
            Create an Account
          </div>
          <div className="text-[13px] text-[#666666] text-center mb-6 max-w-[300px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
            lobortis maximus.
          </div>
        </div>
        <form
          className="w-full flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <GlobalInput
            placeholder="Full name"
            {...register("fullName")}
            error={errors.fullName?.message}
          />
          <GlobalInput
            placeholder="Email address"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />
          <div className="relative">
            <GlobalInput
              placeholder="Password"
              type={"password"}
              {...register("password")}
              error={errors.password?.message}
            />
          </div>
          <div className="relative">
            <GlobalInput
              placeholder="Confirm Password"
              type={"password"}
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="agreeToTerms"
              {...register("agreeToTerms")}
              className="mr-2 h-4 w-4 accent-[#FF8400]"
            />
            <label htmlFor="agreeToTerms" className="text-[#181818] text-sm">
              I agree to the{" "}
              <a href="/terms" className="text-[#FF8400] hover:underline">
                Terms & Condition
              </a>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="mb-2 text-sm text-red-600">
              {errors.agreeToTerms.message}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-gradient-to-r from-[#2767E7] to-[#0057FF] py-3 font-semibold text-base text-white transition-colors duration-200 hover:bg-[#0057FF] disabled:cursor-not-allowed disabled:opacity-50 mt-2 mb-1"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-xs text-gray-500 mt-2 text-center">
          Already have an account?{" "}
          <Link href="/login" className="font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </GlobalAuthModal>
  );
};

export default SignUpModalScreen;
