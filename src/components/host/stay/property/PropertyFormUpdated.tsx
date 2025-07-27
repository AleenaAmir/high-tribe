"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PropertyLocationMap, {
  PropertyLocationMapRef,
} from "./PropertyLocationMap";
import Image from "next/image";
import { filtersArray } from "@/components/dashboard/center/MapDashboard";
import DestinationSvg from "@/components/dashboard/svgs/DestinationSvg";
import Location from "@/components/dashboard/svgs/Location";
import Filters from "@/components/dashboard/svgs/Filters";
import {
  fetchGooglePlaceSuggestions,
  getGooglePlaceDetails,
  getCoordinatesForGooglePlace,
} from "@/lib/googlePlaces";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

// Form validation schema
const propertyFormSchema = z.object({
  property_name: z.string().min(1, "Property name is required"),
  property_type: z.string().min(1, "Property type is required"),
  location_address: z.string().min(1, "Location is required"),
  location_lat: z.string().optional(),
  location_lng: z.string().optional(),
  entrance_address: z.string().min(1, "Entrance location is required"),
  entrance_lat: z.string().optional(),
  entrance_lng: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  max_guests: z.number().min(1, "Maximum guests must be at least 1"),
  bedrooms: z.number().min(1, "Number of bedrooms must be at least 1"),
  bathrooms: z.number().min(1, "Number of bathrooms must be at least 1"),
  price_per_night: z.number().min(1, "Price per night must be at least 1"),
});

type PropertyFormData = z.infer<typeof propertyFormSchema>;

interface PropertyFormUpdatedProps {
  onSubmit: (data: PropertyFormData) => void;
  initialData?: Partial<PropertyFormData>;
}

