"use client";
import { useState, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import GlobalAuthModal from "@/components/global/GlobalAuthModal";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (phoneNumber: string) => void;
  loading: boolean;
}

const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
});

type PhoneForm = z.infer<typeof phoneSchema>;

const countries = [
  { code: "US", flag: "🇺🇸", dialCode: "+1", name: "United States" },
  { code: "GB", flag: "🇬🇧", dialCode: "+44", name: "United Kingdom" },
  { code: "CA", flag: "🇨🇦", dialCode: "+1", name: "Canada" },
  { code: "AU", flag: "🇦🇺", dialCode: "+61", name: "Australia" },
  { code: "IN", flag: "🇮🇳", dialCode: "+91", name: "India" },
  { code: "DE", flag: "🇩🇪", dialCode: "+49", name: "Germany" },
  { code: "FR", flag: "🇫🇷", dialCode: "+33", name: "France" },
  { code: "JP", flag: "🇯🇵", dialCode: "+81", name: "Japan" },
];

const STATIC_CODE = "000000";

const PhoneVerificationModal = ({
  isOpen,
  onClose,
  onVerified,
  loading,
}: PhoneVerificationModalProps) => {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [enteredCode, setEnteredCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
    mode: "onSubmit",
  });

  const phoneNumber = watch("phoneNumber");

  const onSubmit = async (data: PhoneForm) => {
    try {
      // Simulate API call for sending verification code
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep("code");
      toast.success("Verification code sent!");
    } catch (error) {
      toast.error("Failed to send verification code. Please try again.");
    }
  };

  const handleCodeChange = (idx: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...enteredCode];
    newCode[idx] = value;
    setEnteredCode(newCode);
    if (value && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (paste.length > 0) {
      const newCode = paste.split("");
      while (newCode.length < 6) newCode.push("");
      setEnteredCode(newCode);
      setTimeout(() => {
        const nextIdx = Math.min(paste.length, 5);
        inputRefs.current[nextIdx]?.focus();
      }, 0);
      e.preventDefault();
    }
  };

  const handleCodeKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (enteredCode[idx] === "" && idx > 0) {
        const newCode = [...enteredCode];
        newCode[idx - 1] = "";
        setEnteredCode(newCode);
        setTimeout(() => inputRefs.current[idx - 1]?.focus(), 0);
        e.preventDefault();
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      setTimeout(() => inputRefs.current[idx - 1]?.focus(), 0);
    } else if (e.key === "ArrowRight" && idx < 5) {
      setTimeout(() => inputRefs.current[idx + 1]?.focus(), 0);
    }
  };

  const handleVerify = () => {
    if (enteredCode.join("") === STATIC_CODE) {
      toast.success("Phone verified!");
      onVerified(phoneNumber || "");
    } else {
      toast.error("Invalid code. Try 000000");
    }
  };

  const handleSendAgain = () => {
    setEnteredCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const handleClose = () => {
    // Reset state when closing
    setStep("phone");
    setEnteredCode(["", "", "", "", "", ""]);
    setValue("phoneNumber", "");
    onClose();
  };

  return (
    <GlobalAuthModal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-[428px]"
    >
      <div className="flex flex-col items-center w-full max-w-md mx-auto p-0">
        <div className="flex flex-col items-center w-full mb-6">
          <Image
            src="/logo.svg"
            alt="High Tribe"
            width={130}
            height={47}
            className="h-11 w-auto"
          />
          <div className="text-[22px] font-semibold text-[#181818] text-center mb-1">
            Phone Verification
          </div>
          {step === "phone" ? (
            <div className="text-[13px] text-[#666666] text-center mb-6 max-w-[300px]">
              We'll send a verification code to your phone for security.
            </div>
          ) : (
            <div className="text-[15px] text-[#666666] text-center mb-6 max-w-[320px]">
              Enter the 6-digit code to complete your registration.
            </div>
          )}
        </div>

        {step === "phone" ? (
          <form
            className="w-full flex flex-col gap-4 items-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full flex flex-col items-center">
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    country="gb"
                    value={field.value}
                    onChange={field.onChange}
                    inputClass="!w-full !h-12 !pl-16 !pr-10 !text-[18px] !font-medium !text-[#181818] !rounded-md !border !border-gray-300 !bg-white !shadow-none focus:!border-blue-500 placeholder:!text-gray-400 placeholder:!font-normal"
                    buttonClass="!border-none !bg-transparent !pl-4 !pr-2 !py-0 !h-full !flex !items-center !text-[22px]"
                    containerClass="!w-full !max-w-[340px] !bg-white !rounded-md !border !border-gray-300 !text-left !text-black  !mx-auto"
                    dropdownClass="!rounded-md !border !border-gray-200 !shadow-none !text-[12px] !mt-1 !z-[9999]"
                    searchClass="!py-2 !px-3 !text-base !rounded-md !border !border-gray-200 !mb-2 !shadow-none"
                    inputProps={{
                      name: "phone",
                      required: true,
                      autoFocus: true,
                    }}
                    specialLabel=""
                    placeholder="( +44 ) 22234 123423"
                    disableDropdown={false}
                    disableCountryCode={false}
                    disableSearchIcon
                  />
                )}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full max-w-[340px] rounded-md bg-gradient-to-r from-[#2767E7] to-[#0057FF] h-12 font-semibold text-base text-white transition-colors duration-200 hover:bg-[#0057FF] disabled:cursor-not-allowed disabled:opacity-50 mt-2"
            >
              {loading ? "Sending..." : "Send the code"}
            </button>
          </form>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="flex justify-center gap-3 mb-6">
              {enteredCode.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  onPaste={handleCodePaste}
                  onKeyDown={(e) => handleCodeKeyDown(idx, e)}
                  className="w-10 h-12 text-center text-2xl text-[#1165E2] font-semibold border-b-2 border-gray-400 focus:border-blue-500 outline-none bg-transparent mx-1"
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </div>
            <button
              onClick={handleVerify}
              className="w-full max-w-[340px] rounded-md bg-gradient-to-r from-[#2767E7] to-[#0057FF] h-12 font-semibold text-base text-white transition-colors duration-200 hover:bg-[#0057FF] disabled:cursor-not-allowed disabled:opacity-50 mb-2"
            >
              Verify Phone Number
            </button>
            <div className="flex justify-between w-full max-w-[340px] text-sm mt-2">
              <span
                className="text-[#181818] cursor-pointer"
                onClick={() => setStep("phone")}
              >
                Edit phone number?
              </span>
              <span
                className="text-[#0057FF] cursor-pointer"
                onClick={handleSendAgain}
              >
                Send again
              </span>
            </div>
          </div>
        )}
      </div>
    </GlobalAuthModal>
  );
};

export default PhoneVerificationModal;
