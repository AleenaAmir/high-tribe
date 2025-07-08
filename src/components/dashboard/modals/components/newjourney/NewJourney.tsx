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
import PlaneIcon from "@/components/dashboard/svgs/PlaneIcon";
import TrainIcon from "@/components/dashboard/svgs/TrainIcon";
import CarIcon from "@/components/dashboard/svgs/CarIcon";
import BusIcon from "@/components/dashboard/svgs/BusIcon";
import WalkIcon from "@/components/dashboard/svgs/WalkIcon";
import BikeIcon from "@/components/dashboard/svgs/BikeIcon";
import FaqInfoIcon from "@/components/dashboard/svgs/FaqInfoIcon";
import TraveLocationIcon from "@/components/dashboard/svgs/TraveLocationIcon";
import GlobalDateInput from "@/components/global/GlobalDateInput";

const TAGS = [
  "🏛️ Cultural Exploration",
  "🏰 Historical Sites",
  "🍛 Local Cuisine",
  "🎨 Art & Crafts",
  "🛍️ Shopping Spree",
  "🌳 Nature Walks",
  "🏙️ City Tours",
  "🎉 Positive Celebrations",
  "📸 Photography Spots",
  "🎵 Local Music",
  "🛒 Traditional Markets",
  "🌺 Relaxing Parks",
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

const editIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="11"
    height="12"
    fill="none"
    viewBox="0 0 11 12"
  >
    <g fill="#fff" clipPath="url(#clip0_552_58635)">
      <path d="M.653 10.263A.327.327 0 0 1 .327 9.9l.251-2.287a.33.33 0 0 1 .095-.193l5.345-5.344a1.045 1.045 0 0 1 1.48 0l1.016 1.016a1.045 1.045 0 0 1 0 1.48L3.172 9.913a.33.33 0 0 1-.192.095l-2.287.251zm.566-2.467-.196 1.77 1.77-.195 5.26-5.26a.39.39 0 0 0 0-.556l-1.02-1.019a.39.39 0 0 0-.554 0z"></path>
      <path d="M7.514 5.43a.33.33 0 0 1-.232-.094L5.253 3.301a.328.328 0 1 1 .464-.464l2.036 2.035a.327.327 0 0 1-.239.559M5.255 4.874 2.71 7.417l.462.462 2.544-2.543zM9.801 10.263H4.574a.327.327 0 1 1 0-.654H9.8a.327.327 0 0 1 0 .654"></path>
    </g>
    <defs>
      <clipPath id="clip0_552_58635">
        <path fill="#fff" d="M0 .788h10.454v10.454H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

const deleteIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    fill="none"
    viewBox="0 0 17 17"
  >
    <path
      fill="#fff"
      d="M12.402 6.699v-1.48a.313.313 0 0 0-.312-.313h-2.07V3.89a.313.313 0 0 0-.313-.312H7.363a.313.313 0 0 0-.312.312v1.016H4.98a.313.313 0 0 0-.313.312v1.48c0 .173.14.313.312.313h.09v6.254c0 .172.14.312.312.312h5.42A1.2 1.2 0 0 0 12 12.38V7.011h.09c.172 0 .312-.14.312-.312M7.676 4.203h1.718v.703H7.676zm3.7 8.176a.574.574 0 0 1-.574.573H5.695v-5.94h5.68zm.4-5.993H5.294v-.855h6.484z"
    ></path>
    <path
      fill="#fff"
      d="M7.285 8.265H6.66v3.672h.625zM8.847 8.265h-.625v3.672h.625zM10.41 8.265h-.625v3.672h.625z"
    ></path>
  </svg>
);

const expandIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="10"
    fill="none"
    viewBox="0 0 10 10"
  >
    <path
      fill="#fff"
      d="M5.092 1.617v5.884L3.094 5.503a.377.377 0 1 0-.534.534L5.203 8.68a.377.377 0 0 0 .534 0l2.642-2.643a.376.376 0 0 0 0-.534.377.377 0 0 0-.533 0L5.847 7.501V1.617a.378.378 0 0 0-.755 0"
    ></path>
  </svg>
);