const PropertyFormUpdated: React.FC<PropertyFormUpdatedProps> = ({
  onSubmit,
  initialData = {},
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      property_name: "",
      property_type: "",
      location_address: "",
      location_lat: "",
      location_lng: "",
      entrance_address: "",
      entrance_lat: "",
      entrance_lng: "",
      description: "",
      max_guests: 1,
      bedrooms: 1,
      bathrooms: 1,
      price_per_night: 0,
      ...initialData,
    },
  });

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [entranceSearch, setEntranceSearch] = useState("");
  const [entranceSuggestions, setEntranceSuggestions] = useState<any[]>([]);
  const [isEntranceLoading, setIsEntranceLoading] = useState(false);
  const [showEntranceSuggestions, setShowEntranceSuggestions] = useState(false);
  const [isFilters, setIsFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    coords: [number, number] | null;
    name: string;
  }>({ coords: null, name: "" });
  const mapRef = useRef<PropertyLocationMapRef>(null);

  // Watch form values
  const locationAddress = watch("location_address");
  const entranceAddress = watch("entrance_address");

  // Autocomplete functionality for general location
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
    async (query: string) => {
      if (!query.trim() || !selectedLocation?.coords) return;

      try {
        // Try Google Places API first with location bias
        const googleSuggestions = await fetchGooglePlaceSuggestions(query, {
          lat: selectedLocation.coords[1],
          lng: selectedLocation.coords[0],
        });

        if (googleSuggestions.length > 0) {
          setEntranceSuggestions(googleSuggestions);
          return;
        }

        // Fallback to Mapbox if Google Places returns no results
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${
            process.env.NEXT_PUBLIC_MAPBOX_TOKEN
          }&proximity=${selectedLocation.coords[0]},${
            selectedLocation.coords[1]
          }&types=poi,address&limit=5`
        );

        if (response.ok) {
          const data = await response.json();
          setEntranceSuggestions(data.features || []);
        }
      } catch (error) {
        console.error("Error fetching entrance suggestions:", error);
        setEntranceSuggestions([]);
      }
    },
    [selectedLocation]
  );

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSuggestions(search, setSuggestions, setIsLoading);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, fetchSuggestions]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchEntranceSuggestions(entranceSearch);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [entranceSearch, fetchEntranceSuggestions]);

  // Handle suggestion clicks for general location
  const handleSuggestionClick = (feature: any) => {
    setSearch(feature.place_name);
    setValue("location_address", feature.place_name);
    setShowSuggestions(false);

    // Store the general area coordinates for entrance search context
    if (feature.geometry?.coordinates) {
      const [lng, lat] = feature.geometry.coordinates;
      setValue("location_lat", lat.toString());
      setValue("location_lng", lng.toString());
      setSelectedLocation({
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
          setValue("entrance_address", selectedText);
          setValue("entrance_lat", coordinates[1].toString());
          setValue("entrance_lng", coordinates[0].toString());
        }
      } else {
        // Mapbox suggestion
        coordinates = suggestion.geometry?.coordinates;
        selectedText = suggestion.place_name;
        setValue("entrance_address", selectedText);
        if (coordinates) {
          setValue("entrance_lat", coordinates[1].toString());
          setValue("entrance_lng", coordinates[0].toString());
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
      setSelectedLocation({ coords, name: placeName });
      setValue("entrance_address", placeName);
      setValue("entrance_lat", coords[1].toString());
      setValue("entrance_lng", coords[0].toString());
      setEntranceSearch(placeName);
    },
    [setValue]
  );

  const onSubmitForm = (data: PropertyFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {/* Property Basic Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Property Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Name *
            </label>
            <input
              type="text"
              {...register("property_name")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter property name"
            />
            {errors.property_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.property_name.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type *
            </label>
            <select
              {...register("property_type")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select property type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="cabin">Cabin</option>
              <option value="studio">Studio</option>
            </select>
            {errors.property_type && (
              <p className="text-red-500 text-sm mt-1">
                {errors.property_type.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-3 bg-[#F8F8F8] md:px-6 relative">
            <div className="flex items-center gap-2 w-full relative">
              <div className="flex items-center px-2 py-1 group gap-2 bg-white border border-[#EEEEEE] rounded-full w-full relative max-w-[160px]">
                <Location className="flex-shrink-0 text-[#696969] group-hover:text-[#F6691D]" />
                <input
                  type="text"
                  className="outline-none bg-transparent text-sm w-full"
                  placeholder="Search property area... *"
                  value={search}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearch(value);
                    setValue("location_address", value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
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
                  placeholder="Exact property entrance... *"
                  value={entranceSearch}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEntranceSearch(value);
                    setValue("entrance_address", value);
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
                    {entranceSuggestions.map(
                      (suggestion: any, index: number) => (
                        <div
                          key={suggestion.place_id || suggestion.id || index}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                          onClick={() =>
                            handleEntranceSuggestionClick(suggestion)
                          }
                        >
                          {suggestion.structured_formatting ? (
                            // Google Places suggestion
                            <div>
                              <div className="font-medium text-gray-900">
                                {suggestion.structured_formatting.main_text}
                              </div>
                              <div className="text-sm text-gray-500">
                                {
                                  suggestion.structured_formatting
                                    .secondary_text
                                }
                              </div>
                            </div>
                          ) : (
                            // Mapbox suggestion
                            <div className="text-gray-700">
                              {suggestion.place_name}
                            </div>
                          )}
                        </div>
                      )
                    )}
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
            <PropertyLocationMap
              ref={mapRef}
              selectedLocation={selectedLocation}
              onLocationSelect={handleMapLocationSelect}
            />
          </div>
        </div>
        {errors.location_address && (
          <p className="text-red-500 text-sm mt-1">
            {errors.location_address.message}
          </p>
        )}
        {errors.entrance_address && (
          <p className="text-red-500 text-sm mt-1">
            {errors.entrance_address.message}
          </p>
        )}
      </div>

      {/* Property Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Property Details
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your property..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Guests *
              </label>
              <input
                type="number"
                {...register("max_guests", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
              {errors.max_guests && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.max_guests.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms *
              </label>
              <input
                type="number"
                {...register("bedrooms", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
              {errors.bedrooms && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bedrooms.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms *
              </label>
              <input
                type="number"
                {...register("bathrooms", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
              {errors.bathrooms && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bathrooms.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Night *
              </label>
              <input
                type="number"
                {...register("price_per_night", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
              {errors.price_per_night && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price_per_night.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Save Property
        </button>
      </div>
    </form>
  );
};

export default PropertyFormUpdated;
