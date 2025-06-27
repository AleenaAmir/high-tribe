"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import GlobalInput from "@/components/global/GlobalInput";
import GlobalAuthModal from "@/components/global/GlobalAuthModal";
import { apiRequest } from "@/lib/api";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface LoginModalScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup?: () => void;
  onShowResetModal?: () => void;
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginModalScreen = ({
  isOpen,
  onClose,
  onSwitchToSignup,
  onShowResetModal,
}: LoginModalScreenProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await apiRequest<any>(
        "/api/auth/login",
        {
          method: "POST",
          json: {
            email: data.email,
            password: data.password,
          },
        },
        "Login successful!"
      );
      localStorage.setItem("token", result.access_token);
      onClose();
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during login"
      );
    }
  };

  return (
    <>
      <GlobalAuthModal
        isOpen={isOpen}
        onClose={onClose}
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
              Explore the world to experience
              <br />
              the beauty of nature
            </div>
            <div className="text-[13px] text-[#666666] text-center mb-6 max-w-[300px]">
              Connect with fellow travelers and discover amazing destinations
              together.
            </div>
          </div>
          <form
            className="w-full flex flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <GlobalInput
              placeholder="Email"
              type="email"
              {...register("email")}
              error={errors.email?.message}
            />
            <GlobalInput
              placeholder="Password"
              type="password"
              {...register("password")}
              error={errors.password?.message}
            />
            <div className="flex justify-end mb-1">
              <button
                type="button"
                className="text-xs text-blue-600 hover:underline focus:outline-none"
                onClick={() => {
                  onClose();
                  onShowResetModal?.();
                }}
              >
                Forgot Password?
              </button>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-gradient-to-r from-[#2767E7] to-[#0057FF] py-3 font-semibold text-base text-white transition-colors duration-200 hover:bg-[#0057FF] disabled:cursor-not-allowed disabled:opacity-50 mt-2 mb-1"
            >
              {isSubmitting ? "Signing In..." : "Continue"}
            </button>
          </form>
          <div className="flex items-center w-full my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-2 text-sm text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <button
            type="button"
            className="flex w-full gap-2 justify-center hover:shadow-none cursor-pointer items-center py-2 font-medium text-gray-700 bg-white rounded-full shadow-lg hover:bg-gray-50 mb-2"
          >
            <img src="/googlesvg.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
          <button
            type="button"
            className="flex w-full gap-2 justify-center hover:shadow-none cursor-pointer items-center py-2 font-medium text-gray-700 bg-white rounded-full shadow-lg hover:bg-gray-50 mb-2"
          >
            <img src="/facebooksvg.svg" alt="Apple" className="w-5 h-5" />
            Continue with Apple
          </button>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Don't have an account?{" "}
            <button
              onClick={() => {
                onClose();
                onSwitchToSignup?.();
              }}
              className="font-medium hover:underline "
            >
              Register
            </button>
          </div>
        </div>
      </GlobalAuthModal>
    </>
  );
};

export default LoginModalScreen;
