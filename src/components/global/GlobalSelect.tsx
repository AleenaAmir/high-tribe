import React from "react";
import { ArrowDownIcon } from "../dashboard/modals/components/newjourney/JourneyStep";

interface GlobalSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string | React.ReactNode;
  error?: string;
  children: string | React.ReactNode;
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
        <label className="text-[12px] z-10 font-medium text-[#1C231F] translate-y-3.5 translate-x-4 bg-white w-fit px-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          {...props}
          className={`rounded-lg w-full appearance-none h-[40px] border px-5 py-2 text-[12px] placeholder:text-[#AFACAC] focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${
            error ? "border-red-400" : "border-[#848484]"
          }`}
        >
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <ArrowDownIcon />
        </div>
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default GlobalSelect;
