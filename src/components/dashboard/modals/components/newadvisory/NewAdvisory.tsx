import React, { useState, useCallback, useEffect } from "react";
import GlobalTextInput from "@/components/global/GlobalTextInput";
import GlobalTextArea from "@/components/global/GlobalTextArea";
import GlobalMultiSelect from "@/components/global/GlobalMultiSelect";
import GlobalFileUpload from "@/components/global/GlobalFileUpload";
import LocationSelector from "../newjourney/LocationSelector";
import { useLocationAutocomplete } from "../newjourney/hooks";
import { MapboxFeature } from "../newjourney/types";
import VisibilitySelector from "../newjourney/VisibilitySelector";
import LocationMap from "@/components/global/LocationMap";
import { apiRequest } from "@/lib/api";

interface NewAdvisoryProps {
  onClose?: () => void;
}

export default function NewAdvisory({ onClose }: NewAdvisoryProps) {
  const locationAutocomplete = useLocationAutocomplete();

  // Form states
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  // Separate input state for location text
  const [locationInput, setLocationInput] = useState("");
  const [location, setLocation] = useState(""); // confirmed location name
  const [selectedLocation, setSelectedLocation] = useState<{
    coords: [number, number] | null;
    name: string;
  }>({ coords: null, name: "" });
  const [expiryDate, setExpiryDate] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [taggedFriends, setTaggedFriends] = useState<
    { id: number; name: string; email?: string; avatar?: string }[]
  >([]);
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [visibility, setVisibility] = useState<"public" | "tribe" | "private">(
    "public"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock user suggestions for friend tagging
  const [userSuggestions, setUserSuggestions] = useState<any[]>([]);

  // Debounced geocoding function
  const debouncedGeocode = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (value.trim()) {
            try {
              const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                value
              )}.json?access_token=${
                process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
              }`;
              const response = await fetch(url);
              const data = await response.json();

              if (data.features && data.features.length > 0) {
                const [lng, lat] = data.features[0].center;
                setSelectedLocation({
                  coords: [lng, lat],
                  name: data.features[0].place_name,
                });
              }
            } catch (error) {
              console.error("Error geocoding location:", error);
            }
          }
        }, 500); // 500ms delay
      };
    })(),
    []
  );

  // Handle location selection from dropdown
  const handleLocationSelect = (feature: MapboxFeature) => {
    const coords: [number, number] = feature.center;
    setSelectedLocation({
      coords,
      name: feature.place_name,
    });
    setLocation(feature.place_name);
    setLocationInput(feature.place_name);
  };

  // Handle map location selection (when user clicks on map)
  const handleMapLocationSelect = (
    coords: [number, number],
    locationName: string
  ) => {
    setSelectedLocation({
      coords,
      name: locationName,
    });
    setLocation(locationName);
    setLocationInput(locationName);
  };

  // Handle location input change (typing)
  const handleLocationInputChange = (value: string) => {
    setLocationInput(value);
    // Do not update marker here
  };

  // Handle Enter key in input (confirm location)
  const handleLocationInputEnter = async () => {
    if (locationInput.trim()) {
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          locationInput
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setSelectedLocation({
            coords: [lng, lat],
            name: data.features[0].place_name,
          });
          setLocation(data.features[0].place_name);
          setLocationInput(data.features[0].place_name);
        }
      } catch (error) {
        console.error("Error geocoding location:", error);
      }
    }
  };

  // Handle friend search
  const handleFriendSearch = async (query: string) => {
    setFriendSearchQuery(query);
    // Mock user suggestions - in real app, this would be an API call
    const mockUsers = [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      },
      {
        id: 3,
        name: "Mike Johnson",
        email: "mike@example.com",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      },
    ];
    setUserSuggestions(
      mockUsers.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  // Form submission
  const handleSubmit = async () => {
    if (
      !title.trim() ||
      !story.trim() ||
      !location.trim() ||
      !expiryDate.trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData with the same structure as journeys
      const formData = new FormData();

      // Add basic advisory data
      formData.append("title", title.trim());
      formData.append("description", story.trim());
      formData.append("location_name", location);
      if (selectedLocation.coords) {
        formData.append("latitude", selectedLocation.coords[1].toString());
        formData.append("longitude", selectedLocation.coords[0].toString());
      }
      formData.append("privacy", visibility);
      formData.append("type", "advisory");
      formData.append("status", "published");
      formData.append("expiry_date", expiryDate);

      // Add tagged users
      if (taggedFriends.length > 0) {
        taggedFriends.forEach((friend, index) => {
          formData.append(`tagged_users[${index}]`, friend.id.toString());
        });
      }

      // Append media files
      media.forEach((file, index) => {
        formData.append(`media[${index}]`, file);
      });

      // API call using the same endpoint as journeys
      await apiRequest(
        "posts",
        {
          method: "POST",
          body: formData,
        },
        "Travel Advisory created successfully!"
      );

      // Reset form
      setTitle("");
      setStory("");
      setLocation("");
      setSelectedLocation({ coords: null, name: "" });
      setExpiryDate("");
      setMedia([]);
      setTaggedFriends([]);
      setVisibility("public");

      // Close modal
      onClose?.();
    } catch (error) {
      console.error("Error creating travel advisory:", error);
      alert("Failed to create travel advisory. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1">
      {/* Form Section */}
      <div>
        {/* Header */}
        <div className="w-full p-4 border-b border-[#D9D9D9] rounded-tl-[20px] bg-white">
          <h4 className="text-[18px] md:text-[22px] text-[#111111] font-bold text-center">
            Travel Advisory
          </h4>
          <p className="text-[10px] text-[#706F6F] text-center">
            Share you travel experience with world.
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
            {/* Location Input */}
            <LocationSelector
              label="Location"
              value={locationInput}
              onChange={handleLocationInputChange}
              onSelect={handleLocationSelect}
              onSearch={locationAutocomplete.fetchSuggestions}
              suggestions={locationAutocomplete.suggestions}
              placeholder=" "
              onLocationInputEnter={handleLocationInputEnter}
            />

            {/* Title Input */}
            <GlobalTextInput
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder=" "
            />

            {/* Story Input */}
            <GlobalTextArea
              label="Share your story"
              rows={4}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder=" "
            />

            {/* Expiry Date Input */}
            <GlobalTextInput
              label="Advisory expires on"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="mm/dd/yyyy"
            />

            {/* Media Upload */}
            <GlobalFileUpload
              label="Photos & Videos (Max 10)"
              value={media}
              onChange={setMedia}
              maxFiles={10}
              headLine="Drag & drop or click to upload"
              subLine="Max 5 files - JPG, PNG, PMD, MP4, MOV"
              allowedTypes={[
                "image/jpeg",
                "image/jpg",
                "image/png",
                "video/mp4",
                "video/quicktime",
              ]}
            />

            {/* Tag Friends */}
            <GlobalMultiSelect
              label="Tag Friends"
              value={taggedFriends}
              onChange={setTaggedFriends}
              placeholder="Username"
              suggestions={userSuggestions}
              onSearch={handleFriendSearch}
              maxSelections={10}
            />

            {/* Visibility Selector */}
            <VisibilitySelector value={visibility} onChange={setVisibility} />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end p-4 border-t border-[#D9D9D9] bg-white">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !title.trim() ||
                !story.trim() ||
                !location.trim() ||
                !expiryDate.trim()
              }
              className={`px-6 py-2 text-[12px] text-white rounded-lg border font-semibold transition-all ${
                isSubmitting ||
                !title.trim() ||
                !story.trim() ||
                !location.trim() ||
                !expiryDate.trim()
                  ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "border-blue-600 bg-gradient-to-r from-[#257CFF] to-[#1063E0] cursor-pointer hover:from-[#1a6be0] hover:to-[#0d5ac7]"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  Sharing...
                </div>
              ) : (
                "Share Post"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Map Section */}
      <div className="h-full w-full relative">
        <LocationMap
          location={selectedLocation}
          onLocationSelect={handleMapLocationSelect}
          markerColor="#22c55e"
        />
      </div>
    </div>
  );
}
