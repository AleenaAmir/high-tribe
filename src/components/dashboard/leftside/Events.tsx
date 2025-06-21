import React from "react";

type EventsProps = {
  events?: any[];
};
const Events = ({ events }: EventsProps) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col gap-4">
      {events?.map((event, i) => (
        <div key={i} className="flex items-center gap-2 justify-between">
          <h3 className="text-[12px] text-[#666666]">{event.title}</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-[#666666]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default Events;
