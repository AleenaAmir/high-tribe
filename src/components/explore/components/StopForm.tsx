import React, { useState, useEffect } from "react";
import {
  Step,
  StopCategory,
} from "@/components/dashboard/modals/components/newjourney/types";
import PlaneIcon from "@/components/dashboard/svgs/PlaneIcon";
import TrainIcon from "@/components/dashboard/svgs/TrainIcon";
import CarIcon from "@/components/dashboard/svgs/CarIcon";
import BusIcon from "@/components/dashboard/svgs/BusIcon";
import WalkIcon from "@/components/dashboard/svgs/WalkIcon";
import BikeIcon from "@/components/dashboard/svgs/BikeIcon";
import GlobalTextInput from "@/components/global/GlobalTextInput";
import GlobalTextArea from "@/components/global/GlobalTextArea";
import GlobalFileUpload from "@/components/global/GlobalFileUpload";
import { DeleteIcon } from "../icons/StepIcons";
import { toast } from "react-hot-toast";

interface StopFormProps {
  step: Step;
  dayIndex: number;
  stepIndex: number;
  journeyData: any;
  onStepUpdate: (
    dayIndex: number,
    stepIndex: number,
    updatedStep: Partial<Step>
  ) => void;
  onStepDelete: (dayIndex: number, stepIndex: number) => void;
  onSaveStep: (dayIndex: number, stepIndex: number) => void;
  isSaved: boolean;
}

