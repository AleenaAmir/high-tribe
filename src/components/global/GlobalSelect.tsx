import React from "react";

interface GlobalSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

const GlobalSelect: React.FC<GlobalSelectProps> = ({
  label,
  error,
  className = "",
  children,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-[12px] font-medium text-black translate-y-3 translate-x-4 bg-white w-fit px-1">
          {label}
        </label>
      )}
      <select
        {...props}
        className={`rounded-lg border px-5 py-3 text-[12px] placeholder:text-[#AFACAC] focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${
          error ? "border-red-400" : "border-[#848484]"
        }`}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default GlobalSelect;
