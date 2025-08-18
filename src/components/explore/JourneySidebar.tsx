import React, { useState } from "react";
import Image from "next/image";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Step,
  StopCategory,
  MapboxFeature,
} from "@/components/dashboard/modals/components/newjourney/types";
import PlaneIcon from "@/components/dashboard/svgs/PlaneIcon";
import TrainIcon from "@/components/dashboard/svgs/TrainIcon";
import CarIcon from "@/components/dashboard/svgs/CarIcon";
import BusIcon from "@/components/dashboard/svgs/BusIcon";
import WalkIcon from "@/components/dashboard/svgs/WalkIcon";
import BikeIcon from "@/components/dashboard/svgs/BikeIcon";
import JourneyCalendar from "./JourneyCalendar";
import JourneyBookings from "./JourneyBookings";

interface JourneyData {
  journeyName: string;
  startingPoint: string;
  endPoint: string;
  startDate: string;
  endDate: string;
  who: string;
  budget: string;
  days?: Day[];
}

interface Day {
  id: number;
  dayNumber: number;
  date: Date;
  steps: Step[];
  isOpen: boolean;
}

interface JourneySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  journeyData: JourneyData | null;
  selectedStep?: { dayIndex: number; stepIndex: number } | null;
  onStepSelect?: (dayIndex: number, stepIndex: number) => void;
  onJourneyDataUpdate?: (updatedData: JourneyData) => void;
 
}

interface FormData {
  days: Day[];
}