const TravelMedium = [
  {
    name: "plane",
    icon: (
      <PlaneIcon className="w-[18px] h-[18px] text-black hover:text-[#2379FC] cursor-pointer" />
    ),
  },
  {
    name: "train",
    icon: (
      <TrainIcon className="w-[18px] h-[18px] text-black hover:text-[#2379FC] cursor-pointer" />
    ),
  },
  {
    name: "car",
    icon: (
      <CarIcon className="w-[18px] h-[18px] text-black hover:text-[#2379FC] cursor-pointer" />
    ),
  },
  {
    name: "bus",
    icon: (
      <BusIcon className="w-[18px] h-[18px] text-black hover:text-[#2379FC] cursor-pointer" />
    ),
  },
  {
    name: "walk",
    icon: (
      <WalkIcon className="w-[18px] h-[18px] text-black hover:text-[#2379FC] cursor-pointer" />
    ),
  },
  {
    name: "bike",
    icon: (
      <BikeIcon className="w-[18px] h-[18px] text-black hover:text-[#2379FC] cursor-pointer" />
    ),
  },
  {
    name: "info",
    icon: (
      <FaqInfoIcon className="w-[18px] h-[18px] text-black hover:text-[#2379FC] cursor-pointer" />
    ),
  },
];

type Step = {
  location: string;
  notes: string;
  media: File[];
  mediumOfTravel: string;
  startDate: string;
  endDate: string;
};

