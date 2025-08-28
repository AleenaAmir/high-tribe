import React, { useState } from "react";
import ChevronDownIcon from "../icons/ChevronDownIcon";
import { RiDeleteBin4Line } from "react-icons/ri";
import ViewDayStop from "./ViewDayStop";

interface DayItemProps {
  day: any;
  dayIndex: number;
  dayStops: any[];
  onAddStop: (
    dayIndex: number,
    formattedDate: string,
    dayNumber: number
  ) => void;
  handleViewDayStops: (formattedDate: string) => void;
  onDeleteDay: (dayIndex: number) => void;
  isLastDay: boolean;
  totalDays: number; // Add total days count
}

const DayItem: React.FC<DayItemProps> = ({
  day,
  dayIndex,
  dayStops,
  onAddStop,
  handleViewDayStops,
  onDeleteDay,
  isLastDay,
  totalDays,
}) => {
  const formattedDate = new Date(day.date).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  // open by default
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleDayToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-100 px-4">
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
          <div className="flex items-center justify-center">
            <ChevronDownIcon isOpen={isOpen} className="h-6 w-6" />
          </div>
        </button>

        {/* Right: + Add Stop & Delete */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onAddStop(dayIndex, formattedDate, day.dayNumber)}
            className="text-[12px] leading-none font-semibold bg-[linear-gradient(90.76deg,#9243AC_0.54%,#B6459F_50.62%,#E74294_99.26%)] bg-clip-text text-transparent focus:outline-none"
          >
            + Add Stop
          </button>

          {isLastDay && totalDays > 1 && (
            <button
              type="button"
              onClick={() => onDeleteDay(dayIndex)}
              className="text-red-500 hover:text-red-700"
            >
              <RiDeleteBin4Line className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Show stops if open */}
      {isOpen && (
        <ViewDayStop
          handleViewDayStops={(formattedDate: string) =>
            handleViewDayStops(formattedDate)
          }
          dayStops={dayStops}
          formattedDate={formattedDate}
        />
      )}
    </div>
  );
};

export default DayItem;
