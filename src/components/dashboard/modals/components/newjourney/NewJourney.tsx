import React, { useState, useCallback } from "react";
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

export default function NewJourney() {
  const journeyForm = useJourneyForm();
  const startLocationAutocomplete = useLocationAutocomplete();
  const endLocationAutocomplete = useLocationAutocomplete();

  // State for tracking which location is being set by map click
  const [activeMapSelect, setActiveMapSelect] = useState<"start" | "end">(
    "start"
  );
  const [userSuggestions, setUserSuggestions] = useState<any[]>([]);

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
    const error = journeyForm.validateTitle(title);
    if (error) {
      journeyForm.setFieldError("title", error);
    } else {
      journeyForm.clearFieldError("title");
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const description = e.target.value;
    journeyForm.form.setValue("description", description);
    const error = journeyForm.validateDescription(description);
    if (error) {
      journeyForm.setFieldError("description", error);
    } else {
      journeyForm.clearFieldError("description");
    }
  };

  const handleStartDateChange = (date: string) => {
    journeyForm.form.setValue("startDate", date);
    const endDate = journeyForm.form.watch("endDate");
    const dateErrors = journeyForm.validateDates(date, endDate);

    if (dateErrors.startDate) {
      journeyForm.setFieldError("startDate", dateErrors.startDate);
    } else {
      journeyForm.clearFieldError("startDate");
    }

    if (dateErrors.endDate) {
      journeyForm.setFieldError("endDate", dateErrors.endDate);
    } else {
      journeyForm.clearFieldError("endDate");
    }
  };

  const handleEndDateChange = (date: string) => {
    journeyForm.form.setValue("endDate", date);
    const startDate = journeyForm.form.watch("startDate");
    const dateErrors = journeyForm.validateDates(startDate, date);

    if (dateErrors.startDate) {
      journeyForm.setFieldError("startDate", dateErrors.startDate);
    } else {
      journeyForm.clearFieldError("startDate");
    }

    if (dateErrors.endDate) {
      journeyForm.setFieldError("endDate", dateErrors.endDate);
    } else {
      journeyForm.clearFieldError("endDate");
    }
  };

  // User search handler
  const handleUserSearch = async (query: string) => {
    const results = journeyForm.searchUsers(query);
    setUserSuggestions(results);
  };

  // Form submission
  const handleSubmit = async () => {
    const formData = journeyForm.form.getValues();
    const success = await journeyForm.submitJourney(formData);

    if (success) {
      // Handle successful submission (e.g., close modal, show success message)
      console.log("Journey created successfully!");
    }
  };

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1">
      {/* Form Section */}
      <div>
        {/* Header */}
        <div className="w-full p-4 border-b border-[#D9D9D9] rounded-tl-[20px] bg-white">
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
              placeholder="Enter journey title..."
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
                placeholder="Enter start location..."
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
                placeholder="Enter end location..."
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
              placeholder="Describe your journey..."
            />

            {/* Journey Steps */}
            <StepsList
              steps={journeyForm.steps}
              onStepsChange={journeyForm.setSteps}
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
              onChange={(users) => journeyForm.form.setValue("friends", users)}
              suggestions={userSuggestions}
              onSearch={handleUserSearch}
              loading={journeyForm.loadingUsers}
              error={journeyForm.form.formState.errors.friends?.message}
            />
          </div>

          {/* Form Actions */}
          <JourneyFormActions
            visibility={journeyForm.visibility}
            onVisibilityChange={journeyForm.setVisibility}
            onSubmit={handleSubmit}
            isSubmitting={journeyForm.isSubmitting}
            disabled={
              Object.keys(journeyForm.errors).length > 0 ||
              Object.keys(journeyForm.stepErrors).length > 0
            }
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
          onStepsChange={() => {}}
          activeMapSelect={activeMapSelect}
          setActiveMapSelect={setActiveMapSelect}
        />
      </div>
    </div>
  );
}
