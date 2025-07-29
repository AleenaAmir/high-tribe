import React, { useState } from "react";
import { ContinuousCalendar } from "./ContinuousCalendar";
import BookingCalanderSideSection from "./BookingCalanderSideSection";
import BookingsTable from "./BookingsTable";

export default function BookingsMain() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [filters, setFilters] = useState("checkInDate");

  return (
    <div>
      <div className="p-3 md:px-4 md:py-3 lg:px-6 lg:py-3 flex items-center justify-between bg-[#F8F8F8]">
        <div className="flex items-center gap-2">
          <button
            className={`cursor-pointer py-1 px-3 rounded-md text-[12px] ${
              activeTab === "calendar"
                ? "bg-white font-bold"
                : "hover:bg-white hover:font-bold"
            }`}
            onClick={() => setActiveTab("calendar")}
          >
            Calendar
          </button>
          <button
            className={`cursor-pointer py-1 px-3 rounded-md text-[12px] ${
              activeTab === "bookings"
                ? "bg-white font-bold"
                : "hover:bg-white hover:font-bold"
            }`}
            onClick={() => setActiveTab("bookings")}
          >
            Bookings
          </button>
        </div>
        {activeTab === "bookings" && (
          <div className="flex items-center gap-2 text-[12px]">
            <p>Filter by</p>
            <button
              onClick={() => setFilters("listing")}
              className={`cursor-pointer py-1 px-3 rounded-full   border border-[#1D1D1D] ${
                filters === "listing"
                  ? "bg-black text-white"
                  : "text-black text-[12px] hover:bg-black bg-white hover:text-white"
              }`}
            >
              Listing
            </button>
            <button
              onClick={() => setFilters("bookingStatus")}
              className={`cursor-pointer py-1 px-3 rounded-full  text-[12px]  border border-[#1D1D1D] ${
                filters === "bookingStatus"
                  ? "bg-black text-white"
                  : "text-black text-[12px] hover:bg-black bg-white hover:text-white"
              }`}
            >
              Booking status
            </button>
            <button
              onClick={() => setFilters("checkInDate")}
              className={`cursor-pointer py-1 px-3 rounded-full  text-[12px]  border border-[#1D1D1D] ${
                filters === "checkInDate"
                  ? "bg-black text-white"
                  : "text-black text-[12px] hover:bg-black bg-white hover:text-white"
              }`}
            >
              Check in date
            </button>
            <button
              onClick={() => setFilters("checkInDate")}
              className={`cursor-pointer py-1 px-3 rounded-full bg-[#1265E2] text-white text-[12px]`}
            >
              Download report
            </button>
          </div>
        )}
      </div>
      {activeTab === "calendar" && <ContinuousCalendar />}
      {activeTab === "bookings" && <BookingsTable />}
    </div>
  );
}
