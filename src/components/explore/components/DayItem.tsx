import React from "react";
import { Step } from "@/components/dashboard/modals/components/newjourney/types";
import ChevronDownIcon from "../icons/ChevronDownIcon";
import StepPreview from "./StepPreview";
import StopForm from "./StopForm";

interface DayItemProps {
  day: any;
  dayIndex: number;
  isOpen: boolean;
  journeyData: any;
  onDayToggle: (dayIndex: number) => void;
  onAddStop: (dayIndex: number) => void;
  selectedStep?: { dayIndex: number; stepIndex: number } | null;
  onStepSelect: (dayIndex: number, stepIndex: number) => void;
  onStepUpdate: (
    dayIndex: number,
    stepIndex: number,
    updatedStep: Partial<Step>
  ) => void;
  onStepDelete: (dayIndex: number, stepIndex: number) => void;
  onSaveStep: (dayIndex: number, stepIndex: number) => void;
  onEditStep: (dayIndex: number, stepIndex: number) => void;
  savedSteps: { [key: string]: boolean };
}

const DayItem: React.FC<DayItemProps> = ({
  day,
  dayIndex,
  isOpen,
  journeyData,
  onDayToggle,
  onAddStop,
  selectedStep,
  onStepSelect,
  onStepUpdate,
  onStepDelete,
  onSaveStep,
  onEditStep,
  savedSteps,
}) => {
  const formattedDate = new Date(day.date).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        {/* Left: Day label + date + chevron */}
        <button
          type="button"
          onClick={() => onDayToggle(dayIndex)}
          className="inline-flex items-center gap-1.5 focus:outline-none"
        >
          <span className="text-[12px] font-gilroy leading-[100%] tracking-[-3%] font-medium text-[#000000]">
            Day {day.dayNumber}{" "}
            <span className="text-[#000000] text-[12px] font-gilroy leading-[100%] tracking-[-3%] font-medium">
              ({formattedDate})
            </span>
          </span>
          <ChevronDownIcon isOpen={isOpen} />
        </button>

        {/* Right: + Add Stop */}
        <button
          type="button"
          onClick={() => onAddStop(dayIndex)}
          className="text-[12px] leading-none font-semibold bg-[linear-gradient(90.76deg,#9243AC_0.54%,#B6459F_50.62%,#E74294_99.26%)] bg-clip-text text-transparent focus:outline-none"
        >
          + Add Stop
        </button>
      </div>

      {/* Day Content - Steps */}
      {isOpen && (
        <div className="px-4 pb-4 bg-gray-50">
          {/* Show existing steps */}
          {day.steps && day.steps.length > 0 ? (
            <div className="space-y-3 pt-3">
              {day.steps.map((step: any, stepIndex: number) => {
                const stepKey = `${dayIndex}-${stepIndex}`;
                const isSaved = savedSteps[stepKey];
                const isSelected =
                  selectedStep?.dayIndex === dayIndex &&
                  selectedStep?.stepIndex === stepIndex;

                return (
                  <div key={stepIndex}>
                    {/* Show saved steps as preview */}
                    {isSaved && (
                      <StepPreview
                        step={step}
                        dayIndex={dayIndex}
                        stepIndex={stepIndex}
                        isSelected={isSelected}
                        onStepSelect={onStepSelect}
                        onEditStep={onEditStep}
                      />
                    )}

                    {/* Show form for unsaved steps */}
                    {!isSaved && (
                      <StopForm
                        step={step}
                        dayIndex={dayIndex}
                        stepIndex={stepIndex}
                        journeyData={journeyData}
                        onStepUpdate={onStepUpdate}
                        onStepDelete={onStepDelete}
                        onSaveStep={onSaveStep}
                        isSaved={false}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="pt-3 text-center text-gray-500 text-[12px]">
              No stops planned for this day yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DayItem;
