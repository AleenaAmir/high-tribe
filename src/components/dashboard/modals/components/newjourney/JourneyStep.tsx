import React, { useState } from "react";
import GlobalTextArea from "@/components/global/GlobalTextArea";
import GlobalFileUpload from "@/components/global/GlobalFileUpload";
import LocationSelector from "./LocationSelector";
import DateRangeSelector from "./DateRangeSelector";
import TravelModeSelector from "./TravelModeSelector";
import { Step, StopCategory, MapboxFeature, ValidationErrors } from "./types";
import { EditIcon, DeleteIcon, ExpandIcon } from "./constants";
import PlaneIcon from "@/components/dashboard/svgs/PlaneIcon";
import TrainIcon from "@/components/dashboard/svgs/TrainIcon";
import CarIcon from "@/components/dashboard/svgs/CarIcon";
import BusIcon from "@/components/dashboard/svgs/BusIcon";
import WalkIcon from "@/components/dashboard/svgs/WalkIcon";
import BikeIcon from "@/components/dashboard/svgs/BikeIcon";
import { useLocationAutocomplete } from "./hooks";

interface JourneyStepProps {
  step: Step;
  index: number;
  isOpen: boolean;
  isEditing: boolean;
  onToggleOpen: () => void;
  onToggleEdit: () => void;
  onDelete: () => void;
  onUpdate: (updatedStep: Partial<Step>) => void;
  onFieldTouch?: (fieldName: string) => void;
  fetchStepSuggestions?: (query: string) => Promise<MapboxFeature[]>;
  stopCategories: StopCategory[];
  loadingCategories: boolean;
  errors?: ValidationErrors;
  canAddStep?: boolean; // Add this to control if locations can be modified
}

