import React from "react";
import GlobalDateInput from "@/components/global/GlobalDateInput";
import { DateRangeSelectorProps } from "./types";

export default function DateRangeSelector({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startDateError,
  endDateError,
  startLabel = "Start Date",
  endLabel = "End Date",
}: DateRangeSelectorProps) {
  const validateDateRange = (start: string, end: string) => {
    if (!start || !end) return true; // Individual date validation will handle required dates

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    return endDateObj >= startDateObj;
  };

  const handleStartDateChange = (date: string) => {
    onStartDateChange(date);

    // If end date exists and would be invalid with new start date, clear end date error
    if (endDate && validateDateRange(date, endDate)) {
      // This will be handled by parent validation
    }
  };

  const handleEndDateChange = (date: string) => {
    onEndDateChange(date);

    // If start date exists and would be invalid with new end date, handle error
    if (startDate && !validateDateRange(startDate, date)) {
      // This will be handled by parent validation
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <GlobalDateInput
        label={startLabel}
        value={startDate}
        onChange={(e) => handleStartDateChange(e.target.value)}
        error={startDateError}
      />
      <GlobalDateInput
        label={endLabel}
        value={endDate}
        onChange={(e) => handleEndDateChange(e.target.value)}
        error={endDateError}
        min={startDate} // Set minimum date to start date
      />
    </div>
  );
}
