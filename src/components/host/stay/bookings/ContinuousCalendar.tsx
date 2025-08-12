"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BookingCalanderSideSection from "./BookingCalanderSideSection";
import { apiRequest } from "@/lib/api";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

// Layout constants for stacked booking bars within a week row
const MAX_LANES = 4; // cap visible overlapping rows per week
const LANE_HEIGHT = 22; // px height per lane (bar height + spacing)

interface ContinuousCalendarProps {
  onClick?: (_day: number, _month: number, _year: number) => void;
}

type HostCalendarItem = {
  id: number;
  guest_name: string;
  property_id: number;
  property_name: string;
  site_id: number;
  site_name: string;
  status: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
};

type HostCalendarResponse = {
  data: HostCalendarItem[];
};

export const ContinuousCalendar: React.FC<ContinuousCalendarProps> = ({
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week">("week");
  const [bookings, setBookings] = useState<HostCalendarItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const monthOptions = useMemo(
    () => monthNames.map((m, i) => ({ name: m, value: String(i) })),
    []
  );
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());

  const startOfMonth = useMemo(
    () => new Date(current.getFullYear(), current.getMonth(), 1),
    [current]
  );
  const endOfMonth = useMemo(
    () => new Date(current.getFullYear(), current.getMonth() + 1, 0),
    [current]
  );

  // Calendar grid start and end (to fill leading/trailing days of weeks)
  const gridStart = useMemo(() => {
    const d = new Date(startOfMonth);
    const dow = d.getDay();
    d.setDate(d.getDate() - dow);
    return d;
  }, [startOfMonth]);
  const gridEnd = useMemo(() => {
    const d = new Date(endOfMonth);
    const dow = d.getDay();
    d.setDate(d.getDate() + (6 - dow));
    return d;
  }, [endOfMonth]);

  const weeks: Date[][] = useMemo(() => {
    const days: Date[] = [];
    const d = new Date(gridStart);
    while (d <= gridEnd) {
      days.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    const result: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [gridStart, gridEnd]);

  const formatDate = (dt: Date) => dt.toISOString().slice(0, 10);

  const dateKey = (dt: Date) => formatDate(dt);

  const scrollToDate = (dt: Date) => {
    const key = dateKey(dt);
    const el = containerRef.current?.querySelector<HTMLDivElement>(
      `[data-date="${key}"]`
    );
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Expand range a bit to include cross-month bookings like in the screenshot
      const start = new Date(gridStart);
      start.setDate(start.getDate() - 3);
      const end = new Date(gridEnd);
      end.setDate(end.getDate() + 3);

      const endpoint = `host/calendar?start_date=${formatDate(
        start
      )}&end_date=${formatDate(end)}`;
      const resp = await apiRequest<HostCalendarResponse>(endpoint, {
        method: "GET",
      });
      setBookings(resp?.data || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load calendar");
    } finally {
      setLoading(false);
    }
  }, [gridStart, gridEnd]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // On mount, scroll to today's date so it is visible
  useEffect(() => {
    const id = window.setTimeout(() => scrollToDate(new Date()), 80);
    return () => window.clearTimeout(id);
  }, []);

  const handlePrev = () =>
    setCurrent((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const handleNext = () =>
    setCurrent((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const handleTodayClick = () => {
    const t = new Date();
    setCurrent(t);
    requestAnimationFrame(() => scrollToDate(t));
  };

  const handleDayClick = (date: Date) => {
    if (!onClick) return;
    onClick(date.getDate(), date.getMonth(), date.getFullYear());
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  // Compute booking bars per week with stacking and label-at-start behavior
  const bookingBarsPerWeek = useMemo(() => {
    const isSameDate = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    type Bar = {
      leftPct: number;
      widthPct: number;
      label: string;
      lane: number;
      showLabel: boolean;
      color: string;
    };

    type WeekBars = { bars: Bar[]; laneCount: number; extras: number };

    const ranges = bookings.map((b) => ({
      ...b,
      start: new Date(b.start_date + "T00:00:00"),
      end: new Date(b.end_date + "T00:00:00"),
    }));

    const result: WeekBars[] = weeks.map((week, weekIndex) => {
      const weekStart = week[0];
      const weekEnd = week[6];

      // Build raw segments first
      const segments = ranges
        .map((r) => {
          const segStart = new Date(
            Math.max(weekStart.getTime(), r.start.getTime())
          );
          const segEnd = new Date(Math.min(weekEnd.getTime(), r.end.getTime()));
          if (segStart > segEnd) return null;
          const startDow = segStart.getDay();
          const endDow = segEnd.getDay();
          const days =
            Math.floor(
              (segEnd.getTime() - segStart.getTime()) / (1000 * 60 * 60 * 24)
            ) + 1;
          const leftPct = (startDow / 7) * 100;
          const widthPct = (days / 7) * 100;
          const status = (r.status || "").toLowerCase();
          const color = "#1164E1"; // keep solid blue per design
          return {
            leftPct,
            widthPct,
            startDow,
            endDow,
            label: `${r.guest_name || "Guest"}`,
            showLabel: isSameDate(segStart, r.start),
            color,
          };
        })
        .filter(Boolean) as Array<{
        leftPct: number;
        widthPct: number;
        startDow: number;
        endDow: number;
        label: string;
        showLabel: boolean;
        color: string;
      }>;

      // Sort by start then by longer first for better packing
      segments.sort((a, b) =>
        a.startDow === b.startDow
          ? b.endDow - a.endDow
          : a.startDow - b.startDow
      );

      const laneEnds: number[] = []; // endDow per lane
      const bars: Bar[] = [];

      segments.forEach((s) => {
        let lane = 0;
        while (lane < laneEnds.length && s.startDow <= laneEnds[lane]) {
          lane += 1;
        }
        laneEnds[lane] = s.endDow;
        bars.push({
          leftPct: s.leftPct,
          widthPct: s.widthPct,
          label: s.label,
          lane,
          showLabel: s.showLabel,
          color: s.color,
        });
      });

      const laneCount = Math.max(1, laneEnds.length);
      const laneCap = expandedWeeks.has(weekIndex)
        ? Math.max(laneCount, MAX_LANES)
        : MAX_LANES;
      const extras = bars.filter((b) => b.lane >= laneCap).length;
      // Return visible bars only; extras are summarized
      return {
        bars: bars.filter((b) => b.lane < laneCap),
        laneCount: Math.min(laneCount, laneCap),
        extras,
      };
    });

    return result;
  }, [bookings, weeks, expandedWeeks]);

  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-1">
        <div className="lg:col-span-3 py-4 px-2">
          <BookingCalanderSideSection />
        </div>

        <div className="w-full px-5 sm:px-8 lg:col-span-9 bg-white">
          {/* Header */}
          <div className="sticky top-0 z-30 w-full rounded-t-2xl bg-white px-2 sm:px-4 pt-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-md border border-[#D9D9D9] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setView("month")}
                    className={`px-3 py-1.5 text-xs sm:text-sm ${
                      view === "month"
                        ? "bg-white font-semibold"
                        : "bg-[#F4F4F4]"
                    }`}
                  >
                    Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("week")}
                    className={`px-3 py-1.5 text-xs sm:text-sm ${
                      view === "week"
                        ? "bg-black text-white font-semibold"
                        : "bg-[#F4F4F4]"
                    }`}
                  >
                    Week
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="rounded-md p-2 hover:bg-gray-100"
                  aria-label="Previous Month"
                >
                  <svg className="size-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="m15 19-7-7 7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div className="min-w-28 text-center text-sm font-semibold">
                  {monthNames[current.getMonth()]} {current.getFullYear()}
                </div>
                <button
                  onClick={handleNext}
                  className="rounded-md p-2 hover:bg-gray-100"
                  aria-label="Next Month"
                >
                  <svg className="size-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="m9 5 7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleTodayClick}
                  className="ml-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium hover:bg-gray-100"
                >
                  Today
                </button>
                <div className="hidden sm:block ml-2">
                  <Select
                    name="month"
                    value={String(current.getMonth())}
                    options={monthOptions}
                    onChange={(e) => {
                      const m = Number(e.target.value);
                      const next = new Date(current.getFullYear(), m, 1);
                      setCurrent(next);
                      requestAnimationFrame(() => scrollToDate(next));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Days header */}
          <div className="grid grid-cols-7 border-b border-slate-200 text-center font-bold text-[12px] sm:text-[14px]">
            {daysOfWeek.map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Month grid */}
          <div
            ref={containerRef}
            className="w-full max-h[600px] lg:max-h-[600px] overflow-y-auto calendar-container"
          >
            {weeks.map((week, weekIdx) => {
              return (
                <div key={`w-${weekIdx}`} className="relative">
                  <div className="grid grid-cols-7">
                    {week.map((date, idx) => {
                      const isCurrentMonth =
                        date.getMonth() === current.getMonth();
                      const isToday = isSameDay(date, new Date());
                      const showMonthLabel = idx === 0 && date.getDate() <= 7; // start-of-month label
                      return (
                        <div
                          key={date.toISOString()}
                          onClick={() => handleDayClick(date)}
                          data-date={formatDate(date)}
                          className={`relative aspect-square border border-[#E5E7EB] p-2 cursor-pointer ${
                            isCurrentMonth
                              ? "bg-white"
                              : "bg-[#FAFAFA] text-[#B8B8B8]"
                          }`}
                        >
                          <div className="flex items-baseline justify-between">
                            <span className="text-[10px] font-semibold text-[#6B7280]">
                              {showMonthLabel
                                ? monthNames[date.getMonth()].slice(0, 3)
                                : ""}
                            </span>
                            <span
                              className={`inline-flex items-center justify-center rounded-full size-6 text-xs ${
                                isToday
                                  ? "bg-[#1164E1] text-white"
                                  : "text-[#6B7280]"
                              }`}
                            >
                              {date.getDate()}
                            </span>
                          </div>
                          {/* Optional placeholder for rates */}
                          <div className="absolute bottom-1 left-1 text-[11px] font-semibold text-black opacity-70">
                            {/* Example: show $ if in current month to match mock UI */}
                            {isCurrentMonth ? "$55" : ""}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Booking bars for this week (stacked) */}
                  <div
                    className="pointer-events-none absolute left-0 right-0 bottom-2"
                    style={{
                      height: `${
                        (bookingBarsPerWeek[weekIdx]?.laneCount || 1) *
                        LANE_HEIGHT
                      }px`,
                    }}
                  >
                    {bookingBarsPerWeek[weekIdx]?.bars.map((bar, i) => (
                      <div
                        key={`bar-${i}`}
                        className="absolute h-6 rounded-full text-white flex items-center pl-2 pr-3 text-[11px]"
                        style={{
                          left: `${bar.leftPct}%`,
                          width: `${bar.widthPct}%`,
                          top: `${bar.lane * LANE_HEIGHT}px`,
                          backgroundColor: bar.color,
                        }}
                        title={bar.label}
                      >
                        {bar.showLabel && (
                          <>
                            <span className="mr-2 inline-flex items-center justify-center rounded-full bg-white/25 text-white size-4">
                              <svg
                                viewBox="0 0 24 24"
                                className="size-3"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-3.866 0-7 3.134-7 7h2a5 5 0 0 1 10 0h2c0-3.866-3.134-7-7-7Z" />
                              </svg>
                            </span>
                            <span className="truncate">{bar.label}</span>
                          </>
                        )}
                      </div>
                    ))}
                    {bookingBarsPerWeek[weekIdx]?.extras &&
                      bookingBarsPerWeek[weekIdx]!.extras > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedWeeks((prev) => {
                              const n = new Set(prev);
                              if (n.has(weekIdx)) n.delete(weekIdx);
                              else n.add(weekIdx);
                              return n;
                            })
                          }
                          className="absolute right-1 text-[10px] font-semibold text-[#1f2937] bg-white rounded px-1 py-0.5 shadow pointer-events-auto"
                          style={{
                            top: `${
                              (bookingBarsPerWeek[weekIdx]!.laneCount - 1) *
                              LANE_HEIGHT
                            }px`,
                          }}
                        >
                          +{bookingBarsPerWeek[weekIdx]!.extras} more
                        </button>
                      )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer actions */}
          <div className="flex gap-3 py-3">
            <button className="rounded-md border border-gray-300 px-3 py-1.5 text-xs sm:text-sm">
              Booking
            </button>
            <button className="rounded-md border border-gray-300 px-3 py-1.5 text-xs sm:text-sm">
              Pending
            </button>
            <button className="rounded-md bg-[#1164E1] text-white px-3 py-1.5 text-xs sm:text-sm">
              Evolve/Owner
            </button>
          </div>

          {loading && (
            <div className="py-2 text-sm text-gray-500">Loading calendar…</div>
          )}
          {error && <div className="py-2 text-sm text-red-500">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export interface SelectProps {
  name: string;
  value: string;
  label?: string;
  options: { name: string; value: string }[];
  onChange: (_event: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

export const Select = ({
  name,
  value,
  label,
  options = [],
  onChange,
  className,
}: SelectProps) => (
  <div className={`relative ${className}`}>
    {label && (
      <label htmlFor={name} className="mb-2 block font-medium text-slate-800">
        {label}
      </label>
    )}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="cursor-pointer rounded-lg border border-gray-300 bg-white py-1.5 pl-2 pr-6 text-sm font-medium text-gray-900 hover:bg-gray-100 sm:rounded-xl sm:py-2.5 sm:pl-3 sm:pr-8 appearance-none"
      required
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-1 sm:pr-2">
      <svg
        className="size-5 text-slate-600"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  </div>
);
