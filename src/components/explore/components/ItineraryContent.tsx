import React from "react";
import DayItem from "./DayItem";
import { Step } from "@/components/dashboard/modals/components/newjourney/types";

interface ItineraryContentProps {
  finalDisplayDays: any[];
  openDayIndex: number | null;
  journeyData: any;
  dayStops: any[];


  onAddStop: (dayIndex: number, formattedDate: string, dayNumber: number) => void;

  handleViewDayStops: (formattedDate: string) => void;
}

const ItineraryContent: React.FC<ItineraryContentProps> = ({
  finalDisplayDays,
  openDayIndex,
  handleViewDayStops,
  dayStops,
  onAddStop,

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
              dayStops={dayStops}
              onAddStop={onAddStop}

              handleViewDayStops={(formattedDate: string) => handleViewDayStops(formattedDate)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ItineraryContent;
