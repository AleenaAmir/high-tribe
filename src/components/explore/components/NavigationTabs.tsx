import React from "react";
import PlusIcon from "../icons/PlusIcon";

interface NavigationTabsProps {
  activeTab: "itinerary" | "bookings" | "chat";
  setActiveTab: (tab: "itinerary" | "bookings" | "chat") => void;
  daysDiff: number;
  addDayDisabled: boolean;
  isAddingDay: boolean;
  handleAddDay: () => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  setActiveTab,
  daysDiff,
  addDayDisabled,
  isAddingDay,
  handleAddDay,
}) => {
  return (
    <div className="flex items-center gap-1 justify-between px-4">
      <div className="flex items-center gap-1 py-4">
        {/* Itinerary */}
        <button
          onClick={() => setActiveTab("itinerary")}
          className={`relative px-3 py-2 text-[14px] font-gilroy font-bold leading-[100%] tracking-[-3%] whitespace-nowrap transition-colors
      ${activeTab === "itinerary"
              ? "text-transparent bg-clip-text bg-gradient-to-r from-[#9243AC] via-[#B6459F] to-[#E74294]"
              : "text-gray-600 hover:text-[#9243AC]"}
    `}
        >
          Itinerary ({daysDiff} days)
          {activeTab === "itinerary" && (
            <span className="absolute left-0 right-0 -bottom-[2px] h-[2px] bg-gradient-to-r from-[#9243AC] via-[#B6459F] to-[#E74294]" />
          )}
        </button>

        {/* Bookings */}
        <button
          onClick={() => setActiveTab("bookings")}
          className={`relative px-3 py-2 text-[14px] font-gilroy font-bold leading-[100%] tracking-[-3%] whitespace-nowrap transition-colors
      ${activeTab === "bookings"
              ? "text-transparent bg-clip-text bg-gradient-to-r from-[#9243AC] via-[#B6459F] to-[#E74294]"
              : "text-gray-600 hover:text-[#9243AC]"}
    `}
        >
          Bookings
          {activeTab === "bookings" && (
            <span className="absolute left-0 right-0 -bottom-[2px] h-[2px] bg-gradient-to-r from-[#9243AC] via-[#B6459F] to-[#E74294]" />
          )}
        </button>

        {/* Chat */}
        <button
          onClick={() => setActiveTab("chat")}
          className={`relative px-3 py-2 text-[14px] font-gilroy font-bold leading-[100%] tracking-[-3%] whitespace-nowrap transition-colors
      ${activeTab === "chat"
              ? "text-transparent bg-clip-text bg-gradient-to-r from-[#9243AC] via-[#B6459F] to-[#E74294]"
              : "text-gray-600 hover:text-[#9243AC]"}
    `}
        >
          Chat
          {activeTab === "chat" && (
            <span className="absolute left-0 right-0 -bottom-[2px] h-[2px] bg-gradient-to-r from-[#9243AC] via-[#B6459F] to-[#E74294]" />
          )}
        </button>
      </div>

      <div>
        <button
          type="button"
          onClick={handleAddDay}
          className={`text-[12px] flex items-center gap-1 py-2 px-3 rounded-full leading-none focus:outline-none transition-all bg-[linear-gradient(90.76deg,#9243AC_0.54%,#B6459F_50.62%,#E74294_99.26%)] text-white hover:opacity-90`}
        >
          <div className={`p-0.5 border rounded-full border-white`}>
            {isAddingDay ? (
              <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <PlusIcon className="w-2.5 h-2.5 text-white" />
            )}
          </div>
          <span>{isAddingDay ? "Adding..." : "Add Day"}</span>
        </button>
      </div>
    </div>
  );
};

export default NavigationTabs;
