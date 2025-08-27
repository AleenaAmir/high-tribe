import React from "react";

interface ChevronDownIconProps {
  className?: string;
  isOpen?: boolean;
}

const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({
  className = "h-4 w-4",
  isOpen = false,
}) => {
  return (
    <svg
      className={`${className} text-gray-700 transition-transform ${isOpen ? "rotate-180" : ""
        }`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 111.04 1.08l-4.22 3.34a.75.75 0 01-.94 0L5.21 8.31a.75.75 0 01.02-1.1z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default ChevronDownIcon;
