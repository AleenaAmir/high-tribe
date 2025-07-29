"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PropertyLocationMap, {
  PropertyLocationMapRef,
} from "./PropertyLocationMap";
import GlobalTextInput from "../../../global/GlobalTextInput";
import GlobalSelect from "../../../global/GlobalSelect";
import GlobalTextArea from "../../../global/GlobalTextArea";
import Location from "@/components/dashboard/svgs/Location";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  fetchGooglePlaceSuggestions,
  getCoordinatesForGooglePlace,
} from "@/lib/googlePlaces";
import LocationSmall from "@/components/dashboard/svgs/LocationSmall";

interface PropertyFormProps {}

// Simplified Zod schema for property form validation
const propertyFormSchema = z.object({
  location_address: z.string().min(1, "Property address is required"),
  location_lat: z.string().min(1, "Property latitude is required"),
  location_lng: z.string().min(1, "Property longitude is required"),
  property_name: z.string().min(1, "Property name is required"),
  languages: z.string().min(1, "Languages spoken is required"),
  short_description: z.string().optional(),
  images: z.array(z.any()).min(1, "At least one image is required"),
  cover_image: z.any().refine((val) => val !== null, "Cover image is required"),
});

type PropertyFormData = z.infer<typeof propertyFormSchema>;

// Language Multi-Select Component
interface LanguageMultiSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  languages: { value: string; label: string }[];
}

