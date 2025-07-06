import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  useForm,
  useFieldArray,
  Controller,
  FieldValues,
} from "react-hook-form";
import Fuse from "fuse.js";
import GlobalTextInput from "@/components/global/GlobalTextInput";
import GlobalTextArea from "@/components/global/GlobalTextArea";
import GlobalSelect from "@/components/global/GlobalSelect";
import GlobalTagInput from "@/components/global/GlobalTagInput";
import GlobalFileUpload from "@/components/global/GlobalFileUpload";
import JourneyMap, { LatLng } from "./JourneyMap";

const TAGS = [
  "Cultural Exploration",
  "Historical Sites",
  "Local Cuisine",
  "Art & Crafts",
  "Shopping Spree",
  "Nature Walks",
  "City Tours",
  "Positive Celebrations",
  "Photography Spots",
  "Local Music",
  "Traditional Markets",
  "Relaxing Parks",
];

const plusIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="7"
    height="7"
    fill="none"
    viewBox="0 0 7 7"
  >
    <path
      fill="#fff"
      d="M4.123 3.12h2.61v1.245h-2.61v2.61H2.878v-2.61H.283V3.12h2.595V.525h1.245z"
    ></path>
  </svg>
);

type Step = {
  location: string;
  notes: string;
  media: File[];
};

type NewJourneyForm = {
  title: string;
  startLocation: string;
  endLocation: string;
  description: string;
  steps: Step[];
  summary: string;
  summaryMedia: File[];
  friends: string;
  tags: string[];
};

const defaultValues: NewJourneyForm = {
  title: "",
  startLocation: "",
  endLocation: "",
  description: "",
  steps: [{ location: "", notes: "", media: [] }],
  summary: "",
  summaryMedia: [],
  friends: "",
  tags: [],
};

const MAPBOX_GEOCODE_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places/";

