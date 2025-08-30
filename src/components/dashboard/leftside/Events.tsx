// import React from "react";

// type EventsProps = {
//   events?: any[];
// };
// const Events = ({ events }: EventsProps) => {
//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col gap-4">
//       {events?.map((event, i) => (
//         <div key={i} className="flex items-center gap-2 justify-between">
//           <h3 className="text-[12px] text-[#666666]">{event.title}</h3>
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-4 h-4 text-[#666666]"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M19 9l-7 7-7-7"
//             />
//           </svg>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Events;




import React, { useState } from 'react';
import { ChevronUp } from 'lucide-react';

interface Event {
  title: string;
}

interface EventsProps {
  events?: Event[];
}

const Events = ({ events = [] }: EventsProps) => {
  const [showEvents, setShowEvents] = useState(false);
  const [trips] = useState(
    events.length > 0
      ? events.map((event, index) => ({
        id: index + 1,
        title: event.title,
        date: "8/13/2025",
        isHighlighted: index === 0
      }))
      : [
        { id: 1, title: "Events Host", date: "8/13/2025", isHighlighted: true },
        { id: 2, title: "Events in Iceland", date: "8/14/2025", isHighlighted: false },
        { id: 3, title: "Event story", date: "8/15/2025", isHighlighted: false },
        { id: 4, title: "Event coffee with ali", date: "8/16/2025", isHighlighted: false },
        { id: 5, title: "Event coffee with cli", date: "8/16/2025", isHighlighted: false },
        { id: 6, title: "Event story", date: "8/16/2025", isHighlighted: false },
        { id: 7, title: "Events in Iceland", date: "8/17/2025", isHighlighted: false }
      ]
  );

  const toggleEvents = () => {
    setShowEvents(!showEvents);
  };

  return (
    <div className={`w-full mx-auto bg-[#FFFFFF] border border-[#F2F2F1] p-4 mb-2 rounded-lg shadow-sm font-gilroy transition-all duration-300 `}>

      <div className="flex justify-between items-center">
        <h1 className="text-[16px] font-[500] text-[#000000]font-gilroy ">Upcoming Trips</h1>
        <div className="relative">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br from-[#9243AC] via-[#B6459F] to-[#E74294] cursor-pointer hover:opacity-80 transition-opacity"
            onClick={toggleEvents}
          >
            <img
              src="/dashboard/upArrow.svg"
              alt="Arrow"
              className={`w-3 h-3 transition-transform duration-200 ${showEvents ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </div>
      {showEvents && (
        <div className="space-y-2 pt-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className={`flex justify-between items-center px-4 py-2.5 rounded-full border transition-all duration-200 hover:shadow-sm relative ${trip.isHighlighted
                ? 'border-[#A9A9A9] bg-white shadow-sm'
                : 'border-[#EDEDED] bg-[#FFFFFF]'
                }`}
            >
              <span className={`text-xs text-center ${trip.isHighlighted ? 'text-[#000000] font-sm' : 'text-[#000000]'
                }`}>
                {trip.title}
              </span>
              <span className={`text-[10px] text-center ml-4 ${trip.isHighlighted ? 'text-[#FF0202] font-sm' : 'text-[#4E4949]'
                }`}>
                {trip.date}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default Events;