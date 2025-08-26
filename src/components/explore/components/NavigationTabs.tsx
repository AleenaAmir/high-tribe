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
    <div className="flex items-center gap-1 justify-between px-4 border-b border-gray-100 overflow-x-auto">
      <div className="flex items-center gap-1">
        <button
          className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors text-bold text-[14px] font-gilroy leading-[100%] tracking-[-3%] ${
            activeTab === "itinerary"
              ? "bg-[linear-gradient(90.76deg,#9243AC_0.54%,#B6459F_50.62%,#E74294_99.26%)] bg-clip-text text-transparent border-b-2 border-[linear-gradient(90.76deg,#9243AC_0.54%,#B6459F_50.62%,#E74294_99.26%)]"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("itinerary")}
        >
          Itinerary ({daysDiff} days)
        </button>
        <button
          className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors text-bold text-[14px] font-gilroy leading-[100%] tracking-[-3%] ${
            activeTab === "chat"
              ? "bg-[linear-gradient(90.76deg,#9243AC_0.54%,#B6459F_50.62%,#E74294_99.26%)] bg-clip-text text-transparent border-b-2 border-[linear-gradient(90.76deg,#9243AC_0.54%,#B6459F_50.62%,#E74294_99.26%)]"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("chat")}
        >
          Calendar
        </button>
        <button
          className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors text-bold text-[14px] font-gilroy leading-[100%] tracking-[-3%] ${
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
              addDayDisabled || isAddingDay ? "border-gray-400" : "border-white"
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
  );
};

export default NavigationTabs;