const JourneySidebar: React.FC<JourneySidebarProps> = ({
  isOpen,
  onClose,
  journeyData,
  selectedStep,
  onStepSelect,
  onJourneyDataUpdate,

}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDayIndex, setOpenDayIndex] = useState<number | null>(null);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [savedSteps, setSavedSteps] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState<
    "itinerary" | "calendar" | "bookings"
  >("itinerary");

  // React Hook Form setup
  const { control, handleSubmit, watch, setValue, getValues } =
    useForm<FormData>({
      defaultValues: {
        days: [],
      },
    });

  const {
    fields: days,
    append: appendDay,
    remove: removeDay,
  } = useFieldArray({
    control,
    name: "days",
  });

  // Watch the form data for real-time updates
  const watchedDays = watch("days");

  // Initialize days if empty
  React.useEffect(() => {
    if (journeyData && days.length === 0) {
      const startDate = new Date(journeyData.startDate);
      const endDate = new Date(journeyData.endDate);
      const daysDiff =
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
        ) + 1;

      const initialDays = Array.from({ length: daysDiff }, (_, i) => ({
        id: i + 1,
        dayNumber: i + 1,
        date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
        steps: [],
        isOpen: false,
      }));

      // Set initial days using setValue
      setValue("days", initialDays);
    }
  }, [journeyData, days.length, setValue]);

  // Mark existing steps as saved for sample data
  React.useEffect(() => {
    if (journeyData && journeyData.days) {
      console.log("Updating saved steps for journey data:", journeyData);
      const newSavedSteps: { [key: string]: boolean } = {};
      journeyData.days.forEach((day: any, dayIndex: number) => {
        if (day.steps) {
          day.steps.forEach((step: any, stepIndex: number) => {
            const stepKey = `${dayIndex}-${stepIndex}`;
            newSavedSteps[stepKey] = true;
          });
        }
      });
      console.log("New saved steps mapping:", newSavedSteps);
      setSavedSteps(newSavedSteps);
    }
  }, [journeyData]);

  if (!journeyData) return null;

  // Calculate number of days
  const startDate = new Date(journeyData.startDate);
  const endDate = new Date(journeyData.endDate);
  const daysDiff =
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) +
    1;

  // Get month names
  const startMonth = startDate.toLocaleDateString("en-US", { month: "short" });
  const endMonth = endDate.toLocaleDateString("en-US", { month: "short" });
  const monthDisplay =
    startMonth === endMonth ? startMonth : `${startMonth}, ${endMonth}`;

  // Get traveler count from "who" field
  const getTravelerCount = (who: string) => {
    switch (who) {
      case "solo":
        return 1;
      case "couple":
        return 2;
      case "family":
        return 4;
      case "group":
        return 6;
      default:
        return 2;
    }
  };

  const travelerCount = getTravelerCount(journeyData.who);

  // Mock stop categories for now
  const stopCategories: StopCategory[] = [
    { id: 1, name: "Accommodation", label: "Accommodation" },
    { id: 2, name: "Attraction", label: "Attraction" },
    { id: 3, name: "Restaurant", label: "Restaurant" },
    { id: 4, name: "Transport", label: "Transport" },
    { id: 5, name: "Activity", label: "Activity" },
  ];

  const handleAddDay = () => {
    console.log("Adding new day...");
    console.log("Current journeyData:", journeyData);

    // If we have sample data, update it directly
    if (journeyData?.days) {
      console.log("Using sample data path");
      const updatedJourneyData = { ...journeyData };
      const newDayNumber = (updatedJourneyData.days?.length || 0) + 1;
      const newDayDate = new Date(
        startDate.getTime() + (newDayNumber - 1) * 24 * 60 * 60 * 1000
      );

      const newDay: Day = {
        id: newDayNumber,
        dayNumber: newDayNumber,
        date: newDayDate,
        steps: [],
        isOpen: false,
      };

      console.log("New day to add:", newDay);

      if (updatedJourneyData.days) {
        updatedJourneyData.days.push(newDay);
      }

      console.log("Updated journeyData:", updatedJourneyData);

      // Update the journeyData in the parent component
      if (onJourneyDataUpdate) {
        onJourneyDataUpdate(updatedJourneyData);
        console.log("✅ Day added successfully!");
      }
      return;
    }

    console.log("Using form data path");
    // Original form-based logic
    const newDay: Day = {
      id: days.length + 1,
      dayNumber: days.length + 1,
      date: new Date(startDate.getTime() + days.length * 24 * 60 * 60 * 1000),
      steps: [],
      isOpen: false,
    };
    appendDay(newDay);
  };

  const handleAddStop = (dayIndex: number) => {
    console.log("Adding stop to day:", dayIndex);
    console.log("Current journeyData:", journeyData);

    // If we have sample data, update it directly
    if (journeyData?.days) {
      console.log("Using sample data path for adding stop");
      const updatedJourneyData = { ...journeyData };
      const currentDay = updatedJourneyData.days?.[dayIndex];

      if (!currentDay) {
        console.error("Day not found at index:", dayIndex);
        return;
      }

      const newStep: Step = {
        name: `Stop ${(currentDay.steps?.length || 0) + 1}`,
        location: { coords: null, name: "" },
        notes: "",
        media: [],
        mediumOfTravel: "",
        startDate: "",
        endDate: "",
        category: "",
        dateError: "",
      };

      console.log("New step to add:", newStep);
      currentDay.steps = [...(currentDay.steps || []), newStep];
      console.log("Updated day:", currentDay);

      // Update the journeyData in the parent component
      if (onJourneyDataUpdate) {
        onJourneyDataUpdate(updatedJourneyData);
        console.log("✅ Stop added successfully!");
      }

      setOpenDayIndex(dayIndex);
      return;
    }

    // Original form-based logic
    const currentDays = getValues("days");
    console.log("Current days:", currentDays);

    if (!currentDays || !currentDays[dayIndex]) {
      console.error("Day not found at index:", dayIndex);
      return;
    }

    const currentDay = currentDays[dayIndex];
    console.log("Current day:", currentDay);

    const newStep: Step = {
      name: `Stop ${(currentDay.steps?.length || 0) + 1}`,
      location: { coords: null, name: "" },
      notes: "",
      media: [],
      mediumOfTravel: "",
      startDate: "",
      endDate: "",
      category: "",
      dateError: "",
    };

    const updatedDay = {
      ...currentDay,
      steps: [...(currentDay.steps || []), newStep],
    };

    console.log("Updated day:", updatedDay);

    // Update the form
    setValue(`days.${dayIndex}`, updatedDay, { shouldValidate: true });

    // Force a re-render by triggering watch
    watch("days");

    setOpenDayIndex(dayIndex);
  };

  const handleStepDelete = (dayIndex: number, stepIndex: number) => {
    // If we have sample data, update it directly
    if (journeyData?.days) {
      const updatedJourneyData = { ...journeyData };
      const currentDay = updatedJourneyData.days?.[dayIndex];

      if (!currentDay || !currentDay.steps) {
        console.error("Day or steps not found");
        return;
      }

      currentDay.steps = currentDay.steps.filter(
        (_, index) => index !== stepIndex
      );

      // Update the journeyData in the parent component
      if (onJourneyDataUpdate) {
        onJourneyDataUpdate(updatedJourneyData);
      }

      // Remove from saved steps
      const stepKey = `${dayIndex}-${stepIndex}`;
      const newSavedSteps = { ...savedSteps };
      delete newSavedSteps[stepKey];
      setSavedSteps(newSavedSteps);
      console.log("✅ Stop deleted successfully!");
      return;
    }

    // Original form-based logic
    const currentDays = getValues("days");
    const currentDay = currentDays[dayIndex];
    const updatedSteps = currentDay.steps.filter(
      (_, index) => index !== stepIndex
    );

    const updatedDay = {
      ...currentDay,
      steps: updatedSteps,
    };

    setValue(`days.${dayIndex}`, updatedDay, { shouldValidate: true });
    watch("days");

    // Remove from saved steps
    const stepKey = `${dayIndex}-${stepIndex}`;
    const newSavedSteps = { ...savedSteps };
    delete newSavedSteps[stepKey];
    setSavedSteps(newSavedSteps);
    console.log("✅ Stop deleted successfully!");
  };

  const handleStepUpdate = (
    dayIndex: number,
    stepIndex: number,
    updatedStep: Partial<Step>
  ) => {
    // If we have sample data, update it directly
    if (journeyData?.days) {
      const updatedJourneyData = { ...journeyData };
      const currentDay = updatedJourneyData.days?.[dayIndex];

      if (!currentDay || !currentDay.steps) {
        console.error("Day or steps not found");
        return;
      }

      currentDay.steps[stepIndex] = {
        ...currentDay.steps[stepIndex],
        ...updatedStep,
      };

      // Update the journeyData in the parent component
      if (onJourneyDataUpdate) {
        onJourneyDataUpdate(updatedJourneyData);
      }
      return;
    }

    // Original form-based logic
    const currentDays = getValues("days");
    const currentDay = currentDays[dayIndex];
    const updatedSteps = [...currentDay.steps];
    updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], ...updatedStep };

    const updatedDay = {
      ...currentDay,
      steps: updatedSteps,
    };

    setValue(`days.${dayIndex}`, updatedDay, { shouldValidate: true });
    watch("days");
  };

  const handleDayToggle = (dayIndex: number) => {
    setOpenDayIndex(openDayIndex === dayIndex ? null : dayIndex);
  };

  const handleStepToggleEdit = (stepIndex: number) => {
    setEditingStepIndex(editingStepIndex === stepIndex ? null : stepIndex);
  };

  const handleSaveStep = (dayIndex: number, stepIndex: number) => {
    const stepKey = `${dayIndex}-${stepIndex}`;
    setSavedSteps((prev) => ({ ...prev, [stepKey]: true }));
    console.log("Step saved:", stepKey);
  };

  const handleEditStep = (dayIndex: number, stepIndex: number) => {
    const stepKey = `${dayIndex}-${stepIndex}`;
    setSavedSteps((prev) => ({ ...prev, [stepKey]: false }));
  };

  // Use watchedDays for rendering to ensure real-time updates
  const displayDays = watchedDays || days;

  // If we have sample data with days, use that instead
  const finalDisplayDays = journeyData?.days || displayDays;

  const totalDays = finalDisplayDays.length;

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

  // Step Preview Component (for saved steps)
  const StepPreview = ({
    step,
    dayIndex,
    stepIndex,
  }: {
    step: Step;
    dayIndex: number;
    stepIndex: number;
  }) => {
    const stepKey = `${dayIndex}-${stepIndex}`;
    const isSaved = savedSteps[stepKey];
    const isSelected =
      selectedStep?.dayIndex === dayIndex &&
      selectedStep?.stepIndex === stepIndex;

    if (!isSaved) return null;

    const handleStepClick = () => {
      if (onStepSelect) {
        onStepSelect(dayIndex, stepIndex);
      }
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
              isSelected
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            <span className="text-[10px] font-medium">{stepIndex + 1}</span>
          </div>

          {/* Step Image */}
          <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-md overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
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
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>0 Mi</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>0h 0m</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
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
              onClick={(e) => {
                e.stopPropagation();
                handleEditStep(dayIndex, stepIndex);
              }}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              </svg>
              Edit
            </button>
            <button
              type="button"
              className="text-[10px] text-gray-500 hover:text-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Custom Stop Form Component
  const StopForm = ({
    step,
    dayIndex,
    stepIndex,
  }: {
    step: Step;
    dayIndex: number;
    stepIndex: number;
  }) => {
    const [selectedTravelMode, setSelectedTravelMode] = useState(
      step.mediumOfTravel || "plane"
    );

    const stepKey = `${dayIndex}-${stepIndex}`;
    const isSaved = savedSteps[stepKey];

    const handleSave = () => {
      handleSaveStep(dayIndex, stepIndex);
      console.log("Saving step:", step);
    };

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 relative">
        {/* Delete Button */}
        <button
          type="button"
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
          onClick={() => handleStepDelete(dayIndex, stepIndex)}
          title="Delete step"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
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
                  handleStepUpdate(dayIndex, stepIndex, {
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
            <label className="text-[12px] font-medium text-gray-700">
              Location
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter location"
                value={step.location.name}
                onChange={(e) =>
                  handleStepUpdate(dayIndex, stepIndex, {
                    location: { ...step.location, name: e.target.value },
                  })
                }
              />
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
                      handleStepUpdate(dayIndex, stepIndex, {
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
                    handleStepUpdate(dayIndex, stepIndex, {
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
                    handleStepUpdate(dayIndex, stepIndex, {
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-gray-700">
              Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Add notes about this stop..."
              value={step.notes}
              onChange={(e) =>
                handleStepUpdate(dayIndex, stepIndex, { notes: e.target.value })
              }
            />
          </div>

          {/* Media Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-gray-700">
              Photos & Videos for this stop
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <div className="text-[12px] text-gray-600">
                  <p>Drag & drop or click to upload</p>
                  <p className="text-[10px] text-gray-500">
                    Max 5 files .JPG, PNG, MP3, Mov
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              className="px-6 py-2 bg-blue-500 text-white rounded-md text-[12px] font-medium hover:bg-blue-600 transition-colors"
              onClick={handleSave}
            >
              {isSaved ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <div>
      {/* Main Sidebar */}
      <div
        className={`fixed left-0 top-30 bottom-2 z-40 w-[524px] bg-white rounded-r-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <div className="p-3">
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center justify-center rounded-full hover:bg-gray-100  border border-[#E5E5E5]">
                <button
                  className="h-8 w-8 mx-auto flex items-center justify-center"
                  aria-label="Menu"
                  onClick={onClose}
                  type="button"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 12h18M3 6h18M3 18h18"></path>
                  </svg>
                </button>
              </div>
              <button type="button" className="flex items-center gap-2">
                <Image
                  src={"/dashboard/People.svg"}
                  alt={"footprint3"}
                  width={16}
                  height={16}
                  className="md:w-[16px] md:h-[16px] w-[12px] h-[12px]"
                />
                <span className="text-[10px] ">Add People</span>
                <svg
                  className="w-4 h-4 text-gray-400 cursor-pointer rotate-90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Trip Header */}
          <div className="px-3 pb-2 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 bg-[#F8F8F8] w-fit rounded-full py-2 px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="13"
                  fill="none"
                  viewBox="0 0 8 13"
                >
                  <g fill="#FF0202" clipPath="url(#clip0_1032_52210)">
                    <path d="M6.215.71a3.81 3.81 0 0 0-4.43 0C.05 1.927-.504 4.299.495 6.226L4 13l3.506-6.774c.998-1.927.443-4.3-1.291-5.516m.598 5.119-2.812 5.435-2.814-5.435c-.8-1.548-.356-3.45 1.036-4.427.54-.38 1.158-.57 1.777-.57s1.237.19 1.777.569c1.392.978 1.837 2.88 1.036 4.428"></path>
                    <path d="M4 1.733c-1.088 0-1.974.933-1.974 2.08 0 1.146.886 2.08 1.974 2.08s1.973-.934 1.973-2.08c0-1.147-.884-2.08-1.973-2.08M4 5.06c-.653 0-1.184-.56-1.184-1.248S3.347 2.565 4 2.565s1.184.56 1.184 1.248S4.653 5.06 4 5.06"></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_1032_52210">
                      <path fill="#fff" d="M0 0h8v13H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
                <h2 className="text-[16px] font-medium">
                  Trip to {journeyData.startingPoint} to {journeyData.endPoint}
                </h2>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  fill="none"
                  viewBox="0 0 10 10"
                >
                  <g fill="#7C7E7F" clipPath="url(#clip0_1032_52203)">
                    <path d="M.625 9.063a.312.312 0 0 1-.313-.347l.241-2.188a.3.3 0 0 1 .09-.184L5.757 1.23a1 1 0 0 1 1.416 0l.972.972a1 1 0 0 1 0 1.416l-5.11 5.11a.3.3 0 0 1-.184.09l-2.188.24zm.54-2.36L.979 8.397l1.694-.188 5.031-5.03a.375.375 0 0 0 0-.532l-.975-.975a.375.375 0 0 0-.531 0z"></path>
                    <path d="M7.187 4.44a.31.31 0 0 1-.222-.09l-1.94-1.947a.314.314 0 0 1 .443-.443l1.947 1.946a.313.313 0 0 1-.228.535M5.027 3.907 2.594 6.34l.442.442L5.469 4.35zM9.375 9.063h-5a.312.312 0 1 1 0-.626h5a.312.312 0 1 1 0 .626"></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_1032_52203">
                      <path fill="#fff" d="M0 0h10v10H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="text-[9px] mb-2 flex items-center gap-3">
              <span className="">{journeyData.startingPoint}</span>
              {totalDays} days in {monthDisplay}
              <span className="">{travelerCount} travelers</span>
              <span className="">${journeyData.budget}</span>
            </div>

            {/* Heading */}
            <div className="pb-2 pt-3">
              <div className="text-[16px] font-semibold ">
                Itinerary ({totalDays} days)
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-3 border-b border-gray-100 overflow-x-auto">
            <button
              className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === "itinerary"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("itinerary")}
            >
              Itinerary
            </button>
            <button
              className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === "calendar"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("calendar")}
            >
              Calendar
            </button>
            <button
              className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === "bookings"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("bookings")}
            >
              Bookings
            </button>
          </div>

          {/* Content based on active tab */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {activeTab === "itinerary" && (
              <div className="p-3">
                <div className="space-y-2">
                  {finalDisplayDays.map((day, dayIndex) => (
                    <div key={day.id} className="border-b border-gray-200 pb-2">
                      {/* Day Header */}
                      <div className="flex items-center justify-between py-2">
                        <div
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => handleDayToggle(dayIndex)}
                        >
                          <span className="text-[9px] font-medium">
                            Day {day.dayNumber}
                          </span>
                          <svg
                            className={`w-3 h-3 transition-transform ${
                              openDayIndex === dayIndex ? "rotate-180" : ""
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
                        <button
                          type="button"
                          className="text-[#7F7C7C] hover:text-blue-800 text-[9px] font-medium"
                          onClick={() => handleAddStop(dayIndex)}
                        >
                          + Add Stop
                        </button>
                      </div>

                      {/* Day Content - Steps */}
                      {openDayIndex === dayIndex && (
                        <div className="mt-3 space-y-3">
                          {!day.steps || day.steps.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                              <p className="text-[12px]">
                                No stops added for this day.
                              </p>
                              <p className="text-[10px]">
                                Click '+ Add Stop' to create your first stop.
                              </p>
                            </div>
                          ) : (
                            day.steps.map((step, stepIndex) => {
                              const stepKey = `${dayIndex}-${stepIndex}`;
                              const isSaved = savedSteps[stepKey];

                              return (
                                <div key={`step-${stepIndex}`}>
                                  {/* Show preview for saved steps */}
                                  {isSaved && (
                                    <StepPreview
                                      step={step}
                                      dayIndex={dayIndex}
                                      stepIndex={stepIndex}
                                    />
                                  )}

                                  {/* Show form for unsaved steps or when editing */}
                                  {!isSaved && (
                                    <StopForm
                                      step={step}
                                      dayIndex={dayIndex}
                                      stepIndex={stepIndex}
                                    />
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Day Button */}
                <div className="text-center pt-4 pb-4">
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 text-[12px] font-medium"
                    onClick={handleAddDay}
                  >
                    + Add Days
                  </button>
                </div>
              </div>
            )}

            {activeTab === "calendar" && (
              <JourneyCalendar
                journeyData={journeyData}
                selectedStep={selectedStep}
                onStepSelect={onStepSelect}
              />
            )}

            {activeTab === "bookings" && (
              <JourneyBookings journeyData={journeyData} />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default JourneySidebar;
