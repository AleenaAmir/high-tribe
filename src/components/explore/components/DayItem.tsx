import React, { useState } from "react";
import { Step } from "@/components/dashboard/modals/components/newjourney/types";
import ChevronDownIcon from "../icons/ChevronDownIcon";

import ViewDayStop from "./ViewDayStop";

interface DayItemProps {
  day: any;
  dayIndex: number;
  dayStops: any[];


  onAddStop: (dayIndex: number, formattedDate: string, dayNumber: number) => void;



  handleViewDayStops: (formattedDate: string) => void;
}

const DayItem: React.FC<DayItemProps> = ({
  day,
  dayIndex,
  dayStops,
  onAddStop,
  handleViewDayStops,

}) => {
  const formattedDate = new Date(day.date).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const [openDayIndex, setOpenDayIndex] = useState<number | null>(null);

  const handleDayToggle = () => {
    setOpenDayIndex((prevIndex) => (prevIndex === dayIndex ? null : dayIndex));
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        {/* Left: Day label + date + chevron */}
        <button
          type="button"
          onClick={handleDayToggle}
          className="inline-flex items-center gap-1.5 focus:outline-none"
        >
          <span className="text-[12px] font-gilroy leading-[100%] tracking-[-3%] font-medium text-[#000000]">
            Day {day.dayNumber}{" "}
            <span className="text-[#000000] text-[12px] font-gilroy leading-[100%] tracking-[-3%] font-medium">
              ({formattedDate})
            </span>
          </span>
          <ChevronDownIcon isOpen={openDayIndex === dayIndex} />
        </button>

        {/* Right: + Add Stop */}
        <button
          type="button"
          onClick={() => onAddStop(dayIndex, formattedDate, day.dayNumber)}
          className="text-[12px] leading-none font-semibold bg-[linear-gradient(90.76deg,#9243AC_0.54%,#B6459F_50.62%,#E74294_99.26%)] bg-clip-text text-transparent focus:outline-none"
        >
          + Add Stop
        </button>
      </div>

      {/* Day Content - Steps */}
      {openDayIndex === dayIndex && (
        <ViewDayStop handleViewDayStops={(formattedDate: string) => handleViewDayStops(formattedDate)} dayStops={dayStops} formattedDate={formattedDate} />
      )}
    </div>
  );
};

export default DayItem;