async function geocodeLocation(query: string): Promise<LatLng | null> {
  if (!query) return null;
  const url = `${MAPBOX_GEOCODE_URL}${encodeURIComponent(
    query
  )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.features && data.features.length > 0) {
    const [lng, lat] = data.features[0].center;
    return [lng, lat];
  }
  return null;
}

// Helper for reverse geocoding
async function reverseGeocode(lng: number, lat: number): Promise<string> {
  const url = `${MAPBOX_GEOCODE_URL}${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.features && data.features.length > 0) {
    return data.features[0].place_name;
  }
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export default function NewJourney() {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewJourneyForm>({ defaultValues });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "steps",
  });

  // State to track which step is open and which header is being edited
  const [openStepIndex, setOpenStepIndex] = useState(0);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [headerEdits, setHeaderEdits] = useState<{ [key: number]: string }>({});
  const [visibility, setVisibility] = useState<"public" | "tribe" | "private">(
    "public"
  );

  // Store both coordinates and place names for start/end
  const [startLocation, setStartLocation] = useState<{
    coords: LatLng | null;
    name: string;
  }>({ coords: null, name: "" });
  const [endLocation, setEndLocation] = useState<{
    coords: LatLng | null;
    name: string;
  }>({ coords: null, name: "" });
  // Track which location is being set by map click
  const [activeMapSelect, setActiveMapSelect] = useState<"start" | "end">(
    "start"
  );

  // Steps: each step has { location: { coords, name }, notes, media }
  const [steps, setSteps] = useState<
    Array<{
      location: { coords: LatLng | null; name: string };
      notes: string;
      media: File[];
    }>
  >([{ location: { coords: null, name: "" }, notes: "", media: [] }]);

  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");

  const [startSuggestions, setStartSuggestions] = useState<any[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<any[]>([]);
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showEndDropdown, setShowEndDropdown] = useState(false);
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  const mapRef = useRef<any>(null);

  // Debug: Log when activeMapSelect changes
  useEffect(() => {
    console.log("activeMapSelect changed to:", activeMapSelect);
  }, [activeMapSelect]);

  // Debug: Create a wrapper for setActiveMapSelect to log calls
  const setActiveMapSelectWithLog = useCallback((value: "start" | "end") => {
    console.log("setActiveMapSelect called with:", value);
    setActiveMapSelect(value);
  }, []);

  // Memoized callback functions to prevent unnecessary re-renders
  const handleStartChange = useCallback(async (loc: LatLng) => {
    const name = await reverseGeocode(loc[0], loc[1]);
    setStartLocation({ coords: loc, name });
  }, []);

  const handleEndChange = useCallback(async (loc: LatLng) => {
    const name = await reverseGeocode(loc[0], loc[1]);
    setEndLocation({ coords: loc, name });
  }, []);

  // Helper: bounding box filter for steps
  function isBetweenStartEnd(point: LatLng): boolean {
    if (!startLocation.coords || !endLocation.coords) return false;
    const [x1, y1] = startLocation.coords;
    const [x2, y2] = endLocation.coords;
    const [px, py] = point;
    const minX = Math.min(x1, x2),
      maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2),
      maxY = Math.max(y1, y2);
    return px >= minX && px <= maxX && py >= minY && py <= maxY;
  }

  // Fly to location on map
  function flyToOnMap(lng: number, lat: number) {
    if (mapRef.current && mapRef.current.flyTo) {
      mapRef.current.flyTo({ center: [lng, lat], zoom: 10 });
    }
  }

  // When startLocation changes, update input
  React.useEffect(() => {
    if (startLocation.coords)
      setStartInput(
        `${startLocation.coords[1].toFixed(
          5
        )}, ${startLocation.coords[0].toFixed(5)}`
      );
  }, [startLocation.coords]);
  React.useEffect(() => {
    if (endLocation.coords)
      setEndInput(
        `${endLocation.coords[1].toFixed(5)}, ${endLocation.coords[0].toFixed(
          5
        )}`
      );
  }, [endLocation.coords]);

  // Debounced fetch for suggestions
  const fetchStartSuggestions = debounce(async (query: string) => {
    if (!query) return setStartSuggestions([]);
    const url = `${MAPBOX_GEOCODE_URL}${encodeURIComponent(
      query
    )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();
    setStartSuggestions(data.features || []);
  }, 300);
  const fetchEndSuggestions = debounce(async (query: string) => {
    if (!query) return setEndSuggestions([]);
    const url = `${MAPBOX_GEOCODE_URL}${encodeURIComponent(
      query
    )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();
    setEndSuggestions(data.features || []);
  }, 300);

  // When user selects a start location (input, dropdown, or map)
  async function handleStartSelect(place: any) {
    setStartLocation({
      coords: [place.center[0], place.center[1]],
      name: place.place_name,
    });
    setShowStartDropdown(false);
    flyToOnMap(place.center[0], place.center[1]);
  }
  // When user selects an end location (input, dropdown, or map)
  async function handleEndSelect(place: any) {
    setEndLocation({
      coords: [place.center[0], place.center[1]],
      name: place.place_name,
    });
    setShowEndDropdown(false);
    flyToOnMap(place.center[0], place.center[1]);
  }

  // Add step button handler
  function handleAddStep() {
    setSteps([
      ...steps,
      { location: { coords: null, name: "" }, notes: "", media: [] },
    ]);
  }

  // Step location autocomplete (filtered to between start/end)
  async function fetchStepSuggestions(query: string) {
    if (!query || !startLocation.coords || !endLocation.coords) return [];
    const url = `${MAPBOX_GEOCODE_URL}${encodeURIComponent(
      query
    )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();
    return (data.features || []).filter((f: any) => {
      const [lng, lat] = f.center;
      // Only allow locations between start and end
      const [x1, y1] = startLocation.coords!;
      const [x2, y2] = endLocation.coords!;
      const minX = Math.min(x1, x2),
        maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2),
        maxY = Math.max(y1, y2);
      return lng >= minX && lng <= maxX && lat >= minY && lat <= maxY;
    });
  }

  const onSubmit = (data: NewJourneyForm) => {
    // handle form submission
    console.log(data);
  };

  const tags = watch("tags");

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 flex flex-col gap-4 max-h-[650px] overflow-y-auto"
      >
        <GlobalTextInput
          label="Title"
          placeholder="Title"
          {...register("title", { required: true })}
          error={errors.title?.message}
        />
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <label className="text-xs font-medium text-gray-700 mb-1">
              Start Location
            </label>
            <input
              ref={startInputRef}
              className="rounded-lg border px-3 py-2 text-sm bg-gray-100 w-full"
              value={startLocation.name}
              placeholder="Enter a place"
              onChange={async (e) => {
                setStartLocation({ ...startLocation, name: e.target.value });
                fetchStartSuggestions(e.target.value);
                setShowStartDropdown(true);
              }}
              onFocus={async () => setShowStartDropdown(true)}
              onBlur={() => setTimeout(() => setShowStartDropdown(false), 150)}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const coords = await geocodeLocation(startLocation.name);
                  if (coords) {
                    setStartLocation({ coords, name: startLocation.name });
                    flyToOnMap(coords[0], coords[1]);
                  }
                  setShowStartDropdown(false);
                }
              }}
            />
            {showStartDropdown && startSuggestions.length > 0 && (
              <ul className="absolute z-10 left-0 right-0 bg-white border rounded-lg shadow mt-1 max-h-48 overflow-y-auto">
                {startSuggestions.map((s, i) => (
                  <li
                    key={s.id}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-100"
                    onMouseDown={() => handleStartSelect(s)}
                  >
                    {s.place_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative">
            <label className="text-xs font-medium text-gray-700 mb-1">
              End Location
            </label>
            <input
              ref={endInputRef}
              className="rounded-lg border px-3 py-2 text-sm bg-gray-100 w-full"
              value={endLocation.name}
              placeholder="Enter a place"
              onChange={async (e) => {
                setEndLocation({ ...endLocation, name: e.target.value });
                fetchEndSuggestions(e.target.value);
                setShowEndDropdown(true);
              }}
              onFocus={async () => setShowEndDropdown(true)}
              onBlur={() => setTimeout(() => setShowEndDropdown(false), 150)}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const coords = await geocodeLocation(endLocation.name);
                  if (coords) {
                    setEndLocation({ coords, name: endLocation.name });
                    flyToOnMap(coords[0], coords[1]);
                  }
                  setShowEndDropdown(false);
                }
              }}
            />
            {showEndDropdown && endSuggestions.length > 0 && (
              <ul className="absolute z-10 left-0 right-0 bg-white border rounded-lg shadow mt-1 max-h-48 overflow-y-auto">
                {endSuggestions.map((s, i) => (
                  <li
                    key={s.id}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-100"
                    onMouseDown={() => handleEndSelect(s)}
                  >
                    {s.place_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <GlobalTextArea
          label="Description"
          placeholder="Description"
          rows={2}
          {...register("description")}
          error={errors.description?.message}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold text-base">Journey Steps</span>
          <button
            type="button"
            className="px-3 py-1 text-[10px] flex items-center gap-1"
            onClick={handleAddStep}
          >
            Add step
            <span className="p-2 w-fit bg-blue-500 text-white rounded-full text-[15px] flex items-center justify-center">
              {plusIcon}
            </span>
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="border border-[#E9E5E5] rounded-lg p-4 bg-[#FCFCFC]"
            >
              <div className="mb-2">
                <label className="text-xs font-medium text-gray-700 mb-1">
                  Step Location
                </label>
                <StepLocationInput
                  value={step.location.name}
                  onSelect={async (place: any) => {
                    const coords: [number, number] = [
                      place.center[0],
                      place.center[1],
                    ];
                    setSteps((steps) =>
                      steps.map((s, i) =>
                        i === idx
                          ? {
                              ...s,
                              location: { coords, name: place.place_name },
                            }
                          : s
                      )
                    );
                  }}
                  fetchSuggestions={fetchStepSuggestions}
                />
              </div>
              <GlobalTextArea
                label="Notes"
                placeholder="Notes"
                rows={2}
                value={step.notes}
                onChange={(e) =>
                  setSteps((steps) =>
                    steps.map((s, i) =>
                      i === idx ? { ...s, notes: e.target.value } : s
                    )
                  )
                }
              />
              <GlobalFileUpload
                label="Photos & Videos for this step"
                value={step.media}
                onChange={(media) =>
                  setSteps((steps) =>
                    steps.map((s, i) => (i === idx ? { ...s, media } : s))
                  )
                }
              />
            </div>
          ))}
        </div>
        <GlobalTextArea
          label="Journey Summary"
          placeholder="Tell us about your journey..."
          rows={2}
          {...register("summary")}
          error={errors.summary?.message}
        />
        <Controller
          control={control}
          name="summaryMedia"
          render={({ field: { value, onChange } }) => (
            <GlobalFileUpload
              label="Photos / Videos (Max 5)"
              value={value}
              onChange={onChange}
              multiple={true}
            />
          )}
        />
        <GlobalTextInput
          label="Tag Friends"
          placeholder="@username"
          {...register("friends")}
          error={errors.friends?.message}
        />
        <Controller
          control={control}
          name="tags"
          render={({ field: { value, onChange } }) => (
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {TAGS.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    className={`px-3 py-1 rounded-full text-xs border transition-all ${
                      value?.includes(tag)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-100"
                    }`}
                    onClick={() => {
                      if (value?.includes(tag)) {
                        onChange(value.filter((t) => t !== tag));
                      } else {
                        onChange([...(value || []), tag]);
                      }
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {/* <GlobalTagInput
                label="Need Tags"
                value={value}
                onChange={onChange}
              /> */}
            </div>
          )}
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            <button
              type="button"
              className={`px-3 py-1 rounded-full text-[9px] font-medium border transition-all focus:outline-none ${
                visibility === "public"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-[#F7F8FA] text-[#6B7280] border-[#F7F8FA]"
              } flex items-center gap-1`}
              onClick={() => setVisibility("public")}
            >
              Public
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded-full text-[9px] font-medium border transition-all focus:outline-none ${
                visibility === "tribe"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-[#F7F8FA] text-[#6B7280] border-[#F7F8FA]"
              }`}
              onClick={() => setVisibility("tribe")}
            >
              Tribe Only
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded-full text-[9px] font-medium border transition-all focus:outline-none ${
                visibility === "private"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-[#F7F8FA] text-[#6B7280] border-[#F7F8FA]"
              }`}
              onClick={() => setVisibility("private")}
            >
              Private
            </button>
          </div>
          <button
            type="submit"
            className="ml-4 px-6 py-2 text-[12px] rounded-lg border border-blue-600 text-blue-600 font-semibold bg-white hover:bg-blue-50 transition-all"
          >
            Share Post
          </button>
        </div>
      </form>
      <div className="h-[650px] w-full lg:w-[510px]">
        <JourneyMap
          ref={mapRef}
          startLocation={startLocation.coords}
          endLocation={endLocation.coords}
          steps={
            steps.map((s) => s.location.coords).filter(Boolean) as LatLng[]
          }
          onStartChange={handleStartChange}
          onEndChange={handleEndChange}
          onStepsChange={() => {}}
          activeMapSelect={activeMapSelect}
          setActiveMapSelect={setActiveMapSelectWithLog}
        />
      </div>
    </div>
  );
}

// StepLocationInput component for step location autocomplete
function StepLocationInput({
  value,
  onSelect,
  fetchSuggestions,
}: {
  value: string;
  onSelect: (place: any) => void;
  fetchSuggestions: (q: string) => Promise<any[]>;
}) {
  const [input, setInput] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [defaultSuggestions, setDefaultSuggestions] = useState<any[]>([]);

  // Fetch default suggestions for the area between start and end
  const fetchDefaultSuggestions = async () => {
    const results = await fetchSuggestions("place");
    setDefaultSuggestions(results);
    setSuggestions(results);
  };

  useEffect(() => {
    if (showDropdown && input === "") {
      fetchDefaultSuggestions();
    }
    // eslint-disable-next-line
  }, [showDropdown]);

  return (
    <div className="relative">
      <input
        className="rounded-lg border px-3 py-2 text-sm bg-gray-100 w-full"
        value={input}
        placeholder="Enter a place"
        onChange={async (e) => {
          setInput(e.target.value);
          setShowDropdown(true);
          const results = await fetchSuggestions(e.target.value);
          if (results.length > 0) {
            setSuggestions(results);
          } else {
            // fallback to default suggestions
            setSuggestions(defaultSuggestions);
          }
        }}
        onFocus={async () => {
          setShowDropdown(true);
          if (input === "") {
            fetchDefaultSuggestions();
          } else {
            const results = await fetchSuggestions(input);
            setSuggestions(results.length > 0 ? results : defaultSuggestions);
          }
        }}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
      />
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 bg-white border rounded-lg shadow mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-100"
              onMouseDown={() => {
                setInput(s.place_name);
                onSelect(s);
                setShowDropdown(false);
              }}
            >
              {s.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
