import React, { useState, useRef, useEffect } from "react";

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="13"
    fill="none"
    viewBox="0 0 16 13"
  >
    <path
      fill="#000"
      fillRule="evenodd"
      d="M4.72 0c.162 0 .294.138.294.307v.461H7.57v-.46c0-.17.132-.308.295-.308s.295.138.295.307v.461h2.556v-.46c0-.17.132-.308.295-.308s.295.138.295.307v.461h1.672c1.52 0 2.752 1.284 2.752 2.868V8.25c0 .706-.25 1.387-.702 1.913l-1.623 1.888a2.7 2.7 0 0 1-2.05.954H2.752C1.233 13.006 0 11.723 0 10.14V3.636C0 2.052 1.232.768 2.753.768h1.671v-.46c0-.17.132-.308.295-.308m-.296 1.946v-.563H2.753C1.558 1.383.59 2.39.59 3.636v6.503c0 1.244.968 2.253 2.163 2.253h8.601q.075 0 .149-.006V9.32c0-.395.308-.716.688-.716h2.923q.026-.174.026-.352V3.636c0-1.245-.968-2.253-2.163-2.253h-1.67v.563c0 .17-.133.307-.296.307a.3.3 0 0 1-.295-.307v-.563H8.16v.563c0 .17-.132.307-.295.307a.3.3 0 0 1-.295-.307v-.563H5.014v.563c0 .17-.132.307-.295.307a.3.3 0 0 1-.295-.307m7.669 10.31c.331-.125.632-.335.873-.614l1.623-1.888q.21-.245.343-.537H12.19a.1.1 0 0 0-.098.102zm-8.16-7.801h.786v.82h-.786zm2.36 0h.786v.82h-.787zm3.145 0h-.786v.82h.786zm1.573 0h.787v.82h-.787zM4.72 6.913h-.786v.819h.786zm1.573 0h.787v.819h-.787zm3.146 0h-.786v.819h.786zM3.933 9.37h.786v.819h-.786zm3.146 0h-.787v.819h.787zm1.573 0h.786v.819h-.786z"
      clipRule="evenodd"
    ></path>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="15,18 9,12 15,6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="9,18 15,12 9,6"></polyline>
  </svg>
);

interface UnifiedDateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  startDateError?: string;
  endDateError?: string;
  startLabel?: string;
  endLabel?: string;
}

