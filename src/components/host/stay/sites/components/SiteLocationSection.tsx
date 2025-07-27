"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import SitesLocationMap, { SitesLocationMapRef } from "../SitesLocationMap";
import Image from "next/image";
import { filtersArray } from "@/components/dashboard/center/MapDashboard";
import DestinationSvg from "@/components/dashboard/svgs/DestinationSvg";
import Location from "@/components/dashboard/svgs/Location";
import Filters from "@/components/dashboard/svgs/Filters";
import { useSitesForm } from "../hooks/useSitesForm";
import FormError from "./FormError";
import {
  fetchGooglePlaceSuggestions,
  getGooglePlaceDetails,
  getCoordinatesForGooglePlace,
} from "@/lib/googlePlaces";

// Environment variable validation
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface SiteLocationSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  formMethods: ReturnType<typeof useSitesForm>;
}

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SiteLocationSection: React.FC<SiteLocationSectionProps> = ({
  sectionRef,
  formMethods,
}) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
    saveSection,
    isSaving,
  } = formMethods;

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [entranceSearch, setEntranceSearch] = useState("");
  const [entranceSuggestions, setEntranceSuggestions] = useState<any[]>([]);
  const [isEntranceLoading, setIsEntranceLoading] = useState(false);
  const [showEntranceSuggestions, setShowEntranceSuggestions] = useState(false);
  const [isFilters, setIsFilters] = useState(false);
  const mapRef = useRef<SitesLocationMapRef>(null);

  // Watch form values
  const siteLocation = watch("siteLocation");
  const entranceLocation = watch("entranceLocation");
  const selectedLocation = watch("selectedLocation");

  // Debounced values for API calls
  const debouncedSearch = useDebounce(search, 300);
  const debouncedEntranceSearch = useDebounce(entranceSearch, 300);

  // Memoize selected location to prevent unnecessary re-renders
  const memoizedSelectedLocation = useMemo(
    () => selectedLocation || { coords: null, name: "" },
    [selectedLocation?.coords, selectedLocation?.name]
  );

  // Autocomplete functionality
  const fetchSuggestions = useCallback(
    async (
      query: string,
      setSuggestions: (suggestions: any[]) => void,
      setLoading: (loading: boolean) => void
    ) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      if (!MAPBOX_ACCESS_TOKEN) {
        console.warn("MAPBOX_ACCESS_TOKEN is not available");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=5&country=pk&types=place,region,locality,district`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch suggestions");
        }

        const data = await response.json();
        setSuggestions(data.features || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Entrance search with Google Places API for better POI suggestions
  const fetchEntranceSuggestions = useCallback(
    async (query: string) => {
      if (!query.trim() || !selectedLocation?.coords) return;

      setIsEntranceLoading(true);
      try {
        // Try Google Places API first with location bias
        const [lng, lat] = selectedLocation.coords;
        const googleResults = await fetchGooglePlaceSuggestions(query, {
          lat,
          lng,
        });

        if (googleResults && googleResults.length > 0) {
          setEntranceSuggestions(googleResults);
        } else {
          // Fallback to Mapbox if Google Places doesn't return results
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              query
            )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=5&proximity=${lng},${lat}&types=poi,address,place`
          );

          if (response.ok) {
            const data = await response.json();
            setEntranceSuggestions(data.features || []);
          }
        }
      } catch (error) {
        console.error("Error fetching entrance suggestions:", error);
        setEntranceSuggestions([]);
      } finally {
        setIsEntranceLoading(false);
      }
    },
    [selectedLocation?.coords]
  );

  // Effect for debounced search
  useEffect(() => {
    if (debouncedSearch) {
      fetchSuggestions(debouncedSearch, setSuggestions, setIsLoading);
    }
  }, [debouncedSearch, fetchSuggestions]);

  // Effect for debounced entrance search
  useEffect(() => {
    if (debouncedEntranceSearch) {
      fetchEntranceSuggestions(debouncedEntranceSearch);
    }
  }, [debouncedEntranceSearch, fetchEntranceSuggestions]);

  const handleLocationSelect = useCallback(
    (suggestion: any) => {
      const locationName = suggestion.place_name || suggestion.text;
      const coords = suggestion.center || suggestion.geometry?.coordinates;

      setSearch(locationName);
      setValue("siteLocation", locationName);
      setValue("selectedLocation", {
        coords: coords ? [coords[0], coords[1]] : null,
        name: locationName,
      });

      // Update map
      if (mapRef.current && coords) {
        mapRef.current.centerMap(coords[0], coords[1], locationName);
      }

      setSuggestions([]);
      setShowSuggestions(false);
    },
    [setValue]
  );

  const handleEntranceSelect = useCallback(
    async (suggestion: any) => {
      try {
        let locationName =
          suggestion.place_name || suggestion.description || suggestion.text;
        let coords = suggestion.center || suggestion.geometry?.coordinates;

        // If it's a Google Places suggestion, get detailed info
        if (suggestion.place_id && !coords) {
          const details = await getGooglePlaceDetails(suggestion.place_id);
          if (details) {
            locationName = details.name;
            coords = [
              details.geometry.location.lng,
              details.geometry.location.lat,
            ];
          }
        }

        setEntranceSearch(locationName);
        setValue("entranceLocation", locationName);

        setEntranceSuggestions([]);
        setShowEntranceSuggestions(false);
      } catch (error) {
        console.error("Error selecting entrance location:", error);
      }
    },
    [setValue]
  );

  const handleSaveSection = async () => {
    await saveSection("location");
  };

  return (
    <section ref={sectionRef} className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Site Location</h2>
        <button
          type="button"
          onClick={handleSaveSection}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Section"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form Inputs */}
        <div className="space-y-6">
          {/* Site Location Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Location *
            </label>
            <div className="relative">
              <input
                {...register("siteLocation")}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search for your site location..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Location className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
            <FormError error={errors.siteLocation?.message} />

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleLocationSelect(suggestion)}
                  >
                    <div className="font-medium text-gray-900">
                      {suggestion.text}
                    </div>
                    <div className="text-sm text-gray-600">
                      {suggestion.place_name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Entrance Location Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exact Entrance Location *
            </label>
            <div className="relative">
              <input
                {...register("entranceLocation")}
                value={entranceSearch}
                onChange={(e) => {
                  setEntranceSearch(e.target.value);
                  setShowEntranceSuggestions(true);
                }}
                onFocus={() => setShowEntranceSuggestions(true)}
                placeholder="Enter specific entrance or landmark..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!selectedLocation?.coords}
              />
              <DestinationSvg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {isEntranceLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
            <FormError error={errors.entranceLocation?.message} />

            {/* Entrance Suggestions Dropdown */}
            {showEntranceSuggestions && entranceSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {entranceSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleEntranceSelect(suggestion)}
                  >
                    <div className="font-medium text-gray-900">
                      {suggestion.description ||
                        suggestion.text ||
                        suggestion.name}
                    </div>
                    {suggestion.place_name && (
                      <div className="text-sm text-gray-600">
                        {suggestion.place_name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Management
              </label>
              <select
                {...register("siteManagement")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select management type</option>
                <option value="self-managed">Self Managed</option>
                <option value="property-manager">Property Manager</option>
                <option value="company">Company Managed</option>
              </select>
              <FormError error={errors.siteManagement?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Type
              </label>
              <select
                {...register("access")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select access type</option>
                <option value="public">Public Access</option>
                <option value="private">Private Access</option>
                <option value="restricted">Restricted Access</option>
              </select>
              <FormError error={errors.access?.message} />
            </div>
          </div>
        </div>

        {/* Right Column - Map */}
        <div className="h-96 lg:h-auto">
          <SitesLocationMap
            ref={mapRef}
            selectedLocation={memoizedSelectedLocation}
            onLocationSelect={(coords, name) => {
              setValue("selectedLocation", { coords, name });
              setValue("siteLocation", name);
              setSearch(name);
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default SiteLocationSection;
