"use client";

import { useEffect, useRef, useState } from "react";
import Explore from "@/components/explore/Explore";
import ExploreMap, { InteractiveMapRef } from "@/components/explore/ExploreMap";
import ExploreHotels from "@/components/explore/ExploreHotels";
import NewJourneyExplore from "@/components/explore/NewJourneyExplore";
import JourneySidebar from "@/components/explore/JourneySidebar";
import StepDetailsPanel from "@/components/explore/StepDetailsPanel";
import { Step } from "@/components/dashboard/modals/components/newjourney/types";
import ExploreJourneyList from "@/components/explore/ExploreJourneyList";
import StopModal from "@/components/explore/StopModal";
import DayStopsModal from "@/components/explore/components/DayStopsModal";
import { apiRequest } from "@/lib/api";

/** === API & Local Types === */
type ApiJourney = {
  id: number;
  title?: string;
  start_location_name?: string;
  start_lat?: string | number | null;
  start_lng?: string | number | null;
  end_location_name?: string;
  end_lat?: string | number | null;
  end_lng?: string | number | null;
  start_date?: string; // "YYYY-MM-DD"
  end_date?: string; // "YYYY-MM-DD"
  budget?: string | number;
  travelers?: string;
  user?: any;
  stops?: ApiJourneyStop[];
};

type ApiJourneyStop = {
  date: string;
  id: number;
  title?: string;
  location_name?: string;
  lat?: string | number;
  lng?: string | number;
  notes?: string;
  transport_mode?: string;
  start_date?: string;
  end_date?: string;
  stop_category_id?: string | number;
  category?: {
    id: number;
    name: string;
  };
  media?: Array<{
    url: string;
    type: string;
  }>;
};

type JourneyDay = {
  id?: number;
  dayNumber: number;
  date: string | Date;
  steps: Step[];
  isOpen?: boolean;
};

type JourneyData = {
  id: number;
  journeyName: string;
  startingPoint: string;
  endPoint: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  who: string;
  budget: string;
  days: JourneyDay[];
};

/** === Helpers === */
const toISODate = (d?: string | Date): string => {
  const date = d ? new Date(d) : new Date();
  return date.toISOString().split("T")[0];
};

const toNumberOrNull = (v: unknown): number | null => {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const normalizeDays = (raw: any): JourneyDay[] => {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map((d: any, i: number) => ({
    id: d?.id ?? i + 1,
    dayNumber: d?.dayNumber ?? i + 1,
    date: d?.date ?? new Date(),
    steps: Array.isArray(d?.steps) ? d.steps : [],
    isOpen: !!d?.isOpen,
  }));
};

/** API → Local mapper */
const toJourneyDataFromApi = (j: ApiJourney): JourneyData => {
  // Transform stops into days and steps
  const transformStopsToDays = (stops: ApiJourneyStop[] = []): JourneyDay[] => {
    // If no stops, create empty days based on journey date range
    if (!stops.length) {
      const startDate = new Date(j.start_date || new Date());
      const endDate = new Date(j.end_date || new Date());
      const daysDiff =
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
        ) + 1;

      return Array.from({ length: daysDiff }, (_, i) => ({
        id: i + 1,
        dayNumber: i + 1,
        date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
        steps: [],
        isOpen: false,
      }));
    }

    // Group stops by date
    const stopsByDate = new Map<string, ApiJourneyStop[]>();

    stops.forEach((stop) => {
      const date =
        stop.start_date ||
        j.start_date ||
        new Date().toISOString().split("T")[0];
      if (!stopsByDate.has(date)) {
        stopsByDate.set(date, []);
      }
      stopsByDate.get(date)!.push(stop);
    });

    // Convert to days array
    const days: JourneyDay[] = [];
    const sortedDates = Array.from(stopsByDate.keys()).sort();

    sortedDates.forEach((date, index) => {
      const dayStops = stopsByDate.get(date) || [];
      const steps: Step[] = dayStops.map((stop) => ({
        name: stop.title || `Stop ${index + 1}`,
        location: {
          coords:
            stop.lat && stop.lng
              ? ([
                  parseFloat(String(stop.lng)),
                  parseFloat(String(stop.lat)),
                ] as [number, number])
              : null,
          name: stop.location_name || "",
        },
        notes: stop.notes || "",
        media:
          stop.media?.map((m) => ({
            url: m.url,
            type: m.type,
            file_name: "",
            fileObject: null as any,
          })) || [],
        mediumOfTravel: stop.transport_mode || "",
        startDate: stop.start_date || "",
        endDate: stop.end_date || "",
        category:
          stop.category?.name || stop.stop_category_id?.toString() || "",
        dateError: "",
      }));

      days.push({
        id: index + 1,
        dayNumber: index + 1,
        date: new Date(date),
        steps,
        isOpen: false,
      });
    });

    return days;
  };

  return {
    id: j.id,
    journeyName: j.title || "Untitled Journey",
    startingPoint: j.start_location_name || "Unknown",
    endPoint: j.end_location_name || "Unknown",
    startDate: toISODate(j.start_date),
    endDate: toISODate(j.end_date),
    who: j.travelers || "couple",
    budget: j.budget != null ? String(j.budget) : "1000",
    days: transformStopsToDays(j.stops),
  };
};

