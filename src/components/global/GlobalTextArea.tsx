import React from "react";

interface GlobalTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string | React.ReactNode;
  error?: string;
}

const GlobalTextArea: React.FC<GlobalTextAreaProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-[12px] font-medium text-[#1C231F] translate-y-3.5 translate-x-4 bg-white w-fit px-1">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`rounded-lg border px-5 py-3 text-[12px] placeholder:text-[#AFACAC] focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none ${error ? "border-red-400" : "border-[#848484]"
          }`}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default GlobalTextArea;
