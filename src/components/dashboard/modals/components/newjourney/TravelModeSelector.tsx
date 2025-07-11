import React from "react";
import { TravelModeSelectorProps } from "./types";
import { TRAVEL_MODES } from "./constants";

export default function TravelModeSelector({
  selectedMode,
  onModeSelect,
  modes = TRAVEL_MODES,
  error,
}: TravelModeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1 justify-end">
        {modes.map((mode, index) => {
          const isSelected = selectedMode === mode.name;
          return (
            <button
              key={`${mode.name}-${index}`}
              type="button"
              className={`p-1 rounded-md bg-[#F8F6F6] border w-fit cursor-pointer transition-colors ${
                isSelected
                  ? "text-[#2379FC] border-[#2379FC] bg-blue-50"
                  : "text-black hover:text-[#2379FC] border-[#F8F6F6] hover:border-[#DFDFDF]"
              }`}
              onClick={() => onModeSelect(mode.name)}
              title={`Select ${mode.name}`}
              aria-label={`Select ${mode.name} as travel mode`}
            >
              <div className="w-[18px] h-[18px] flex items-center justify-center">
                {mode.icon}
              </div>
            </button>
          );
        })}
      </div>
      {error && <p className="text-red-500 text-[10px] text-right">{error}</p>}
    </div>
  );
}
