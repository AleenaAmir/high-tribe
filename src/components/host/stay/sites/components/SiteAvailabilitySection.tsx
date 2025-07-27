"use client";
import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../CustomCalendar.css";
import { useSitesForm } from "../hooks/useSitesForm";
import FormError from "./FormError";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

interface SiteAvailabilitySectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

const SiteAvailabilitySection: React.FC<SiteAvailabilitySectionProps> = ({
  sectionRef,
}) => {
  const {
    selectedDays,
    selectDaysChecked,
    selectedDates,
    selectDateChecked,
    noticePeriod,
    advanceBookingLimit,
    cancellationPolicy,
    bookingType,
    updateSelectedDays,
    updateSelectDaysChecked,
    updateSelectedDates,
    updateSelectDateChecked,
    updateNoticePeriod,
    updateAdvanceBookingLimit,
    updateCancellationPolicy,
    updateBookingType,
    saveSection,
    formState: { errors },
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

  const searchParams = useSearchParams();
  const propertyId = searchParams ? searchParams.get("propertyId") : null;
  const siteId = searchParams ? searchParams.get("siteId") : null;

  const handleSave = async () => {
    try {
      const isValid = await saveSection("availability");
      if (!isValid) {
        return;
      }

      const formData = new FormData();

      // @ts-ignore
      formData.append("site_id", siteId);

      formData.append("availability_type", "days");
      formData.append("available_days[]", "sunday");
      formData.append("available_days[]", "monday");
      formData.append("notice_period", "Book the room 1 day before arrival");
      formData.append("booking_type", bookingType);
      formData.append("advance_booking_limit", "up to 1-2 month ahead");
      formData.append("cancellation_policy", cancellationPolicy);

      let token = "";
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token") || "";
      }

      const response = await fetch(
        `https://api.hightribe.com/api/properties/${propertyId}/sites/availability`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        console.log("✅ Availability saved successfully:", result);
        toast.success(result.message);
      } else {
        console.error("❌ Failed to save availability:", result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      toast.error("Network error");
    }
  };

  return (
    <div ref={sectionRef}>
      <div className="bg-white rounded-2xl shadow p-10 mx-auto mt-8">
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
                  checked={selectDaysChecked}
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
                      checked={selectedDays.includes(day)}
                      disabled={!selectDaysChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateSelectedDays([...selectedDays, day]);
                        } else {
                          updateSelectedDays(
                            selectedDays.filter((d) => d !== day)
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
                checked={selectDateChecked}
                onChange={(e) => updateSelectDateChecked(e.target.checked)}
                className="accent-black w-4 h-4 rounded border-gray-300"
              />
              <span className="font-medium text-black text-sm">
                Select Date
              </span>
            </label>
            <div
              className={
                selectDateChecked ? "block" : "opacity-50 pointer-events-none"
              }
            >
              <div className="bg-white rounded-xl shadow-sm p-2">
                <Calendar
                  selectRange={false}
                  value={
                    selectedDates.length > 0 ? selectedDates[0] : undefined
                  }
                  onClickDay={(date) => {
                    const exists = selectedDates.some(
                      (d) => d.toDateString() === date.toDateString()
                    );
                    if (exists) {
                      updateSelectedDates(
                        selectedDates.filter(
                          (d) => d.toDateString() !== date.toDateString()
                        )
                      );
                    } else {
                      updateSelectedDates([...selectedDates, date]);
                    }
                  }}
                  tileClassName={({ date, view }) => {
                    if (view === "month") {
                      const isSelected = selectedDates.some(
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
                value={noticePeriod || ""}
                onChange={(e) => updateNoticePeriod(e.target.value)}
                placeholder="Notice period for booking"
              />
              <FormError error={errors.noticePeriod?.message} />
            </div>
            <div>
              <span className="block text-sm font-semibold text-black mb-4">
                Booking Type
              </span>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-black"
                value={advanceBookingLimit || ""}
                onChange={(e) => updateAdvanceBookingLimit(e.target.value)}
              >
                <option value="">Advance Booking Limit</option>
                <option value="1">1 day</option>
                <option value="3">3 days</option>
                <option value="7">1 week</option>
                <option value="30">1 month</option>
              </select>
              <FormError error={errors.advanceBookingLimit?.message} />
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                value={cancellationPolicy || ""}
                onChange={(e) => updateCancellationPolicy(e.target.value)}
              >
                <option value="">Cancellation Policy</option>
                <option value="flexible">Flexible</option>
                <option value="moderate">Moderate</option>
                <option value="strict">Strict</option>
              </select>
              <FormError error={errors.cancellationPolicy?.message} />
            </div>
          </div>
          {/* Right: Radio Buttons */}
          <div className="flex flex-col justify-center h-full">
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 text-base font-normal text-black">
                <input
                  type="radio"
                  name="bookingType"
                  value="instant"
                  checked={bookingType === "instant"}
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
                  checked={bookingType === "request"}
                  onChange={() => updateBookingType("request")}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm">
                  Request to Book (Host approval needed)
                </span>
              </label>
            </div>
            <FormError error={errors.bookingType?.message} />
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
