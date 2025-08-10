import React from "react";

interface CheckboxOption {
  label: string;
  value: string;
}

interface GlobalCheckboxGroupProps {
  label?: string;
  options: CheckboxOption[];
  value: string[];
  onChange: (value: string[]) => void;
  name: string;
  error?: string;
  className?: string;
}

const GlobalCheckboxGroup: React.FC<GlobalCheckboxGroupProps> = ({
  label,
  options,
  value,
  onChange,
  name,
  error,
  className = "",
}) => {
  const handleChange = (checkedValue: string) => {
    if (value.includes(checkedValue)) {
      onChange(value.filter((v) => v !== checkedValue));
    } else {
      onChange([...value, checkedValue]);
    }
  };

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
              value.includes(option.value)
                ? "font-semibold text-blue-600"
                : "text-gray-700"
            }`}
          >
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={value.includes(option.value)}
              onChange={() => handleChange(option.value)}
              className="accent-[#275BD3] w-4 h-4"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default GlobalCheckboxGroup;
