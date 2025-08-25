"use client";
import React, { useEffect, useState } from "react";
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
import GlobalTextInput from "@/components/global/GlobalTextInput";
import GlobalTextArea from "@/components/global/GlobalTextArea";
import GlobalFileUpload from "@/components/global/GlobalFileUpload";
import { generateDaysFromRange } from "@/app/querry/getDays";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import PlusIcon from "./icons/PlusIcon";

interface JourneyData {
  id: number;
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
  journeyData: JourneyData | any;
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
  console.log(journeyData, "journeyData");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [addDayDisabled, setAddDayDisabled] = useState(false);
  const [isAddingDay, setIsAddingDay] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDayIndex, setOpenDayIndex] = useState<number | null>(null);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [savedSteps, setSavedSteps] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState<"itinerary" | "bookings" | "chat">(
    "itinerary"
  );
  const isInitialLoad = React.useRef(true);

  // Calculate number of days early so it can be used in useEffects
  const startDate = new Date(journeyData.startDate);
  const endDate = new Date(journeyData.endDate);
  const daysDiff =
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) +
    1;

  useEffect(() => {
    const days = generateDaysFromRange(
      journeyData.startDate,
      journeyData.endDate
    );
    if (days.length > 0) {
      setSelectedDay(days.length);
    } else {
      setSelectedDay(null);
    }
    console.log(days, "days");
  }, [journeyData]);

  // Reset addDayDisabled when journey data changes
  useEffect(() => {
    if (journeyData) {
      // Allow adding days up to a reasonable maximum (e.g., 30 days)
      const maxAllowedDays = 30;
      const currentDaysCount = daysDiff;

      // Enable the button if we haven't reached the maximum days
      if (currentDaysCount < maxAllowedDays) {
        setAddDayDisabled(false);
      } else {
        setAddDayDisabled(true);
      }
    }
  }, [journeyData, daysDiff]);
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
    if (journeyData && journeyData.days && isInitialLoad.current) {
      console.log(
        "Initial load - updating saved steps for journey data:",
        journeyData
      );
      const newSavedSteps: { [key: string]: boolean } = {};
      journeyData.days.forEach((day: any, dayIndex: number) => {
        if (day.steps) {
          day.steps.forEach((step: any, stepIndex: number) => {
            const stepKey = `${dayIndex}-${stepIndex}`;
            // Only mark as saved if the step has some content (not a newly added empty step)
            const hasContent =
              step.location?.name ||
              step.notes ||
              step.category ||
              step.startDate ||
              step.endDate;
            newSavedSteps[stepKey] = hasContent;
          });
        }
      });
      console.log("Initial saved steps mapping:", newSavedSteps);
      setSavedSteps(newSavedSteps);
      isInitialLoad.current = false;
    }
  }, [journeyData]);

  if (!journeyData) return null;

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

  /**
   * Extends the journey by one day by updating the end date
   * This function:
   * 1. Calculates the new end date (current end date + 1 day)
   * 2. Calls the API to update the journey with the new end date
   * 3. Updates the local state to reflect the change
   * 4. Regenerates the days display automatically
   */
  const handleAddDay = async () => {
    console.log("Adding new day...");
    console.log("Current journeyData:", journeyData);

    if (isAddingDay) return; // Prevent multiple simultaneous requests

    // Check if we're already at the maximum allowed days
    const maxAllowedDays = 30;
    if (daysDiff >= maxAllowedDays) {
      toast.error(`Journey cannot exceed ${maxAllowedDays} days.`);
      return;
    }

    setIsAddingDay(true);
    try {
      // Get current end date and add one day
      const currentEndDate = new Date(journeyData.endDate);
      const newEndDate = new Date(currentEndDate);
      newEndDate.setDate(newEndDate.getDate() + 1);

      // Format the new end date as YYYY-MM-DD
      const newEndDateString = newEndDate.toISOString().split("T")[0];

      // Get token for API call
      const TOKEN =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || "<PASTE_VALID_TOKEN_HERE>"
          : "<PASTE_VALID_TOKEN_HERE>";

      // Prepare form data for API call
      const formData = new FormData();
      formData.append(
        "start_lat",
        journeyData.start_lat?.toString() || "31.5497"
      );
      formData.append(
        "start_lng",
        journeyData.start_lng?.toString() || "74.3436"
      );
      formData.append("end_location_name", journeyData.endPoint);
      formData.append("end_lat", journeyData.end_lat?.toString() || "36.3167");
      formData.append("end_lng", journeyData.end_lng?.toString() || "74.6500");
      formData.append("start_date", journeyData.startDate);
      formData.append("end_date", newEndDateString);
      formData.append("user_id", "1"); // This should come from user context
      formData.append("budget", journeyData.budget);
      formData.append("_method", "PUT");

      // Call API to update the journey
      const response = await fetch(
        `https://api.hightribe.com/api/journeys/${journeyData.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: "application/json",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error:", errorData);
        toast.error("Failed to extend journey. Please try again.");
        return;
      }

      // Update local journey data with new end date
      const updatedJourneyData = {
        ...journeyData,
        endDate: newEndDateString,
      };

      // Update the journeyData in the parent component
      if (onJourneyDataUpdate) {
        onJourneyDataUpdate(updatedJourneyData);
        console.log(
          "✅ Day added successfully! New end date:",
          newEndDateString
        );
        toast.success("Journey extended by one day!");
      }
    } catch (error) {
      console.error("Error adding day:", error);
      toast.error("Failed to extend journey. Please try again.");
    } finally {
      setIsAddingDay(false);
    }
  };

  const handleAddStop = (dayIndex: number) => {
    // Get the current day from the generated days
    const currentDay = finalDisplayDays[dayIndex];
    if (!currentDay) return;

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

    // Update the day with the new step
    const updatedDay = {
      ...currentDay,
      steps: [...(currentDay.steps || []), newStep],
    };

    // Update the finalDisplayDays array
    const updatedDays = [...finalDisplayDays];
    updatedDays[dayIndex] = updatedDay;

    // Update journeyData if it exists
    if (journeyData) {
      const updatedJourneyData = { ...journeyData };
      if (!updatedJourneyData.days) {
        updatedJourneyData.days = [];
      }
      updatedJourneyData.days[dayIndex] = updatedDay;

      if (onJourneyDataUpdate) {
        onJourneyDataUpdate(updatedJourneyData);
      }
    }

    // Mark the new step as unsaved so the form appears
    const newStepIndex = currentDay.steps?.length || 0;
    const stepKey = `${dayIndex}-${newStepIndex}`;
    setSavedSteps((prev) => ({ ...prev, [stepKey]: false }));

    // Open the day to show the new step
    setOpenDayIndex(dayIndex);

    console.log("✅ Stop added successfully!");
  };

  const handleStepDelete = (dayIndex: number, stepIndex: number) => {
    // Get the current day from the generated days
    const currentDay = finalDisplayDays[dayIndex];
    if (!currentDay || !currentDay.steps) {
      console.error("Day or steps not found");
      return;
    }

    // Remove the step
    const updatedSteps = currentDay.steps.filter(
      (_, index) => index !== stepIndex
    );

    const updatedDay = {
      ...currentDay,
      steps: updatedSteps,
    };

    // Update journeyData if it exists
    if (journeyData) {
      const updatedJourneyData = { ...journeyData };
      if (!updatedJourneyData.days) {
        updatedJourneyData.days = [];
      }
      updatedJourneyData.days[dayIndex] = updatedDay;

      if (onJourneyDataUpdate) {
        onJourneyDataUpdate(updatedJourneyData);
      }
    }

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
    // Get the current day from the generated days
    const currentDay = finalDisplayDays[dayIndex];
    if (!currentDay || !currentDay.steps) {
      console.error("Day or steps not found");
      return;
    }

    // Update the step
    const updatedSteps = [...currentDay.steps];
    updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], ...updatedStep };

    const updatedDay = {
      ...currentDay,
      steps: updatedSteps,
    };

    // Update journeyData if it exists
    if (journeyData) {
      const updatedJourneyData = { ...journeyData };
      if (!updatedJourneyData.days) {
        updatedJourneyData.days = [];
      }
      updatedJourneyData.days[dayIndex] = updatedDay;

      if (onJourneyDataUpdate) {
        onJourneyDataUpdate(updatedJourneyData);
      }
    }
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

  // Generate all available days from start date to end date
  const generateAllDays = (): Day[] => {
    const startDate = new Date(journeyData.startDate);
    const endDate = new Date(journeyData.endDate);
    const daysDiff =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      ) + 1;

    const allDays: Day[] = Array.from({ length: daysDiff }, (_, i) => {
      const dayDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      return {
        id: i + 1,
        dayNumber: i + 1,
        date: dayDate,
        steps: [] as Step[],
        isOpen: false,
      };
    });

    // If we have existing journey data with days, merge them
    if (journeyData?.days && journeyData.days.length > 0) {
      journeyData.days.forEach((existingDay: any, index: number) => {
        if (allDays[index]) {
          allDays[index] = {
            ...allDays[index],
            steps: existingDay.steps || [],
            isOpen: existingDay.isOpen || false,
          };
        }
      });
    }

    return allDays;
  };

  // Use all available days instead of just existing days
  const finalDisplayDays = generateAllDays();

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
  console.log(journeyData, "journeyData");
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

    // Add local state for inputs to prevent focus loss
    const [localLocation, setLocalLocation] = useState(
      step.location.name || ""
    );
    const [localNotes, setLocalNotes] = useState(step.notes || "");

    const stepKey = `${dayIndex}-${stepIndex}`;
    const isSaved = savedSteps[stepKey];

    // Update local state when step prop changes
    React.useEffect(() => {
      setLocalLocation(step.location.name || "");
      setLocalNotes(step.notes || "");
    }, [step.location.name, step.notes]);

    const handleSaveStop = async (
      dayIndex: number,
      stepIndex: number,
      step: Step
    ) => {
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
        formData.append(
          "lng",
          step.location.coords?.[0]?.toString() || "2.2945"
        );
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
      setSavedSteps((m) => ({ ...m, [`${dayIndex}-${stepIndex}`]: true }));
    };

    // Handle blur events to update parent state
    const handleLocationBlur = () => {
      handleStepUpdate(dayIndex, stepIndex, {
        location: { ...step.location, name: localLocation },
      });
    };

    const handleNotesBlur = () => {
      handleStepUpdate(dayIndex, stepIndex, { notes: localNotes });
    };

    // Handle Enter key to save and blur
    const handleLocationKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "Enter") {
        (e.currentTarget as HTMLInputElement).blur();
      }
    };

    const handleNotesKeyDown = (
      e: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
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

      handleStepUpdate(dayIndex, stepIndex, { media: mediaArray });
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
              onClick={() => handleSaveStop(dayIndex, stepIndex, step)}
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
        className={`fixed left-0 top-50 bottom-0 z-40 w-[524px] bg-white rounded-r-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <div className="p-3">
            <div className="flex items-center gap-2 justify-end">
              <div className="flex items-center justify-center ">
                <button
                  className="h-8 w-8 mx-auto flex items-center justify-center"
                  aria-label="Menu"
                  onClick={onClose}
                  type="button"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.70801 2.70789L9.67142 9.67102"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2.70801 9.67102L9.67142 2.70789"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
              {/* <button type="button" className="flex items-center gap-2">
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
              </button> */}
            </div>
          </div>

          {/* Trip Header */}
          <div className="px-3 pb-2  border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2  w-fit rounded-full py-2 px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="16"
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
                <h2 className="text-[20px] font-medium text-[#000000] font-gilroy leading-[100%] tracking-[-3%]">
                  Trip to {journeyData.startingPoint} to {journeyData.endPoint}
                </h2>
                <Image
                  src="/dashboard/Pencil.png"
                  alt="Edit"
                  width={16}
                  height={16}
                  className="w-6 h-6 cursor-pointer"
                />
              </div>
            </div>
            <div className="text-[13px] text-[#000000] font-gilroy leading-[100%] tracking-[-3%] ml-5 mb-2 flex items-center gap-3">
              <span className="">{journeyData.startingPoint}</span>
              {finalDisplayDays.length} days in {journeyData.startDate} to{" "}
              {journeyData.endDate}
              <span className="">{travelerCount} travelers</span>
              <span className="">${journeyData.budget}</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 justify-between px-4 border-b border-gray-100 overflow-x-auto">
            <div className="flex items-center gap-1">
              <button
                className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors  text-bold text-[14px] font-gilroy leading-[100%] tracking-[-3%]  ${
                  activeTab === "itinerary"
                    ? "bg-[linear-gradient(90.76deg,#9243AC_0.54%,#B6459F_50.62%,#E74294_99.26%)] bg-clip-text text-transparent border-b-2 border-[linear-gradient(90.76deg,#9243AC_0.54%,#B6459F_50.62%,#E74294_99.26%)]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("itinerary")}
              >
                Itinerary ({daysDiff} days)
              </button>
              <button
                className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors  text-bold text-[14px] font-gilroy leading-[100%] tracking-[-3%]  ${
                  activeTab === "chat"
                    ? "bg-[linear-gradient(90.76deg,#9243AC_0.54%,#B6459F_50.62%,#E74294_99.26%)] bg-clip-text text-transparent border-b-2 border-[linear-gradient(90.76deg,#9243AC_0.54%,#B6459F_50.62%,#E74294_99.26%)]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("chat")}
              >
                Calendar
              </button>
              <button
                className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors  text-bold text-[14px] font-gilroy leading-[100%] tracking-[-3%]  ${
                  activeTab === "bookings"
                    ? "bg-[linear-gradient(90.76deg,#9243AC_0.54%,#B6459F_50.62%,#E74294_99.26%)] bg-clip-text text-transparent border-b-2 border-[linear-gradient(90.76deg,#9243AC_0.54%,#B6459F_50.62%,#E74294_99.26%)]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("bookings")}
              >
                Bookings
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={handleAddDay}
                disabled={addDayDisabled || isAddingDay}
                className={`text-[12px] flex items-center gap-1 py-2 px-3 rounded-full leading-none focus:outline-none transition-all ${
                  addDayDisabled || isAddingDay
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[linear-gradient(90.76deg,#9243AC_0.54%,#B6459F_50.62%,#E74294_99.26%)] text-white hover:opacity-90"
                }`}
              >
                <div
                  className={`p-0.5 border rounded-full ${
                    addDayDisabled || isAddingDay
                      ? "border-gray-400"
                      : "border-white"
                  }`}
                >
                  {isAddingDay ? (
                    <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <PlusIcon
                      className={`w-2.5 h-2.5 ${
                        addDayDisabled ? "text-gray-400" : "text-white"
                      }`}
                    />
                  )}
                </div>
                <span>{isAddingDay ? "Adding..." : "Add Day"}</span>
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === "itinerary" && (
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-3 space-y-2">
                {finalDisplayDays.map((day: any, dayIndex: number) => {
                  const isOpen = openDayIndex === dayIndex;
                  const formattedDate = new Date(day.date).toLocaleDateString(
                    "en-US",
                    {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    }
                  );

                  return (
                    <div key={day.id || dayIndex}>
                      <div className="flex items-center justify-between border-b border-gray-100 p-4">
                        {/* Left: Day label + date + chevron */}
                        <button
                          type="button"
                          onClick={() => handleDayToggle(dayIndex)}
                          className="inline-flex items-center gap-1.5 focus:outline-none"
                        >
                          <span className="text-[12px] font-gilroy leading-[100%] tracking-[-3%] font-medium text-[#000000]">
                            Day {day.dayNumber}{" "}
                            <span className="text-[#000000] text-[12px] font-gilroy leading-[100%] tracking-[-3%] font-medium">
                              ({formattedDate})
                            </span>
                          </span>
                          <svg
                            className={`h-3 w-3 text-gray-700 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 111.04 1.08l-4.22 3.34a.75.75 0 01-.94 0L5.21 8.31a.75.75 0 01.02-1.1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>

                        {/* Right: + Add Stop */}
                        <button
                          type="button"
                          onClick={() => handleAddStop(dayIndex)}
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
                              {day.steps.map((step: any, stepIndex: number) => (
                                <div key={stepIndex}>
                                  {/* Show saved steps as preview */}
                                  <StepPreview
                                    step={step}
                                    dayIndex={dayIndex}
                                    stepIndex={stepIndex}
                                  />

                                  {/* Show form for unsaved steps */}
                                  {!savedSteps[`${dayIndex}-${stepIndex}`] && (
                                    <StopForm
                                      step={step}
                                      dayIndex={dayIndex}
                                      stepIndex={stepIndex}
                                    />
                                  )}
                                </div>
                              ))}
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
                })}
              </div>

              {/* Add Day Button */}
              {/* <div className="text-center py-4">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 text-[12px] font-medium disabled:text-[#7F7C7C]"
                  // onClick={handleAddDay}
                  disabled={addDayDisabled}
                >
                  + Add Days
                </button>
              </div> */}
            </div>
          )}

          {activeTab === "chat" && (
            <JourneyCalendar
              journeyData={journeyData}
              selectedStep={selectedStep}
              onStepSelect={onStepSelect}
            />
          )}

          {activeTab === "bookings" && (
            <JourneyBookings journeyData={journeyData} />
          )}
        </form>
      </div>
    </div>
  );
};

export default JourneySidebar;
