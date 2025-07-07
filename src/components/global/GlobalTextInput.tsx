import React from "react";

interface GlobalTextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const GlobalTextInput: React.FC<GlobalTextInputProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-[10px] font-medium text-[#5E6368] translate-y-3 translate-x-4 bg-white w-fit px-1">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`rounded-lg border py-3 px-5 text-[9px] placeholder:text-[#AFACAC] focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${
          error ? "border-red-400" : "border-[#848484]"
        }`}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default GlobalTextInput;
