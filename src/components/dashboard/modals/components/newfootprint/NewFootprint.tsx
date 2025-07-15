import React, { useState, useCallback, useEffect } from "react";
import GlobalTextInput from "@/components/global/GlobalTextInput";
import GlobalTextArea from "@/components/global/GlobalTextArea";
import GlobalMultiSelect from "@/components/global/GlobalMultiSelect";
import GlobalFileUpload from "@/components/global/GlobalFileUpload";
import LocationSelector from "../newjourney/LocationSelector";
import { useLocationAutocomplete } from "../newjourney/hooks";
import { MapboxFeature } from "../newjourney/types";
import VisibilitySelector from "../newjourney/VisibilitySelector";
import FootprintMap from "./FootprintMap";
import { apiRequest } from "@/lib/api";

interface NewFootprintProps {
  onClose?: () => void;
}

interface MoodTag {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}

const moodTags: MoodTag[] = [
  { id: "1", name: "Cultural Exploration", icon: "🏛️", selected: false },
  { id: "2", name: "Historical Sites", icon: "🏰", selected: false },
  { id: "3", name: "Local Cuisine", icon: "🍜", selected: false },
  { id: "4", name: "Art & Crafts", icon: "🎨", selected: false },
  { id: "5", name: "Shopping Spree", icon: "🛍️", selected: false },
  { id: "6", name: "Nature Walks", icon: "🌿", selected: false },
  { id: "7", name: "City Tours", icon: "🏙️", selected: false },
  { id: "8", name: "Festive Celebrations", icon: "🎉", selected: false },
  { id: "9", name: "Photography Spots", icon: "📸", selected: false },
];

export default function NewFootprint({ onClose }: NewFootprintProps) {
  const locationAutocomplete = useLocationAutocomplete();

  // Form states
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [location, setLocation] = useState("");
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

  // Mock user suggestions for friend tagging
  const [userSuggestions, setUserSuggestions] = useState<any[]>([]);

  // Handle location selection
  const handleLocationChange = (value: string) => {
    setLocation(value);
  };

  const handleLocationSelect = (feature: MapboxFeature) => {
    const coords: [number, number] = feature.center;
    setSelectedLocation({
      coords,
      name: feature.place_name,
    });
    setLocation(feature.place_name);
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
    if (!title.trim() || !story.trim() || !location.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", story);
      formData.append("location_name", location);
      if (selectedLocation.coords) {
        formData.append("latitude", selectedLocation.coords[1].toString());
        formData.append("longitude", selectedLocation.coords[0].toString());
      }
      formData.append("privacy", visibility);
      formData.append(
        "mood_tags",
        JSON.stringify(selectedMoodTags.map((tag) => tag.name))
      );
      formData.append(
        "tagged_user_ids",
        JSON.stringify(taggedFriends.map((friend) => friend.id))
      );

      // Append media files
      media.forEach((file, index) => {
        formData.append(`media[${index}]`, file);
      });

      // API call to create footprint
      await apiRequest(
        "footprints/create",
        {
          method: "POST",
          body: formData,
        },
        "Footprint created successfully!"
      );

      // Reset form
      setTitle("");
      setStory("");
      setLocation("");
      setSelectedLocation({ coords: null, name: "" });
      setMedia([]);
      setTaggedFriends([]);
      setSelectedMoodTags([]);
      setVisibility("public");

      // Close modal
      onClose?.();
    } catch (error) {
      console.error("Error creating footprint:", error);
      alert("Failed to create footprint. Please try again.");
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
              value={location}
              onChange={handleLocationChange}
              onSelect={handleLocationSelect}
              onSearch={locationAutocomplete.fetchSuggestions}
              suggestions={locationAutocomplete.suggestions}
              placeholder=" "
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
            <div className="mb-4">
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
            </div>

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
                !location.trim()
              }
              className={`px-6 py-2 text-[12px] text-white rounded-lg border font-semibold transition-all ${
                isSubmitting ||
                !title.trim() ||
                !story.trim() ||
                !location.trim()
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
        <FootprintMap
          location={selectedLocation}
          onLocationSelect={(coords) => {
            setSelectedLocation({ coords, name: location });
          }}
        />
      </div>
    </div>
  );
}
