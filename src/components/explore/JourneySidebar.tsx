"use client";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Step } from "@/components/dashboard/modals/components/newjourney/types";
import JourneyCalendar from "./JourneyCalendar";
import JourneyBookings from "./JourneyBookings";
import { generateDaysFromRange } from "@/app/querry/getDays";
import { toast } from "react-hot-toast";

// Import smaller components
import CloseIcon from "./icons/CloseIcon";
import JourneyHeader from "./components/JourneyHeader";
import NavigationTabs from "./components/NavigationTabs";
import ItineraryContent from "./components/ItineraryContent";

interface JourneyData {
  id: number;
  journeyName: string;
  startingPoint: string;
  endPoint: string;
  startDate: string;
  endDate: string;
  who: string;
  budget: string;
  days: Day[];
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
  dayStops: any[];

  onAddStop?: (
    dayIndex: number,
    formattedDate: string,
    dayNumber: number
  ) => void;
  handleViewDayStops?: (formattedDate: string) => void;
  onEditJourney?: (journeyData: JourneyData) => Promise<void>;
  onRefetchJourney?: () => Promise<void>;
  onAddPeople?: () => void;
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
  handleViewDayStops,
  onAddStop,
  dayStops,
  onEditJourney,
  onRefetchJourney,
  onAddPeople,
}) => {
  console.log(journeyData, "journeyData");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [addDayDisabled, setAddDayDisabled] = useState(false);
  const [isAddingDay, setIsAddingDay] = useState(false);
  const [openDayIndex, setOpenDayIndex] = useState<number | null>(null);
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

  // Removed automatic refetch to prevent infinite loops
  // Refetch will only happen when explicitly called (e.g., after edits, adding days, etc.)

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

  const { control, handleSubmit, setValue } = useForm<FormData>({
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

      // Refetch journey data to ensure we have the latest information
      if (onRefetchJourney) {
        await onRefetchJourney();
      }
    } catch (error) {
      console.error("Error adding day:", error);
      toast.error("Failed to extend journey. Please try again.");
    } finally {
      setIsAddingDay(false);
    }
  };

  // inside JourneySidebar component

  const handleDeleteDay = async (dayIndex: number) => {
    console.log("Deleting day at index:", dayIndex);

    // Check if we have more than one day
    if (finalDisplayDays.length <= 1) {
      toast.error(
        "Cannot delete the last day. Journey must have at least one day."
      );
      return;
    }

    // Check if this is the last day (only allow deleting the last day)
    if (dayIndex !== finalDisplayDays.length - 1) {
      toast.error("Can only delete the last day of the journey.");
      return;
    }

    try {
      // Get current end date and subtract one day
      const currentEndDate = new Date(journeyData.endDate);
      const newEndDate = new Date(currentEndDate);
      newEndDate.setDate(newEndDate.getDate() - 1);

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
        toast.error("Failed to delete day. Please try again.");
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
          "✅ Day deleted successfully! New end date:",
          newEndDateString
        );
        toast.success("Day removed from journey!");
      }

      // Refetch journey data to ensure we have the latest information
      if (onRefetchJourney) {
        await onRefetchJourney();
      }
    } catch (error) {
      console.error("Error deleting day:", error);
      toast.error("Failed to delete day. Please try again.");
    }
  };

  // Function to manually trigger refetch
  const handleManualRefetch = async () => {
    if (onRefetchJourney) {
      try {
        await onRefetchJourney();
        toast.success("Journey data refreshed");
      } catch (error) {
        console.error("Error refreshing journey data:", error);
        toast.error("Failed to refresh journey data");
      }
    }
  };

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

  console.log(journeyData, "journeyData");

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <div>
      {/* Main Sidebar */}
      <div
        className={`fixed left-0 top-50 bottom-0 z-[1001] w-[524px] bg-white rounded-r-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <div className="py-4 pr-2">
            <div className="flex items-center gap-2 justify-end">
              <div className="flex items-center justify-center ">
                <button
                  className="h-6 w-6 mx-auto text-black flex items-center justify-center bg-[#F4F4F4] rounded-full "
                  aria-label="Menu"
                  onClick={onClose}
                  type="button"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Trip Header */}
          <JourneyHeader
            journeyData={journeyData}
            travelerCount={travelerCount}
            onEditJourney={async () => await onEditJourney?.(journeyData)}
            onAddPeople={onAddPeople}
          />

          {/* Navigation Tabs */}
          <NavigationTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            daysDiff={daysDiff}
            addDayDisabled={addDayDisabled}
            isAddingDay={isAddingDay}
            handleAddDay={handleAddDay}
          />

          {/* Content based on active tab */}
          {activeTab === "itinerary" && (
            <ItineraryContent
              finalDisplayDays={finalDisplayDays}
              openDayIndex={openDayIndex}
              journeyData={journeyData}
              handleViewDayStops={handleViewDayStops || (() => {})}
              dayStops={dayStops}
              onAddStop={onAddStop || (() => {})}
              onDeleteDay={handleDeleteDay} // ✅ FIX: required prop
            />
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
