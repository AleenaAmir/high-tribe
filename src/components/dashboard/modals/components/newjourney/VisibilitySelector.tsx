import React, { useState, useRef, useEffect } from "react";
import { VisibilitySelectorProps, VisibilityType } from "./types";
import { ChevronDownIcon } from "./constants";

const VISIBILITY_LABELS: Record<VisibilityType, string> = {
  public: "Public",
  tribe: "Tribe Only",
  private: "Private",
};

export default function VisibilitySelector({
  value,
  onChange,
  options = ["public", "tribe", "private"],
}: VisibilitySelectorProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleVisibilityChange = (newVisibility: VisibilityType) => {
    onChange(newVisibility);
    setShowDropdown(false);
  };

  const availableOptions = options.filter((option) => option !== value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="px-6 py-2 rounded-full text-[13px] bg-blue-600 text-white border-blue-600 font-medium border focus:outline-none flex items-center gap-2 transition-all w-36 justify-between hover:bg-blue-700"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-expanded={showDropdown}
        aria-haspopup="listbox"
      >
        <span>{VISIBILITY_LABELS[value]}</span>
        <div
          className={`transition-transform duration-200 ${
            showDropdown ? "rotate-180" : ""
          }`}
        >
          {ChevronDownIcon}
        </div>
      </button>

      {showDropdown && availableOptions.length > 0 && (
        <ul
          className="absolute left-0 mt-1 w-36 bg-white rounded-lg shadow-lg z-20 border border-gray-200"
          role="listbox"
        >
          {availableOptions.map((option) => (
            <li
              key={option}
              role="option"
              className="px-6 py-2 text-[13px] cursor-pointer hover:bg-blue-100 text-[#6B7280] transition-colors first:rounded-t-lg last:rounded-b-lg"
              onClick={() => handleVisibilityChange(option)}
            >
              {VISIBILITY_LABELS[option]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
