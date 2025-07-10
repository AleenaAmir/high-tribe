import React from "react";
import VisibilitySelector from "./VisibilitySelector";
import { VisibilityType } from "./types";

interface JourneyFormActionsProps {
  visibility: VisibilityType;
  onVisibilityChange: (visibility: VisibilityType) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  disabled?: boolean;
}

export default function JourneyFormActions({
  visibility,
  onVisibilityChange,
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Share Post",
  disabled = false,
}: JourneyFormActionsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && !isSubmitting) {
      onSubmit();
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-t border-[#D9D9D9] bg-white">
      <VisibilitySelector value={visibility} onChange={onVisibilityChange} />

      <button
        type="submit"
        onClick={handleSubmit}
        disabled={disabled || isSubmitting}
        className={`ml-4 px-6 py-2 text-[12px] rounded-lg border font-semibold transition-all ${
          disabled || isSubmitting
            ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
            : "border-blue-600 text-black bg-white hover:bg-blue-50 cursor-pointer"
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            Creating...
          </div>
        ) : (
          submitButtonText
        )}
      </button>
    </div>
  );
}
