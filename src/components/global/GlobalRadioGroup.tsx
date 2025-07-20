import React from "react";

interface RadioOption {
  label: string;
  value: string;
}

interface GlobalRadioGroupProps {
  label?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  error?: string;
  className?: string;
}

const GlobalRadioGroup: React.FC<GlobalRadioGroupProps> = ({
  label,
  options,
  value,
  onChange,
  name,
  error,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-[12px] font-medium text-black bg-white w-fit px-1">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-4 mt-1">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-2 cursor-pointer text-[12px] ${
              value === option.value
                ? "font-semibold text-blue-600"
                : "text-gray-700"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="accent-blue-600 w-4 h-4"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default GlobalRadioGroup;
