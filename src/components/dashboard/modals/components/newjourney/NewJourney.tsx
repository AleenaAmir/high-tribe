import React, { useState, useCallback, useEffect } from "react";
import GlobalTextInput from "@/components/global/GlobalTextInput";
import GlobalTextArea from "@/components/global/GlobalTextArea";
import GlobalMultiSelect from "@/components/global/GlobalMultiSelect";
import JourneyMap, { LatLng } from "./JourneyMap";
import LocationSelector from "./LocationSelector";
import DateRangeSelector from "./DateRangeSelector";
import StepsList from "./StepsList";
import JourneyFormActions from "./JourneyFormActions";
import {
  useJourneyForm,
  useLocationAutocomplete,
  reverseGeocode,
} from "./hooks";
import { MapboxFeature } from "./types";
import VisibilitySelector from "./VisibilitySelector";

interface NewJourneyProps {
  onClose?: () => void;
}

export default function NewJourney({ onClose }: NewJourneyProps) {
  const journeyForm = useJourneyForm();
  const startLocationAutocomplete = useLocationAutocomplete();
  const endLocationAutocomplete = useLocationAutocomplete();

  // State for tracking which location is being set by map click
  const [activeMapSelect, setActiveMapSelect] = useState<"start" | "end">(
    "start"
  );
  const [userSuggestions, setUserSuggestions] = useState<any[]>([]);

  // State to track if form has been submitted (to show all errors)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Location change handlers for map interaction
  const handleStartChange = useCallback(
    async (loc: LatLng) => {
      const name = await reverseGeocode(loc[0], loc[1]);
      journeyForm.setStartLocation({ coords: loc, name });
      journeyForm.clearFieldError("startLocation");
    },
    [journeyForm]
  );

  const handleEndChange = useCallback(
    async (loc: LatLng) => {
      const name = await reverseGeocode(loc[0], loc[1]);
      journeyForm.setEndLocation({ coords: loc, name });
      journeyForm.clearFieldError("endLocation");
    },
    [journeyForm]
  );

  // Location selector handlers
  const handleStartLocationChange = (value: string) => {
    journeyForm.setStartLocation({
      ...journeyForm.startLocation,
      name: value,
    });
    journeyForm.clearFieldError("startLocation");
  };

  const handleStartLocationSelect = (feature: MapboxFeature) => {
    const coords: LatLng = feature.center;
    journeyForm.setStartLocation({
      coords,
      name: feature.place_name,
    });
    journeyForm.flyToOnMap(coords[0], coords[1]);
    journeyForm.clearFieldError("startLocation");
  };

  const handleEndLocationChange = (value: string) => {
    journeyForm.setEndLocation({
      ...journeyForm.endLocation,
      name: value,
    });
    journeyForm.clearFieldError("endLocation");
  };

  const handleEndLocationSelect = (feature: MapboxFeature) => {
    const coords: LatLng = feature.center;
    journeyForm.setEndLocation({
      coords,
      name: feature.place_name,
    });
    journeyForm.flyToOnMap(coords[0], coords[1]);
    journeyForm.clearFieldError("endLocation");
  };

  // Form field handlers
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    journeyForm.form.setValue("title", title);
    journeyForm.clearFieldError("title");
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const description = e.target.value;
    journeyForm.form.setValue("description", description);
    journeyForm.clearFieldError("description");
  };

  const handleStartDateChange = (date: string) => {
    journeyForm.form.setValue("startDate", date);
    journeyForm.clearFieldError("startDate");
    journeyForm.clearFieldError("endDate"); // Clear end date error when start date changes
  };

  const handleEndDateChange = (date: string) => {
    journeyForm.form.setValue("endDate", date);
    journeyForm.clearFieldError("endDate");
  };

  // User search handler
  const handleUserSearch = async (query: string) => {
    const results = journeyForm.searchUsers(query);
    setUserSuggestions(results);
  };

  // Validation function that shows errors only after submit attempt
  const validateForm = useCallback(() => {
    const formData = journeyForm.form.getValues();
    const newErrors: any = {};
    const newStepErrors: any = {};

    // Only validate and show errors if user attempted submit
    if (hasAttemptedSubmit) {
      // Validate title
      const titleError = journeyForm.validateTitle(formData.title);
      if (titleError) newErrors.title = titleError;

      // Validate description
      const descriptionError = journeyForm.validateDescription(
        formData.description
      );
      if (descriptionError) newErrors.description = descriptionError;

      // Validate start location
      const startLocationError = journeyForm.validateLocation(
        journeyForm.startLocation,
        "Start location"
      );
      if (startLocationError) newErrors.startLocation = startLocationError;

      // Validate end location
      const endLocationError = journeyForm.validateLocation(
        journeyForm.endLocation,
        "End location"
      );
      if (endLocationError) newErrors.endLocation = endLocationError;

      // Validate dates
      const dateErrors = journeyForm.validateDates(
        formData.startDate,
        formData.endDate
      );
      if (dateErrors.startDate) newErrors.startDate = dateErrors.startDate;
      if (dateErrors.endDate) newErrors.endDate = dateErrors.endDate;

      // Validate steps
      journeyForm.steps.forEach((step, index) => {
        const stepError = journeyForm.validateStep(
          step,
          index,
          journeyForm.stopCategories
        );
        if (Object.keys(stepError).length > 0) {
          newStepErrors[index] = stepError;
        }
      });
    }

    journeyForm.setErrors(newErrors);
    journeyForm.setStepErrors(newStepErrors);
  }, [
    hasAttemptedSubmit,
    journeyForm.form.watch("title"),
    journeyForm.form.watch("description"),
    journeyForm.form.watch("startDate"),
    journeyForm.form.watch("endDate"),
    JSON.stringify(journeyForm.startLocation),
    JSON.stringify(journeyForm.endLocation),
    JSON.stringify(journeyForm.steps),
    journeyForm.stopCategories.length,
  ]);

  // Run validation when dependencies change
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  // Check if form has validation errors
  const hasValidationErrors = useCallback(() => {
    const formData = journeyForm.form.getValues();

    // Check main form errors
    const titleError = journeyForm.validateTitle(formData.title);
    const descriptionError = journeyForm.validateDescription(
      formData.description
    );
    const startLocationError = journeyForm.validateLocation(
      journeyForm.startLocation,
      "Start location"
    );
    const endLocationError = journeyForm.validateLocation(
      journeyForm.endLocation,
      "End location"
    );
    const dateErrors = journeyForm.validateDates(
      formData.startDate,
      formData.endDate
    );

    const hasMainErrors = !!(
      titleError ||
      descriptionError ||
      startLocationError ||
      endLocationError ||
      dateErrors.startDate ||
      dateErrors.endDate
    );

    // Check step errors
    const hasStepErrors = journeyForm.steps.some((step, index) => {
      const stepError = journeyForm.validateStep(
        step,
        index,
        journeyForm.stopCategories
      );
      return Object.keys(stepError).length > 0;
    });

    return hasMainErrors || hasStepErrors;
  }, [
    journeyForm.form.watch("title"),
    journeyForm.form.watch("description"),
    journeyForm.form.watch("startDate"),
    journeyForm.form.watch("endDate"),
    JSON.stringify(journeyForm.startLocation),
    JSON.stringify(journeyForm.endLocation),
    JSON.stringify(journeyForm.steps),
    journeyForm.stopCategories.length,
  ]);

  // Form submission
  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    // This will trigger validation to show all errors
    setTimeout(() => {
      validateForm();
    }, 0);

    // Check if there are validation errors
    if (hasValidationErrors()) {
      return; // Don't submit if there are errors
    }

    const formData = journeyForm.form.getValues();

    // Add draft status for new journeys
    const journeyData = {
      ...formData,
      status: "draft",
    };

    const success = await journeyForm.submitJourney(journeyData);

    if (success) {
      // Handle successful submission (e.g., close modal, show success message)
      console.log("Journey created successfully!");

      // Reset form after successful submission
      journeyForm.form.reset();
      journeyForm.setStartLocation({ coords: null, name: "" });
      journeyForm.setEndLocation({ coords: null, name: "" });
      journeyForm.setSteps([
        {
          name: "Stop 1",
          location: { coords: null, name: "" },
          notes: "",
          media: [],
          mediumOfTravel: "",
          startDate: "",
          endDate: "",
          category: "",
          dateError: "",
        },
      ]);

      // Reset submit attempt state
      setHasAttemptedSubmit(false);

      // Close the modal
      onClose?.();
    }
  };

  return (
    <div
      className="max-h-[90vh]  h-full  overflow-y-auto rounded-[20px] bg-white shadow-lg
          [&::-webkit-scrollbar]:w-1
           [&::-webkit-scrollbar-track]:bg-[#1063E0]
           [&::-webkit-scrollbar-thumb]:bg-[#D9D9D9] 
           dark:[&::-webkit-scrollbar-track]:bg-[#D9D9D9]
           dark:[&::-webkit-scrollbar-thumb]:bg-[#1063E0]
    "
    >
      <div className="grid lg:grid-cols-2 grid-cols-1 ">
        {/* Form Section */}
        <div>
          {/* Header */}
          <div className="w-full p-3 border-b border-[#D9D9D9] rounded-tl-[20px] bg-white">
            <h4 className="text-[18px] md:text-[22px] text-[#111111] font-bold text-center">
              New Journey
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
              className="flex flex-col gap-2 max-h-[500px] overflow-y-auto px-6 py-2 
           [&::-webkit-scrollbar]:w-1
           [&::-webkit-scrollbar-track]:bg-[#1063E0]
           [&::-webkit-scrollbar-thumb]:bg-[#D9D9D9] 
           dark:[&::-webkit-scrollbar-track]:bg-[#D9D9D9]
           dark:[&::-webkit-scrollbar-thumb]:bg-[#1063E0]"
            >
              {/* Title Input */}
              <GlobalTextInput
                label="Title"
                value={journeyForm.form.watch("title")}
                onChange={handleTitleChange}
                error={journeyForm.errors.title}
                placeholder=" "
              />

              {/* Location Selectors */}
              <div className="grid grid-cols-2 gap-2">
                <LocationSelector
                  label="Start Location"
                  value={journeyForm.startLocation.name}
                  onChange={handleStartLocationChange}
                  onSelect={handleStartLocationSelect}
                  onLocationSelect={(coords, name) => {
                    journeyForm.setStartLocation({ coords, name });
                    journeyForm.flyToOnMap(coords[0], coords[1]);
                    journeyForm.clearFieldError("startLocation");
                  }}
                  onSearch={startLocationAutocomplete.fetchSuggestions}
                  suggestions={startLocationAutocomplete.suggestions}
                  error={journeyForm.errors.startLocation}
                  placeholder=" "
                />

                <LocationSelector
                  label="End Location"
                  value={journeyForm.endLocation.name}
                  onChange={handleEndLocationChange}
                  onSelect={handleEndLocationSelect}
                  onLocationSelect={(coords, name) => {
                    journeyForm.setEndLocation({ coords, name });
                    journeyForm.flyToOnMap(coords[0], coords[1]);
                    journeyForm.clearFieldError("endLocation");
                  }}
                  onSearch={endLocationAutocomplete.fetchSuggestions}
                  suggestions={endLocationAutocomplete.suggestions}
                  error={journeyForm.errors.endLocation}
                  placeholder=" "
                />
              </div>

              {/* Date Range Selector */}
              <DateRangeSelector
                startDate={journeyForm.form.watch("startDate")}
                endDate={journeyForm.form.watch("endDate")}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                startDateError={journeyForm.errors.startDate}
                endDateError={journeyForm.errors.endDate}
              />

              {/* Description */}
              <GlobalTextArea
                label="Description"
                rows={3}
                value={journeyForm.form.watch("description")}
                onChange={handleDescriptionChange}
                error={journeyForm.errors.description}
                placeholder=" "
              />

              {/* Journey Steps */}
              <StepsList
                steps={journeyForm.steps}
                onStepsChange={(newSteps) => {
                  journeyForm.setSteps(newSteps);
                }}
                canAddStep={!!journeyForm.canAddStep}
                fetchStepSuggestions={journeyForm.fetchStepSuggestions}
                stopCategories={journeyForm.stopCategories}
                loadingCategories={journeyForm.loadingCategories}
                stepErrors={journeyForm.stepErrors}
                showAddButton={true}
                previousSteps={[]}
                showPreviousSteps={false}
              />

              {/* Tag Friends */}
              <GlobalMultiSelect
                label="Tag Friends"
                value={journeyForm.form.watch("friends")}
                onChange={(users) =>
                  journeyForm.form.setValue("friends", users)
                }
                suggestions={userSuggestions}
                onSearch={handleUserSearch}
                loading={journeyForm.loadingUsers}
                error={journeyForm.form.formState.errors.friends?.message}
              />
              <VisibilitySelector
                value={journeyForm.visibility}
                onChange={journeyForm.setVisibility}
              />
            </div>

            {/* Form Actions */}
            <JourneyFormActions
              onSubmit={handleSubmit}
              isSubmitting={journeyForm.isSubmitting}
              disabled={false} // Never disable the submit button
            />
          </form>
        </div>

        {/* Map Section */}
        <div className="h-full w-full">
          <JourneyMap
            ref={journeyForm.mapRef}
            startLocation={journeyForm.startLocation.coords}
            endLocation={journeyForm.endLocation.coords}
            steps={
              journeyForm.steps
                .map((s) => s.location.coords)
                .filter(Boolean) as LatLng[]
            }
            onStartChange={handleStartChange}
            onEndChange={handleEndChange}
            onStepsChange={() => { }}
            activeMapSelect={activeMapSelect}
            setActiveMapSelect={setActiveMapSelect}
          />
        </div>
      </div>
    </div>
  );
}
