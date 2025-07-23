import React from "react";

interface GlobalInputStepperProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const GlobalInputStepper: React.FC<GlobalInputStepperProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 5,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {label && <span className="text-xs mb-1 text-center">{label}</span>}
      <div className="flex items-center gap-4 p-2 border border-[#848484] rounded-sm">
        <button
          type="button"
          className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold bg-white hover:bg-gray-100 disabled:opacity-50"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          -
        </button>
        <span className="w-5 h-5 flex items-center justify-center text-sm font-medium  rounded-full">
          {value}
        </span>
        <button
          type="button"
          className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold bg-white hover:bg-gray-100 disabled:opacity-50"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default GlobalInputStepper;
