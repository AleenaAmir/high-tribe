"use client";
import React, { useState, useEffect } from "react";
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

const SitesBookingSettingsForm = ({
  propertyId,
  siteId,
  onSuccess,
  siteData,
  isEditMode,
}: {
  propertyId: string;
  siteId: string;
  onSuccess?: () => void;
  siteData?: any;
  isEditMode?: boolean;
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{
    from: string | null;
    to: string | null;
  }>({
    from: null,
    to: null,
  });
  const [dateError, setDateError] = useState<string>("");
  const [dataSent, setDataSent] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingSettingsFormData>({
    resolver: zodResolver(bookingSettingsSchema),
    defaultValues: {
      ownerBlock: true,
      bookingType: "request",
      selectedDates: [],
    },
  });

  // Populate form data when siteData is available in edit mode
  useEffect(() => {
    if (isEditMode && siteData?.booking_setting) {
      reset({
        ownerBlock: siteData.booking_setting.owner_block || true,
        bookingType: siteData.booking_setting.booking_type || "request",
        selectedDates: siteData.booking_setting.selected_dates || [],
      });

      // Set selected dates if available
      if (siteData.booking_setting.selected_dates) {
        setSelectedDates(siteData.booking_setting.selected_dates);
      }
    }
  }, [siteData, isEditMode, reset]);

  const ownerBlock = watch("ownerBlock");

  // Update form value when selectedDates changes
  useEffect(() => {
    setValue("selectedDates", selectedDates);
  }, [selectedDates, setValue]);

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

  // Handle date selection for range
  const handleDateClick = (date: Date) => {
    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      setDateError("Cannot select dates in the past");
      setTimeout(() => setDateError(""), 3000);
      return;
    }

    // Clear any previous errors
    setDateError("");

    // Create date string in local timezone to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    if (!dateRange.from) {
      // First date selection - set as from date
      setDateRange({ from: dateString, to: null });
      setSelectedDates([dateString]);
    } else if (!dateRange.to) {
      // Second date selection - set as to date
      const fromDate = new Date(dateRange.from + "T00:00:00");
      const toDate = new Date(dateString + "T00:00:00");

      if (toDate < fromDate) {
        // If to date is before from date, show error and don't update

        setDateError("End date cannot be before start date");
        setTimeout(() => setDateError(""), 3000);
        return;
      } else {
        setDateRange({ from: dateRange.from, to: dateString });
        setSelectedDates(generateDateRange(dateRange.from, dateString));
      }
    } else {
      // Reset selection
      setDateRange({ from: dateString, to: null });
      setSelectedDates([dateString]);
    }
  };

  // Generate date range between two dates
  const generateDateRange = (fromDate: string, toDate: string) => {
    const dates = [];
    const current = new Date(fromDate + "T00:00:00");
    const end = new Date(toDate + "T00:00:00");

    while (current <= end) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, "0");
      const day = String(current.getDate()).padStart(2, "0");
      dates.push(`${year}-${month}-${day}`);
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  // Check if date is selected
  const isDateSelected = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;
    return selectedDates.includes(dateString);
  };

  // Check if date is in range
  const isDateInRange = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    if (!dateRange.from || !dateRange.to) return false;

    const currentDate = new Date(dateString + "T00:00:00");
    const fromDate = new Date(dateRange.from + "T00:00:00");
    const toDate = new Date(dateRange.to + "T00:00:00");

    return currentDate >= fromDate && currentDate <= toDate;
  };

  const onSubmit = async (data: BookingSettingsFormData) => {
    try {
      // Validate date range before submission
      if (dateRange.from && dateRange.to) {
        const fromDate = new Date(dateRange.from + "T00:00:00");
        const toDate = new Date(dateRange.to + "T00:00:00");

        if (toDate < fromDate) {
          return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (fromDate < today) {
          return;
        }
      }

      const formData = new FormData();

      // Add site_id
      if (siteId) {
        formData.append("site_id", siteId);
      }

      // Add site_id for edit mode
      if (isEditMode && siteData?.id) {
        formData.append("site_id", siteData.id.toString());
      }

      // Add owner_block (mapped from ownerBlock)
      formData.append("owner_block", data.ownerBlock ? "1" : "0");

      // Add booking_type (mapped from bookingType)
      formData.append("booking_type", data.bookingType);

      // Add selected_dates if any dates are selected
      if (data.selectedDates && data.selectedDates.length > 0) {
        data.selectedDates.forEach((date) => {
          formData.append("selected_dates[]", date);
        });
      }

      const response = await apiFormDataWrapper<{
        success: boolean;
        message: string;
      }>(
        `properties/${propertyId}/sites/availability`,
        formData,
        isEditMode
          ? "Booking settings updated successfully!"
          : "Booking settings saved successfully!"
      );

      console.log("Form submitted successfully:", response);

      // Mark section as completed
      if (onSuccess) {
        onSuccess();
      }
      setDataSent(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Error handling is already done by apiFormDataWrapper
    }
  };

  const handleSaveClick = async () => {
    // Trigger form validation and submission
    const isValid = await handleSubmit(onSubmit)();
    return isValid;
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
      <div className="mt-4">
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
          <div
            className={`mb-6 max-w-[541px] mx-auto ${
              !ownerBlock ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="text-gray-500 hover:text-gray-700"
                disabled={!ownerBlock}
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
                disabled={!ownerBlock}
              >
                &gt;
              </button>
            </div>

            {/* Selected date range display */}
            {/* {dateRange.from && dateRange.to && (
              <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-blue-600 text-sm">
                Selected: {new Date(dateRange.from).toLocaleDateString()} -{" "}
                {new Date(dateRange.to).toLocaleDateString()}
              </div>
            )} */}

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
              {days.map((day, index) => {
                const isInRange = isDateInRange(day.date);
                const isStartDate =
                  dateRange.from &&
                  day.date.toDateString() ===
                    new Date(dateRange.from).toDateString();
                const isEndDate =
                  dateRange.to &&
                  day.date.toDateString() ===
                    new Date(dateRange.to).toDateString();
                const isSelected = isDateSelected(day.date);

                // Check if date is in the past
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isPastDate = day.date < today;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDateClick(day.date)}
                    disabled={!ownerBlock || isPastDate}
                    className={`
                      p-2 text-sm transition-colors
                      ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                      ${
                        isSelected
                          ? "bg-black text-white"
                          : isInRange
                          ? "bg-black text-white"
                          : "hover:bg-gray-100"
                      }
                      ${isStartDate && isInRange ? "rounded-l-full" : ""}
                      ${isEndDate && isInRange ? "rounded-r-full" : ""}
                      ${
                        !ownerBlock || isPastDate
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }
                      ${isPastDate ? "text-gray-300" : ""}
                    `}
                  >
                    {day.date.getDate()}
                  </button>
                );
              })}
            </div>
            {/* Error message display */}
            {dateError && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {dateError}
              </div>
            )}
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
                  className="accent-[#275BD3] w-4 h-4"
                  defaultChecked
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
                  className="accent-[#275BD3] w-4 h-4"
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
              type="button"
              onClick={handleSaveClick}
              disabled={isSubmitting}
              className={` w-[158px] mt-2 h-[35px] font-[500] text-[14px] text-white px-4 md:px-10 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                dataSent ? "bg-[#237AFC]" : "bg-[#BABBBC]"
              }`}
            >
              {dataSent
                ? "Saved"
                : isSubmitting
                ? "Saving..."
                : isEditMode ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitesBookingSettingsForm;
