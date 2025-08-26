import React from "react";
import DayItem from "./DayItem";
import { Step } from "@/components/dashboard/modals/components/newjourney/types";

interface ItineraryContentProps {
  finalDisplayDays: any[];
  openDayIndex: number | null;
  journeyData: any;
  selectedStep?: { dayIndex: number; stepIndex: number } | null;
  onDayToggle: (dayIndex: number) => void;
  onAddStop: (dayIndex: number) => void;
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

const ItineraryContent: React.FC<ItineraryContentProps> = ({
  finalDisplayDays,
  openDayIndex,
  journeyData,
  selectedStep,
  onDayToggle,
  onAddStop,
  onStepSelect,
  onStepUpdate,
  onStepDelete,
  onSaveStep,
  onEditStep,
  savedSteps,
}) => {
  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="p-3 space-y-2">
        {finalDisplayDays.map((day: any, dayIndex: number) => {
          const isOpen = openDayIndex === dayIndex;

          return (
            <DayItem
              key={day.id || dayIndex}
              day={day}
              dayIndex={dayIndex}
              isOpen={isOpen}
              journeyData={journeyData}
              onDayToggle={onDayToggle}
              onAddStop={onAddStop}
              selectedStep={selectedStep}
              onStepSelect={onStepSelect}
              onStepUpdate={onStepUpdate}
              onStepDelete={onStepDelete}
              onSaveStep={onSaveStep}
              onEditStep={onEditStep}
              savedSteps={savedSteps}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ItineraryContent;
