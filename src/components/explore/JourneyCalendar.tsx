import React, { useState } from "react";
import { Step } from "@/components/dashboard/modals/components/newjourney/types";

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

interface JourneyCalendarProps {
  journeyData: JourneyData | null;
  selectedStep?: { dayIndex: number; stepIndex: number } | null;
  onStepSelect?: (dayIndex: number, stepIndex: number) => void;
}

const JourneyCalendar: React.FC<JourneyCalendarProps> = ({
  journeyData,
  selectedStep,
  onStepSelect,
}) => {
  const [currentDayOffset, setCurrentDayOffset] = useState(0);

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

  // Use journeyData days or create default days
  const displayDays =
    journeyData.days ||
    Array.from({ length: daysDiff }, (_, i) => ({
      id: i + 1,
      dayNumber: i + 1,
      date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
      steps: [],
      isOpen: false,
    }));

  const totalDays = displayDays.length;

  // Time slots for the calendar
  const timeSlots = [
    { id: "all-day", label: "All-day", time: null },
    { id: "11am", label: "11am", time: "11:00" },
    { id: "12am", label: "12am", time: "12:00" },
    { id: "1pm", label: "1pm", time: "13:00" },
    { id: "2pm", label: "2pm", time: "14:00" },
    { id: "3pm", label: "3pm", time: "15:00" },
    { id: "4pm", label: "4pm", time: "16:00" },
  ];

  // Get visible days (6 days at a time)
  const visibleDays = displayDays.slice(currentDayOffset, currentDayOffset + 6);

  const handlePreviousDays = () => {
    if (currentDayOffset > 0) {
      setCurrentDayOffset(Math.max(0, currentDayOffset - 6));
    }
  };

  const handleNextDays = () => {
    if (currentDayOffset + 6 < totalDays) {
      setCurrentDayOffset(Math.min(totalDays - 6, currentDayOffset + 6));
    }
  };

  // Helper function to get events for a specific day and time slot
  const getEventsForSlot = (dayIndex: number, timeSlot: string) => {
    const day = displayDays[dayIndex];
    if (!day || !day.steps) return [];

    return day.steps.filter((step) => {
      if (timeSlot === "all-day") {
        // All-day events (accommodations, etc.)
        return step.category === "1"; // Accommodation
      } else {
        // Time-specific events
        if (step.startDate) {
          const eventTime = new Date(step.startDate);
          const eventHour = eventTime.getHours();
          const slotHour = parseInt(timeSlot.replace(/\D/g, ""));

          if (timeSlot.includes("pm") && slotHour !== 12) {
            return eventHour === slotHour + 12;
          } else if (timeSlot.includes("am")) {
            return eventHour === slotHour;
          }
        }
        return false;
      }
    });
  };

  // Helper function to get event color based on category
  const getEventColor = (category: string) => {
    switch (category) {
      case "1": // Accommodation
        return "bg-green-100 border-green-200 text-green-800";
      case "2": // Attraction
        return "bg-purple-100 border-purple-200 text-purple-800";
      case "3": // Restaurant
        return "bg-orange-100 border-orange-200 text-orange-800";
      case "4": // Transport
        return "bg-blue-100 border-blue-200 text-blue-800";
      case "5": // Activity
        return "bg-pink-100 border-pink-200 text-pink-800";
      default:
        return "bg-gray-100 border-gray-200 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-full">
          {/* Calendar Header - Days */}
          <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {/* Empty corner cell */}
              <div className="bg-white p-4"></div>

              {/* Day headers */}
              {visibleDays.map((day, index) => (
                <div key={day.id} className="bg-white p-4 text-center">
                  <div className="text-sm font-medium text-gray-900">
                    Day {day.dayNumber}
                  </div>
                </div>
              ))}

              {/* Navigation arrows */}
              <div className="bg-white p-4 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreviousDays}
                    disabled={currentDayOffset === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextDays}
                    disabled={currentDayOffset + 6 >= totalDays}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Body - Time Slots */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {/* Time slot labels */}
            <div className="bg-white">
              {timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="h-16 border-b border-gray-100 flex items-center px-4 text-sm text-gray-600 font-medium"
                >
                  {slot.label}
                </div>
              ))}
            </div>

            {/* Calendar cells for each day */}
            {visibleDays.map((day, dayIndex) => (
              <div key={day.id} className="bg-white">
                {timeSlots.map((slot) => {
                  const events = getEventsForSlot(
                    currentDayOffset + dayIndex,
                    slot.id
                  );

                  return (
                    <div
                      key={slot.id}
                      className="h-16 border-b border-gray-100 p-1 relative"
                    >
                      {events.map((event, eventIndex) => {
                        const isSelected =
                          selectedStep?.dayIndex ===
                            currentDayOffset + dayIndex &&
                          selectedStep?.stepIndex === eventIndex;

                        return (
                          <div
                            key={eventIndex}
                            className={`absolute inset-1 rounded-md border p-2 text-xs cursor-pointer transition-all ${getEventColor(
                              event.category || ""
                            )} ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                            onClick={() => {
                              if (onStepSelect) {
                                onStepSelect(
                                  currentDayOffset + dayIndex,
                                  eventIndex
                                );
                              }
                            }}
                          >
                            {slot.id === "all-day" ? (
                              <div className="font-medium truncate">
                                {event.location.name || event.name}
                              </div>
                            ) : (
                              <>
                                <div className="font-medium truncate">
                                  {event.location.name || event.name}
                                </div>
                                {event.startDate && (
                                  <div className="text-xs opacity-75">
                                    {new Date(
                                      event.startDate
                                    ).toLocaleTimeString("en-US", {
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}
                                  </div>
                                )}
                                {event.location.name && (
                                  <div className="text-xs opacity-75 truncate">
                                    {event.location.name}
                                  </div>
                                )}
                                <div className="text-xs opacity-75">
                                  View &...
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Empty column for navigation arrows */}
            <div className="bg-white">
              {timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="h-16 border-b border-gray-100"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyCalendar;
