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
  canAddStep: boolean;
  fetchStepSuggestions?: (query: string) => Promise<MapboxFeature[]>;
  stopCategories: StopCategory[];
  loadingCategories: boolean;
  stepErrors?: StepErrors;
  onAddStep?: () => void;
}

export default function StepsList({
  steps,
  onStepsChange,
  canAddStep,
  fetchStepSuggestions,
  stopCategories,
  loadingCategories,
  stepErrors = {},
  onAddStep,
}: StepsListProps) {
  const [openStepIndex, setOpenStepIndex] = useState<number>(0);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);

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
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[13px]">Journey Stops</span>
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
      </div>

      {/* Steps List */}
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
              fetchStepSuggestions={fetchStepSuggestions}
              stopCategories={stopCategories}
              loadingCategories={loadingCategories}
              errors={stepErrors[index]}
              canAddStep={canAddStep}
            />
          ))
        )}
      </div>

      {/* Help Text */}
      {!canAddStep ? (
        <div className="text-[10px] text-gray-500 text-center mt-2">
          💡 Tip: Set your starting and ending locations first to enable adding
          journey stops
        </div>
      ) : (
        <div className="text-[10px] text-gray-500 text-center mt-2">
          🗺️ Location suggestions are filtered to show places between your start
          and end points. Click on any location field to see available options!
        </div>
      )}
    </div>
  );
}
