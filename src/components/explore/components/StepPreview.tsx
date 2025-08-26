import React from "react";
import { Step } from "@/components/dashboard/modals/components/newjourney/types";
import {
  LocationPinIcon,
  ClockIcon,
  PeopleIcon,
  EditIcon,
  MoreOptionsIcon,
  ImageIcon,
} from "../icons/StepIcons";

interface StepPreviewProps {
  step: Step;
  dayIndex: number;
  stepIndex: number;
  isSelected: boolean;
  onStepSelect: (dayIndex: number, stepIndex: number) => void;
  onEditStep: (dayIndex: number, stepIndex: number) => void;
}

const StepPreview: React.FC<StepPreviewProps> = ({
  step,
  dayIndex,
  stepIndex,
  isSelected,
  onStepSelect,
  onEditStep,
}) => {
  const handleStepClick = () => {
    onStepSelect(dayIndex, stepIndex);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditStep(dayIndex, stepIndex);
  };

  return (
    <div
      className={`bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3 cursor-pointer transition-all hover:bg-gray-100 ${
        isSelected ? "border-blue-500 bg-blue-50" : ""
      }`}
      onClick={handleStepClick}
    >
      <div className="flex items-start gap-3">
        {/* Step Number */}
        <div
          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
            isSelected ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
          }`}
        >
          <span className="text-[10px] font-medium">{stepIndex + 1}</span>
        </div>

        {/* Step Image */}
        <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-md">
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-[12px] font-semibold mb-1 ${
              isSelected ? "text-blue-900" : "text-gray-900"
            }`}
          >
            {step.location.name || step.name}
          </h3>

          {/* Step Details */}
          <div className="flex items-center gap-4 text-[10px] text-gray-600">
            <div className="flex items-center gap-1">
              <LocationPinIcon className="w-3 h-3" />
              <span>0 Mi</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-3 h-3" />
              <span>0h 0m</span>
            </div>
            <div className="flex items-center gap-1">
              <PeopleIcon className="w-3 h-3" />
              <span>1</span>
            </div>
          </div>
        </div>

        {/* Step Actions */}
        <div className="flex flex-col items-end gap-1">
          <div className="text-[10px] text-gray-500">
            {step.startDate
              ? new Date(step.startDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })
              : "No date"}
          </div>
          <button
            type="button"
            className="text-[10px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            onClick={handleEditClick}
          >
            <EditIcon className="w-3 h-3" />
            Edit
          </button>
          <button
            type="button"
            className="text-[10px] text-gray-500 hover:text-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreOptionsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepPreview;
