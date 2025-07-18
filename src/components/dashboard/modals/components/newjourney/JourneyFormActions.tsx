import React from "react";
import VisibilitySelector from "./VisibilitySelector";
import { VisibilityType } from "./types";

interface JourneyFormActionsProps {
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  submitText?: string; // Alternative prop name for consistency
  disabled?: boolean;
  hideVisibilitySelector?: boolean;
}

export default function JourneyFormActions({
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Share Post",
  submitText,
  disabled = false,
  hideVisibilitySelector = false,
}: JourneyFormActionsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && !isSubmitting) {
      onSubmit();
    }
  };

  // Use submitText if provided, otherwise fall back to submitButtonText
  const buttonText = submitText || submitButtonText;

  return (
    <div
      className={`flex items-center justify-end w-full p-4 border-t border-[#D9D9D9] bg-white rounded-bl-[20px]`}
    >
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={disabled || isSubmitting}
        className={`${
          hideVisibilitySelector ? "" : "ml-4"
        } px-8 py-3 text-[12px] rounded-lg border font-semibold transition-all ${
          disabled || isSubmitting
            ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
            : "border-blue-600 text-black bg-white hover:bg-blue-50 cursor-pointer"
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            {buttonText.includes("Add") ? "Adding..." : "Creating..."}
          </div>
        ) : (
          buttonText
        )}
      </button>
    </div>
  );
}
