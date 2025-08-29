"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlobalModalBorderLess from "../global/GlobalModalBorderLess";
import GlobalTextInput from "../global/GlobalTextInput";
import GlobalSelect from "../global/GlobalSelect";
import GlobalDateInput from "../global/GlobalDateInput";
import Location from "../dashboard/svgs/Location";
import { toast } from "react-hot-toast";
import Image from "next/image";
import {
  fetchGooglePlaceSuggestions,
  getCoordinatesForGooglePlace,
} from "@/lib/googlePlaces";

// Helper function to get Google Place photo URL
const getGooglePhotoUrl = (photoReference: string, maxWidth = 1600) => {
  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_LOCATION_API_KEY;
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
};

// ── Validation ────────────────────────────────────────────────────────────────
const journeyFormSchema = z
  .object({
    title: z
      .string()
      .min(3, "Journey name must be at least 3 characters")
      .max(50, "Journey name must be less than 50 characters"),
    startLocationName: z
      .string()
      .min(2, "Starting point must be at least 2 characters"),
    endLocationName: z
      .string()
      .min(2, "End point must be at least 2 characters"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    noOfPeople: z
      .string()
      .min(1, "No of people is required")
      .regex(/^\d+$/, "No of people must be a number"),
    imageUrl: z.string().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return !isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start;
    },
    { message: "End date must be after start date", path: ["endDate"] }
  );

type JourneyFormData = z.infer<typeof journeyFormSchema>;

// ── Location Selector Component ───────────────────────────────────────────────
interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (
    coords: [number, number],
    name: string,
    placeId?: string
  ) => void;
  error?: string;
  placeholder?: string;
  label: string;
}