export default function JourneyStep({
  step,
  index,
  isOpen,
  isEditing,
  onToggleOpen,
  onToggleEdit,
  onDelete,
  onUpdate,
  onFieldTouch,
  fetchStepSuggestions,
  stopCategories,
  loadingCategories,
  errors = {},
  canAddStep = false,
}: JourneyStepProps) {
  const [headerEdit, setHeaderEdit] = useState(
    step.name || `Stop ${index + 1}`
  );
  const [stepSuggestions, setStepSuggestions] = useState<MapboxFeature[]>([]);

  // Debug categories
  React.useEffect(() => {
    console.log(`Step ${index + 1} - Categories:`, stopCategories);
    console.log(`Step ${index + 1} - Loading categories:`, loadingCategories);
  }, [stopCategories, loadingCategories, index]);

  const handleStepLocationSearch = async (query: string) => {
    if (fetchStepSuggestions && canAddStep) {
      try {
        const suggestions = await fetchStepSuggestions(query);
        setStepSuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching step suggestions:", error);
        setStepSuggestions([]);
      }
    }
  };

  const handleLocationSelect = (coords: [number, number], name: string) => {
    if (canAddStep) {
      onUpdate({
        location: {
          coords,
          name,
        },
      });
      onFieldTouch?.("location");
    }
  };

  const handleLocationChange = (value: string) => {
    if (canAddStep) {
      onUpdate({
        location: {
          ...step.location,
          name: value,
        },
      });
      onFieldTouch?.("location");
    }
  };

  const handleLocationSuggestionSelect = (feature: MapboxFeature) => {
    if (canAddStep) {
      handleLocationSelect(feature.center, feature.place_name);
    }
  };

  const handleModeSelect = (mode: string) => {
    onUpdate({ mediumOfTravel: mode });
    onFieldTouch?.("travelMode");
  };

  const handleStartDateChange = (date: string) => {
    onUpdate({ startDate: date });
    onFieldTouch?.("startDate");
  };

  const handleEndDateChange = (date: string) => {
    onUpdate({ endDate: date });
    onFieldTouch?.("endDate");
  };

  const handleNotesChange = (notes: string) => {
    onUpdate({ notes });
    onFieldTouch?.("notes");
  };

  const handleCategoryChange = (category: string) => {
    onUpdate({ category });
    onFieldTouch?.("category");
  };

  const handleMediaChange = (files: File[]) => {
    onUpdate({ media: files });
  };

  const handleHeaderEditSave = () => {
    onUpdate({
      name: headerEdit,
    });
    onToggleEdit();
  };

  const renderTravelIcon = (mode: string) => {
    const iconProps = { className: "w-[12px] h-[12px] text-white" };

    switch (mode) {
      case "plane":
        return <PlaneIcon {...iconProps} />;
      case "train":
        return <TrainIcon {...iconProps} />;
      case "car":
        return <CarIcon {...iconProps} />;
      case "bus":
        return <BusIcon {...iconProps} />;
      case "walk":
        return <WalkIcon {...iconProps} />;
      case "bike":
        return <BikeIcon {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="border border-[#E9E5E5] rounded-lg bg-[#FCFCFC]">
      {/* Collapsed Header View */}
      {!isOpen && (
        <div
          className="flex items-center justify-between px-4 py-3 cursor-pointer bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          onClick={onToggleOpen}
        >
          {isEditing ? (
            <input
              className="text-[10px] font-semibold border-b border-blue-400 bg-transparent outline-none w-1/2 text-white"
              value={headerEdit}
              onChange={(e) => setHeaderEdit(e.target.value)}
              onBlur={handleHeaderEditSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleHeaderEditSave();
                }
              }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold">
                {step.name || `Step ${index + 1}`}
              </span>
              {step.mediumOfTravel && step.mediumOfTravel !== "info" && (
                <div className="w-[12px] h-[12px] text-white">
                  {renderTravelIcon(step.mediumOfTravel)}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="cursor-pointer hover:opacity-75 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                setHeaderEdit(step.name || `Stop ${index + 1}`);
                onToggleEdit();
              }}
              title="Edit step name"
            >
              {EditIcon}
            </button>
            <button
              type="button"
              className="cursor-pointer hover:opacity-75 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Delete step"
            >
              {DeleteIcon}
            </button>
            <button
              type="button"
              className="cursor-pointer hover:opacity-75 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onToggleOpen();
              }}
              title="Expand"
            >
              {ExpandIcon}
            </button>
          </div>
        </div>
      )}

      {/* Expanded Content View */}
      {isOpen && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-[#5E6368] font-semibold">
              {step.name || `Stop ${index + 1}`}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-gray-400 hover:text-black text-lg transition-colors"
                onClick={onToggleOpen}
                title="Close"
              >
                −
              </button>
              <button
                type="button"
                className="text-gray-400 hover:text-black text-lg rotate-45 transition-colors"
                onClick={onDelete}
                title="Delete step"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Location Input */}
            <LocationSelector
              label="Location"
              value={step.location.name}
              onChange={handleLocationChange}
              onSelect={handleLocationSuggestionSelect}
              onLocationSelect={handleLocationSelect}
              onSearch={handleStepLocationSearch}
              suggestions={stepSuggestions}
              error={!canAddStep ? undefined : errors.location}
              placeholder={
                canAddStep
                  ? "Click to see locations between your start and end points..."
                  : "Please set start and end locations first"
              }
              disabled={!canAddStep}
              isStepLocation={true}
            />

            {/* Travel Mode Selector */}
            <TravelModeSelector
              selectedMode={step.mediumOfTravel}
              onModeSelect={handleModeSelect}
              error={errors.travelMode}
            />

            {/* Date Range */}
            <DateRangeSelector
              startDate={step.startDate}
              endDate={step.endDate}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              startDateError={errors.startDate}
              endDateError={errors.endDate}
            />

            {/* Stop Category */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-medium text-black z-10 translate-y-3 translate-x-4 bg-white w-fit px-1">
                  Stop Category
                </label>
                {stopCategories.length === 0 && !loadingCategories && (
                  <span className="text-[10px] text-blue-600">
                    Using defaults (API may be unavailable)
                  </span>
                )}
              </div>
              <select
                className="border px-3 py-2 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={step.category || ""}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="" disabled>
                  {loadingCategories
                    ? "Loading categories..."
                    : stopCategories.length === 0
                    ? "No categories available"
                    : "Select a category"}
                </option>
                {stopCategories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name || category.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-[10px]">{errors.category}</p>
              )}
            </div>

            {/* Notes */}
            <GlobalTextArea
              label="Notes"
              rows={2}
              value={step.notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              error={errors.notes}
              placeholder="Add notes about this stop..."
            />

            {/* Media Upload */}
            <div className="mt-2">
              <GlobalFileUpload
                label="Photos & Videos for this step"
                value={step.media}
                onChange={handleMediaChange}
                maxFiles={5}
                accept="image/*,video/*"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
