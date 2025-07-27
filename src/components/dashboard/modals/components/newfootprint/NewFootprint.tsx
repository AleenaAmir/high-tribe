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
import { toast } from "react-hot-toast";

interface NewFootprintProps {
  onClose?: () => void;
}

interface MoodTag {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}

// const moodTags: MoodTag[] = [
//   { id: "1", name: "Cultural Exploration", icon: "🏛️", selected: false },
//   { id: "2", name: "Historical Sites", icon: "🏰", selected: false },
//   { id: "3", name: "Local Cuisine", icon: "🍜", selected: false },
//   { id: "4", name: "Art & Crafts", icon: "🎨", selected: false },
//   { id: "5", name: "Shopping Spree", icon: "🛍️", selected: false },
//   { id: "6", name: "Nature Walks", icon: "🌿", selected: false },
//   { id: "7", name: "City Tours", icon: "🏙️", selected: false },
//   { id: "8", name: "Festive Celebrations", icon: "🎉", selected: false },
//   { id: "9", name: "Photography Spots", icon: "📸", selected: false },
// ];

export default function NewFootprint({ onClose }: NewFootprintProps) {
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
  const [media, setMedia] = useState<File[]>([]);
  const [taggedFriends, setTaggedFriends] = useState<
    { id: number; name: string; email?: string; avatar?: string }[]
  >([]);
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [visibility, setVisibility] = useState<"public" | "tribe" | "private">(
    "public"
  );
  const [selectedMoodTags, setSelectedMoodTags] = useState<MoodTag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation states
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    story?: string;
    location?: string;
  }>({});

  // Mock user suggestions for friend tagging
  const [userSuggestions, setUserSuggestions] = useState<any[]>([]);

  // Validation function
  const validateForm = useCallback(() => {
    const newErrors: {
      title?: string;
      story?: string;
      location?: string;
    } = {};

    if (hasAttemptedSubmit) {
      // Title validation
      if (!title || title.trim() === "") {
        newErrors.title = "Title is required";
      } else if (title.length > 100) {
        newErrors.title = "Title must not exceed 100 characters";
      }

      // Story validation
      if (!story || story.trim() === "") {
        newErrors.story = "Story is required";
      } else if (story.length > 1000) {
        newErrors.story = "Story must not exceed 1000 characters";
      }

      // Location validation
      if (!location || location.trim() === "" || !selectedLocation.coords) {
        newErrors.location = "Location is required";
      }
    }

    setErrors(newErrors);
  }, [hasAttemptedSubmit, title, story, location, selectedLocation.coords]);

  // Run validation when dependencies change
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  // Check if form has validation errors
  const hasValidationErrors = useCallback(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

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
              )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
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
    // Clear location error when location is selected
    setErrors((prev) => ({ ...prev, location: undefined }));
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
    // Clear location error when location is selected
    setErrors((prev) => ({ ...prev, location: undefined }));
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
          // Clear location error when location is confirmed
          setErrors((prev) => ({ ...prev, location: undefined }));
        }
      } catch (error) {
        console.error("Error geocoding location:", error);
      }
    }
  };

  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    // Clear title error when user types
    setErrors((prev) => ({ ...prev, title: undefined }));
  };

  // Handle story change
  const handleStoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStory(e.target.value);
    // Clear story error when user types
    setErrors((prev) => ({ ...prev, story: undefined }));
  };

  // Handle mood tag selection
  const handleMoodTagToggle = (tag: MoodTag) => {
    setSelectedMoodTags((prev) => {
      const isSelected = prev.find((t) => t.id === tag.id);
      if (isSelected) {
        return prev.filter((t) => t.id !== tag.id);
      } else {
        return [...prev, { ...tag, selected: true }];
      }
    });
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
    // Set submit attempt to show validation errors
    setHasAttemptedSubmit(true);

    // Check for validation errors
    if (hasValidationErrors()) {
      console.log("Validation errors found, preventing submission");
      return;
    }

    // Debug: Log current state values
    console.log("Current state values:");
    console.log("title:", title);
    console.log("story:", story);
    console.log("location:", location);
    console.log("selectedLocation:", selectedLocation);
    console.log("visibility:", visibility);

    setIsSubmitting(true);

    try {
      // Create FormData with the footprint API structure
      const formData = new FormData();

      // Add basic footprint data
      formData.append("title", title.trim());
      formData.append("story", story.trim());
      formData.append("location_name", location);
      formData.append("lat", selectedLocation.coords![1].toString());
      formData.append("lng", selectedLocation.coords![0].toString());
      formData.append("privacy", visibility);

      // Also try with alternative field names in case API expects different names
      formData.append("latitude", selectedLocation.coords![1].toString());
      formData.append("longitude", selectedLocation.coords![0].toString());

      // Debug: Log each field being added
      console.log("Adding fields to FormData:");
      console.log("title:", title.trim());
      console.log("story:", story.trim());
      console.log("location_name:", location);
      console.log("lat:", selectedLocation.coords![1].toString());
      console.log("lng:", selectedLocation.coords![0].toString());
      console.log("privacy:", visibility);

      // Add mood tags (if enabled)
      if (selectedMoodTags.length > 0) {
        selectedMoodTags.forEach((tag) => {
          formData.append("mood_tags[]", tag.name);
        });
      }

      // Add tagged friends
      if (taggedFriends.length > 0) {
        taggedFriends.forEach((friend) => {
          formData.append("tagged_friends[]", friend.id.toString());
        });
      }

      // Append media files
      media.forEach((file) => {
        formData.append("media[]", file);
      });

      // Debug: Log the FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // API call to footprints endpoint
      const response = await fetch("https://api.hightribe.com/api/footprints", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${typeof window !== "undefined"
              ? localStorage.getItem("token") || ""
              : ""
            }`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create footprint");
      }

      console.log("API Response:", data);

      // Show success toast
      toast.success("Footprint created successfully!");

      // Reset form
      setTitle("");
      setStory("");
      setLocation("");
      setLocationInput("");
      setSelectedLocation({ coords: null, name: "" });
      setMedia([]);
      setTaggedFriends([]);
      setSelectedMoodTags([]);
      setVisibility("public");
      setErrors({});
      setHasAttemptedSubmit(false);

      // Close modal
      onClose?.();
    } catch (error: any) {
      console.error("Error creating footprint:", error);

      // Log detailed error information
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }

      // Show error toast
      const errorMessage =
        error.message || "Failed to create footprint. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Footprint
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
                error={errors.location}
                placeholder=" "
                onLocationInputEnter={handleLocationInputEnter}
              />

              {/* Title Input */}
              <GlobalTextInput
                label="Title"
                value={title}
                onChange={handleTitleChange}
                error={errors.title}
                placeholder=" "
              />

              {/* Story Input */}
              <GlobalTextArea
                label="Share your story"
                rows={4}
                value={story}
                onChange={handleStoryChange}
                error={errors.story}
                placeholder=" "
              />

              {/* Media Upload */}
              <GlobalFileUpload
                label="Photos & Videos (Max 10)"
                value={media}
                onChange={setMedia}
                maxFiles={10}
                headLine="Drag & drop or click to upload"
                subLine="Max 5 files: JPG, PNG, MP3, Mov"
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
                placeholder="username"
                suggestions={userSuggestions}
                onSearch={handleFriendSearch}
                maxSelections={10}
              />

              {/* Mood Tags */}
              {/* <div className="mb-4">
              <label className="text-[12px] font-medium text-black mb-2 block">
                Mood Tags
              </label>
              <div className="grid grid-cols-3 gap-2">
                {moodTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleMoodTagToggle(tag)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-[10px] transition-all ${
                      selectedMoodTags.find((t) => t.id === tag.id)
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <span className="text-[14px]">{tag.icon}</span>
                    <span className="truncate">{tag.name}</span>
                  </button>
                ))}
              </div>
            </div> */}

              {/* Visibility Selector */}
              <VisibilitySelector value={visibility} onChange={setVisibility} />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end p-3 border-t border-[#D9D9D9] bg-white">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-6 py-2 text-[12px] text-white rounded-lg border font-semibold transition-all ${isSubmitting
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
            markerColor="#ef4444"
          />
        </div>
      </div>
    </div>
  );
}