type NewJourneyForm = {
  title: string;
  startLocation: string;
  endLocation: string;
  startDate: string;
  endDate: string;
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
  startDate: "",
  endDate: "",
  description: "",
  steps: [
    {
      location: "",
      notes: "",
      media: [],
      mediumOfTravel: "",
      startDate: "",
      endDate: "",
    },
  ],
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
  const [openStepIndex, setOpenStepIndex] = useState<number>(0); // -1 means none open
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [headerEdits, setHeaderEdits] = useState<{ [key: number]: string }>({});
  const [visibility, setVisibility] = useState<"public" | "tribe" | "private">(
    "public"
  );
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);

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

  // Steps: each step has { location: { coords, name }, notes, media, mediumOfTravel, startDate, endDate }
  const [steps, setSteps] = useState<
    Array<{
      location: { coords: LatLng | null; name: string };
      notes: string;
      media: File[];
      mediumOfTravel: string;
      startDate: string;
      endDate: string;
    }>
  >([
    {
      location: { coords: null, name: "" },
      notes: "",
      media: [],
      mediumOfTravel: "",
      startDate: "",
      endDate: "",
    },
  ]);

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
      {
        location: { coords: null, name: "" },
        notes: "",
        media: [],
        mediumOfTravel: "",
        startDate: "",
        endDate: "",
      },
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
    // Transform local steps data to match form structure
    const formSteps = steps.map((step) => ({
      location: step.location.name,
      notes: step.notes,
      media: step.media,
      mediumOfTravel: step.mediumOfTravel,
      startDate: step.startDate,
      endDate: step.endDate,
    }));

    // Create the complete form data
    const completeData = {
      ...data,
      steps: formSteps,
      startLocation: startLocation.name,
      endLocation: endLocation.name,
    };

    // handle form submission
    console.log(completeData);
  };

  const tags = watch("tags");

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 ">
      <div>
        <div className="w-full p-4 border-b border-[#D9D9D9] rounded-tl-[20px] bg-white">
          <h4 className="text-[18px] md:text-[22px] text-[#111111] font-bold text-center">
            New Journey
          </h4>
          <p className="text-[10px] text-[#706F6F] text-center">
            Share you travel experience with world
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-1">
          <div
            className="flex flex-col gap-2 max-h-[500px] overflow-y-auto px-6 py-2 
           [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-[#1063E0]
  [&::-webkit-scrollbar-thumb]:bg-[#D9D9D9] 
  dark:[&::-webkit-scrollbar-track]:bg-[#D9D9D9]
  dark:[&::-webkit-scrollbar-thumb]:bg-[#1063E0] 
          "
          >
            <GlobalTextInput
              label="Title"
              {...register("title", { required: true })}
              error={errors.title?.message}
            />
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-black z-10 translate-y-3 translate-x-4 bg-white w-fit px-1">
                  Start Location
                </label>
                <div className="relative">
                  <div className="flex items-center gap-2 rounded-lg border pl-5 pr-2 py-3 border-[#848484]">
                    <input
                      ref={startInputRef}
                      className=" placeholder:text-[#AFACAC]  text-[12px] w-full outline-none"
                      value={startLocation.name}
                      onChange={async (e) => {
                        setStartLocation({
                          ...startLocation,
                          name: e.target.value,
                        });
                        fetchStartSuggestions(e.target.value);
                        setShowStartDropdown(true);
                      }}
                      onFocus={async () => setShowStartDropdown(true)}
                      onBlur={() =>
                        setTimeout(() => setShowStartDropdown(false), 150)
                      }
                      onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const coords = await geocodeLocation(
                            startLocation.name
                          );
                          if (coords) {
                            setStartLocation({
                              coords,
                              name: startLocation.name,
                            });
                            flyToOnMap(coords[0], coords[1]);
                          }
                          setShowStartDropdown(false);
                        }
                      }}
                    />
                    <TraveLocationIcon className="w-[14px] h-[14px] text-black hover:text-[#2379FC] cursor-pointer" />
                  </div>
                  {showStartDropdown && startSuggestions.length > 0 && (
                    <ul className="absolute z-10 left-0 right-0 bg-white border rounded-lg shadow mt-1 max-h-48 overflow-y-auto">
                      {startSuggestions.map((s, i) => (
                        <li
                          key={s.id}
                          className="px-3 py-2 text-[12px] cursor-pointer hover:bg-blue-100"
                          onMouseDown={() => handleStartSelect(s)}
                        >
                          {s.place_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-black z-10 translate-y-3 translate-x-4 bg-white w-fit px-1">
                  End Location
                </label>
                <div className="relative">
                  <div className="flex items-center gap-2 rounded-lg border pl-5 pr-2 py-3 border-[#848484]">
                    <input
                      ref={endInputRef}
                      className=" placeholder:text-[#AFACAC]  text-[12px] w-full outline-none"
                      value={endLocation.name}
                      onChange={async (e) => {
                        setEndLocation({
                          ...endLocation,
                          name: e.target.value,
                        });
                        fetchEndSuggestions(e.target.value);
                        setShowEndDropdown(true);
                      }}
                      onFocus={async () => setShowEndDropdown(true)}
                      onBlur={() =>
                        setTimeout(() => setShowEndDropdown(false), 150)
                      }
                      onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const coords = await geocodeLocation(
                            endLocation.name
                          );
                          if (coords) {
                            setEndLocation({ coords, name: endLocation.name });
                            flyToOnMap(coords[0], coords[1]);
                          }
                          setShowEndDropdown(false);
                        }
                      }}
                    />
                    <TraveLocationIcon className="w-[14px] h-[14px] text-black hover:text-[#2379FC] cursor-pointer" />
                  </div>
                  {showEndDropdown && endSuggestions.length > 0 && (
                    <ul className="absolute z-10 left-0 right-0 bg-white border rounded-lg shadow mt-1 max-h-48 overflow-y-auto">
                      {endSuggestions.map((s, i) => (
                        <li
                          key={s.id}
                          className="px-3 py-2 text-[12px] cursor-pointer hover:bg-blue-100"
                          onMouseDown={() => handleEndSelect(s)}
                        >
                          {s.place_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <GlobalDateInput
                label="Start Date"
                {...register("startDate", { required: true })}
                error={errors.startDate?.message}
              />
              <GlobalDateInput
                label="End Date"
                {...register("endDate", { required: true })}
                error={errors.endDate?.message}
              />
            </div>
            <GlobalTextArea
              label="Description"
              rows={3}
              {...register("description")}
              error={errors.description?.message}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="font-semibold text-[13px]">Journey Stops</span>
              <button
                type="button"
                className="px-3 py-1 text-[12px] flex items-center gap-1"
                onClick={() => {
                  handleAddStep();
                  setOpenStepIndex(steps.length); // open the new step
                }}
              >
                Add Stop
                <span className="p-2 w-fit bg-blue-500 text-white rounded-full text-[15px] flex items-center justify-center">
                  {plusIcon}
                </span>
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {steps.map((step, idx) => {
                const isOpen = openStepIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[#E9E5E5] rounded-lg bg-[#FCFCFC]"
                  >
                    {/* Closed View */}
                    {!isOpen && (
                      <div
                        className="flex items-center justify-between px-4 py-3 cursor-pointer bg-black text-white rounded-lg"
                        onClick={() => setOpenStepIndex(idx)}
                      >
                        {editingStepIndex === idx ? (
                          <input
                            className="text-[10px] font-semibold border-b border-blue-400 bg-transparent outline-none w-1/2"
                            value={headerEdits[idx] ?? step.location.name}
                            onChange={(e) =>
                              setHeaderEdits({
                                ...headerEdits,
                                [idx]: e.target.value,
                              })
                            }
                            onBlur={() => {
                              setSteps((steps) =>
                                steps.map((s, i) =>
                                  i === idx
                                    ? {
                                        ...s,
                                        location: {
                                          ...s.location,
                                          name:
                                            headerEdits[idx] ?? s.location.name,
                                        },
                                      }
                                    : s
                                )
                              );
                              setEditingStepIndex(null);
                            }}
                            autoFocus
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold">
                              {step.location.name || `Step ${idx + 1}`}
                            </span>
                            {step.mediumOfTravel &&
                              step.mediumOfTravel !== "info" && (
                                <div className="w-[12px] h-[12px] text-white">
                                  {step.mediumOfTravel === "plane" && (
                                    <PlaneIcon className="w-[18px] h-[18px]" />
                                  )}
                                  {step.mediumOfTravel === "train" && (
                                    <TrainIcon className="w-[18px] h-[18px]" />
                                  )}
                                  {step.mediumOfTravel === "car" && (
                                    <CarIcon className="w-[18px] h-[18px]" />
                                  )}
                                  {step.mediumOfTravel === "bus" && (
                                    <BusIcon className="w-[18px] h-[18px]" />
                                  )}
                                  {step.mediumOfTravel === "walk" && (
                                    <WalkIcon className="w-[18px] h-[18px]" />
                                  )}
                                  {step.mediumOfTravel === "bike" && (
                                    <BikeIcon className="w-[18px] h-[18px]" />
                                  )}
                                </div>
                              )}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className=" cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingStepIndex(idx);
                              setHeaderEdits({
                                ...headerEdits,
                                [idx]: step.location.name,
                              });
                            }}
                            title="Edit step name"
                          >
                            {editIcon}
                          </button>
                          <button
                            type="button"
                            className=" cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSteps((steps) =>
                                steps.filter((_, i) => i !== idx)
                              );
                              if (openStepIndex === idx) setOpenStepIndex(-1);
                            }}
                            title="Delete step"
                          >
                            {deleteIcon}
                          </button>
                          <button
                            type="button"
                            className=" cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenStepIndex(idx);
                            }}
                            title="Expand"
                          >
                            {expandIcon}
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Open View */}
                    {isOpen && (
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-[#5E6368] font-semibold">
                            {step.location.name || `Stop ${idx + 1}`}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="text-gray-400 hover:text-black text-lg"
                              onClick={() => setOpenStepIndex(-1)}
                              title="Close"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              className="text-gray-400 hover:text-black text-lg rotate-45"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSteps((steps) =>
                                  steps.filter((_, i) => i !== idx)
                                );
                                if (openStepIndex === idx) setOpenStepIndex(-1);
                              }}
                              title="Delete step"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[12px] font-medium text-black z-10 translate-y-3 translate-x-4 bg-white w-fit px-1">
                            Location
                          </label>
                          <StepLocationInput
                            // mediumOfTravel={step.mediumOfTravel}
                            // setMediumOfTravel={(medium: string) =>
                            //   setSteps((steps) =>
                            //     steps.map((s, i) =>
                            //       i === idx
                            //         ? { ...s, mediumOfTravel: medium }
                            //         : s
                            //     )
                            //   )
                            // }
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
                                        location: {
                                          coords,
                                          name: place.place_name,
                                        },
                                      }
                                    : s
                                )
                              );
                            }}
                            fetchSuggestions={fetchStepSuggestions}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1 justify-end mt-2">
                            {TravelMedium.map((t, i) => {
                              const isSelected = step.mediumOfTravel === t.name;
                              return (
                                <button
                                  key={i}
                                  className={`p-1 rounded-md bg-[#F8F6F6] border w-fit cursor-pointer ${
                                    isSelected
                                      ? "text-[#2379FC] border-[#DFDFDF]"
                                      : "text-black hover:text-[#2379FC] border-[#F8F6F6] hover:border-[#DFDFDF]"
                                  }`}
                                  onClick={() =>
                                    setSteps((steps) =>
                                      steps.map((s, i) =>
                                        i === idx
                                          ? { ...s, mediumOfTravel: t.name }
                                          : s
                                      )
                                    )
                                  }
                                >
                                  {t.name === "plane" && (
                                    <PlaneIcon className="w-[18px] h-[18px]" />
                                  )}
                                  {t.name === "train" && (
                                    <TrainIcon className="w-[18px] h-[18px]" />
                                  )}
                                  {t.name === "car" && (
                                    <CarIcon className="w-[18px] h-[18px]" />
                                  )}
                                  {t.name === "bus" && (
                                    <BusIcon className="w-[18px] h-[18px]" />
                                  )}
                                  {t.name === "walk" && (
                                    <WalkIcon className="w-[18px] h-[18px]" />
                                  )}
                                  {t.name === "bike" && (
                                    <BikeIcon className="w-[18px] h-[18px]" />
                                  )}
                                  {t.name === "info" && (
                                    <FaqInfoIcon className="w-[18px] h-[18px]" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <GlobalDateInput
                            label="Start Date"
                            value={step.startDate}
                            onChange={(e) =>
                              setSteps((steps) =>
                                steps.map((s, i) =>
                                  i === idx
                                    ? { ...s, startDate: e.target.value }
                                    : s
                                )
                              )
                            }
                          />
                          <GlobalDateInput
                            label="End Date"
                            value={step.endDate}
                            onChange={(e) =>
                              setSteps((steps) =>
                                steps.map((s, i) =>
                                  i === idx
                                    ? { ...s, endDate: e.target.value }
                                    : s
                                )
                              )
                            }
                          />
                        </div>
                        <GlobalTextArea
                          label="Notes"
                          rows={1}
                          value={step.notes}
                          onChange={(e) =>
                            setSteps((steps) =>
                              steps.map((s, i) =>
                                i === idx ? { ...s, notes: e.target.value } : s
                              )
                            )
                          }
                        />
                        <div className="mt-2">
                          <GlobalFileUpload
                            label="Photos & Videos for this step"
                            value={step.media}
                            onChange={(files) =>
                              setSteps((steps) =>
                                steps.map((s, i) =>
                                  i === idx ? { ...s, media: files } : s
                                )
                              )
                            }
                            maxFiles={5}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <GlobalTextInput
              label="Tag Friends"
              {...register("friends")}
              error={errors.friends?.message}
            />
          </div>
          <div className="flex items-center justify-between p-4 border-t border-[#D9D9D9]">
            <div className="relative">
              <button
                type="button"
                className={`px-6 py-2 rounded-full text-[13px] bg-blue-600 text-white border-blue-600 font-medium border focus:outline-none flex items-center gap-2 transition-all w-36 justify-between`}
                onClick={() => setShowVisibilityDropdown((v) => !v)}
              >
                {visibility === "public"
                  ? "Public"
                  : visibility === "tribe"
                  ? "Tribe Only"
                  : "Private"}
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showVisibilityDropdown && (
                <ul className="absolute left-0 mt-1 w-36 bg-white rounded-lg shadow z-20">
                  {["public", "tribe", "private"]
                    .filter((v) => v !== visibility)
                    .map((v) => (
                      <li
                        key={v}
                        className="px-6 py-1 text-[13px] cursor-pointer hover:bg-blue-100 text-[#6B7280]"
                        onClick={() => {
                          setVisibility(v as typeof visibility);
                          setShowVisibilityDropdown(false);
                        }}
                      >
                        {v === "public"
                          ? "Public"
                          : v === "tribe"
                          ? "Tribe Only"
                          : "Private"}
                      </li>
                    ))}
                </ul>
              )}
            </div>
            <button
              type="submit"
              className="ml-4 px-6 py-2 text-[12px] rounded-lg border border-blue-600 text-black cursor-pointer font-semibold bg-white hover:bg-blue-50 transition-all"
            >
              Share Post
            </button>
          </div>
        </form>
      </div>
      <div className="h-full w-full">
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
      <div className="flex items-center gap-1 border px-5 py-3 border-[#848484] rounded-lg">
        <input
          className="  placeholder:text-[#AFACAC]  text-[10px] w-full focus:outline-none"
          value={input}
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
      </div>
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