function LocationSelector({
  value,
  onChange,
  onLocationSelect,
  error,
  placeholder,
  label,
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
          onLocationSelect(coordinates, selectedText, suggestion.place_id);
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
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          className={`rounded-lg border py-3 px-5 text-[12px] w-full h-[40px] placeholder:text-[#AFACAC] focus:outline-none focus:ring-2 focus:ring-[#9743AA] transition-all ${
            error ? "border-red-500" : "border-[#848484]"
          }`}
          // placeholder={placeholder || "Search for a location..."}
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
export default function NewJourneyExplore({
  newJourney,
  setNewJourney,
  // onJourneyCreated,
  setShowJourneyList,
  editJourneyData,
  onJourneyUpdated,
}: {
  newJourney: boolean;
  setNewJourney: (v: boolean) => void;
  // onJourneyCreated?: (journeyData: JourneyFormData) => void;
  setShowJourneyList: (v: boolean) => void;
  editJourneyData?: any;
  onJourneyUpdated?: (updatedJourney: any | null) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<JourneyFormData>({
    resolver: zodResolver(journeyFormSchema),
    defaultValues: {
      title: editJourneyData?.journeyName || editJourneyData?.title || "",
      startLocationName:
        editJourneyData?.startingPoint ||
        editJourneyData?.start_location_name ||
        "",
      endLocationName:
        editJourneyData?.endPoint || editJourneyData?.end_location_name || "",
      startDate: editJourneyData?.startDate || "",
      endDate: editJourneyData?.endDate || "",
      noOfPeople:
        editJourneyData?.number_of_people?.toString() ||
        editJourneyData?.travelers?.toString() ||
        "",
      imageUrl: editJourneyData?.image_url || "",
    },
  });

  // State for location coordinates and background image
  const [startLocation, setStartLocation] = useState<{
    coords: [number, number] | null;
    name: string;
  }>({
    coords: null,
    name: "",
  });

  const [endLocation, setEndLocation] = useState<{
    coords: [number, number] | null;
    name: string;
  }>({
    coords: null,
    name: "",
  });

  const [backgroundImage, setBackgroundImage] = useState<string>(
    "https://res.cloudinary.com/dtfzklzek/image/upload/v1755211203/794_1_x4c1uv.png"
  );
  const [isUpdatingBackground, setIsUpdatingBackground] = useState(false);

  // Initialize the image URL in the form when component mounts
  useEffect(() => {
    setValue("imageUrl", backgroundImage, { shouldValidate: true });
  }, [setValue, backgroundImage]);

  // Populate form with edit data when editJourneyData changes
  useEffect(() => {
    if (editJourneyData) {
      console.log("Populating form with edit data:", editJourneyData);

      setValue(
        "title",
        editJourneyData.journeyName || editJourneyData.title || "",
        {
          shouldValidate: true,
        }
      );
      setValue(
        "startLocationName",
        editJourneyData.startingPoint ||
          editJourneyData.start_location_name ||
          "",
        {
          shouldValidate: true,
        }
      );
      setValue(
        "endLocationName",
        editJourneyData.endPoint || editJourneyData.end_location_name || "",
        {
          shouldValidate: true,
        }
      );
      setValue("startDate", editJourneyData.startDate || "", {
        shouldValidate: true,
      });
      setValue("endDate", editJourneyData.endDate || "", {
        shouldValidate: true,
      });
      setValue(
        "noOfPeople",
        editJourneyData.number_of_people?.toString() ||
          editJourneyData.travelers?.toString() ||
          "",
        {
          shouldValidate: true,
        }
      );
      setValue("imageUrl", editJourneyData.image_url || backgroundImage, {
        shouldValidate: true,
      });

      // Set location coordinates if available
      if (editJourneyData.start_lat && editJourneyData.start_lng) {
        setStartLocation({
          coords: [
            parseFloat(editJourneyData.start_lng.toString()),
            parseFloat(editJourneyData.start_lat.toString()),
          ],
          name:
            editJourneyData.startingPoint ||
            editJourneyData.start_location_name ||
            "",
        });
      }
      if (editJourneyData.end_lat && editJourneyData.end_lng) {
        setEndLocation({
          coords: [
            parseFloat(editJourneyData.end_lng.toString()),
            parseFloat(editJourneyData.end_lat.toString()),
          ],
          name:
            editJourneyData.endPoint || editJourneyData.end_location_name || "",
        });
      }

      // Set background image if available
      if (editJourneyData.image_url) {
        setBackgroundImage(editJourneyData.image_url);
      }
    }
  }, [editJourneyData, setValue, backgroundImage]);

  // Function to get Google Place photo for location
  const getGooglePlacePhoto = useCallback(async (placeId: string) => {
    try {
      const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_LOCATION_API_KEY;
      if (!GOOGLE_API_KEY) {
        console.warn("Google API key not found");
        return null;
      }

      console.log("Fetching Google Place photo for placeId:", placeId);

      // Get place details to check if photos are available
      const detailsResponse = await fetch(
        `/api/google-places?action=details&place_id=${placeId}&fields=place_id,formatted_address,geometry,name,photos`
      );

      if (!detailsResponse.ok) {
        throw new Error(`Google Places API error: ${detailsResponse.status}`);
      }

      const detailsData = await detailsResponse.json();
      console.log("Google Places details response:", detailsData);

      if (
        detailsData.status === "REQUEST_DENIED" ||
        detailsData.status === "OVER_QUERY_LIMIT"
      ) {
        console.warn("Google Places API error, falling back to Mapbox");
        return null;
      }

      if (
        !detailsData.result ||
        !detailsData.result.photos ||
        detailsData.result.photos.length === 0
      ) {
        console.warn("No photos available for this location");
        return null;
      }

      // Use the first photo (usually the best one)
      const photo = detailsData.result.photos[0];
      console.log("Selected photo:", photo);

      // Use our API proxy to get the photo URL
      const photoResponse = await fetch(
        `/api/google-places?action=photo&maxwidth=1600&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`
      );

      if (!photoResponse.ok) {
        throw new Error(
          `Google Places Photos API error: ${photoResponse.status}`
        );
      }

      const photoData = await photoResponse.json();
      console.log("Photo response:", photoData);

      if (
        photoData.status === "REQUEST_DENIED" ||
        photoData.status === "OVER_QUERY_LIMIT"
      ) {
        console.warn("Google Places Photos API error, falling back to Mapbox");
        return null;
      }

      const photoUrl = photoData.photo_url;
      if (!photoUrl) {
        console.warn("No photo URL returned from API");
        return null;
      }

      console.log("Photo URL:", photoUrl);

      // Test if the image loads successfully
      const img = new window.Image();
      return new Promise<string | null>((resolve) => {
        img.onload = () => {
          console.log("Google Place photo loaded successfully");
          resolve(photoUrl);
        };
        img.onerror = () => {
          console.warn(
            "Failed to load Google Place photo, falling back to Mapbox"
          );
          resolve(null);
        };
        img.src = photoUrl;
      });
    } catch (error) {
      console.error("Error getting Google Place photo:", error);
      return null;
    }
  }, []);

  // Function to get Mapbox static image for location
  const getMapboxStaticImage = useCallback(async (coords: [number, number]) => {
    try {
      const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
      if (!MAPBOX_TOKEN) {
        console.warn("Mapbox token not found, using default background");
        return null;
      }

      // Get a static map image from Mapbox
      const [lng, lat] = coords;
      const width = 800;
      const height = 600;
      const zoom = 12;

      // Fixed URL format with proper pin marker syntax
      const imageUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${lng},${lat})/${lng},${lat},${zoom}/${width}x${height}@2x?access_token=${MAPBOX_TOKEN}`;

      // Test if the image loads successfully
      const img = new window.Image();
      return new Promise<string | null>((resolve) => {
        img.onload = () => resolve(imageUrl);
        img.onerror = () => {
          console.warn(
            "Failed to load Mapbox static image, using default background"
          );
          resolve(null);
        };
        img.src = imageUrl;
      });
    } catch (error) {
      console.error("Error getting Mapbox static image:", error);
      return null;
    }
  }, []);

  // Function to update background image based on location
  const updateBackgroundImage = useCallback(
    async (coords: [number, number], placeId?: string) => {
      console.log(
        "Updating background image with coords:",
        coords,
        "placeId:",
        placeId
      );
      setIsUpdatingBackground(true);
      try {
        let newBackgroundImage: string | null = null;

        // Try Google Places photo first if placeId is available
        if (placeId) {
          console.log("Attempting to get Google Place photo...");
          newBackgroundImage = await getGooglePlacePhoto(placeId);
          console.log("Google Place photo result:", newBackgroundImage);
        }

        // Fallback to Mapbox static image if Google photo is not available
        if (!newBackgroundImage) {
          console.log("Falling back to Mapbox static image...");
          newBackgroundImage = await getMapboxStaticImage(coords);
          console.log("Mapbox static image result:", newBackgroundImage);
        }

        if (newBackgroundImage) {
          console.log("Setting new background image:", newBackgroundImage);
          setBackgroundImage(newBackgroundImage);
          // Update the form field with the image URL
          setValue("imageUrl", newBackgroundImage, { shouldValidate: true });
        } else {
          console.log("No background image available, keeping default");
          // Set the default background image URL
          setValue("imageUrl", backgroundImage, { shouldValidate: true });
        }
      } catch (error) {
        console.error("Error updating background image:", error);
      } finally {
        setIsUpdatingBackground(false);
      }
    },
    [getGooglePlacePhoto, getMapboxStaticImage, setValue, backgroundImage]
  );

  // Handle start location selection
  const handleStartLocationSelect = async (
    coords: [number, number],
    name: string,
    placeId?: string
  ) => {
    setStartLocation({ coords, name });
    setValue("startLocationName", name, { shouldValidate: true });

    // Update background image with the selected start location
    await updateBackgroundImage(coords, placeId);
  };

  // Handle end location selection
  const handleEndLocationSelect = async (
    coords: [number, number],
    name: string,
    placeId?: string
  ) => {
    setEndLocation({ coords, name });
    setValue("endLocationName", name, { shouldValidate: true });

    // Update background image with the selected end location
    await updateBackgroundImage(coords, placeId);
  };

  const onSubmit = async (data: JourneyFormData) => {
    try {
      // ⚠️ Move these to env/secure storage, not hardcoded
      const API_BASE = "https://api.hightribe.com";
      const TOKEN =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || "<PASTE_VALID_TOKEN_HERE>"
          : "<PASTE_VALID_TOKEN_HERE>";
      console.log(TOKEN, "TOKEN");

      const user_id = JSON.parse(localStorage.getItem("user") || "{}").id;

      // Use actual coordinates if available, otherwise fallback to dummy values
      const startLat = startLocation.coords
        ? startLocation.coords[1].toString()
        : "31.5497";
      const startLng = startLocation.coords
        ? startLocation.coords[0].toString()
        : "74.3436";
      const endLat = endLocation.coords
        ? endLocation.coords[1].toString()
        : "36.3167";
      const endLng = endLocation.coords
        ? endLocation.coords[0].toString()
        : "74.6500";

      // Prepare payload for your API (map to their expected snake_case keys)
      const payload = {
        title: data.title,
        start_location_name: data.startLocationName,
        start_lat: startLat,
        start_lng: startLng,
        end_location_name: data.endLocationName,
        end_lat: endLat,
        end_lng: endLng,
        start_date: data.startDate,
        end_date: data.endDate,
        user_id: user_id, // TODO: replace with actual auth/user context
        number_of_people: data.noOfPeople,
        image_url: data.imageUrl || backgroundImage, // Include the image URL in the payload
      };

      let response;
      let isEditMode = !!editJourneyData;

      if (isEditMode) {
        // Update existing journey
        response = await fetch(
          `${API_BASE}/api/journeys/${editJourneyData.id}`,
          {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // Create new journey
        response = await fetch(`${API_BASE}/api/journeys`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (response.status === 201 || response.status === 200) {
        const successMessage = isEditMode
          ? "Journey updated successfully!"
          : "Journey created successfully!";
        toast.success(successMessage);
      }

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
          `API request failed: ${response.status} ${response.statusText} ${text}`
        );
      }

      const result = await response.json();

      if (isEditMode && onJourneyUpdated) {
        // Update the journey data in the parent component
        const updatedJourney = {
          ...editJourneyData,
          ...payload,
          journeyName: payload.title,
          startingPoint: payload.start_location_name,
          endPoint: payload.end_location_name,
        };
        onJourneyUpdated(updatedJourney);
      } else {
        setShowJourneyList(true);
      }

      reset();
      setNewJourney(false);
    } catch (err) {
      console.error("Error saving journey:", err);
      toast.error("Failed to save journey. Please try again.");
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // prevent closing while submitting
    reset();
    setStartLocation({ coords: null, name: "" });
    setEndLocation({ coords: null, name: "" });
    setBackgroundImage(
      "https://res.cloudinary.com/dtfzklzek/image/upload/v1755211203/794_1_x4c1uv.png"
    );
    setIsUpdatingBackground(false);
    setNewJourney(false);
    // Reset edit data when closing
    if (editJourneyData && onJourneyUpdated) {
      onJourneyUpdated(null);
    }
  };

  return (
    <div>
      <GlobalModalBorderLess
        isOpen={newJourney}
        onClose={handleClose}
        maxWidth="max-w-[800px]"
        customPadding="p-0"
      >
        <div className="overflow-y-scroll w-full rounded-[20px] scrollbar-hide h-[600px] max-w-[800px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full rounded-lg">
            {/* Left: Visual */}
            <div
              className="relative bg-cover bg-center rounded-l-md hidden lg:grid"
              style={{
                backgroundImage: `url(${backgroundImage})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-l-lg" />

              {/* Loading overlay */}
              {isUpdatingBackground && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-l-lg">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-sm">Updating map...</p>
                  </div>
                </div>
              )}

              <div className="absolute bottom-6 left-6 text-white">
                <Image
                  src="/logowhite.svg"
                  alt="New Journey Explore"
                  width={130}
                  height={47}
                />
                <h2 className="text-xl text-semibold mt-3">
                  {watch("title") ? watch("title") : "Start New Journey"}
                </h2>
                <p className="text-sm opacity-90">
                  {watch("endDate") && (
                    <>
                      {(() => {
                        const start = watch("startDate");
                        const end = watch("endDate");
                        if (start && end) {
                          const startDate = new Date(start);
                          const endDate = new Date(end);
                          const diffTime =
                            endDate.getTime() - startDate.getTime();
                          const diffDays =
                            Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                          if (!isNaN(diffDays) && diffDays > 0) {
                            return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
                          }
                        }
                        return null;
                      })()}
                    </>
                  )}{" "}
                  {watch("noOfPeople") && `• ${watch("noOfPeople")} Travelers`}
                </p>
              </div>
            </div>

            {/* Right: Form */}
            <div className=" flex flex-col  bg-white justify-center h-full">
              <div className="flex justify-center items-center p-4">
                <div className="text-center">
                  <h2 className="text-[22px] font-bold">
                    {editJourneyData ? "Edit Journey" : "Start New Journey"}
                  </h2>

                  {/* <p className="text-[10px] leading-relaxed">
                    Plan your next adventure by sharing the details of your
                    trip. Fill in where you're going, when you're leaving, and
                    who's traveling with you.
                  </p> */}
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full relative z-10 p-6 pt-0"
              >
                {/* Title */}
                <GlobalTextInput
                  label="Journey Name"
                  error={errors.title?.message}
                  {...register("title")}
                />

                {/* Start Location with suggestions */}
                <LocationSelector
                  value={watch("startLocationName")}
                  onChange={(value) =>
                    setValue("startLocationName", value, {
                      shouldValidate: true,
                    })
                  }
                  onLocationSelect={handleStartLocationSelect}
                  error={errors.startLocationName?.message}
                  placeholder=""
                  label="Starting Point"
                />

                {/* End Location with suggestions */}
                <LocationSelector
                  value={watch("endLocationName")}
                  onChange={(value) =>
                    setValue("endLocationName", value, { shouldValidate: true })
                  }
                  onLocationSelect={handleEndLocationSelect}
                  error={errors.endLocationName?.message}
                  placeholder=""
                  label="End Point"
                />

                {/* Dates */}

                <GlobalDateInput
                  label="Start Date"
                  error={errors.startDate?.message}
                  value={watch("startDate")}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setValue("startDate", e.target.value, {
                      shouldValidate: true,
                    })
                  }
                />

                <GlobalDateInput
                  label="End Date"
                  error={errors.endDate?.message}
                  value={watch("endDate")}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setValue("endDate", e.target.value, {
                      shouldValidate: true,
                    })
                  }
                />

                {/* Who */}
                {/* <GlobalSelect
                  label="Who"
                  error={errors.who?.message}
                  {...register("who")}
                >
                  <option value="">Select travelers</option>
                  <option value="solo">Solo Traveler</option>
                  <option value="couple">Couple</option>
                  <option value="family">Family</option>
                  <option value="group">Group</option>
                </GlobalSelect> */}

                {/* Budget */}
                {/* <div className="relative">
                  <GlobalTextInput
                    label="Budget"
                   
                    error={errors.budget?.message}
                    {...register("budget")}
                  />
                  <div className="absolute right-3 top-9">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-400"
                    >
                      <circle cx="12" cy="8" r="7"></circle>
                      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"></path>
                    </svg>
                  </div>
                </div> */}

                <GlobalTextInput
                  label="No of People"
                  type="number"
                  min={1}
                  error={errors.noOfPeople?.message}
                  {...register("noOfPeople")}
                />

                {/* Create */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                  className="w-full max-w-[300px] flex items-center justify-center mx-auto bg-gradient-to-r from-[#9743AA] to-[#E54295] text-white font-semibold text-[16px] py-2 px-4 rounded-full transition-colors duration-200 mt-6 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? editJourneyData
                      ? "Updating..."
                      : "Creating..."
                    : editJourneyData
                    ? "Update Journey"
                    : "Create Journey"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </GlobalModalBorderLess>
    </div>
  );
}
