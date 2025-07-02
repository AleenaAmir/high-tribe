"use client";

import { apiRequest } from "@/lib/api";
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

      const result = await apiRequest<any>(
        "register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
        "Signup successful!"
      );

      localStorage.setItem("name", result.user.fullName);
      toast.success("Signup successful! Redirecting...");
      setSignUp?.(false); // Close the signup flow
      router.push("/dashboard");
    } catch (err: any) {
      // Handle specific username already used error
      if (err.message && err.message.toLowerCase().includes("username")) {
        toast.error(
          "Username is already taken. Please choose a different username."
        );

        setShowForm(true);
        setShowPhoneModal(false);
        setSignupData(null);
      } else if (err.message && err.message.toLowerCase().includes("email")) {
        toast.error("Email is already used. Please choose a different email.");
        setShowForm(true);
        setShowPhoneModal(false);
        setSignupData(null);
      } else if (err.message && err.message.toLowerCase().includes("phone")) {
        toast.error(
          "Phone number is already used. Please choose a different phone number."
        );
        setShowForm(false);
        setShowPhoneModal(true);
        setSignupData(null);
      } else {
        toast.error(
          err instanceof Error
            ? err.message
            : "An error occurred during sign up"
        );
        setShowForm(true);
        setShowPhoneModal(false);
        setSignupData(null);
      }
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
