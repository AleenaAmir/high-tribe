"use client";
import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../CustomCalendar.css";
import { useSitesForm } from "../contexts/SitesFormContext";

interface SiteAvailabilitySectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

const SiteAvailabilitySection: React.FC<SiteAvailabilitySectionProps> = ({
  sectionRef,
}) => {
  const {
    state,
    updateSelectedDays,
    updateSelectDaysChecked,
    updateSelectedDates,
    updateSelectDateChecked,
    updateNoticePeriod,
    updateAdvanceBookingLimit,
    updateCancellationPolicy,
    updateBookingType,
    saveSection,
  } = useSitesForm();

  // Helper for days
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleSave = async () => {
    const availabilityData = {
      selectedDays: state.selectedDays,
      selectDaysChecked: state.selectDaysChecked,
      selectedDates: state.selectedDates,
      selectDateChecked: state.selectDateChecked,
      noticePeriod: state.noticePeriod,
      advanceBookingLimit: state.advanceBookingLimit,
      cancellationPolicy: state.cancellationPolicy,
      bookingType: state.bookingType,
    };

    await saveSection("availability", availabilityData);
  };

  return (
    <div ref={sectionRef}>
      <div className="bg-white rounded-2xl shadow p-10 max-w-4xl mx-auto mt-8">
        <h2 className="text-base font-medium text-black mb-8">
          Availability and Booking Details
        </h2>
        <div className="grid grid-cols-3 gap-8 items-start mb-10">
          {/* Left: Days Selection */}
          <div>
            <div className="mb-6">
              <span className="block text-sm font-semibold text-black mb-4">
                Availability
              </span>
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={state.selectDaysChecked}
                  onChange={(e) => updateSelectDaysChecked(e.target.checked)}
                  className="accent-black w-4 h-4 rounded border-gray-300"
                />
                <span className="font-medium text-black text-sm">
                  Select Days
                </span>
              </label>
              <div className="flex flex-col gap-2 pl-6">
                {daysOfWeek.map((day) => (
                  <label key={day} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={state.selectedDays.includes(day)}
                      disabled={!state.selectDaysChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateSelectedDays([...state.selectedDays, day]);
                        } else {
                          updateSelectedDays(
                            state.selectedDays.filter((d) => d !== day)
                          );
                        }
                      }}
                      className="accent-black w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-black font-normal">
                      {day}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          {/* Right: Calendar Selection */}
          <div className="flex flex-col items-center col-span-2">
            <label className="flex items-center gap-2 mb-2 self-start">
              <input
                type="checkbox"
                checked={state.selectDateChecked}
                onChange={(e) => updateSelectDateChecked(e.target.checked)}
                className="accent-black w-4 h-4 rounded border-gray-300"
              />
              <span className="font-medium text-black text-sm">
                Select Date
              </span>
            </label>
            <div
              className={
                state.selectDateChecked
                  ? "block"
                  : "opacity-50 pointer-events-none"
              }
            >
              <div className="bg-white rounded-xl shadow-sm p-2">
                <Calendar
                  selectRange={false}
                  value={
                    state.selectedDates.length > 0
                      ? state.selectedDates[0]
                      : undefined
                  }
                  onClickDay={(date) => {
                    const exists = state.selectedDates.some(
                      (d) => d.toDateString() === date.toDateString()
                    );
                    if (exists) {
                      updateSelectedDates(
                        state.selectedDates.filter(
                          (d) => d.toDateString() !== date.toDateString()
                        )
                      );
                    } else {
                      updateSelectedDates([...state.selectedDates, date]);
                    }
                  }}
                  tileClassName={({ date, view }) => {
                    if (view === "month") {
                      const isSelected = state.selectedDates.some(
                        (d) => d.toDateString() === date.toDateString()
                      );
                      return isSelected ? "react-calendar__tile--active" : "";
                    }
                    return "";
                  }}
                  calendarType="gregory"
                  minDetail="month"
                  maxDetail="month"
                  showNeighboringMonth={true}
                  className="border-0"
                  formatDay={(locale, date) => date.getDate().toString()}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Inputs and Booking Type */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Left: Inputs */}
          <div>
            <div className="mb-8">
              <span className="block text-sm font-semibold text-black mb-4">
                Booking preferences
              </span>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                value={state.noticePeriod}
                onChange={(e) => updateNoticePeriod(e.target.value)}
                placeholder="Notice period for booking"
              />
            </div>
            <div>
              <span className="block text-sm font-semibold text-black mb-4">
                Booking Type
              </span>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-black"
                value={state.advanceBookingLimit}
                onChange={(e) => updateAdvanceBookingLimit(e.target.value)}
              >
                <option value="">Advance Booking Limit</option>
                <option value="1">1 day</option>
                <option value="3">3 days</option>
                <option value="7">1 week</option>
                <option value="30">1 month</option>
              </select>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                value={state.cancellationPolicy}
                onChange={(e) => updateCancellationPolicy(e.target.value)}
              >
                <option value="">Cancellation Policy</option>
                <option value="flexible">Flexible</option>
                <option value="moderate">Moderate</option>
                <option value="strict">Strict</option>
              </select>
            </div>
          </div>
          {/* Right: Radio Buttons */}
          <div className="flex flex-col justify-end h-full">
            <div className="flex flex-col gap-6">
              <label className="flex items-center gap-3 text-base font-normal text-black">
                <input
                  type="radio"
                  name="bookingType"
                  value="instant"
                  checked={state.bookingType === "instant"}
                  onChange={() => updateBookingType("instant")}
                  className="accent-black w-4 h-4"
                />
                <span className="text-sm">
                  Instant Booking (Book without host approval)
                </span>
              </label>
              <label className="flex items-center gap-3 text-base font-normal text-black">
                <input
                  type="radio"
                  name="bookingType"
                  value="request"
                  checked={state.bookingType === "request"}
                  onChange={() => updateBookingType("request")}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm">
                  Request to Book (Host approval needed)
                </span>
              </label>
            </div>
          </div>
        </div>
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="px-12 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-base shadow-sm"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteAvailabilitySection;