const StopForm: React.FC<StopFormProps> = ({
  step,
  dayIndex,
  stepIndex,
  journeyData,
  onStepUpdate,
  onStepDelete,
  onSaveStep,
  isSaved,
}) => {
  const [selectedTravelMode, setSelectedTravelMode] = useState(
    step.mediumOfTravel || "plane"
  );

  // Add local state for inputs to prevent focus loss
  const [localLocation, setLocalLocation] = useState(step.location.name || "");
  const [localNotes, setLocalNotes] = useState(step.notes || "");

  // Update local state when step prop changes
  useEffect(() => {
    setLocalLocation(step.location.name || "");
    setLocalNotes(step.notes || "");
  }, [step.location.name, step.notes]);

  // Mock stop categories for now
  const stopCategories: StopCategory[] = [
    { id: 1, name: "Accommodation", label: "Accommodation" },
    { id: 2, name: "Attraction", label: "Attraction" },
    { id: 3, name: "Restaurant", label: "Restaurant" },
    { id: 4, name: "Transport", label: "Transport" },
    { id: 5, name: "Activity", label: "Activity" },
  ];

  // Travel mode icons
  const travelModes = [
    { id: "plane", icon: PlaneIcon, label: "Plane" },
    { id: "train", icon: TrainIcon, label: "Train" },
    { id: "bus", icon: BusIcon, label: "Bus" },
    { id: "walk", icon: WalkIcon, label: "Walk" },
    { id: "bike", icon: BikeIcon, label: "Bike" },
    { id: "car", icon: CarIcon, label: "Car" },
    {
      id: "info",
      icon: () => <span className="text-[10px]">?</span>,
      label: "Info",
    },
  ];

  const handleSaveStop = async () => {
    // Persist
    try {
      const TOKEN =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || "<PASTE_VALID_TOKEN_HERE>"
          : "<PASTE_VALID_TOKEN_HERE>";

      const formData = new FormData();
      formData.append("title", step.name);
      formData.append("stop_category_id", step.category || "1");
      formData.append("location_name", step.location.name);
      formData.append(
        "lat",
        step.location.coords?.[1]?.toString() || "48.8584"
      );
      formData.append("lng", step.location.coords?.[0]?.toString() || "2.2945");
      formData.append("transport_mode", step.mediumOfTravel || "");
      formData.append("start_date", step.startDate || "");
      formData.append("end_date", step.endDate || "");
      formData.append("notes", step.notes || "");

      const response = await fetch(
        `https://api.hightribe.com/api/journeys/${journeyData.id}/stops`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: "application/json",
          },
          body: formData,
        }
      );
      if (response.status === 201) {
        toast.success("Stop saved successfully!");
      }
    } catch (e) {
      console.warn("Save failed (show a toast, keep user in edit):", e);
      return;
    }

    // Switch to preview mode
    onSaveStep(dayIndex, stepIndex);
  };

  // Handle blur events to update parent state
  const handleLocationBlur = () => {
    onStepUpdate(dayIndex, stepIndex, {
      location: { ...step.location, name: localLocation },
    });
  };

  const handleNotesBlur = () => {
    onStepUpdate(dayIndex, stepIndex, { notes: localNotes });
  };

  // Handle Enter key to save and blur
  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.currentTarget as HTMLInputElement).blur();
    }
  };

  const handleNotesKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      (e.currentTarget as HTMLTextAreaElement).blur();
    }
  };

  // Convert media files for GlobalFileUpload component
  const getMediaFiles = (): File[] => {
    if (!step.media || !Array.isArray(step.media)) return [];
    return step.media.map((item) => item.fileObject).filter(Boolean);
  };

  const handleMediaChange = (files: File[]) => {
    const mediaArray = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
      file_name: file.name,
      fileObject: file,
    }));

    onStepUpdate(dayIndex, stepIndex, { media: mediaArray });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 relative">
      {/* Delete Button */}
      <button
        type="button"
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
        onClick={() => onStepDelete(dayIndex, stepIndex)}
        title="Delete step"
      >
        <DeleteIcon className="w-5 h-5" />
      </button>

      <div className="flex flex-col gap-4">
        {/* Stop Type */}
        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-medium text-gray-700">
            Stop type
          </label>
          <div className="relative">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={step.category || ""}
              onChange={(e) =>
                onStepUpdate(dayIndex, stepIndex, {
                  category: e.target.value,
                })
              }
            >
              <option value="">Select stop type</option>
              {stopCategories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location with Travel Icons */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <GlobalTextInput
                label="Location"
                placeholder="Enter location"
                value={localLocation}
                onChange={(e) => setLocalLocation(e.target.value)}
                onBlur={handleLocationBlur}
                onKeyDown={handleLocationKeyDown}
              />
            </div>
            <div className="flex gap-1">
              {travelModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                    selectedTravelMode === mode.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setSelectedTravelMode(mode.id);
                    onStepUpdate(dayIndex, stepIndex, {
                      mediumOfTravel: mode.id,
                    });
                  }}
                  title={mode.label}
                >
                  <mode.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-[12px] font-medium text-gray-700">
              Start date
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={step.startDate}
                onChange={(e) =>
                  onStepUpdate(dayIndex, stepIndex, {
                    startDate: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="text-[12px] font-medium text-gray-700">
              End date
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={step.endDate}
                onChange={(e) =>
                  onStepUpdate(dayIndex, stepIndex, {
                    endDate: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <GlobalTextArea
          label="Notes"
          rows={3}
          placeholder="Add notes about this stop..."
          value={localNotes}
          onChange={(e) => setLocalNotes(e.target.value)}
          onBlur={handleNotesBlur}
          onKeyDown={handleNotesKeyDown}
        />

        {/* Media Upload */}
        <GlobalFileUpload
          label="Photos & Videos for this stop"
          value={getMediaFiles()}
          onChange={handleMediaChange}
          headLine="Drag & drop or click to upload"
          subLine="Max 5 files .JPG, PNG, MP4, Mov"
          maxFiles={5}
          accept="image/*,video/*"
          multiple={true}
        />

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            className="px-6 py-2 bg-blue-500 text-white rounded-md text-[12px] font-medium hover:bg-blue-600 transition-colors"
            onClick={handleSaveStop}
          >
            {isSaved ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StopForm;