/** Base for safe merges when prev is null */
const blankJourney: JourneyData = {
  id: 0,
  journeyName: "",
  startingPoint: "",
  endPoint: "",
  startDate: "",
  endDate: "",
  who: "",
  budget: "",
  days: [],
};

const Page = () => {
  const mapRef = useRef<InteractiveMapRef>(null);

  const [activeFilter, setActiveFilter] = useState<string>("All feeds");
  const [isExplorePanelOpen, setIsExplorePanelOpen] = useState<boolean>(false);
  const [newJourney, setNewJourney] = useState<boolean>(false);
  const [isJourneySidebarOpen, setIsJourneySidebarOpen] =
    useState<boolean>(false);

  // 🔹 No mock: start empty until user picks or creates a journey
  const [journeyData, setJourneyData] = useState<JourneyData | null>(null);
  const [showJourneyList, setShowJourneyList] = useState<boolean>(false);
  const [formattedDate, setFormattedDate] = useState<string>("");

  const [selectedStep, setSelectedStep] = useState<{
    dayIndex: number;
    stepIndex: number;
  } | null>(null);

  const [isStepDetailsOpen, setIsStepDetailsOpen] = useState<boolean>(false);
  const [dayStops, setDayStops] = useState<any[]>([]);
  const [allStops, setAllStops] = useState<ApiJourneyStop[]>([]);

  /** === Handlers === */

  const handleStepSelect = (dayIndex: number, stepIndex: number) => {
    setSelectedStep({ dayIndex, stepIndex });
    setIsStepDetailsOpen(true);
  };

  // Accepts full or partial updates from children (e.g., JourneySidebar)
  const updateJourneyData = (updated: Partial<JourneyData> | JourneyData) => {
    setJourneyData((prev) => {
      const merged = { ...(prev ?? blankJourney), ...(updated as any) };
      // normalize days if provided
      if ((updated as any)?.days) {
        merged.days = normalizeDays((updated as any).days);
      }
      return merged;
    });
  };
  useEffect(() => {
    fetchJourneyData(journeyData?.id);
    console.log(dayStops, "dayStops");
    console.log(
      Array.isArray(dayStops) ? dayStops : [],
      "dayStopsssssssssssssss"
    );
  }, [journeyData?.id]);
  console.log(journeyData, "journeyData");

  const extractStops = (r: any): ApiJourneyStop[] => {
    const p = r?.data ?? r; // axios: r.data, fetch/custom: r
    if (Array.isArray(p)) return p; // payload is array
    if (Array.isArray(p?.data)) return p.data; // payload.data is array
    return [];
  };

  const fetchJourneyData = async (journeyId: number | undefined) => {
    if (!journeyId) return;

    const response = await apiRequest(`journeys/${journeyId}/stops`);
    const stops = extractStops(response);

    console.log("isArray?", Array.isArray(stops), stops); // ✅ yahan sahi array milega
    setAllStops(stops); // full list as-is

    // If modal is open, refilter the stops for the current day
    if (openDayIndex && formattedDate) {
      const targetISO = toISOyyyyMMdd(formattedDate);
      const filtered = stops.filter((s) => toISOyyyyMMdd(s.date) === targetISO);
      setDayStops(filtered);
    } else {
      setDayStops([]); // modal ke liye blank start (ya default filter lagani ho to wo)
    }

    // Also update the journey data to reflect the new stops
    if (journeyData) {
      const updatedJourneyData = {
        ...journeyData,
        stops: stops,
      };
      setJourneyData(updatedJourneyData);
    }
  };

  const handleStepDetailsClose = () => {
    setIsStepDetailsOpen(false);
    setSelectedStep(null);
  };

  // Called when a journey is clicked in SideExplore (uses your API shape)
  const handleJourneyClick = (journey: ApiJourney) => {
    console.log("Journey clicked:", journey);

    const transformed = toJourneyDataFromApi(journey);
    console.log("Transformed journey data:", transformed);

    setJourneyData(transformed);
    setIsJourneySidebarOpen(true);

    // Center map at start coordinates if present
    const lng = toNumberOrNull(journey.start_lng);
    const lat = toNumberOrNull(journey.start_lat);
    if (lng != null && lat != null) {
      mapRef.current?.centerMap(
        lng,
        lat,
        journey.start_location_name || "Start"
      );
    }
  };
  const [isAddingStop, setIsAddingStop] = useState<boolean>(false);
  const [addStopForDay, setAddStopForDay] = useState<number | null>(null);
  const [dayNumber, setDayNumber] = useState<number | null>(null);
  const handleAddStop = (
    dayIndex: number,
    formattedDate: string,
    dayNumber: number
  ) => {
    debugger;
    setFormattedDate(formattedDate);
    setDayNumber(dayNumber);
    setAddStopForDay(dayIndex);
    setIsAddingStop(true);
  };
  const [openDayIndex, setOpenDayIndex] = useState<boolean>(false);
  const [openDayNumber, setOpenDayNumber] = useState<number | null>(null);
  const [modalDayNumber, setModalDayNumber] = useState<number | null>(null);
  // Put this near your helpers
  const toISOyyyyMMdd = (d: string | Date): string => {
    if (d instanceof Date) return d.toISOString().slice(0, 10);

    // If already ISO (YYYY-MM-DD), keep it
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;

    // If MM/DD/YYYY -> convert to YYYY-MM-DD
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
      const [mm, dd, yyyy] = d.split("/");
      return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }

    // Fallback: parse and format
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? "" : dt.toISOString().slice(0, 10);
  };

  const handleViewDayStops = async (
    formattedDate: string,
    maybeDayNumber?: number
  ) => {
    console.log("handleViewDayStops called with formattedDate:", formattedDate);
    setOpenDayIndex(true);
    setFormattedDate(formattedDate); // Set the formattedDate state

    // Normalize date once
    const targetISO = toISOyyyyMMdd(formattedDate);
    console.log("targetISO:", targetISO);

    // Prefer the one passed in; otherwise compute from journeyData.days
    const computed =
      maybeDayNumber ??
      (() => {
        const idx = journeyData?.days?.findIndex(
          (d) => toISOyyyyMMdd(d.date as any) === targetISO
        );
        return idx != null && idx >= 0 ? idx + 1 : null;
      })();

    setModalDayNumber(computed); // <-- use this for the modal
    setOpenDayNumber(computed); // (optional: if you still want this)

    // Fetch fresh data and filter immediately
    if (journeyData?.id) {
      try {
        const response = await apiRequest(`journeys/${journeyData.id}/stops`);
        const stops = extractStops(response);
        console.log("Fetched stops:", stops.length);

        // Filter stops for the current date
        const filtered = stops.filter(
          (s) => toISOyyyyMMdd(s.date) === targetISO
        );
        console.log(
          "Filtered stops for date:",
          targetISO,
          "count:",
          filtered.length
        );
        setDayStops(filtered);

        // Also update allStops for consistency
        setAllStops(stops);
      } catch (error) {
        console.error("Failed to fetch stops:", error);
        setDayStops([]);
      }
    } else {
      // Fallback to existing allStops if no journeyId
      const filtered = allStops.filter(
        (s) => toISOyyyyMMdd(s.date) === targetISO
      );
      console.log(
        "Filtered stops for date:",
        targetISO,
        "count:",
        filtered.length
      );
      setDayStops(filtered);
    }
  };

  // Selected step for details panel
  const getSelectedStepData = (): Step | null => {
    if (!selectedStep || !journeyData?.days?.length) return null;
    const { dayIndex, stepIndex } = selectedStep;
    const day = journeyData.days[dayIndex];
    if (!day?.steps?.length) return null;
    return day.steps[stepIndex] ?? null;
  };

  return (
    <>
      <div className="h-[calc(100vh-210px)] bg-gray-50">
        <Explore
          onPlaceSelected={(lng: number, lat: number, name?: string) => {
            mapRef.current?.centerMap(lng, lat, name);
          }}
          onFilterChange={(filter: string) => setActiveFilter(filter)}
          onNewJourneyClick={() => setNewJourney(true)}
          onShowJourneyList={() => setShowJourneyList(!showJourneyList)}
        />

        <div className="flex h-full">
          {/* Sidebar only when journeyData exists */}
          {journeyData && (
            <JourneySidebar
              isOpen={isJourneySidebarOpen}
              onClose={() => setIsJourneySidebarOpen(false)}
              journeyData={journeyData}
              handleViewDayStops={(formattedDate: string) =>
                handleViewDayStops(formattedDate)
              }
              selectedStep={selectedStep}
              onStepSelect={handleStepSelect}
              onJourneyDataUpdate={updateJourneyData}
              onAddStop={handleAddStop}
              dayStops={dayStops}
            />
          )}

          {/* Main Content */}
          <div className="flex flex-1">
            {/* <SideExplore
              onExploreClick={() => setIsExplorePanelOpen(true)}
              onJourneyClick={handleJourneyClick} // <-- consumes ApiJourney
            /> */}
            {showJourneyList && (
              <ExploreJourneyList
                onJourneyClick={handleJourneyClick}
                setShowJourneyList={setShowJourneyList}
                onNewJourneyClick={() => setNewJourney(true)}
              />
            )}
            <div className="flex-1">
              <ExploreMap
                ref={mapRef}
                className="h-[calc(100vh-210px)]"
                activeFilter={activeFilter}
              />
            </div>
          </div>
        </div>

        {isExplorePanelOpen && (
          <ExploreHotels setIsExplorePanelOpen={setIsExplorePanelOpen} />
        )}
      </div>

      {/* Step Details Panel */}
      <StepDetailsPanel
        isOpen={isStepDetailsOpen}
        onClose={handleStepDetailsClose}
        step={getSelectedStepData()}
        dayIndex={selectedStep?.dayIndex || 0}
        stepIndex={selectedStep?.stepIndex || 0}
      />

      {/* Create Journey (if your modal returns the same API shape) */}
      <NewJourneyExplore
        newJourney={newJourney}
        setNewJourney={setNewJourney}
        setShowJourneyList={setShowJourneyList}
      />
      {isAddingStop ? (
        <StopModal
          open={isAddingStop}
          mode="add"
          dayIndex={addStopForDay || 0}
          onClose={() => setIsAddingStop(false)}
          journeyData={journeyData}
          formattedDate={formattedDate}
          dayNumber={dayNumber}
          onStopAdded={() => {
            // Refresh the journey data after a stop is added
            if (journeyData?.id) {
              fetchJourneyData(journeyData.id);
            }
          }}
        />
      ) : null}

      {openDayIndex && (
        <DayStopsModal
          key={`day-stops-modal-${dayStops.length}-${formattedDate}`}
          open={openDayIndex}
          onClose={() => setOpenDayIndex(false)}
          dayStops={dayStops as unknown as ApiJourneyStop[]}
          dayNumber={modalDayNumber}
          journeyName={journeyData?.journeyName || ""}
          journeyId={journeyData?.id}
          formattedDate={formattedDate}
          onStopDeleted={() => {
            // Refresh the journey data after a stop is deleted
            if (journeyData?.id) {
              fetchJourneyData(journeyData.id);
            }
          }}
          onStopAdded={() => {
            // Refresh the journey data after a stop is added
            if (journeyData?.id) {
              fetchJourneyData(journeyData.id);
            }
          }}
          onStopUpdated={() => {
            // Refresh the journey data after a stop is updated
            if (journeyData?.id) {
              fetchJourneyData(journeyData.id);
            }
          }}
        />
      )}
    </>
  );
};

export default Page;
