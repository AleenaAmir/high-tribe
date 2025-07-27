import React, { useState, useCallback, useMemo, useEffect } from "react";
import JourneyMap, { LatLng } from "./JourneyMap";
import GlobalSelect from "@/components/global/GlobalSelect";

import GlobalMultiSelect from "@/components/global/GlobalMultiSelect";
import StepsList from "./StepsList";
import VisibilitySelector from "./VisibilitySelector";
import { useJourneyForm } from "./hooks";
import { apiRequest } from "@/lib/api";
import {
  ExistingJourney,
  Step,
  VisibilityType,
  MapboxFeature,
  ExistingJourneyListItem,
  ValidationErrors,
  StepErrors,
} from "./types";

interface ExistingJourneyProps {
  onClose?: () => void;
}

export default function ExistingJourneyComponent({
  onClose,
}: ExistingJourneyProps) {
  // State for journey list and selection
  const [journeysList, setJourneysList] = useState<ExistingJourneyListItem[]>(
    []
  );
  const [loadingJourneysList, setLoadingJourneysList] = useState(false);
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(
    null
  );
  const [selectedJourney, setSelectedJourney] =
    useState<ExistingJourney | null>(null);
  const [loadingSelectedJourney, setLoadingSelectedJourney] = useState(false);

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEndAndPublish, setIsEndAndPublish] = useState(false);
  const [visibility, setVisibility] = useState<VisibilityType>("public");
  const [newSteps, setNewSteps] = useState<Step[]>([]);
  const [taggedFriends, setTaggedFriends] = useState<
    { id: number; name: string; email?: string; avatar?: string }[]
  >([]);
  const [friendSearchQuery, setFriendSearchQuery] = useState("");

  // Validation states
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});

  // Initialize journey form with limited functionality
  const journeyForm = useJourneyForm();

  // Validation function for steps
  const validateSteps = useCallback(() => {
    const newStepErrors: StepErrors = {};

    if (hasAttemptedSubmit) {
      newSteps.forEach((step, index) => {
        const stepError: ValidationErrors = {};

        // Name validation
        if (!step.name || step.name.trim() === "") {
          stepError.name = "Step name is required";
        } else if (step.name.length > 100) {
          stepError.name = "Step name must not exceed 100 characters";
        }

        // Location validation
        if (!step.location.coords || !step.location.name.trim()) {
          stepError.location = "Location is required";
        }

        // Travel mode validation
        if (!step.mediumOfTravel || step.mediumOfTravel.trim() === "") {
          stepError.travelMode = "Travel medium is required";
        }

        // Date validation
        if (!step.startDate) {
          stepError.startDate = "Start date is required";
        }
        if (!step.endDate) {
          stepError.endDate = "End date is required";
        }
        if (step.startDate && step.endDate) {
          const start = new Date(step.startDate);
          const end = new Date(step.endDate);
          if (end < start) {
            stepError.endDate = "End date cannot be before start date";
          }
        }

        // Category validation
        if (!step.category || step.category.trim() === "") {
          stepError.category = "Stop category is required";
        } else if (
          !journeyForm.stopCategories.find(
            (cat) => cat.id.toString() === step.category
          )
        ) {
          stepError.category = "Invalid stop category";
        }

        // Notes validation
        if (step.notes && step.notes.length > 500) {
          stepError.notes = "Notes must not exceed 500 characters";
        }

        if (Object.keys(stepError).length > 0) {
          newStepErrors[index] = stepError;
        }
      });
    }

    setStepErrors(newStepErrors);
  }, [hasAttemptedSubmit, newSteps, journeyForm.stopCategories]);

  // Run validation when dependencies change
  useEffect(() => {
    validateSteps();
  }, [validateSteps]);

  // Check if form has validation errors
  const hasValidationErrors = useCallback(() => {
    return Object.keys(stepErrors).length > 0;
  }, [stepErrors]);

  // Fetch journeys list on component mount
  useEffect(() => {
    fetchJourneysList();
  }, []);

  // Fetch journeys list from API
  const fetchJourneysList = async () => {
    setLoadingJourneysList(true);
    try {
      const response = await apiRequest<{ posts: any[] }>("posts/list", {
        method: "GET",
      });

      console.log("API Response for journeys list:", response);

      // Map API response to ExistingJourneyListItem structure
      const mappedJourneys: ExistingJourneyListItem[] = (
        response.posts || []
      ).map((post: any) => ({
        id: post.id?.toString() || "",
        title: post.title || "",
        startLocation: post.start_location_name || "",
        endLocation: post.end_location_name || "",
        startDate: post.start_date || "",
        endDate: post.end_date || "",
        status:
          (post.status as "draft" | "pending" | "published" | "archived") ||
          "draft",
        totalSteps: Array.isArray(post.stops) ? post.stops.length : 0,
        thumbnail: post.thumbnail || undefined,
      }));

      setJourneysList(mappedJourneys);
    } catch (error) {
      console.error("Error fetching journeys list:", error);
      setJourneysList([]);
    } finally {
      setLoadingJourneysList(false);
    }
  };

  // Fetch individual journey data
  const fetchJourneyData = async (journeyId: string) => {
    setLoadingSelectedJourney(true);
    try {
      const response = await apiRequest<{ post: any }>(`posts/${journeyId}`, {
        method: "GET",
      });

      // Debug: Log the API response to understand its structure
      console.log("API Response for journey:", response);

      const post = response.post;

      // Map API response to ExistingJourney structure
      const normalizedJourney: ExistingJourney = {
        id: post.id?.toString() || "",
        title: post.title || "",
        description: post.description || "",
        startLocation: {
          coords:
            post.start_lat && post.start_lng
              ? ([
                parseFloat(post.start_lng),
                parseFloat(post.start_lat),
              ] as LatLng)
              : null,
          name: post.start_location_name || "",
        },
        endLocation: {
          coords:
            post.end_lat && post.end_lng
              ? ([parseFloat(post.end_lng), parseFloat(post.end_lat)] as LatLng)
              : null,
          name: post.end_location_name || "",
        },
        startDate: post.start_date || "",
        endDate: post.end_date || "",
        steps: Array.isArray(post.stops)
          ? post.stops.map((stop: any) => ({
            name: stop.title || "",
            location: {
              coords:
                stop.lat && stop.lng
                  ? ([parseFloat(stop.lng), parseFloat(stop.lat)] as LatLng)
                  : null,
              name: stop.location_name || "",
            },
            notes: stop.notes || "",
            media: Array.isArray(stop.media)
              ? stop.media.map((m: any) => ({
                url: m.url,
                type: m.type,
              }))
              : [],
            mediumOfTravel: stop.transport_mode || "",
            startDate: stop.start_date || "",
            endDate: stop.end_date || "",
            category: stop.category?.name || "",
          }))
          : [],
        friends: Array.isArray(post.tagged_users)
          ? post.tagged_users.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
          }))
          : [],
        visibility: (post.privacy === "public"
          ? "public"
          : post.privacy === "private"
            ? "private"
            : "tribe") as VisibilityType,
        createdAt: post.created_at || "",
        updatedAt: post.updated_at || "",
        userId: post.user?.id?.toString() || "",
        tags: [], // No tags in API response
        status:
          (post.status as "draft" | "pending" | "published" | "archived") ||
          "draft",
        userData: post.user
          ? {
            id: post.user.id,
            name: post.user.name,
            email: post.user.email,
            avatar: post.user.avatar,
          }
          : undefined,
      };

      setSelectedJourney(normalizedJourney);

      // Set initial visibility based on fetched data
      if (normalizedJourney.visibility) {
        setVisibility(normalizedJourney.visibility);
      }

      // Set tagged friends if available
      if (normalizedJourney.friends) {
        setTaggedFriends(normalizedJourney.friends);
      }
    } catch (error) {
      console.error("Error fetching journey data:", error);
      setSelectedJourney(null);
    } finally {
      setLoadingSelectedJourney(false);
    }
  };

  // Journey options for dropdown
  const journeyOptions = useMemo(() => {
    return journeysList.map((journey) => ({
      value: journey.id,
      label: journey.title,
    }));
  }, [journeysList]);

  // Combined steps (existing + new)
  const allSteps = useMemo(() => {
    if (!selectedJourney) return newSteps;
    const existingSteps = Array.isArray(selectedJourney.steps)
      ? selectedJourney.steps
      : [];
    return [...existingSteps, ...newSteps];
  }, [selectedJourney, newSteps]);

  // Get filtered users from journey form hook
  const filteredUsers = useMemo(() => {
    return journeyForm.searchUsers(friendSearchQuery);
  }, [journeyForm, friendSearchQuery]);

  // Handle friend search
  const handleFriendSearch = useCallback((query: string) => {
    setFriendSearchQuery(query);
  }, []);

  // Journey selection handler
  const handleJourneySelect = async (journeyId: string) => {
    // Don't proceed if empty value (placeholder) is selected
    if (!journeyId) {
      setSelectedJourneyId(null);
      setSelectedJourney(null);
      setNewSteps([]);
      setStepErrors({});
      setHasAttemptedSubmit(false);
      return;
    }

    try {
      setSelectedJourneyId(journeyId);
      setNewSteps([]); // Reset new steps when switching journeys
      setStepErrors({}); // Reset validation errors
      setHasAttemptedSubmit(false); // Reset submit attempt

      // Fetch the selected journey data
      await fetchJourneyData(journeyId);
    } catch (error) {
      console.error("Error in journey selection:", error);
      // Reset states on error
      setSelectedJourneyId(null);
      setSelectedJourney(null);
      setNewSteps([]);
      setStepErrors({});
      setHasAttemptedSubmit(false);
    }
  };

  // Focus map on selected journey when journey data is loaded
  useEffect(() => {
    if (
      selectedJourney &&
      selectedJourney.startLocation &&
      selectedJourney.startLocation.coords &&
      Array.isArray(selectedJourney.startLocation.coords) &&
      selectedJourney.startLocation.coords.length >= 2
    ) {
      journeyForm.flyToOnMap(
        selectedJourney.startLocation.coords[0],
        selectedJourney.startLocation.coords[1]
      );
    }
  }, [selectedJourney]);

  // Step suggestions - now allows any location selection
  const fetchStepSuggestions = useCallback(
    async (query: string): Promise<MapboxFeature[]> => {
      let url: string;

      if (!query || query.trim() === "") {
        // When no query, fetch popular places globally
        url = `https://api.mapbox.com/geocoding/v5/mapbox.places/places.json?types=poi,address&limit=20&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
      } else {
        // When there's a query, perform global search
        url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?limit=20&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
          }`;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();

        return data.features || [];
      } catch (error) {
        console.error("Error fetching step suggestions:", error);
        return [];
      }
    },
    []
  );

  // Form submission handlers
  const handleJourneySubmission = async (status: "draft" | "published") => {
    if (!selectedJourney) return;

    // Set submit attempt to show validation errors
    setHasAttemptedSubmit(true);

    // Check for validation errors
    if (hasValidationErrors()) {
      console.log("Validation errors found, preventing submission");
      return;
    }

    const isSubmitting = status === "draft";
    const isEndAndPublish = status === "published";

    if (isSubmitting) setIsSubmitting(true);
    if (isEndAndPublish) setIsEndAndPublish(true);

    try {
      // Check if any new steps have media files
      const hasMediaFiles = newSteps.some(
        (step) => step.media && step.media.length > 0
      );

      newSteps.forEach((step, idx) => {
        console.log(
          `New Step ${idx + 1} - Media files:`,
          step.media?.length || 0
        );
        if (step.media && step.media.length > 0) {
          step.media.forEach((file, fileIdx) => {
            console.log(`  File ${fileIdx + 1}:`, file.file_name, file.type);
          });
        }
      });

      if (hasMediaFiles) {
        const formData = new FormData();

        formData.append("privacy", visibility);

        formData.append("type", "mapping_journey");
        formData.append("status", status);
        formData.append("_method", "PUT");

        // Add tagged user IDs
        taggedFriends.forEach((friend, index) => {
          formData.append(`tagged_users[${index}]`, friend.id.toString());
        });

        // Add stops and media - only new steps
        newSteps.forEach((step, stepIdx) => {
          console.log(`Step ${stepIdx + 1} category:`, step.category);
          formData.append(`stops[${stepIdx}][title]`, step.name);
          // Use the actual selected category instead of hardcoded value
          formData.append(
            `stops[${stepIdx}][stop_category_id]`,
            step.category ? step.category : "1"
          );
          formData.append(
            `stops[${stepIdx}][location][name]`,
            step.location.name
          );
          formData.append(
            `stops[${stepIdx}][location][lat]`,
            step.location.coords?.[1]?.toString() || ""
          );
          formData.append(
            `stops[${stepIdx}][location][lng]`,
            step.location.coords?.[0]?.toString() || ""
          );
          // Transport mode mapping to match API expectations
          const modeMapping: { [key: string]: string } = {
            plane: "airplane",
            train: "train",
            car: "car",
            bus: "bus",
            walk: "foot",
            bike: "bike",
            info: "other",
          };
          const transportMode =
            modeMapping[step.mediumOfTravel] || step.mediumOfTravel || "car";

          formData.append(`stops[${stepIdx}][transport_mode]`, transportMode);
          formData.append(`stops[${stepIdx}][start_date]`, step.startDate);
          formData.append(`stops[${stepIdx}][end_date]`, step.endDate);
          formData.append(`stops[${stepIdx}][notes]`, step.notes || "");
          if (step.media && Array.isArray(step.media)) {
            step.media.forEach((file, fileIdx) => {
              formData.append(
                `stops[${stepIdx}][media][${fileIdx}]`,
                file.fileObject,
                file.file_name
              );
            });
          }
        });

        console.log("=== FormData being sent ===");
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(
              `${key}:`,
              `File(${value.name}, ${value.size} bytes, ${value.type})`
            );
          } else {
            console.log(`${key}:`, value);
          }
        }
        console.log("=== End FormData ===");

        // API call to update/publish journey with FormData
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token") || "<PASTE_VALID_TOKEN_HERE>"
            : "<PASTE_VALID_TOKEN_HERE>";
        const response = await fetch(
          `https://api.hightribe.com/api/posts/${selectedJourney.id}`,
          {
            method: "POST", // Use POST with _method=PUT for Laravel
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              // DO NOT set Content-Type!
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server error response:", errorData);
          throw new Error(
            `HTTP ${response.status}: ${JSON.stringify(errorData)}`
          );
        }

        const result = await response.json();
        console.log("Success response:", result);
      } else {
        const newStopsData = newSteps
          .filter((step) => step.location.coords && step.location.name) // Only include steps with valid location
          .map((step) => {
            console.log(
              `Processing step "${step.name}" with category:`,
              step.category
            );
            // Transport mode mapping to match API expectations
            const modeMapping: { [key: string]: string } = {
              plane: "airplane",
              train: "train",
              car: "car",
              bus: "bus",
              walk: "foot",
              bike: "bike",
              info: "other",
            };
            const transportMode =
              modeMapping[step.mediumOfTravel] || step.mediumOfTravel || "car";

            return {
              title: step.name,
              location: {
                name: step.location.name,
                lat: step.location.coords
                  ? step.location.coords[1].toString()
                  : null,
                lng: step.location.coords
                  ? step.location.coords[0].toString()
                  : null,
              },
              transport_mode: transportMode,
              start_date: step.startDate,
              end_date: step.endDate,
              notes: step.notes,
              stop_category_id: step.category ? parseInt(step.category) : 1, // Use actual selected category
              // Don't include media for now - need proper file upload handling
              media: step.media || [],
            };
          });

        // Combine existing and new stops

        const updateData = {
          id: selectedJourney.id,
          // title: selectedJourney.title,
          // description: selectedJourney.description,
          // start_location_name: selectedJourney.startLocation.name,
          // start_lat: selectedJourney.startLocation.coords
          //   ? selectedJourney.startLocation.coords[1].toString()
          //   : null,
          // start_lng: selectedJourney.startLocation.coords
          //   ? selectedJourney.startLocation.coords[0].toString()
          //   : null,
          // end_location_name: selectedJourney.endLocation.name,
          // end_lat: selectedJourney.endLocation.coords
          //   ? selectedJourney.endLocation.coords[1].toString()
          //   : null,
          // end_lng: selectedJourney.endLocation.coords
          //   ? selectedJourney.endLocation.coords[0].toString()
          //   : null,
          // start_date: selectedJourney.startDate,
          // end_date: selectedJourney.endDate,
          privacy: visibility,
          planning_mode: "manual",
          date_mode: "specific",
          type: "mapping_journey",
          tagged_user_ids: taggedFriends.map((friend) => friend.id),
          status: status,
          stops: newStopsData,
        };

        console.log("=== JSON Data being sent ===");
        console.log(JSON.stringify(updateData, null, 2));
        console.log("=== End JSON Data ===");

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token") || "<PASTE_VALID_TOKEN_HERE>"
            : "<PASTE_VALID_TOKEN_HERE>";
        // API call to update/publish journey
        const response = await fetch(
          `https://api.hightribe.com/api/posts/${selectedJourney.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(updateData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server error response:", errorData);
          throw new Error(
            `HTTP ${response.status}: ${JSON.stringify(errorData)}`
          );
        }

        const result = await response.json();
        console.log("Success response:", result);
      }

      // Reset new steps after successful submission
      setNewSteps([]);
      setStepErrors({});
      setHasAttemptedSubmit(false);

      // Refresh journeys list to get updated data
      await fetchJourneysList();

      // Refresh current journey data
      if (selectedJourneyId) {
        await fetchJourneyData(selectedJourneyId);
      }

      // Close the modal after successful update/publication
      onClose?.();
    } catch (error) {
      console.error(
        `Error ${status === "draft" ? "updating" : "publishing"
        } journey with ${status} status:`,
        error
      );
    } finally {
      if (isSubmitting) setIsSubmitting(false);
      if (isEndAndPublish) setIsEndAndPublish(false);
    }
  };

  const handleUpdateAndPublish = async () => {
    await handleJourneySubmission("draft");
  };

  const handleEndAndPublish = async () => {
    await handleJourneySubmission("published");
  };

  // Get all coordinates for map display
  const allStepCoordinates = useMemo(() => {
    const coords: LatLng[] = [];

    // Add coordinates from all steps (existing + new)
    allSteps.forEach((step) => {
      if (
        step.location &&
        step.location.coords &&
        Array.isArray(step.location.coords) &&
        step.location.coords.length >= 2
      ) {
        coords.push(step.location.coords);
      }
    });

    return coords;
  }, [allSteps]);

  return (
    <div
      className="max-h-[90vh]  h-full  overflow-y-auto
  [&::-webkit-scrollbar]:w-1
         [&::-webkit-scrollbar-track]:bg-[#1063E0]
         [&::-webkit-scrollbar-thumb]:bg-[#D9D9D9] 
         dark:[&::-webkit-scrollbar-track]:bg-[#D9D9D9]
         dark:[&::-webkit-scrollbar-thumb]:bg-[#1063E0]
  "
    >
      <div className="grid lg:grid-cols-2 grid-cols-1">
        {/* Form Section */}
        <div>
          {/* Header */}
          <div className="w-full p-3 border-b border-[#D9D9D9] rounded-tl-[20px] bg-white">
            <h4 className="text-[18px] md:text-[22px] text-[#111111] font-bold text-center">
              My Journey
            </h4>
            <p className="text-[10px] text-[#706F6F] text-center">
              Share your travel experience with the world
            </p>
          </div>

          {/* Form Content */}
          <form className="p-1">
            <div
              className="flex flex-col gap-2 max-h-[500px] lg:min-h-[500px] h-full overflow-y-auto px-6 py-2 
           [&::-webkit-scrollbar]:w-1
           [&::-webkit-scrollbar-track]:bg-[#1063E0]
           [&::-webkit-scrollbar-thumb]:bg-[#D9D9D9] 
           dark:[&::-webkit-scrollbar-track]:bg-[#D9D9D9]
           dark:[&::-webkit-scrollbar-thumb]:bg-[#1063E0]"
            >
              {/* Journey Selection Dropdown */}
              <div className="relative">
                <GlobalSelect
                  label="Select your journey"
                  value={selectedJourneyId || ""}
                  onChange={(e) => handleJourneySelect(e.target.value)}
                >
                  <option value="" disabled>
                    {loadingJourneysList
                      ? "Loading journeys..."
                      : journeysList.length === 0
                        ? "No journeys found"
                        : "Select your journey"}
                  </option>
                  {journeyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </GlobalSelect>
              </div>

              {/* Loading indicator for selected journey */}
              {loadingSelectedJourney && (
                <div className="mb-4 flex items-center justify-center py-8">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                    <span className="text-gray-600">
                      Loading journey details...
                    </span>
                  </div>
                </div>
              )}

              {/* Journey Details */}
              {/* Integrated Steps Section - Always Visible */}
              <div
                className={`mb-4 ${!selectedJourney || loadingSelectedJourney
                    ? "opacity-50 pointer-events-none"
                    : ""
                  }`}
              >
                <div className="border-t border-gray-200 pt-4">
                  <StepsList
                    steps={newSteps}
                    onStepsChange={setNewSteps}
                    canAddStep={!!selectedJourney && !loadingSelectedJourney}
                    fetchStepSuggestions={fetchStepSuggestions}
                    stopCategories={journeyForm.stopCategories}
                    loadingCategories={journeyForm.loadingCategories}
                    stepErrors={stepErrors}
                    showAddButton={true}
                    previousSteps={
                      Array.isArray(selectedJourney?.steps)
                        ? selectedJourney.steps
                        : []
                    }
                    showPreviousSteps={!!selectedJourney}
                    userData={selectedJourney?.userData}
                    journeyData={
                      selectedJourney
                        ? {
                          title: selectedJourney.title,
                          startLocation: selectedJourney.startLocation,
                          endLocation: selectedJourney.endLocation,
                          startDate: selectedJourney.startDate,
                          endDate: selectedJourney.endDate,
                        }
                        : undefined
                    }
                  />
                </div>
              </div>

              {/* Tagged Friends Section */}
              <div
                className={`mb-4 ${!selectedJourney || loadingSelectedJourney
                    ? "opacity-50 pointer-events-none"
                    : ""
                  }`}
              >
                <GlobalMultiSelect
                  label="Tag Friends"
                  value={taggedFriends}
                  onChange={setTaggedFriends}
                  placeholder=" "
                  suggestions={filteredUsers}
                  onSearch={handleFriendSearch}
                  loading={journeyForm.loadingUsers}
                  maxSelections={10}
                />
              </div>

              <VisibilitySelector value={visibility} onChange={setVisibility} />

              {/* Privacy controlled by existing VisibilitySelector in form actions */}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end p-3 border-t border-[#D9D9D9] bg-white">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleEndAndPublish}
                  disabled={
                    !selectedJourney || isSubmitting || loadingSelectedJourney
                  }
                  className={`ml-4 px-6 py-2 text-[12px] text-white rounded-lg border font-semibold transition-all ${!selectedJourney || isSubmitting || loadingSelectedJourney
                      ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "border-blue-600 text-black bg-white bg-gradient-to-r from-[#257CFF] to-[#1063E0] cursor-pointer"
                    }`}
                >
                  {isEndAndPublish ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                      Publishing...
                    </div>
                  ) : (
                    "End Journey"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleUpdateAndPublish}
                  disabled={
                    !selectedJourney || isSubmitting || loadingSelectedJourney
                  }
                  className={`ml-4 px-6 py-2 text-[12px] rounded-lg border font-semibold transition-all ${!selectedJourney || isSubmitting || loadingSelectedJourney
                      ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "border-blue-600 text-black bg-white hover:bg-blue-50 cursor-pointer"
                    }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                      Updating...
                    </div>
                  ) : (
                    "Update Journey"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Map Section - Always Visible */}
        <div className="h-full w-full relative">
          {/* Map Component - Always Rendered */}
          <JourneyMap
            ref={journeyForm.mapRef}
            startLocation={
              selectedJourney?.startLocation?.coords &&
                Array.isArray(selectedJourney.startLocation.coords) &&
                selectedJourney.startLocation.coords.length >= 2
                ? selectedJourney.startLocation.coords
                : null
            }
            endLocation={
              selectedJourney?.endLocation?.coords &&
                Array.isArray(selectedJourney.endLocation.coords) &&
                selectedJourney.endLocation.coords.length >= 2
                ? selectedJourney.endLocation.coords
                : null
            }
            steps={selectedJourney ? allStepCoordinates : []}
            onStartChange={() => { }} // Disable editing existing locations
            onEndChange={() => { }} // Disable editing existing locations
            onStepsChange={() => { }} // Disable bulk step changes
            activeMapSelect="start" // Map stays non-interactive
            setActiveMapSelect={() => { }} // Disable map selection mode changes
          />
        </div>
      </div>
    </div>
  );
}
