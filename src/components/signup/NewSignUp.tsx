"use client";

import { apiRequest, getErrorMessage, setTokenCookie } from "@/lib/api";
import SignUpModalScreen, { SignUpForm } from "./SignUpModalScreen";
import PhoneVerificationModal from "./PhoneVerificationModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const SignupFlowManager = ({
  setSignUp,
  onSwitchToLogin,
}: {
  setSignUp?: (signUp: boolean) => void;
  onSwitchToLogin?: () => void;
}) => {
  const router = useRouter();
  const [signupData, setSignupData] = useState<SignUpForm | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const handleFormSubmit = (data: SignUpForm) => {
    setSignupData(data);
    setShowForm(false);
    setShowPhoneModal(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSignUp?.(false); // Close the entire signup flow
  };

  const handlePhoneModalClose = () => {
    setShowPhoneModal(false);
    setShowForm(true); // Go back to form instead of closing everything
  };

  const handlePhoneVerified = async (verifiedPhone: string) => {
    setShowPhoneModal(false);
    setLoading(true);
    setError(null);
    setPhoneNumber(verifiedPhone);

    // Check if signupData exists
    if (!signupData) {
      toast.error("Signup data is missing. Please try again.");
      setShowForm(true);
      setShowPhoneModal(false);
      setLoading(false);
      return;
    }

    try {
      const body = {
        name: signupData.fullName,
        username: signupData.username,
        email: signupData.email,
        date_of_birth: signupData.dateOfBirth,
        phone: verifiedPhone,
        password: signupData.password,
        password_confirmation: signupData.confirmPassword,
      };

      const result = await apiRequest<any>("register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      // Validate the response
      if (result && result.user && (result.user.name || result.user.fullName)) {
        const userName = result.user.name || result.user.fullName;
        localStorage.setItem("name", userName);

        // Store complete user data in localStorage
        localStorage.setItem("user", JSON.stringify(result.user));

        // Store token in localStorage and cookie if it exists in the response
        if (result.token) {
          localStorage.setItem("token", result.token);
          setTokenCookie(result.token);
        }

        toast.success(
          "Account created successfully! Welcome to High Tribe! 🎉"
        );
        setSignUp?.(false); // Close the signup flow
        router.push("/dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      console.error("Signup error:", err);

      // Get user-friendly error message
      const errorMessage = getErrorMessage(err, "signup");
      toast.error(errorMessage);

      // Handle specific error types for UI state management
      if (err.message && err.message.toLowerCase().includes("phone")) {
        // Keep phone modal open for phone-related errors
        setShowForm(false);
        setShowPhoneModal(true);
      } else {
        // Go back to form for other errors
        setShowForm(true);
        setShowPhoneModal(false);
      }

      setSignupData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SignUpModalScreen
        isOpen={showForm}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        onSwitchToLogin={onSwitchToLogin}
      />
      <PhoneVerificationModal
        isOpen={showPhoneModal}
        onClose={handlePhoneModalClose}
        onVerified={handlePhoneVerified}
        loading={loading}
      />
    </>
  );
};

export default SignupFlowManager;
