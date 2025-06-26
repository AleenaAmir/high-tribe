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
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginModalScreen = ({ isOpen, onClose }: LoginModalScreenProps) => {
  const router = useRouter();
  const [showResetModal, setShowResetModal] = useState(false);
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
              lobortis maximus.
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
                onClick={() => setShowResetModal(true)}
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
            <Link href="/signup" className="font-medium hover:underline">
              Register
            </Link>
          </div>
        </div>
      </GlobalAuthModal>
      {/* Password Reset Modal will be implemented here */}
      {showResetModal && (
        <PasswordResetModal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
        />
      )}
    </>
  );
};

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(15, "Password must not exceed 15 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/^\S*$/, "Password must not contain spaces");

const PasswordResetModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: email, 2: new password, 3: success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [submitted, setSubmitted] = useState(false);

  // Simulate API calls for demo; replace with real API calls
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      // TODO: Call API to send reset email
      // await apiRequest('/api/auth/forgot-password', { method: 'POST', json: { email } });
      setTimeout(() => {
        setStep(2);
        setIsSubmitting(false);
      }, 1000);
    } catch (err: any) {
      setError("Failed to send reset email");
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setIsSubmitting(true);
    setError("");
    if (validatePassword(password)) {
      setIsSubmitting(false);
      return;
    }
    if (password !== confirmPassword) {
      setIsSubmitting(false);
      return;
    }
    try {
      // TODO: Call API to reset password
      // await apiRequest('/api/auth/reset-password', { method: 'POST', json: { email, token, password } });
      setTimeout(() => {
        setStep(3);
        setIsSubmitting(false);
        setTimeout(onClose, 2000); // Auto-close after 2s
      }, 1000);
    } catch (err: any) {
      setError("Failed to reset password");
      setIsSubmitting(false);
    }
  };

  const validatePassword = (pwd: string) => {
    try {
      passwordSchema.parse(pwd);
      return "";
    } catch (err: any) {
      return err.errors?.[0]?.message || "Invalid password";
    }
  };

  let passwordError = submitted && step === 2 ? validatePassword(password) : "";
  let confirmPasswordError =
    submitted &&
    step === 2 &&
    password &&
    confirmPassword &&
    password !== confirmPassword
      ? "Passwords do not match"
      : "";

  return (
    <GlobalAuthModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[428px]">
      <div className="flex flex-col items-center w-full max-w-md mx-auto p-0">
        <div className="flex flex-col items-center w-full">
          <div className="text-2xl font-extrabold text-[#181818] mb-2 text-center leading-tight">
            High
            <br />
            Tribe
          </div>
          <div className="text-[22px] font-semibold text-[#181818] text-center mb-1">
            Reset Password
          </div>
          <div className="text-[13px] text-[#666666] text-center mb-6 max-w-[300px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
            lobortis maximus.
          </div>
        </div>
        {step === 1 && (
          <form
            className="w-full flex flex-col gap-3"
            onSubmit={handleSendEmail}
          >
            <GlobalInput
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-gradient-to-r from-[#2767E7] to-[#0057FF] py-3 font-semibold text-base text-white transition-colors duration-200 hover:bg-[#0057FF] disabled:cursor-not-allowed disabled:opacity-50 mt-2 mb-1"
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </form>
        )}
        {step === 2 && (
          <form
            className="w-full flex flex-col gap-3"
            onSubmit={handleResetPassword}
            autoComplete="off"
          >
            <div className="relative">
              <GlobalInput
                type={"password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                required
              />
            </div>

            <div className="relative">
              <GlobalInput
                type={"password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPasswordError}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-gradient-to-r from-[#2767E7] to-[#0057FF] py-3 font-semibold text-base text-white transition-colors duration-200 hover:bg-[#0057FF] disabled:cursor-not-allowed disabled:opacity-50 mt-2 mb-1"
            >
              {isSubmitting ? "Resetting..." : "Reset password"}
            </button>
          </form>
        )}
        {step === 3 && (
          <div className="w-full flex flex-col items-center justify-center py-8">
            <div className="text-green-600 text-lg font-semibold mb-2">
              Password reset successful!
            </div>
            <div className="text-gray-500 text-sm text-center">
              You can now log in with your new password.
            </div>
          </div>
        )}
      </div>
    </GlobalAuthModal>
  );
};

export default LoginModalScreen;
