import React, { useRef, useState, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";

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

interface GlobalDateInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const GlobalDateInput: React.FC<GlobalDateInputProps> = ({
  label,
  error,
  value,
  onChange,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [calendarPosition, setCalendarPosition] = useState<"bottom" | "top">(
    "bottom"
  );

  // Set current date only on client side to avoid hydration mismatch
  useEffect(() => {
    setCurrentDate(new Date());
  }, []);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Initialize current date and selected date from value
  useEffect(() => {
    if (value) {
      const date = new Date(value as string);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        // Only set currentDate to the selected date on initial load
        // This prevents overwriting the current month view when a date is selected
        if (!isInitializedRef.current) {
          setCurrentDate(date);
          isInitializedRef.current = true;
        }
      }
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  // Close calendar when clicking outside and handle window resize
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        calendarRef.current &&
        !calendarRef.current.contains(target) &&
        inputRef.current &&
        !inputRef.current.contains(target)
      ) {
        setIsCalendarOpen(false);
      }
    };

    const handleWindowResize = () => {
      if (isCalendarOpen && inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const calendarHeight = 320;

        if (spaceBelow < calendarHeight && spaceAbove > spaceBelow) {
          setCalendarPosition("top");
        } else {
          setCalendarPosition("bottom");
        }
      }
    };

    if (isCalendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", handleWindowResize);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [isCalendarOpen]);

  const handleIconClick = () => {
    if (!isCalendarOpen) {
      // Calculate position when opening calendar
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const calendarHeight = 320; // Approximate calendar height

        if (spaceBelow < calendarHeight && spaceAbove > spaceBelow) {
          setCalendarPosition("top");
        } else {
          setCalendarPosition("bottom");
        }
      }
    }
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Remove this line to prevent changing the calendar view when selecting a date
    // setCurrentDate(date);

    // Format date for input value (YYYY-MM-DD)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // Call the onChange handler if provided
    if (onChange) {
      const event = {
        target: { value: formattedDate },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }

    setIsCalendarOpen(false);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getCalendarDays = () => {
    if (!currentDate) return [];

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    return days;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return currentDate && date.getMonth() === currentDate.getMonth();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      if (!prev) return new Date();
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const calendarDays = getCalendarDays();

  // Format value for display
  const stringValue = typeof value === "string" ? value : "";
  const displayValue = stringValue.length === 10 ? stringValue : "";

  return (
    <div className="flex flex-col gap-1 w-full relative">
      {label && (
        <label className="text-[12px] font-medium text-black z-10 translate-y-3.5 translate-x-4 bg-white w-fit px-1">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          className="w-full border h-[40px] rounded-lg pl-4 pr-10 py-2.5 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-200 border-[#848484] cursor-pointer"
          value={displayValue}
          readOnly
          onClick={handleIconClick}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0 m-0 bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
          onClick={handleIconClick}
          aria-label="Open calendar"
        >
          <CalendarIcon />
        </button>

        {/* Calendar Popup */}
        {isCalendarOpen && currentDate && (
          <div
            ref={calendarRef}
            className={`absolute left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-[280px] h-auto
    ${calendarPosition === "bottom" ? "top-full mt-1" : "bottom-full mb-1"}`}
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaAngleLeft className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-semibold text-gray-900">
                {currentDate ? formatDate(currentDate) : ""}
              </h3>
              <button
                onClick={() => navigateMonth("next")}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaAngleRight className="w-4 h-4" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-xs text-gray-500 text-center py-1"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => day && handleDateSelect(day)}
                    disabled={!day || !isCurrentMonth(day)}
                    className={`
            w-8 h-8 text-xs rounded-full flex items-center justify-center transition-colors
            ${
              !day || !isCurrentMonth(day)
                ? "text-gray-300 cursor-default"
                : "hover:bg-blue-50 cursor-pointer"
            }
            ${
              day && isToday(day)
                ? "bg-blue-100 text-blue-600 font-semibold"
                : ""
            }
            ${
              day && isSelected(day)
                ? "bg-blue-600 text-white font-semibold hover:bg-blue-700"
                : ""
            }
            ${
              day && isCurrentMonth(day) && !isToday(day) && !isSelected(day)
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

            {/* Today button */}
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={() => handleDateSelect(new Date())}
                className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium py-1 rounded transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default GlobalDateInput;
