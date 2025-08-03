"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiFormDataWrapper } from "@/lib/api";

// Zod validation schema
const bookingSettingsSchema = z.object({
  ownerBlock: z.boolean(),
  bookingType: z.enum(["instant", "request"], {
    required_error: "Please select a booking type",
  }),
  selectedDates: z.array(z.string()).optional(),
});

type BookingSettingsFormData = z.infer<typeof bookingSettingsSchema>;

const SitesBookingSettingsForm = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingSettingsFormData>({
    resolver: zodResolver(bookingSettingsSchema),
    defaultValues: {
      ownerBlock: true,
      bookingType: "request",
      selectedDates: [],
    },
  });

  const ownerBlock = watch("ownerBlock");

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Get calendar data
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Add previous month's days
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Add next month's days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    if (selectedDates.includes(dateString)) {
      setSelectedDates(selectedDates.filter((d) => d !== dateString));
    } else {
      setSelectedDates([...selectedDates, dateString]);
    }
    setValue("selectedDates", selectedDates);
  };

  // Check if date is selected
  const isDateSelected = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return selectedDates.includes(dateString);
  };

  const onSubmit = async (data: BookingSettingsFormData) => {
    try {
      const formData = new FormData();
      formData.append("ownerBlock", data.ownerBlock.toString());
      formData.append("bookingType", data.bookingType);
      if (data.selectedDates) {
        formData.append("selectedDates", JSON.stringify(data.selectedDates));
      }

      const response = await apiFormDataWrapper<{
        success: boolean;
        message: string;
      }>(
        "/api/sites/booking-settings",
        formData,
        "Booking settings saved successfully!"
      );

      console.log("Form submitted successfully:", response);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div>
      <h4 className="text-[14px] md:text-[16px] text-[#1C231F] font-semibold">
        Booking Settings
      </h4>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="border border-[#E1E1E1] bg-white p-2 md:p-4 rounded-[7px]">
          {/* Owner Block Checkbox */}
          <div className="mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("ownerBlock")}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Owner block</span>
            </label>
          </div>

          {/* Calendar */}
          <div className="mb-6 max-w-[541px] mx-auto">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="text-gray-500 hover:text-gray-700"
              >
                &lt;
              </button>
              <h3 className="text-lg font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                type="button"
                onClick={goToNextMonth}
                className="text-gray-500 hover:text-gray-700"
              >
                &gt;
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 ">
              {/* Day headers */}
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {days.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateClick(day.date)}
                  className={`
                    p-2 text-sm rounded-md transition-colors
                    ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                    ${
                      isDateSelected(day.date)
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"
                    }
                  `}
                >
                  {day.date.getDate()}
                </button>
              ))}
            </div>
          </div>

          {/* Booking Type */}
          <div className="mb-6">
            <h3 className="text-[14px] md:text-[16px] text-[#1C231F] font-bold mb-3">
              Booking Type
            </h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="instant"
                  {...register("bookingType")}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Instant Booking (Book without host approval)
                </span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="request"
                  {...register("bookingType")}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Request to Book (Host approval needed)
                </span>
              </label>
            </div>
            {errors.bookingType && (
              <p className="text-red-500 text-xs mt-1">
                {errors.bookingType.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#237AFC] text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SitesBookingSettingsForm;
