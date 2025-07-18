import React, { useState } from "react";
import JourneyStep from "./JourneyStep";
import {
  Step,
  StopCategory,
  MapboxFeature,
  ValidationErrors,
  StepErrors,
} from "./types";
import { PlusIcon } from "./constants";

interface StepsListProps {
  steps: Step[];
  onStepsChange: (steps: Step[]) => void;
  onStepFieldTouch?: (stepIndex: number, fieldName: string) => void;
  canAddStep: boolean;
  fetchStepSuggestions?: (query: string) => Promise<MapboxFeature[]>;
  stopCategories: StopCategory[];
  loadingCategories: boolean;
  stepErrors?: StepErrors;
  onAddStep?: () => void;
  showAddButton?: boolean;
  previousSteps?: Step[];
  showPreviousSteps?: boolean;
  userData?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  journeyData?: {
    title?: string;
    startLocation?: { name: string };
    endLocation?: { name: string };
    startDate?: string;
    endDate?: string;
  };
}

export default function StepsList({
  steps,
  onStepsChange,
  onStepFieldTouch,
  canAddStep,
  fetchStepSuggestions,
  stopCategories,
  loadingCategories,
  stepErrors = {},
  onAddStep,
  showAddButton = true,
  previousSteps = [],
  showPreviousSteps = false,
  userData,
  journeyData,
}: StepsListProps) {
  const [openStepIndex, setOpenStepIndex] = useState<number>(0);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [previousStepsOpen, setPreviousStepsOpen] = useState<boolean>(true);

  const handleAddStep = () => {
    if (!canAddStep) return;

    const newStep: Step = {
      name: `Stop ${steps.length + 1}`,
      location: { coords: null, name: "" },
      notes: "",
      media: [],
      mediumOfTravel: "",
      startDate: "",
      endDate: "",
      category: "",
      dateError: "",
    };

    const newSteps = [...steps, newStep];
    onStepsChange(newSteps);
    setOpenStepIndex(newSteps.length - 1); // Open the new step

    // Call external add handler if provided
    onAddStep?.();
  };

  const handleStepUpdate = (index: number, updatedStep: Partial<Step>) => {
    const newSteps = steps.map((step, i) =>
      i === index ? { ...step, ...updatedStep } : step
    );
    onStepsChange(newSteps);
  };

  const handleStepDelete = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    onStepsChange(newSteps);

    // Adjust open step index if necessary
    if (openStepIndex === index) {
      setOpenStepIndex(-1);
    } else if (openStepIndex > index) {
      setOpenStepIndex(openStepIndex - 1);
    }

    // Clear editing state if deleting the edited step
    if (editingStepIndex === index) {
      setEditingStepIndex(null);
    } else if (editingStepIndex !== null && editingStepIndex > index) {
      setEditingStepIndex(editingStepIndex - 1);
    }
  };

  const handleStepToggleOpen = (index: number) => {
    setOpenStepIndex(openStepIndex === index ? -1 : index);
  };

  const handleStepToggleEdit = (index: number) => {
    setEditingStepIndex(editingStepIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Previous Steps Section */}
      {showPreviousSteps && previousSteps.length > 0 && (
        <div className=" border-[#E9E5E5] border rounded-[7px] bg-white">
          {/* Collapsible Header */}
          <div className="">
            <div
              className="flex items-center justify-between cursor-pointer px-4 py-3 bg-black rounded-lg hover:bg-gray-800 transition-colors"
              onClick={() => setPreviousStepsOpen(!previousStepsOpen)}
            >
              <span className="text-[14px] font-medium text-white">
                Previous Steps
              </span>
              <svg
                className={`w-4 h-4 text-white transition-transform ${
                  previousStepsOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Collapsible Content */}
          {previousStepsOpen && (
            <div className="px-2 md:px-4 mt-4">
              <div className="flex items-center gap-2 ">
                <div className="flex items-center justify-center py-1 px-3 rounded-full bg-[#F28321] text-lg h-fit">
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : "M"}
                </div>
                <div className="">
                  <p className="text-[12px] md:text-[14px] font-bold">
                    {journeyData?.title ||
                      (journeyData?.startLocation?.name &&
                      journeyData?.endLocation?.name
                        ? `${journeyData.startLocation.name} to ${journeyData.endLocation.name}`
                        : "Lahore to Hunza")}
                  </p>
                  <p className="text-[#6C6868] text-[9px] md:text-[11px]">
                    {journeyData?.startDate && journeyData?.endDate
                      ? `${new Date(journeyData.startDate).toLocaleDateString(
                          "en-GB",
                          { day: "2-digit", month: "short" }
                        )} / ${new Date(journeyData.endDate).toLocaleDateString(
                          "en-GB",
                          { day: "2-digit", month: "short" }
                        )}`
                      : "01 Jun / 23 Jun"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 my-4">
                <p className="text-[14px] md:text-[16px] font-semibold">
                  Stops
                </p>
                {previousSteps.map((step, index) => (
                  <div
                    key={`prev-${index}`}
                    className="flex items-start gap-3 relative"
                  >
                    {/* Step Number */}
                    <div className="w-8 h-8 bg-black  z-10 text-white rounded-full flex items-center justify-center text-[12px] font-bold mt-0.5">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    {index < previousSteps.length - 1 && (
                      <div className="absolute left-3.5 top-8 w-1 h-7 bg-[#ADADAD]"></div>
                    )}
                    {/* Step Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h6 className="text-[13px] font-semibold text-gray-700 mb-1">
                            Stop {index + 1}
                          </h6>
                          <p className="text-[11px] text-gray-500">
                            {step.location.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 ml-2">
                          <span>
                            {step.startDate
                              ? new Date(step.startDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                  }
                                )
                              : "-- ---"}
                          </span>
                          {/* Arrow Icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            fill="none"
                            viewBox="0 0 14 14"
                          >
                            <path
                              fill="#000"
                              d="M1.88 7.5h8.97l-3.047 3.054a.58.58 0 0 0 0 .815c.225.226.59.226.814 0l4.029-4.038a.58.58 0 0 0 0-.816L8.617 2.477a.573.573 0 0 0-.814 0 .58.58 0 0 0 0 .815l3.046 3.054H1.88a.576.576 0 0 0 0 1.154"
                            ></path>
                          </svg>
                          <span>
                            {step.endDate
                              ? new Date(step.endDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                  }
                                )
                              : "-- ---"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[13px]">Journey Stops</span>
        {showAddButton && (
          <button
            type="button"
            className={`px-3 py-1 text-[12px] flex items-center gap-1 transition-colors ${
              canAddStep
                ? "text-black hover:text-blue-600"
                : "text-gray-400 cursor-not-allowed"
            }`}
            onClick={handleAddStep}
            disabled={!canAddStep}
            title={
              canAddStep
                ? "Add a new stop"
                : "Please set start and end locations first"
            }
          >
            Add Stop
            <span
              className={`p-2 w-fit rounded-full text-[15px] flex items-center justify-center transition-colors ${
                canAddStep
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              {PlusIcon}
            </span>
          </button>
        )}
      </div>

      {/* New Steps List */}
      <div className="flex flex-col gap-4">
        {steps.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-[12px]">No journey stops added yet.</p>
            <p className="text-[10px]">
              {canAddStep
                ? "Click 'Add Stop' to create your first stop."
                : "Set your start and end locations to begin adding stops."}
            </p>
          </div>
        ) : (
          steps.map((step, index) => (
            <JourneyStep
              key={`step-${index}`}
              step={step}
              index={index}
              isOpen={openStepIndex === index}
              isEditing={editingStepIndex === index}
              onToggleOpen={() => handleStepToggleOpen(index)}
              onToggleEdit={() => handleStepToggleEdit(index)}
              onDelete={() => handleStepDelete(index)}
              onUpdate={(updatedStep) => handleStepUpdate(index, updatedStep)}
              onFieldTouch={(fieldName) => onStepFieldTouch?.(index, fieldName)}
              fetchStepSuggestions={fetchStepSuggestions}
              stopCategories={stopCategories}
              loadingCategories={loadingCategories}
              errors={stepErrors[index]}
              canAddStep={canAddStep}
            />
          ))
        )}
      </div>
    </div>
  );
}
