import React from "react";
import UnifiedDateRangePicker from "./UnifiedDateRangePicker";
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
  return (
    <UnifiedDateRangePicker
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={onStartDateChange}
      onEndDateChange={onEndDateChange}
      startDateError={startDateError}
      endDateError={endDateError}
      startLabel={startLabel}
      endLabel={endLabel}
    />
  );
}
