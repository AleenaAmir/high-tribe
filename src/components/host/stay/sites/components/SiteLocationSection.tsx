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
import { useSitesForm } from "../contexts/SitesFormContext";
import {
  fetchGooglePlaceSuggestions,
  getGooglePlaceDetails,
  getCoordinatesForGooglePlace,
} from "@/lib/googlePlaces";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface SiteLocationSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

const SiteLocationSection: React.FC<SiteLocationSectionProps> = ({
  sectionRef,
}) => {
  const { state, updateFormData, updateSelectedLocation, saveSection } =
    useSitesForm();

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

  // Memoize selected location to prevent unnecessary re-renders
  const memoizedSelectedLocation = useMemo(
    () => state.selectedLocation,
    [state.selectedLocation.coords, state.selectedLocation.name]
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

      setLoading(true);
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=5&country=pk&types=place,region,locality,district`
        );
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
    async (
      query: string,
      setSuggestions: (suggestions: any[]) => void,
      setLoading: (loading: boolean) => void
    ) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        // Try Google Places API first with location bias
        if (state.selectedLocation.coords) {
          const googleSuggestions = await fetchGooglePlaceSuggestions(query, {
            lat: state.selectedLocation.coords[1],
            lng: state.selectedLocation.coords[0],
          });

          if (googleSuggestions.length > 0) {
            setSuggestions(googleSuggestions);
            return;
          }
        }

        // Fallback to Mapbox if Google Places returns no results
        let searchQuery = query;
        let apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=5&country=pk`;

        // Configure API for detailed address/street results
        apiUrl += `&types=address,poi,place,locality,neighborhood`;

        // If site location is set, bias the search towards that area
        if (state.formData.siteLocation) {
          // Add the site location as context to the search
          searchQuery = `${query}, ${state.formData.siteLocation}`;
          apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            searchQuery
          )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=10&country=pk&types=address,poi,place,locality,neighborhood`;

          // If we have coordinates from the selected location, use proximity bias
          if (state.selectedLocation.coords) {
            const [lng, lat] = state.selectedLocation.coords;
            apiUrl += `&proximity=${lng},${lat}`;
          }
        }

        const response = await fetch(apiUrl);
        const data = await response.json();
        setSuggestions(data.features || []);
      } catch (error) {
        console.error("Error fetching entrance suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [state.formData.siteLocation, state.selectedLocation.coords]
  );

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSuggestions(search, setSuggestions, setIsLoading);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, fetchSuggestions]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchEntranceSuggestions(
        entranceSearch,
        setEntranceSuggestions,
        setIsEntranceLoading
      );
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [entranceSearch, fetchEntranceSuggestions]);

  // Handle suggestion clicks
  const handleSuggestionClick = (feature: any) => {
    setSearch(feature.place_name);
    updateFormData("siteLocation", feature.place_name);
    setShowSuggestions(false);

    // Store the general area coordinates for entrance search context
    if (feature.geometry?.coordinates) {
      const [lng, lat] = feature.geometry.coordinates;
      updateSelectedLocation({
        coords: [lng, lat],
        name: feature.place_name,
      });
    }

    // Only fly to the location, don't add marker yet
    if (mapRef.current && feature.geometry?.coordinates) {
      const [lng, lat] = feature.geometry.coordinates;
      mapRef.current.centerMap(lng, lat, feature.place_name);
    }
  };

  const handleEntranceSuggestionClick = async (suggestion: any) => {
    try {
      let coordinates: [number, number] | null = null;
      let selectedText = "";

      // Check if this is a Google Places suggestion
      if (suggestion.place_id && suggestion.structured_formatting) {
        // Google Places suggestion
        coordinates = await getCoordinatesForGooglePlace(suggestion.place_id);
        if (coordinates) {
          selectedText = suggestion.description;
          updateFormData("entranceLocation", selectedText);
          updateSelectedLocation({
            coords: coordinates,
            name: selectedText,
          });
        }
      } else {
        // Mapbox suggestion
        coordinates = suggestion.geometry?.coordinates;
        selectedText = suggestion.place_name;
        updateFormData("entranceLocation", selectedText);
        if (coordinates) {
          updateSelectedLocation({
            coords: coordinates,
            name: selectedText,
          });
        }
      }

      if (coordinates && mapRef.current) {
        mapRef.current.addMarker(coordinates[0], coordinates[1], "entrance");
        mapRef.current.centerMap(coordinates[0], coordinates[1]);
      }

      setEntranceSuggestions([]);
      setEntranceSearch(selectedText);
      setShowEntranceSuggestions(false);
    } catch (error) {
      console.error("Error handling entrance suggestion click:", error);
    }
  };

  // Handle map location selection - this is for entrance location
  const handleMapLocationSelect = useCallback(
    (coords: [number, number], placeName: string) => {
      updateSelectedLocation({ coords, name: placeName });
      updateFormData("entranceLocation", placeName);
      setEntranceSearch(placeName);
    },
    [updateSelectedLocation, updateFormData]
  );

  const handleSave = async () => {
    const locationData = {
      siteLocation: state.formData.siteLocation,
      entranceLocation: state.formData.entranceLocation,
      selectedLocation: state.selectedLocation,
    };

    await saveSection("location", locationData);
  };

  return (
    <div ref={sectionRef}>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Site Location</h2>
      </div>
      <div className="bg-white rounded-lg shadow-sm mt-4">
        <div className="flex items-center justify-between p-3 bg-[#F8F8F8] md:px-6 relative">
          <div className="flex items-center gap-2 w-full relative">
            <div className="flex items-center px-2 py-1 group gap-2 bg-white border border-[#EEEEEE] rounded-full w-full relative max-w-[160px]">
              <Location className="flex-shrink-0 text-[#696969] group-hover:text-[#F6691D]" />
              <input
                type="text"
                className="outline-none bg-transparent text-sm w-full"
                placeholder="Search site area..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                autoComplete="off"
              />
              {isLoading && (
                <span className="ml-2 text-xs text-gray-400">Loading...</span>
              )}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 top-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-auto">
                  {suggestions.map((feature) => (
                    <div
                      key={feature.id}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm"
                      onClick={() => handleSuggestionClick(feature)}
                    >
                      {feature.place_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center px-2 py-1 gap-2 bg-white border border-[#EEEEEE] rounded-full w-full relative max-w-[160px]">
              <DestinationSvg className="flex-shrink-0" />
              <input
                type="text"
                className="outline-none bg-transparent text-sm w-full"
                placeholder="Exact site entrance..."
                value={entranceSearch}
                onChange={(e) => {
                  setEntranceSearch(e.target.value);
                  setShowEntranceSuggestions(true);
                }}
                onFocus={() => setShowEntranceSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowEntranceSuggestions(false), 150)
                }
                autoComplete="off"
              />
              {isEntranceLoading && (
                <span className="ml-2 text-xs text-gray-400">Loading...</span>
              )}
              {showEntranceSuggestions && entranceSuggestions.length > 0 && (
                <div className="absolute left-0 top-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-auto">
                  {entranceSuggestions.map((suggestion: any, index: number) => (
                    <div
                      key={suggestion.place_id || suggestion.id || index}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                      onClick={() => handleEntranceSuggestionClick(suggestion)}
                    >
                      {suggestion.structured_formatting ? (
                        // Google Places suggestion
                        <div>
                          <div className="font-medium text-gray-900">
                            {suggestion.structured_formatting.main_text}
                          </div>
                          <div className="text-sm text-gray-500">
                            {suggestion.structured_formatting.secondary_text}
                          </div>
                        </div>
                      ) : (
                        // Mapbox suggestion
                        <div className="text-gray-700">
                          {suggestion.place_name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div
              className={`flex items-center justify-center p-2 rounded-full cursor-pointer hover:shadow-lg transition-all delay-300 ${
                isFilters
                  ? "bg-gradient-to-r from-[#D6D5D4] to-white"
                  : "bg-gradient-to-r from-[#257CFF] to-[#0F62DE]"
              }`}
              onClick={() => setIsFilters(!isFilters)}
            >
              <Filters
                className={`${
                  isFilters ? "text-[#6C6868]" : "text-white"
                } flex-shrink-0`}
              />
            </div>
            <div
              className={`${
                isFilters ? "max-w-full" : "max-w-0"
              } flex items-center gap-2 transition-all w-fit delay-300 overflow-hidden`}
            >
              {filtersArray.map((filter, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center p-2 rounded-full cursor-pointer hover:shadow-lg border border-gray-200"
                >
                  <Image
                    src={filter.img}
                    width={17}
                    height={17}
                    alt="svg"
                    className="w-[17px] object-contain flex-shrink-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-hidden h-fit">
          <SitesLocationMap
            ref={mapRef}
            selectedLocation={memoizedSelectedLocation}
            onLocationSelect={handleMapLocationSelect}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SiteLocationSection;
