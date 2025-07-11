import React, { useState, useCallback, useMemo } from "react";
import JourneyMap, { LatLng } from "./JourneyMap";
import GlobalSelect from "@/components/global/GlobalSelect";
import GlobalTextArea from "@/components/global/GlobalTextArea";
import GlobalMultiSelect from "@/components/global/GlobalMultiSelect";
import StepsList from "./StepsList";
import VisibilitySelector from "./VisibilitySelector";
import { useJourneyForm } from "./hooks";
import {
  ExistingJourney,
  Step,
  ExistingJourneyUpdate,
  VisibilityType,
} from "./types";
import { MOCK_EXISTING_JOURNEYS } from "./constants";

export default function ExistingJourneyComponent() {
  // State for selected journey
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibility, setVisibility] = useState<VisibilityType>("public");
  const [newSteps, setNewSteps] = useState<Step[]>([]);
  const [taggedFriends, setTaggedFriends] = useState<
    { id: number; name: string; email?: string; avatar?: string }[]
  >([]);
  const [friendSearchQuery, setFriendSearchQuery] = useState("");

  // Get selected journey data
  const selectedJourney = useMemo(() => {
    if (!selectedJourneyId) return null;
    return (
      MOCK_EXISTING_JOURNEYS.find((j) => j.id === selectedJourneyId) || null
    );
  }, [selectedJourneyId]);

  // Initialize journey form with limited functionality
  const journeyForm = useJourneyForm();

  // Journey options for dropdown
  const journeyOptions = useMemo(() => {
    return MOCK_EXISTING_JOURNEYS.map((journey) => ({
      value: journey.id,
      label: journey.title,
    }));
  }, []);

  // Combined steps (existing + new)
  const allSteps = useMemo(() => {
    if (!selectedJourney) return newSteps;
    return [...selectedJourney.steps, ...newSteps];
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
  const handleJourneySelect = (journeyId: string) => {
    // Don't proceed if empty value (placeholder) is selected
    if (!journeyId) {
      setSelectedJourneyId(null);
      setNewSteps([]);
      return;
    }

    setSelectedJourneyId(journeyId);
    setNewSteps([]); // Reset new steps when switching journeys

    // Focus map on selected journey if it exists
    const journey = MOCK_EXISTING_JOURNEYS.find((j) => j.id === journeyId);
    if (journey && journey.startLocation.coords) {
      journeyForm.flyToOnMap(
        journey.startLocation.coords[0],
        journey.startLocation.coords[1]
      );
    }
  };

  // Form submission
  const handleSubmit = async () => {
    if (!selectedJourney) return;

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call to update the journey with new steps
      const updateData: ExistingJourneyUpdate = {
        journeyId: selectedJourney.id,
        newSteps: newSteps,
        updatedFields: {
          visibility: visibility,
          taggedFriends: taggedFriends,
        },
      };

      console.log("Updating journey:", updateData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      alert(
        `Journey updated successfully! Added ${newSteps.length} new steps${
          taggedFriends.length > 0
            ? ` and tagged ${taggedFriends.length} friends`
            : ""
        }.`
      );

      // Reset new steps after successful submission
      setNewSteps([]);
    } catch (error) {
      console.error("Error updating journey:", error);
      alert("Failed to update journey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get all coordinates for map display
  const allStepCoordinates = useMemo(() => {
    const coords: LatLng[] = [];

    // Add coordinates from all steps (existing + new)
    allSteps.forEach((step) => {
      if (step.location.coords) {
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="p-1"
        >
          <div
            className="flex flex-col gap-2 max-h-[500px] lg:min-h-[500px] h-full overflow-y-auto px-6 py-2 
           [&::-webkit-scrollbar]:w-1
           [&::-webkit-scrollbar-track]:bg-[#1063E0]
           [&::-webkit-scrollbar-thumb]:bg-[#D9D9D9] 
           dark:[&::-webkit-scrollbar-track]:bg-[#D9D9D9]
           dark:[&::-webkit-scrollbar-thumb]:bg-[#1063E0]"
          >
            {/* Journey Selection Dropdown */}
            <GlobalSelect
              label="Select Journey"
              value={selectedJourneyId || ""}
              onChange={(e) => handleJourneySelect(e.target.value)}
            >
              <option value="" disabled>
                Choose an existing journey...
              </option>
              {journeyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </GlobalSelect>

            {/* Journey Details */}
            {/* Integrated Steps Section - Always Visible */}
            <div
              className={`mb-4 ${
                !selectedJourney ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <div className="border-t border-gray-200 pt-4">
                <StepsList
                  steps={newSteps}
                  onStepsChange={setNewSteps}
                  canAddStep={!!selectedJourney}
                  fetchStepSuggestions={journeyForm.fetchStepSuggestions}
                  stopCategories={journeyForm.stopCategories}
                  loadingCategories={journeyForm.loadingCategories}
                  stepErrors={{}}
                  showAddButton={true}
                  previousSteps={selectedJourney?.steps || []}
                  showPreviousSteps={!!selectedJourney}
                />
              </div>
            </div>

            {/* Tagged Friends Section */}
            <div
              className={`mb-4 ${
                !selectedJourney ? "opacity-50 pointer-events-none" : ""
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

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!selectedJourney || isSubmitting}
              className={`ml-4 px-6 py-2 text-[12px] rounded-lg border font-semibold transition-all ${
                !selectedJourney || isSubmitting
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
                `Update Journey${
                  newSteps.length > 0 ? ` (+${newSteps.length})` : ""
                }`
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Map Section - Always Visible */}
      <div className="h-full w-full relative">
        {/* Map Component - Always Rendered */}
        <JourneyMap
          ref={journeyForm.mapRef}
          startLocation={selectedJourney?.startLocation.coords || null}
          endLocation={selectedJourney?.endLocation.coords || null}
          steps={selectedJourney ? allStepCoordinates : []}
          onStartChange={() => {}} // Disable editing existing locations
          onEndChange={() => {}} // Disable editing existing locations
          onStepsChange={() => {}} // Handle through StepsList component
          activeMapSelect="start"
          setActiveMapSelect={() => {}} // Disable location selection mode
        />
      </div>
    </div>
  );
}