const LanguageMultiSelect: React.FC<LanguageMultiSelectProps> = ({
  label,
  value,
  onChange,
  error,
  languages,
}) => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse comma-separated value on mount
  useEffect(() => {
    if (value) {
      setSelectedLanguages(value.split(",").map((lang) => lang.trim()));
    }
  }, [value]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageToggle = (languageValue: string) => {
    const newSelected = selectedLanguages.includes(languageValue)
      ? selectedLanguages.filter((lang) => lang !== languageValue)
      : [...selectedLanguages, languageValue];

    setSelectedLanguages(newSelected);
    onChange(newSelected.join(", "));
  };

  const removeLanguage = (languageValue: string) => {
    const newSelected = selectedLanguages.filter(
      (lang) => lang !== languageValue
    );
    setSelectedLanguages(newSelected);
    onChange(newSelected.join(", "));
  };

  // Filter languages based on search query
  const filteredLanguages = languages.filter((language) =>
    language.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-1" ref={dropdownRef}>
      <label className="text-[12px] font-medium text-black z-10 translate-y-3.5 translate-x-4 bg-white w-fit px-1">
        {label}
      </label>
      <div className="relative">
        <div
          className={`flex flex-wrap items-center gap-2 rounded-lg min-h-[40px] border px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400 transition-all ${
            error ? "border-red-400" : "border-[#848484]"
          }`}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {selectedLanguages.length > 0
            ? selectedLanguages.map((langValue) => {
                const language = languages.find(
                  (lang) => lang.value === langValue
                );
                return (
                  <span
                    key={langValue}
                    className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs flex items-center gap-1"
                  >
                    <span className="font-medium">
                      {language?.label || langValue}
                    </span>
                    <button
                      type="button"
                      className="ml-1 text-blue-500 hover:text-red-500 font-bold text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLanguage(langValue);
                      }}
                      title="Remove language"
                    >
                      ×
                    </button>
                  </span>
                );
              })
            : ""}
        </div>

        {showDropdown && (
          <div className="absolute z-50 left-0 right-0 bg-white border rounded-lg shadow mt-1 max-h-48 overflow-y-auto">
            {/* Search input */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
              <input
                type="text"
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>

            {/* Language options */}
            <div className="max-h-32 overflow-y-auto">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((language) => (
                  <div
                    key={language.value}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-100 flex items-center gap-2 ${
                      selectedLanguages.includes(language.value)
                        ? "bg-blue-50"
                        : ""
                    }`}
                    onClick={() => handleLanguageToggle(language.value)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(language.value)}
                      onChange={() => handleLanguageToggle(language.value)}
                      className="mr-2"
                    />
                    <span className="font-medium">{language.label}</span>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  {searchQuery
                    ? "No languages found"
                    : "No languages available"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

const PropertyForm: React.FC<PropertyFormProps> = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    coords: [number, number] | null;
    name: string;
  }>({
    coords: null,
    name: "",
  });
  const mapRef = useRef<PropertyLocationMapRef>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [coverImageError, setCoverImageError] = useState("");
  const router = useRouter();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    mode: "onTouched",
    defaultValues: {
      location_address: "",
      location_lat: "",
      location_lng: "",
      property_name: "",
      languages: "",
      short_description: "",
      images: [],
      cover_image: null,
    },
  });

  // Watch form values for real-time updates
  const formData = watch();

  // Update form values when images change
  useEffect(() => {
    setValue("images", uploadedImages);
    if (uploadedImages.length > 0) {
      clearErrors("images");
      setImageError("");
    }
  }, [uploadedImages, setValue, clearErrors]);

  // Update form values when cover image changes
  useEffect(() => {
    setValue("cover_image", coverImage);
    if (coverImage) {
      clearErrors("cover_image");
      setCoverImageError("");
    }
  }, [coverImage, setValue, clearErrors]);

  // Clear languages error when at least one language is selected
  useEffect(() => {
    if (formData.languages && formData.languages.trim() !== "") {
      clearErrors("languages");
    }
  }, [formData.languages, clearErrors]);

  // Custom location validation
  const getLocationError = () => {
    const hasAddress =
      formData.location_address && formData.location_address.trim() !== "";
    const hasLat = formData.location_lat && formData.location_lat.trim() !== "";
    const hasLng = formData.location_lng && formData.location_lng.trim() !== "";

    if (!hasAddress || !hasLat || !hasLng) {
      return "Please select a valid property location";
    }
    return null;
  };

  const locationError = getLocationError();

  // Section refs for scrolling
  const locationRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  const sections = [
    {
      id: "location",
      title: "Property Location",
      icon: "📍",
      ref: locationRef,
      requiredFields: ["location_address", "location_lat", "location_lng"],
    },
    {
      id: "overview",
      title: "Property Overview",
      icon: "📋",
      ref: overviewRef,
      requiredFields: ["property_name", "languages"],
    },
    {
      id: "images",
      title: "Property Images/Videos",
      icon: "📷",
      ref: imagesRef,
      requiredFields: ["images", "cover_image"],
    },
  ];

  // Check if section is completed based on required fields
  const isSectionCompleted = (section: (typeof sections)[0]) => {
    if (section.requiredFields.length === 0) return true;

    return section.requiredFields.every((field) => {
      const value = formData[field as keyof typeof formData];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value && value.toString().trim() !== "";
    });
  };

  // Enhanced section completion check
  const getSectionStatus = (section: (typeof sections)[0]) => {
    const baseComplete = isSectionCompleted(section);

    if (section.id === "location") {
      return (
        formData.location_address &&
        formData.location_address.trim() !== "" &&
        formData.location_lat &&
        formData.location_lng
      );
    }

    if (section.id === "images") {
      return uploadedImages.length > 0 && coverImage !== null;
    }

    return baseComplete;
  };

  // Scroll to section
  const scrollToSection = (
    sectionRef: React.RefObject<HTMLDivElement | null>
  ) => {
    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };

  // Google Places API search functionality
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Use Google Places API for suggestions
      const googleSuggestions = await fetchGooglePlaceSuggestions(query);
      setSuggestions(googleSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSuggestions(search);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, fetchSuggestions]);

  // Handle suggestion click for location search
  const handleSuggestionClick = async (suggestion: any) => {
    try {
      let coordinates: [number, number] | null = null;
      let selectedText = "";

      // Handle Google Places suggestion
      if (suggestion.place_id && suggestion.structured_formatting) {
        coordinates = await getCoordinatesForGooglePlace(suggestion.place_id);
        if (coordinates) {
          selectedText = suggestion.description;
          setValue("location_address", selectedText);
          setValue("location_lat", coordinates[1].toString());
          setValue("location_lng", coordinates[0].toString());
        }
      }

      if (coordinates) {
        setSelectedLocation({
          coords: coordinates,
          name: selectedText,
        });
      }

      setSearch(selectedText);
      setSuggestions([]);
      setShowSuggestions(false);

      // Fly to the location on map
      if (mapRef.current && coordinates) {
        mapRef.current.centerMap(coordinates[0], coordinates[1], selectedText);
      }
    } catch (error) {
      console.error("Error handling suggestion click:", error);
    }
  };

  // Handle map location selection
  const handleMapLocationSelect = (
    coords: [number, number],
    placeName: string
  ) => {
    setSearch(placeName);
    setValue("location_address", placeName);
    setValue("location_lat", coords[1].toString());
    setValue("location_lng", coords[0].toString());
    setSelectedLocation({
      coords,
      name: placeName,
    });
  };

  const handleFileUpload = (
    files: File[],
    type: "image" | "video" = "image"
  ) => {
    if (type === "image") {
      setUploadedImages((prev) => [...prev, ...files]);
    } else {
      setUploadedVideo(files[0] || null);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setUploadedVideo(null);
  };

  // Fetch languages from a free API (e.g., restcountries.com)
  const [languages, setLanguages] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("https://libretranslate.com/languages");
        const data = await response.json();

        const langs = data.map((lang: any) => ({
          value: lang.code,
          label: lang.name,
        }));

        setLanguages(langs);
      } catch (error) {
        console.error("Failed to fetch languages:", error);
        setLanguages([
          { value: "en", label: "English" },
          { value: "es", label: "Spanish" },
          { value: "fr", label: "French" },
        ]);
      }
    };

    fetchLanguages();
  }, []);

  // Form submission handler
  const onSubmit = async (data: PropertyFormData) => {
    console.log("Form data:", data);

    // Check location validation
    if (locationError) {
      toast.error("Please select a valid property location");
      return;
    }

    // Validate images and cover image before submission
    if (uploadedImages.length === 0) {
      setError("images", { message: "At least one image is required" });
      setImageError("At least one image is required");
      return;
    }

    if (!coverImage) {
      setError("cover_image", { message: "Cover image is required" });
      setCoverImageError("Cover image is required");
      return;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

    // Construct FormData for file and text fields
    const form = new FormData();

    // Append basic text fields with coordinates
    form.append("location_address", data.location_address);
    form.append("location_lat", data.location_lat);
    form.append("location_lng", data.location_lng);
    form.append("property_name", data.property_name);
    form.append("languages", data.languages);
    form.append("short_description", data.short_description || "");

    // Append uploaded images
    if (uploadedImages.length > 0) {
      uploadedImages.forEach((file) => {
        form.append("media[]", file);
      });
    }

    // Append video if uploaded
    if (uploadedVideo) {
      form.append("video", uploadedVideo);
    }

    // Append cover image if selected
    if (coverImage) {
      form.append("cover_image", coverImage);
    }

    // Append 360 video URL if provided
    if (videoUrl.trim()) {
      form.append("video_url", videoUrl);
    }

    try {
      const response = await fetch("https://api.hightribe.com/api/properties", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server response:", errorData);
        toast.error(`Server Error: ${response.status}`);
        return;
      }

      const result = await response.json();
      console.log("Property created successfully:", result);
      toast.success("Property created successfully!");
      router.push("/host/stay?tab=property");
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Something went wrong while submitting.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white shadow-lg h-screen overflow-y-auto sticky top-16">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-[#1C231F] mb-8">
              Property Setup
            </h1>
            <div className="space-y-3">
              {sections.map((section) => {
                const isCompleted = getSectionStatus(section);
                return (
                  <div
                    key={section.id}
                    className="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                    onClick={() => scrollToSection(section.ref)}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-medium ${
                        isCompleted
                          ? "bg-[#1179FA] text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? "✓" : ""}
                    </div>
                    <span className="font-medium text-sm">{section.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-[940px] mx-auto space-y-8"
          >
            {/* Property Location Section */}
            <div ref={locationRef} className="">
              <div className="">
                <h2 className="text-[16px] font-bold text-[#1C231F]">
                  Property Location
                </h2>
              </div>
              <div
                className={` rounded-lg shadow-sm mt-4 ${
                  locationError ? "bg-red-100" : "bg-[#F8F8F8]"
                }`}
              >
                <div className="px-4 py-2 relative max-w-[410px]">
                  <div className="flex items-center gap-2  border rounded-full border-[#EEEEEE] bg-white px-2 py-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="12"
                      fill="none"
                      viewBox="0 0 10 12"
                    >
                      <path
                        fill="#F61818"
                        d="M4.815 6q.481 0 .824-.343.343-.342.343-.824 0-.48-.343-.824a1.12 1.12 0 0 0-.824-.343q-.48 0-.824.343a1.12 1.12 0 0 0-.343.824q0 .482.343.824.343.343.824.343m0 4.287q1.779-1.633 2.64-2.967.86-1.335.86-2.37 0-1.59-1.013-2.603-1.014-1.014-2.487-1.014T2.33 2.347 1.315 4.95q0 1.035.86 2.37.861 1.334 2.64 2.967m0 1.546Q2.468 9.835 1.308 8.122.148 6.408.148 4.95q0-2.188 1.408-3.486Q2.963.167 4.816.167q1.851 0 3.258 1.297Q9.482 2.762 9.482 4.95q0 1.458-1.16 3.172t-3.507 3.711"
                      ></path>
                    </svg>
                    <input
                      type="text"
                      className="outline-none bg-transparent text-sm w-full border-none focus:border-none focus:ring-0"
                      placeholder="Enter Property Address"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 150)
                      }
                      autoComplete="off"
                    />
                    {isLoading && (
                      <span className="ml-2 text-xs text-gray-400">
                        Loading...
                      </span>
                    )}
                  </div>

                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute left-0 top-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-auto">
                      {suggestions.map((suggestion: any, index: number) => (
                        <div
                          key={suggestion.place_id || index}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div>
                            <div className="font-medium text-gray-900">
                              {suggestion.structured_formatting.main_text}
                            </div>
                            <div className="text-sm text-gray-500">
                              {suggestion.structured_formatting.secondary_text}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location error message */}
                {locationError && (
                  <div className="px-4 pb-2">
                    <span className="text-xs text-red-500">
                      {locationError}
                    </span>
                  </div>
                )}

                <div className="w-full  rounded-lg overflow-hidden">
                  <PropertyLocationMap
                    ref={mapRef}
                    selectedLocation={selectedLocation}
                    onLocationSelect={handleMapLocationSelect}
                  />
                </div>
              </div>
            </div>

            {/* Property Overview Section */}
            <div ref={overviewRef} className="">
              <div className="">
                <h2 className="text-[16px] font-bold text-[#1C231F]">
                  Property Overview
                </h2>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm mt-4 ">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <GlobalTextInput
                    label="Property Name"
                    type="text"
                    placeholder=""
                    {...register("property_name")}
                    error={errors.property_name?.message}
                  />

                  <LanguageMultiSelect
                    label="Languages Spoken at Property"
                    value={formData.languages}
                    onChange={(value) => setValue("languages", value)}
                    error={errors.languages?.message}
                    languages={languages}
                  />
                </div>
                <GlobalTextArea
                  label="Short Description"
                  {...register("short_description")}
                  error={errors.short_description?.message}
                  rows={3}
                />
              </div>
            </div>

            {/* Property Images/Videos Section */}
            <div ref={imagesRef} className="">
              <div className="">
                <h2 className="text-[16px] font-bold text-[#1C231F]">
                  Property Images/Videos
                </h2>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm mt-4 text-center">
                {/* Upload Images Section */}
                <div className="mb-8">
                  <div className="grid grid-cols-5 gap-4 mb-3">
                    {/* Display uploaded images */}
                    {uploadedImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute z-10 -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Upload image button */}
                    <div className="aspect-square p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          handleFileUpload(files, "image");
                        }}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <span className="text-[#464444] text-4xl font-bold mb-1">
                          +
                        </span>
                        <span className="text-[#464444] text-[14px] text-xs">
                          Upload Image
                        </span>
                      </label>
                    </div>
                  </div>
                  {/* Image validation error */}
                  {(errors.images?.message || imageError) && (
                    <div className="text-red-500 text-xs mt-1">
                      {typeof errors.images?.message === "string"
                        ? errors.images.message
                        : imageError}
                    </div>
                  )}
                </div>

                {/* Upload Video Section */}
                <div className="mb-8">
                  <div className="flex gap-4">
                    {/* Video preview or placeholder */}
                    {uploadedVideo ? (
                      <div className="relative group">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 w-48">
                          <video
                            src={URL.createObjectURL(uploadedVideo)}
                            className="w-full h-full object-cover"
                            controls
                          />
                          <button
                            onClick={removeVideo}
                            className="absolute z-10 -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 truncate">
                          {uploadedVideo.name}
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video border-2 p-4 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors w-48">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            handleFileUpload(files, "video");
                          }}
                          className="hidden"
                          id="video-upload"
                        />
                        <label
                          htmlFor="video-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <span className="text-[#464444] text-4xl font-bold mb-1">
                            +
                          </span>
                          <span className="text-[#464444] text-[14px] text-xs">
                            Upload File
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Choose Cover Image Section */}
                <div className="mb-8">
                  <div className="max-w-xs">
                    {coverImage ? (
                      <div className="relative group">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={URL.createObjectURL(coverImage)}
                            alt="Cover image"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setCoverImage(null)}
                            className="absolute z-10 -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 truncate">
                          {coverImage.name}
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video border-2 p-4 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length > 0 && !coverImage) {
                              setCoverImage(files[0]);
                            }
                          }}
                          className="hidden"
                          id="cover-upload"
                        />
                        <label
                          htmlFor="cover-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <span className="text-[#464444] text-4xl font-bold mb-1">
                            +
                          </span>
                          <span className="text-[#464444] text-[14px] text-xs">
                            Upload cover
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                  {/* Cover image validation error */}
                  {(errors.cover_image?.message || coverImageError) && (
                    <div className="text-red-500 text-xs mt-1">
                      {typeof errors.cover_image?.message === "string"
                        ? errors.cover_image.message
                        : coverImageError}
                    </div>
                  )}
                </div>

                {/* Add 360 Video Section */}
                <div>
                  <label className="block text-[14px] md:text-[16px] text-left font-medium text-[#1C231F] mb-1">
                    Add 360 video
                  </label>
                  <div className="max-w-md">
                    <input
                      type="url"
                      placeholder="URL link"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end pt-4 gap-4">
              <button
                type="button"
                className="px-8 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium transition-colors text-sm shadow-sm"
                onClick={() => {
                  /* handle save as draft logic */
                }}
              >
                Save as draft
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
