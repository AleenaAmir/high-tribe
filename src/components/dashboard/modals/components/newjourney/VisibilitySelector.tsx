import React from "react";
import { VisibilitySelectorProps, VisibilityType } from "./types";

const VISIBILITY_LABELS: Record<VisibilityType, string> = {
  public: "Public",
  tribe: "Tribe Only",
  private: "Private",
};

// Icons for each visibility level
const VisibilityIcons = {
  public: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path
        fillRule="evenodd"
        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  tribe: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  private: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

export default function VisibilitySelector({
  value,
  onChange,
  options = ["public", "tribe", "private"],
}: VisibilitySelectorProps) {
  const handleVisibilityChange = (newVisibility: VisibilityType) => {
    onChange(newVisibility);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700 mb-1">
        Journey Visibility
      </label>
      <div className="grid grid-cols-3 gap-2 justify-center items-center">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`px-4 cursor-pointer py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-2 flex items-center gap-2 ${
              value === option
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"
            }`}
            onClick={() => handleVisibilityChange(option)}
          >
            {VisibilityIcons[option]}
            {VISIBILITY_LABELS[option]}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {value === "public" && "Anyone can see your journey"}
        {value === "tribe" && "Only your tribe members can see your journey"}
        {value === "private" && "Only you can see your journey"}
      </p>
    </div>
  );
}
