import React from "react";

interface GlobalTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
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
         <label className="text-xs font-medium text-[#5E6368] translate-y-3 translate-x-5 bg-white w-fit px-2">
         {label}
       </label>
      )}
      <textarea
        {...props}
        className={`rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default GlobalTextArea;
