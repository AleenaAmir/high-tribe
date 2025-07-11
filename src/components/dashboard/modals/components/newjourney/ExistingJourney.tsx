import React, { useState, useCallback, useMemo, useEffect } from "react";
import JourneyMap, { LatLng } from "./JourneyMap";
import GlobalSelect from "@/components/global/GlobalSelect";
import GlobalTextArea from "@/components/global/GlobalTextArea";
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
} from "./types";

export default function ExistingJourneyComponent() {
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
  const [visibility, setVisibility] = useState<VisibilityType>("public");
  const [newSteps, setNewSteps] = useState<Step[]>([]);
  const [taggedFriends, setTaggedFriends] = useState<
    { id: number; name: string; email?: string; avatar?: string }[]
  >([]);
  const [friendSearchQuery, setFriendSearchQuery] = useState("");

  // Initialize journey form with limited functionality
  const journeyForm = useJourneyForm();

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
      };

      console.log("Normalized journey:", normalizedJourney);
      console.log("Start location:", normalizedJourney.startLocation);
      console.log("End location:", normalizedJourney.endLocation);
      console.log("Steps:", normalizedJourney.steps);

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
      return;
    }

    try {
      setSelectedJourneyId(journeyId);
      setNewSteps([]); // Reset new steps when switching journeys

      // Fetch the selected journey data
      await fetchJourneyData(journeyId);
    } catch (error) {
      console.error("Error in journey selection:", error);
      // Reset states on error
      setSelectedJourneyId(null);
      setSelectedJourney(null);
      setNewSteps([]);
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
  }, [selectedJourney, journeyForm]);

  // Step suggestions filtered between start and end of selected journey
  const fetchStepSuggestions = useCallback(
    async (query: string): Promise<MapboxFeature[]> => {
      if (
        !selectedJourney ||
        !selectedJourney.startLocation ||
        !selectedJourney.endLocation ||
        !selectedJourney.startLocation.coords ||
        !selectedJourney.endLocation.coords ||
        !Array.isArray(selectedJourney.startLocation.coords) ||
        !Array.isArray(selectedJourney.endLocation.coords) ||
        selectedJourney.startLocation.coords.length < 2 ||
        selectedJourney.endLocation.coords.length < 2
      ) {
        return [];
      }

      // Calculate bounding box with some padding for better coverage
      const [x1, y1] = selectedJourney.startLocation.coords;
      const [x2, y2] = selectedJourney.endLocation.coords;
      const padding = 0.5; // degrees padding
      const minX = Math.min(x1, x2) - padding;
      const maxX = Math.max(x1, x2) + padding;
      const minY = Math.min(y1, y2) - padding;
      const maxY = Math.max(y1, y2) + padding;

      let url: string;

      if (!query || query.trim() === "") {
        // When no query, fetch popular places in the area using bbox
        url = `https://api.mapbox.com/geocoding/v5/mapbox.places/places.json?bbox=${minX},${minY},${maxX},${maxY}&types=poi,address&limit=10&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
      } else {
        // When there's a query, search with proximity to route center
        const centerLng = (x1 + x2) / 2;
        const centerLat = (y1 + y2) / 2;
        url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?proximity=${centerLng},${centerLat}&bbox=${minX},${minY},${maxX},${maxY}&limit=10&access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        }`;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();

        return (data.features || []).filter((f: any) => {
          const [lng, lat] = f.center;
          // Additional filtering to ensure results are actually between start and end
          return (
            lng >= Math.min(x1, x2) &&
            lng <= Math.max(x1, x2) &&
            lat >= Math.min(y1, y2) &&
            lat <= Math.max(y1, y2)
          );
        });
      } catch (error) {
        console.error("Error fetching step suggestions:", error);
        return [];
      }
    },
    [selectedJourney]
  );

  // Form submission handlers
  const handleUpdateAndPublish = async () => {
    if (!selectedJourney) return;

    setIsSubmitting(true);

    try {
      // Map new steps to API format
      const newStopsData = newSteps
        .filter((step) => step.location.coords && step.location.name) // Only include steps with valid location
        .map((step) => ({
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
          transport_mode: step.mediumOfTravel || "car",
          start_date: step.startDate,
          end_date: step.endDate,
          notes: step.notes,
          stop_category_id: 1, // Default category, you might want to map this properly
          // Don't include media for now - need proper file upload handling
          media: [],
        }));

      const updateData = {
        title: selectedJourney.title,
        description: selectedJourney.description,
        start_location_name: selectedJourney.startLocation.name,
        start_lat: selectedJourney.startLocation.coords
          ? selectedJourney.startLocation.coords[1].toString()
          : null,
        start_lng: selectedJourney.startLocation.coords
          ? selectedJourney.startLocation.coords[0].toString()
          : null,
        end_location_name: selectedJourney.endLocation.name,
        end_lat: selectedJourney.endLocation.coords
          ? selectedJourney.endLocation.coords[1].toString()
          : null,
        end_lng: selectedJourney.endLocation.coords
          ? selectedJourney.endLocation.coords[0].toString()
          : null,
        start_date: selectedJourney.startDate,
        end_date: selectedJourney.endDate,
        privacy: visibility,
        planning_mode: "manual",
        date_mode: "specific",
        type: "mapping_journey",
        tagged_user_ids: taggedFriends.map((friend) => friend.id),
        status: "pending", // Update & Publish sets status to pending
        new_stops: newStopsData,
      };

      console.log(
        "Updating journey with pending status - Full request data:",
        updateData
      );
      console.log("Number of new stops:", newStopsData.length);
      console.log("Request URL:", `posts/${selectedJourney.id}`);
      console.log("Tagged friends:", taggedFriends);

      // API call to update journey
      await apiRequest(
        `posts/${selectedJourney.id}`,
        {
          method: "PUT",
          json: updateData,
        },
        "Journey updated successfully!"
      );

      // Reset new steps after successful submission
      setNewSteps([]);

      // Refresh journeys list to get updated data
      await fetchJourneysList();

      // Refresh current journey data
      if (selectedJourneyId) {
        await fetchJourneyData(selectedJourneyId);
      }
    } catch (error) {
      console.error("Error updating journey with pending status:", error);
      alert("Failed to update journey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndAndPublish = async () => {
    if (!selectedJourney) return;

    setIsSubmitting(true);

    try {
      // Map new steps to API format
      const newStopsData = newSteps
        .filter((step) => step.location.coords && step.location.name) // Only include steps with valid location
        .map((step) => ({
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
          transport_mode: step.mediumOfTravel || "car",
          start_date: step.startDate,
          end_date: step.endDate,
          notes: step.notes,
          stop_category_id: 1, // Default category, you might want to map this properly
          // Don't include media for now - need proper file upload handling
          media: [],
        }));

      const updateData = {
        title: selectedJourney.title,
        description: selectedJourney.description,
        start_location_name: selectedJourney.startLocation.name,
        start_lat: selectedJourney.startLocation.coords
          ? selectedJourney.startLocation.coords[1].toString()
          : null,
        start_lng: selectedJourney.startLocation.coords
          ? selectedJourney.startLocation.coords[0].toString()
          : null,
        end_location_name: selectedJourney.endLocation.name,
        end_lat: selectedJourney.endLocation.coords
          ? selectedJourney.endLocation.coords[1].toString()
          : null,
        end_lng: selectedJourney.endLocation.coords
          ? selectedJourney.endLocation.coords[0].toString()
          : null,
        start_date: selectedJourney.startDate,
        end_date: selectedJourney.endDate,
        privacy: visibility,
        planning_mode: "manual",
        date_mode: "specific",
        type: "mapping_journey",
        tagged_user_ids: taggedFriends.map((friend) => friend.id),
        status: "published", // End & Publish sets status to published
        new_stops: newStopsData,
      };

      console.log(
        "Publishing journey with published status - Full request data:",
        updateData
      );
      console.log("Number of new stops:", newStopsData.length);
      console.log("Request URL:", `posts/${selectedJourney.id}`);
      console.log("Tagged friends:", taggedFriends);

      // API call to end and publish journey
      await apiRequest(
        `posts/${selectedJourney.id}`,
        {
          method: "PUT",
          json: updateData,
        },
        "Journey published successfully!"
      );

      // Reset new steps after successful submission
      setNewSteps([]);

      // Refresh journeys list to get updated data
      await fetchJourneysList();

      // Refresh current journey data
      if (selectedJourneyId) {
        await fetchJourneyData(selectedJourneyId);
      }
    } catch (error) {
      console.error("Error publishing journey with published status:", error);
      alert("Failed to publish journey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="grid lg:grid-cols-2 grid-cols-1">
      {/* Form Section */}
      <div>
        {/* Header */}
        <div className="w-full p-4 border-b border-[#D9D9D9] rounded-tl-[20px] bg-white">
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

              {/* Refresh button */}
              {/* <button
                type="button"
                onClick={fetchJourneysList}
                disabled={loadingJourneysList}
                className="absolute right-2 top-8 p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                title="Refresh journeys list"
              >
                <svg
                  className={`w-4 h-4 ${
                    loadingJourneysList ? "animate-spin" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button> */}
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
              className={`mb-4 ${
                !selectedJourney || loadingSelectedJourney
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
                  stepErrors={{}}
                  showAddButton={true}
                  previousSteps={
                    Array.isArray(selectedJourney?.steps)
                      ? selectedJourney.steps
                      : []
                  }
                  showPreviousSteps={!!selectedJourney}
                />
              </div>
            </div>

            {/* Tagged Friends Section */}
            <div
              className={`mb-4 ${
                !selectedJourney || loadingSelectedJourney
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            >
              <GlobalMultiSelect
                label="Tag Friends"
                value={taggedFriends}
                onChange={setTaggedFriends}
                placeholder="Search and tag friends..."
                suggestions={filteredUsers}
                onSearch={handleFriendSearch}
                loading={journeyForm.loadingUsers}
                maxSelections={10}
              />
            </div>

            {/* Privacy controlled by existing VisibilitySelector in form actions */}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between p-4 border-t border-[#D9D9D9] bg-white">
            <VisibilitySelector value={visibility} onChange={setVisibility} />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleEndAndPublish}
                disabled={
                  !selectedJourney || isSubmitting || loadingSelectedJourney
                }
                className={`ml-4 px-6 py-2 text-[12px] text-white rounded-lg border font-semibold transition-all ${
                  !selectedJourney || isSubmitting || loadingSelectedJourney
                    ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "border-blue-600 text-black bg-white bg-gradient-to-r from-[#257CFF] to-[#1063E0] cursor-pointer"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                    Publishing...
                  </div>
                ) : (
                  "End & Publish"
                )}
              </button>
              <button
                type="button"
                onClick={handleUpdateAndPublish}
                disabled={
                  !selectedJourney || isSubmitting || loadingSelectedJourney
                }
                className={`ml-4 px-6 py-2 text-[12px] rounded-lg border font-semibold transition-all ${
                  !selectedJourney || isSubmitting || loadingSelectedJourney
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
                  "Update & publish"
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
          onStartChange={() => {}} // Disable editing existing locations
          onEndChange={() => {}} // Disable editing existing locations
          onStepsChange={() => {}} // Disable bulk step changes
          activeMapSelect="start" // Map stays non-interactive
          setActiveMapSelect={() => {}} // Disable map selection mode changes
        />
      </div>
    </div>
  );
}
