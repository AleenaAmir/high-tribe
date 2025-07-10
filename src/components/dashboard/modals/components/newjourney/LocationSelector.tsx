import React, { useRef, useState, useEffect } from "react";
import TraveLocationIcon from "@/components/dashboard/svgs/TraveLocationIcon";
import { LocationInputProps, MapboxFeature } from "./types";

interface LocationSelectorProps
  extends Omit<
    LocationInputProps,
    "onFocus" | "onBlur" | "onKeyDown" | "showDropdown"
  > {
  onLocationSelect?: (coords: [number, number], name: string) => void;
  onSearch?: (query: string) => void;
  fetchSuggestions?: (query: string) => Promise<MapboxFeature[]>;
  showDropdown?: boolean;
  debounceMs?: number;
  maxSuggestions?: number;
  allowManualEntry?: boolean;
  geocodeOnEnter?: boolean;
  isStepLocation?: boolean; // Flag to identify if this is a step location (vs start/end location)
}

export default function LocationSelector({
  label,
  value,
  onChange,
  onSelect,
  onLocationSelect,
  onSearch,
  fetchSuggestions,
  suggestions = [],
  showDropdown,
  error,
  placeholder = "Enter location...",
  disabled = false,
  debounceMs = 300,
  maxSuggestions = 10,
  allowManualEntry = true,
  geocodeOnEnter = true,
  isStepLocation = false,
}: LocationSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalShowDropdown, setInternalShowDropdown] = useState(false);
  const [internalSuggestions, setInternalSuggestions] = useState<
    MapboxFeature[]
  >([]);
  const dropdownVisible =
    showDropdown !== undefined ? showDropdown : internalShowDropdown;

  // Use external suggestions if provided, otherwise use internal ones
  const currentSuggestions = onSearch ? suggestions : internalSuggestions;

  // Debounce function
  const debounce = <T extends (...args: any[]) => void>(
    fn: T,
    delay: number
  ) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  // Default fetch suggestions using Mapbox if not provided
  const defaultFetchSuggestions = async (
    query: string
  ): Promise<MapboxFeature[]> => {
    try {
      let url: string;

      if (!query.trim()) {
        // When no query, fetch popular places nearby (generic popular locations)
        url = `https://api.mapbox.com/geocoding/v5/mapbox.places/popular.json?types=poi,address&limit=${maxSuggestions}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
      } else {
        // When there's a query, perform normal search
        url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?limit=${maxSuggestions}&access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        }`;
      }

      const response = await fetch(url);
      const data = await response.json();
      return (data.features || []).slice(0, maxSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return [];
    }
  };

  // Debounced suggestion fetcher
  const debouncedFetch = debounce(async (query: string) => {
    const suggestionFetcher = fetchSuggestions || defaultFetchSuggestions;
    try {
      const results = await suggestionFetcher(query);
      setInternalSuggestions(results);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setInternalSuggestions([]);
    }
  }, debounceMs);

  // Geocode location on Enter key
  const geocodeLocation = async (
    query: string
  ): Promise<[number, number] | null> => {
    if (!query.trim()) return null;

    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return [lng, lat];
      }
    } catch (error) {
      console.error("Error geocoding location:", error);
    }

    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    onSearch?.(newValue);

    // Always show dropdown when typing (if not explicitly controlled)
    if (showDropdown === undefined) {
      setInternalShowDropdown(true);
    }

    // Use internal fetch only if no external handlers provided
    if (!onSearch && !fetchSuggestions) {
      debouncedFetch(newValue);
    }
  };

  const handleFocus = () => {
    // Always show dropdown on focus
    if (showDropdown === undefined) {
      setInternalShowDropdown(true);
    }

    // Always trigger suggestions fetch on focus
    const queryToFetch = value || ""; // Use empty string to fetch popular locations

    if (onSearch) {
      // Use external search handler (for filtered step suggestions)
      onSearch(queryToFetch);
    } else if (!fetchSuggestions) {
      // Use internal fetch for general location search
      debouncedFetch(queryToFetch);
    }
  };

  const handleClick = () => {
    // Same behavior as focus - show dropdown immediately
    handleFocus();
  };

  const handleBlur = () => {
    // Delay hiding dropdown to allow for selection
    setTimeout(() => {
      if (showDropdown === undefined) {
        setInternalShowDropdown(false);
      }
    }, 150);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && geocodeOnEnter && allowManualEntry) {
      e.preventDefault();

      if (showDropdown === undefined) {
        setInternalShowDropdown(false);
      }

      if (geocodeOnEnter) {
        const coords = await geocodeLocation(value);
        if (coords && onLocationSelect) {
          onLocationSelect(coords, value);
        }
      }
    }
  };

  const handleSuggestionSelect = (suggestion: MapboxFeature) => {
    onChange(suggestion.place_name);
    onSelect(suggestion);

    if (onLocationSelect) {
      onLocationSelect(suggestion.center, suggestion.place_name);
    }

    if (showDropdown === undefined) {
      setInternalShowDropdown(false);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      // Cleanup any pending debounced calls
    };
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-medium text-black z-10 translate-y-3 translate-x-4 bg-white w-fit px-1">
        {label}
      </label>
      <div className="relative">
        <div
          className={`flex items-center gap-2 rounded-lg border pl-5 pr-2 py-3 ${
            error ? "border-red-500" : "border-[#848484]"
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
        >
          <input
            ref={inputRef}
            className={`placeholder:text-[#AFACAC] text-[12px] w-full outline-none ${
              disabled ? "cursor-not-allowed" : ""
            }`}
            value={value}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onClick={handleClick}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
          />
          <TraveLocationIcon className="w-[14px] h-[14px] text-black hover:text-[#2379FC] cursor-pointer" />
        </div>

        {error && <p className="text-red-500 text-[10px] mt-1">{error}</p>}

        {dropdownVisible && (
          <div className="absolute z-20 left-0 right-0 bg-white border rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
            {currentSuggestions.length > 0 ? (
              <ul>
                {currentSuggestions.map((suggestion, index) => (
                  <li
                    key={suggestion.id || index}
                    className="px-3 py-2 text-[12px] cursor-pointer hover:bg-blue-100 border-b border-gray-100 last:border-b-0"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent blur
                      handleSuggestionSelect(suggestion);
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {suggestion.place_name}
                      </span>
                      {isStepLocation && (
                        <span className="text-[10px] text-gray-500">
                          📍 Between your start and end locations
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-3 py-4 text-[12px] text-gray-500 text-center">
                {isStepLocation ? (
                  <div>
                    <p>No locations found between your start and end points</p>
                    <p className="text-[10px] mt-1">
                      Try adjusting your search or route
                    </p>
                  </div>
                ) : (
                  <p>No locations found</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
