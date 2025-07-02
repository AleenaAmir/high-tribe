"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import GlobalInput from "@/components/global/GlobalInput";
import GlobalAuthModal from "@/components/global/GlobalAuthModal";
import PhoneVerificationModal from "@/components/signup/PhoneVerificationModal";
import { apiRequest } from "@/lib/api";

import { toast } from "react-hot-toast";
import { useState, useRef } from "react";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

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
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [googleCredential, setGoogleCredential] = useState<string>("");
  const [googleUserData, setGoogleUserData] = useState<any>(null);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

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
        "login",
        {
          method: "POST",
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        },
        "Login successful!"
      );

      localStorage.setItem("name", result?.user?.fullName);
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

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      console.log("Google OAuth success:", credentialResponse);

      const result = await apiRequest<any>("login", {
        method: "POST",
        json: {
          credential: credentialResponse.credential,
        },
      });

      // Check if phone number is required for new user
      if (result.requiresPhoneNumber) {
        setGoogleCredential(credentialResponse.credential);
        setGoogleUserData(result.user);
        setShowPhoneModal(true);
        return;
      }

      // Store user info in localStorage
      localStorage.setItem("name", result.user.fullName);

      // Note: JWT token is automatically set as httpOnly cookie by the API
      // No need to manually store it in localStorage

      toast.success("Google login successful!");
      onClose();
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Google OAuth error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during Google login"
      );
    }
  };

  const handlePhoneVerified = async (phoneNumber: string) => {
    setPhoneLoading(true);
    try {
      const result = await apiRequest<any>("/api/auth/google", {
        method: "POST",
        json: {
          credential: googleCredential,
          phoneNumber: phoneNumber,
        },
      });

      // Store user info in localStorage
      localStorage.setItem("name", result.user.fullName);

      toast.success("Account created successfully!");
      setShowPhoneModal(false);
      onClose();
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while creating your account"
      );
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error("Google OAuth error");
    toast.error("Google login failed. Please try again.");
  };

  const handlePhoneModalClose = () => {
    setShowPhoneModal(false);
    setGoogleCredential("");
    setGoogleUserData(null);
  };

  const triggerGoogleLogin = () => {
    // Find and click the hidden Google button
    if (googleButtonRef.current) {
      const googleButton = googleButtonRef.current.querySelector(
        'div[role="button"]'
      ) as HTMLElement;
      if (googleButton) {
        googleButton.click();
      }
    }
  };

  return (
    <GoogleOAuthProvider clientId="814963512618-7fmmpki2f7lk0j4jqnsk2ga3am3hi12o.apps.googleusercontent.com">
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
          <div className="w-full mb-2">
            {/* Hidden Google Login Component */}
            <div ref={googleButtonRef} style={{ display: "none" }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
                locale="en"
                type="standard"
                context="signin"
                ux_mode="popup"
                auto_select={false}
                cancel_on_tap_outside={true}
                width="100%"
              />
            </div>
            {/* Custom Google Button */}
            <button
              type="button"
              onClick={triggerGoogleLogin}
              className="flex w-full gap-2 justify-center hover:shadow-none cursor-pointer items-center py-2 font-medium text-gray-700 bg-white rounded-full shadow-lg hover:bg-gray-50 mb-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
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

      {/* Phone Verification Modal for New Google Users */}
      <PhoneVerificationModal
        isOpen={showPhoneModal}
        onClose={handlePhoneModalClose}
        onVerified={handlePhoneVerified}
        loading={phoneLoading}
      />
    </GoogleOAuthProvider>
  );
};

export default LoginModalScreen;
