"use client";

import { apiRequest } from "@/lib/api";
import SignUpModalScreen, { SignUpForm } from "./SignUpModalScreen";
import PhoneVerificationModal from "./PhoneVerificationModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const SignupFlowManager = ({
  setSignUp,
}: {
  setSignUp?: (signUp: boolean) => void;
}) => {
  const router = useRouter();
  const [signupData, setSignupData] = useState<SignUpForm | null>(null);
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
    try {
      const result = await apiRequest<any>(
        "/api/auth/signup",
        {
          method: "POST",
          json: {
            fullName: signupData?.fullName,
            email: signupData?.email,
            password: signupData?.password,
            confirmPassword: signupData?.confirmPassword,
            agreeToTerms: signupData?.agreeToTerms,
            phoneNumber: verifiedPhone,
          },
        },
        "Signup successful!"
      );
      localStorage.setItem("token", result.access_token);
      toast.success("Signup successful! Redirecting...");
      setSignUp?.(false); // Close the signup flow
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(
        err instanceof Error ? err.message : "An error occurred during sign up"
      );
      setShowForm(true);
      setShowPhoneModal(false);
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
