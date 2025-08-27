"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlobalModalBorderLess from "../global/GlobalModalBorderLess";
import GlobalSelect from "../global/GlobalSelect";
import GlobalDateInput from "../global/GlobalDateInput";
import Location from "../dashboard/svgs/Location";
import { toast } from "react-hot-toast";
import { apiRequest, apiFormDataWrapper } from "@/lib/api";
import GlobalTextArea from "../global/GlobalTextArea";
import LocationMap from "../global/LocationMap";
import {
  fetchGooglePlaceSuggestions,
  getCoordinatesForGooglePlace,
} from "@/lib/googlePlaces";

// ── Validation ────────────────────────────────────────────────────────────────
const stopFormSchema = z.object({
  category: z.string().min(1, "Category is required"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  modeOfTravel: z.string().min(1, "Mode of travel is required"),
  notes: z.string().optional(),
  date: z.string(),
  //   title: z.string().min(1, "Title is required"),
});

type StopFormData = z.infer<typeof stopFormSchema>;

// ── Location Selector Component ───────────────────────────────────────────────
interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (coords: [number, number], name: string) => void;
  error?: string;
  placeholder?: string;
}

function LocationSelector({
  value,
  onChange,
  onLocationSelect,
  error,
  placeholder,
}: LocationSelectorProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeout: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
          if (query.length < 2) {
            setSuggestions([]);
            return;
          }

          setIsLoadingSuggestions(true);
          try {
            const suggestions = await fetchGooglePlaceSuggestions(query);
            setSuggestions(suggestions);
          } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
          } finally {
            setIsLoadingSuggestions(false);
          }
        }, 300);
      };
    })(),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    debouncedSearch(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = async (suggestion: any) => {
    try {
      let coordinates: [number, number] | null = null;
      let selectedText = "";

      // Handle both Google Places and Mapbox suggestions
      if (suggestion.place_id) {
        coordinates = await getCoordinatesForGooglePlace(suggestion.place_id);
        if (coordinates) {
          selectedText = suggestion.description || suggestion.place_name;
          onChange(selectedText);
          onLocationSelect(coordinates, selectedText);
        }
      }

      setSuggestions([]);
      setShowSuggestions(false);
    } catch (error) {
      console.error("Error handling suggestion click:", error);
      toast.error("Failed to get location coordinates");
    }
  };

  const handleFocus = () => {
    setShowSuggestions(true);
    if (value.length >= 2) {
      debouncedSearch(value);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-[12px] font-medium text-[#1C231F] translate-y-3.5 translate-x-4 bg-white w-fit px-1 z-10">
        Add Location
      </label>
      <div className="relative">
        <input
          type="text"
          className={`rounded-lg border py-3 px-5 text-[12px] w-full h-[40px] placeholder:text-[#AFACAC] focus:outline-none focus:ring-2 focus:ring-[#9743AA] transition-all ${
            error ? "border-red-500" : "border-[#848484]"
          }`}
          placeholder={placeholder || "Search for a location..."}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Location className="text-gray-400" />
        </div>
        {isLoadingSuggestions && (
          <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            Loading...
          </span>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 top-full w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-auto mt-1">
          {suggestions.map((suggestion: any, index: number) => (
            <div
              key={suggestion.place_id || index}
              className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent blur
                handleSuggestionClick(suggestion);
              }}
            >
              <div>
                <div className="font-medium text-gray-900">
                  {suggestion.structured_formatting?.main_text ||
                    suggestion.text}
                </div>
                <div className="text-sm text-gray-500">
                  {suggestion.structured_formatting?.secondary_text ||
                    suggestion.place_name}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────
interface StopModalProps {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  dayIndex: number;
  journeyData?: any;
  formattedDate: string;
  dayNumber: number | null;
  stopData?: any; // For edit mode
  onStopAdded?: () => void;
  onStopUpdated?: () => void;
}

export default function StopModal({
  open,
  onClose,
  mode,
  dayIndex,
  journeyData,
  formattedDate,
  dayNumber,
  stopData,
  onStopAdded,
  onStopUpdated,
}: StopModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<StopFormData>({
    resolver: zodResolver(stopFormSchema),
    defaultValues: {
      category: "",
      location: "",
      modeOfTravel: "",
      notes: "",
      date: formattedDate,
      //   title: "",
    },
  });

  const [stopCategories, setStopCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    coords: [number, number] | null;
    name: string;
  }>({
    coords: null,
    name: "",
  });

  // Load stop categories
  useEffect(() => {
    setLoadingCategories(true);
    const fetchCategories = async () => {
      try {
        // Fetch categories from API
        const categoriesData = await apiRequest<any>("posts/stops/categories", {
          method: "GET",
        });

        // Handle categories data structure
        let categories = [];
        if (Array.isArray(categoriesData)) {
          categories = categoriesData;
        } else if (
          categoriesData?.categories &&
          Array.isArray(categoriesData.categories)
        ) {
          categories = categoriesData.categories;
        } else if (
          categoriesData &&
          typeof categoriesData === "object" &&
          categoriesData.data &&
          Array.isArray(categoriesData.data)
        ) {
          categories = categoriesData.data;
        }

        // Map categories to expected structure
        const mappedCategories = categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          label: cat.name,
        }));

        setStopCategories(mappedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        // Set some default categories for fallback
        const defaultCategories = [
          { id: 1, name: "Hotel", label: "Hotel" },
          { id: 2, name: "Restaurant", label: "Restaurant" },
          { id: 3, name: "Tourist Attraction", label: "Tourist Attraction" },
          { id: 4, name: "Shopping", label: "Shopping" },
          { id: 5, name: "Entertainment", label: "Entertainment" },
          { id: 6, name: "Transportation", label: "Transportation" },
          { id: 7, name: "Other", label: "Other" },
        ];
        setStopCategories(defaultCategories);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Initialize form with stop data for edit mode
  useEffect(() => {
    if (mode === "edit" && stopData) {
      setValue("category", stopData.stop_category_id?.toString() || "");
      setValue("location", stopData.location_name || "");
      setValue("modeOfTravel", stopData.transport_mode || "");
      setValue("notes", stopData.notes || "");
      setValue("date", stopData.date || formattedDate);
      //   setValue("title", stopData.title || "");

      // Set location coordinates if available
      if (stopData.lat && stopData.lng) {
        setSelectedLocation({
          coords: [parseFloat(stopData.lng), parseFloat(stopData.lat)],
          name: stopData.location_name || "",
        });
      }
    } else {
      // Reset form for add mode
      reset({
        category: "",
        location: "",
        modeOfTravel: "",
        notes: "",
        date: formattedDate,
        // title: "",
      });
      setSelectedLocation({ coords: null, name: "" });
    }
  }, [mode, stopData, formattedDate, setValue, reset]);

  const handleLocationSelect = (coords: [number, number], name: string) => {
    setSelectedLocation({ coords, name });
  };

  const onSubmit = async (data: StopFormData) => {
    if (!journeyData || !journeyData.id) {
      toast.error("Missing journey data. Cannot save stop.");
      return;
    }

    try {
      // Use the date from the form data, which should be the formattedDate
      console.log("Form data date:", data.date);
      console.log("Original formattedDate:", formattedDate);

      let apiDate;
      if (data.date && data.date.includes("/")) {
        // Format: MM/DD/YYYY (from toLocaleDateString)
        const [month, day, year] = data.date.split("/");
        apiDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      } else if (data.date && data.date.includes("-")) {
        // Format: YYYY-MM-DD (already in correct format)
        apiDate = data.date;
      } else {
        // Fallback to current date
        apiDate = new Date().toISOString().split("T")[0];
      }

      console.log("Converted apiDate:", apiDate);

      const formData = new FormData();
      formData.append("stop_category_id", data.category || "1");
      formData.append("location_name", data.location);
      formData.append("title", data.location || "Untitled Stop");
      formData.append("date", apiDate);

      // Use selectedLocation.coords if available, otherwise fallback to dummy values
      const lat =
        selectedLocation.coords && selectedLocation.coords[1] !== undefined
          ? String(selectedLocation.coords[1])
          : "48.8584";
      const lng =
        selectedLocation.coords && selectedLocation.coords[0] !== undefined
          ? String(selectedLocation.coords[0])
          : "2.2945";

      formData.append("lat", lat);
      formData.append("lng", lng);
      formData.append("transport_mode", data.modeOfTravel || "");
      formData.append("notes", data.notes || "");

      if (mode === "edit" && stopData?.id) {
        // Update existing stop - add _method: PUT for Laravel
        formData.append("_method", "PUT");

        // Use direct fetch for PUT requests with FormData
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token") || ""
            : "";
        const response = await fetch(
          `https://api.hightribe.com/api/journeys/${journeyData.id}/stops/${stopData.id}`,
          {
            method: "POST", // Laravel expects POST with _method: PUT
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            body: formData,
          }
        );

        if (response.ok) {
          toast.success("Stop updated successfully!");
          onStopUpdated?.();
        } else {
          throw new Error("Failed to update stop");
        }
      } else {
        // Create new stop
        const response = await apiFormDataWrapper(
          `journeys/${journeyData.id}/stops`,
          formData,
          "Stop added successfully!"
        );

        console.log("API Response:", response);
        onStopAdded?.();
      }

      reset();
      onClose();
    } catch (error) {
      console.error("Failed to save stop:", error);

      // Log more details about the error
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }

      // Check if it's an API error with response
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as any;
        console.error("API Error Response:", apiError.response);
        if (apiError.response?.data) {
          console.error("API Error Data:", apiError.response.data);
        }
      }

      toast.error(`Failed to ${mode} stop. Please try again.`);
    }
  };

  return (
    <div>
      <GlobalModalBorderLess
        isOpen={open}
        onClose={onClose}
        maxWidth="max-w-[949px]"
        customPadding="p-0"
      >
        <div className="overflow-hidden w-full rounded-[20px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full rounded-lg">
            {/* Left: Form Panel */}
            <div className="flex flex-col bg-white h-full">
              {/* Header */}
              <div className="flex justify-center items-center p-6 border-b border-gray-200">
                <h2 className="text-[22px] font-bold font-gilroy text-center">
                  {mode === "edit" ? "Edit Stop" : "Add New Stop"}
                </h2>
              </div>

              <div className="flex p-6 border-b border-gray-200">
                <h3 className="text-[14px] font-bold font-gilroy">
                  Day {dayNumber} ({formattedDate})
                </h3>
              </div>

              {/* Form Content */}
              <div className="flex-1 p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Title */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      {...register("title")}
                      placeholder="Enter stop title..."
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9743AA] ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div> */}

                  {/* Category */}
                  <GlobalSelect
                    label="Category"
                    value={watch("category")}
                    onChange={(e) =>
                      setValue("category", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                    error={errors.category?.message}
                  >
                    <option value="" disabled>
                      {loadingCategories
                        ? "Loading categories..."
                        : stopCategories.length === 0
                        ? "No categories available"
                        : "Select a category"}
                    </option>
                    {stopCategories.map((category) => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name || category.label}
                      </option>
                    ))}
                  </GlobalSelect>

                  {/* Location with Google Places suggestions */}
                  <LocationSelector
                    value={watch("location")}
                    onChange={(value) =>
                      setValue("location", value, { shouldValidate: true })
                    }
                    onLocationSelect={handleLocationSelect}
                    error={errors.location?.message}
                    placeholder="Search for a location..."
                  />

                  {/* Mode of Travel */}
                  <GlobalSelect
                    label="Mode of Travel"
                    value={watch("modeOfTravel")}
                    onChange={(e) =>
                      setValue("modeOfTravel", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                    error={errors.modeOfTravel?.message}
                  >
                    <option value="" disabled>
                      Select a mode of travel
                    </option>
                    <option value="car">Car</option>
                    <option value="bus">Bus</option>
                    <option value="train">Train</option>
                    <option value="plane">Plane</option>
                    <option value="walking">Walking</option>
                    <option value="other">Other</option>
                  </GlobalSelect>

                  {/* Notes */}
                  <GlobalTextArea
                    label="Notes"
                    rows={3}
                    placeholder="Add notes about this stop..."
                    value={watch("notes")}
                    onChange={(e) => setValue("notes", e.target.value)}
                    error={errors.notes?.message}
                  />

                  {/* Save Button */}
                  <div className="flex justify-end items-center pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-[#9743AA] to-[#E54295] text-white font-semibold text-[16px] py-2 px-6 rounded-full transition-colors duration-200 disabled:cursor-not-allowed hover:opacity-90"
                    >
                      {isSubmitting
                        ? mode === "edit"
                          ? "Updating..."
                          : "Saving..."
                        : mode === "edit"
                        ? "Update"
                        : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right: Map */}
            <div className="bg-gray-100 h-full relative">
              <LocationMap
                location={selectedLocation}
                onLocationSelect={handleLocationSelect}
                markerColor="#9743AA"
              />

              {/* Close button overlay */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors z-10"
                type="button"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </GlobalModalBorderLess>
    </div>
  );
}