export default function UnifiedDateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startDateError,
  endDateError,
  startLabel = "Start date",
  endLabel = "End date",
}: UnifiedDateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState<"dates" | "flexible">(
    "dates"
  );
  const [leftCalendarDate, setLeftCalendarDate] = useState(new Date());
  const [rightCalendarDate, setRightCalendarDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [activeInput, setActiveInput] = useState<"start" | "end" | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
    "bottom"
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize dates from props
  useEffect(() => {
    if (startDate) {
      const date = new Date(startDate);
      if (!isNaN(date.getTime())) {
        setSelectedStartDate(date);
        setLeftCalendarDate(date);
      }
    }
    if (endDate) {
      const date = new Date(endDate);
      if (!isNaN(date.getTime())) {
        setSelectedEndDate(date);
        setRightCalendarDate(date);
      }
    }
  }, [startDate, endDate]);

  // Calculate dropdown position
  const calculateDropdownPosition = () => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const dropdownHeight = 400; // Approximate height of dropdown
    const dropdownWidth = 600; // Approximate width of dropdown

    // Check if there's enough space below
    const spaceBelow = viewportHeight - containerRect.bottom;
    const spaceAbove = containerRect.top;

    // Check horizontal positioning
    const spaceRight = viewportWidth - containerRect.left;
    const spaceLeft = containerRect.right;

    if (spaceBelow >= dropdownHeight || spaceBelow > spaceAbove) {
      setDropdownPosition("bottom");
    } else {
      setDropdownPosition("top");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
        setActiveInput(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      calculateDropdownPosition();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Calculate duration
  const getDuration = () => {
    if (!selectedStartDate || !selectedEndDate) return "";
    const diffTime = Math.abs(
      selectedEndDate.getTime() - selectedStartDate.getTime()
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  };

  const handleInputClick = (inputType: "start" | "end") => {
    setActiveInput(inputType);
    setIsOpen(true);

    // Set calendar focus based on which input was clicked
    if (inputType === "start" && selectedStartDate) {
      setLeftCalendarDate(selectedStartDate);
    } else if (inputType === "end" && selectedEndDate) {
      setRightCalendarDate(selectedEndDate);
    }
  };

  const handleDateSelect = (date: Date, calendar: "left" | "right") => {
    if (calendar === "left") {
      setSelectedStartDate(date);
      setLeftCalendarDate(date);
      const formattedDate = formatDateForInput(date);
      onStartDateChange(formattedDate);

      // If end date is before start date, clear end date
      if (selectedEndDate && date > selectedEndDate) {
        setSelectedEndDate(null);
        onEndDateChange("");
      }
    } else {
      // Only allow selecting end date if it's after start date
      if (!selectedStartDate || date >= selectedStartDate) {
        setSelectedEndDate(date);
        setRightCalendarDate(date);
        const formattedDate = formatDateForInput(date);
        onEndDateChange(formattedDate);
      }
    }
  };

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateForDisplay = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getCalendarDays = (date: Date) => {
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }

    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date, type: "start" | "end") => {
    if (type === "start") {
      return (
        selectedStartDate &&
        date.toDateString() === selectedStartDate.toDateString()
      );
    } else {
      return (
        selectedEndDate &&
        date.toDateString() === selectedEndDate.toDateString()
      );
    }
  };

  const isInRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const isCurrentMonth = (date: Date, calendarDate: Date) => {
    return date.getMonth() === calendarDate.getMonth();
  };

  const isDisabled = (date: Date, calendar: "left" | "right") => {
    if (calendar === "right") {
      // In right calendar, disable dates before start date
      return !!(selectedStartDate && date < selectedStartDate);
    }
    return false;
  };

  const navigateMonth = (
    direction: "prev" | "next",
    calendar: "left" | "right"
  ) => {
    if (calendar === "left") {
      setLeftCalendarDate((prev) => {
        const newDate = new Date(prev);
        if (direction === "prev") {
          newDate.setMonth(newDate.getMonth() - 1);
        } else {
          newDate.setMonth(newDate.getMonth() + 1);
        }
        return newDate;
      });
    } else {
      setRightCalendarDate((prev) => {
        const newDate = new Date(prev);
        if (direction === "prev") {
          newDate.setMonth(newDate.getMonth() - 1);
        } else {
          newDate.setMonth(newDate.getMonth() + 1);
        }
        return newDate;
      });
    }
  };

  const leftCalendarDays = getCalendarDays(leftCalendarDate);
  const rightCalendarDays = getCalendarDays(rightCalendarDate);

  // Format values for display
  const startDisplayValue =
    startDate && startDate.length === 10 ? startDate : "";
  const endDisplayValue = endDate && endDate.length === 10 ? endDate : "";

  return (
    <div className="flex flex-col gap-1 w-full relative" ref={containerRef}>
      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-black translate-y-3.5 translate-x-4 bg-white w-fit px-1">
              {startLabel}
            </label>
            <input
              ref={startInputRef}
              type="text"
              className="rounded-lg border border-[#848484] px-5 py-2.5 text-[12px] placeholder:text-[#AFACAC] focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none"
              value={startDisplayValue}
              readOnly
              onClick={() => handleInputClick("start")}
              placeholder=" "
            />
            <button
              type="button"
              className="absolute right-3 top-9 p-0 m-0 bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => handleInputClick("start")}
            >
              <CalendarIcon />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-black translate-y-3.5 translate-x-4 bg-white w-fit px-1">
              {endLabel}
            </label>
            <input
              ref={endInputRef}
              type="text"
              className="rounded-lg border border-[#848484] px-5 py-2.5 text-[12px] placeholder:text-[#AFACAC] focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none"
              value={endDisplayValue}
              readOnly
              onClick={() => handleInputClick("end")}
              placeholder=" "
            />
            <button
              type="button"
              className="absolute right-3 top-9 p-0 m-0 bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => handleInputClick("end")}
            >
              <CalendarIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {(startDateError || endDateError) && (
        <div className="flex gap-2">
          {startDateError && (
            <span className="text-xs text-red-500">{startDateError}</span>
          )}
          {endDateError && (
            <span className="text-xs text-red-500">{endDateError}</span>
          )}
        </div>
      )}

      {/* Unified Date Range Picker Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-full  lg:max-w-[90vw] ${
            dropdownPosition === "bottom" ? "top-full mt-1" : "bottom-full mb-1"
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">When</h3>
            {getDuration() && (
              <p className="text-sm text-gray-600">{getDuration()}</p>
            )}

            {/* Toggle Buttons */}
            <div className="flex gap-2 mt-3 justify-center items-center">
              <button
                onClick={() => setSelectionMode("dates")}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  selectionMode === "dates"
                    ? "bg-gray-200 text-gray-900"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Dates
              </button>
              <button
                onClick={() => setSelectionMode("flexible")}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  selectionMode === "flexible"
                    ? "bg-gray-200 text-gray-900"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Flexible
              </button>
            </div>
          </div>

          {/* Calendars */}
          <div className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Left Calendar */}
              <div className="flex-1 max-w-[250px] mx-auto">
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => navigateMonth("prev", "left")}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronLeftIcon />
                  </button>
                  <h4 className="text-sm font-semibold text-gray-900">
                    {formatDateForDisplay(leftCalendarDate)}
                  </h4>
                  <button
                    onClick={() => navigateMonth("next", "left")}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronRightIcon />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="text-xs text-gray-500 text-center py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1 ">
                  {leftCalendarDays.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => day && handleDateSelect(day, "left")}
                      disabled={!day || !isCurrentMonth(day, leftCalendarDate)}
                      className={`
                        w-7 h-7 text-xs rounded-full flex items-center justify-center transition-colors
                        ${
                          !day || !isCurrentMonth(day, leftCalendarDate)
                            ? "text-gray-300 cursor-default"
                            : "hover:bg-blue-50 cursor-pointer"
                        }
                        ${
                          day && isToday(day)
                            ? "bg-blue-100 text-blue-600 font-semibold"
                            : ""
                        }
                        ${
                          day && isSelected(day, "start")
                            ? "bg-blue-600 text-white font-semibold hover:bg-blue-700"
                            : ""
                        }
                        ${
                          day &&
                          isInRange(day) &&
                          !isSelected(day, "start") &&
                          !isSelected(day, "end")
                            ? "bg-blue-100 text-blue-600"
                            : ""
                        }
                        ${
                          day &&
                          isCurrentMonth(day, leftCalendarDate) &&
                          !isToday(day) &&
                          !isSelected(day, "start") &&
                          !isInRange(day)
                            ? "text-gray-700"
                            : ""
                        }
                      `}
                    >
                      {day ? day.getDate() : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Calendar */}
              <div className="flex-1 max-w-[250px] mx-auto">
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => navigateMonth("prev", "right")}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronLeftIcon />
                  </button>
                  <h4 className="text-sm font-semibold text-gray-900">
                    {formatDateForDisplay(rightCalendarDate)}
                  </h4>
                  <button
                    onClick={() => navigateMonth("next", "right")}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronRightIcon />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="text-xs text-gray-500 text-center py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {rightCalendarDays.map((day, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        day &&
                        !isDisabled(day, "right") &&
                        handleDateSelect(day, "right")
                      }
                      disabled={
                        day === null ||
                        (day
                          ? !isCurrentMonth(day, rightCalendarDate)
                          : false) ||
                        (day ? isDisabled(day, "right") : false)
                      }
                      className={`
                        w-8 h-8 text-xs rounded-full flex items-center justify-center transition-colors
                        ${
                          !day ||
                          !isCurrentMonth(day, rightCalendarDate) ||
                          isDisabled(day, "right")
                            ? "text-gray-300 cursor-default"
                            : "hover:bg-blue-50 cursor-pointer"
                        }
                        ${
                          day && isToday(day)
                            ? "bg-blue-100 text-blue-600 font-semibold"
                            : ""
                        }
                        ${
                          day && isSelected(day, "end")
                            ? "bg-blue-600 text-white font-semibold hover:bg-blue-700"
                            : ""
                        }
                        ${
                          day &&
                          isInRange(day) &&
                          !isSelected(day, "start") &&
                          !isSelected(day, "end")
                            ? "bg-blue-100 text-blue-600"
                            : ""
                        }
                        ${
                          day &&
                          isCurrentMonth(day, rightCalendarDate) &&
                          !isToday(day) &&
                          !isSelected(day, "end") &&
                          !isInRange(day) &&
                          !isDisabled(day, "right")
                            ? "text-gray-700"
                            : ""
                        }
                      `}
                    >
                      {day ? day.getDate() : ""}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
