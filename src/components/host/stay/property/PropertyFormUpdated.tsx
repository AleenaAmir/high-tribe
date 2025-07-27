"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PropertyLocationMap, {
  PropertyLocationMapRef,
} from "./PropertyLocationMap";
import GlobalTextInput from "../../../global/GlobalTextInput";
import GlobalSelect from "../../../global/GlobalSelect";
import GlobalTextArea from "../../../global/GlobalTextArea";
import Image from "next/image";
import { filtersArray } from "@/components/dashboard/center/MapDashboard";
import DestinationSvg from "@/components/dashboard/svgs/DestinationSvg";
import Location from "@/components/dashboard/svgs/Location";
import Filters from "@/components/dashboard/svgs/Filters";
import { toast } from "react-hot-toast";
import { apiRequest } from "@/lib/api";
import {
  fetchGooglePlaceSuggestions,
  getCoordinatesForGooglePlace,
} from "@/lib/googlePlaces";
import { useRouter } from "next/navigation";
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface PropertyFormProps {}

// Zod schema for property form validation
const propertyFormSchema = z
  .object({
    location_address: z.string().min(1, "Property location is required"),
    location_lat: z.string().min(1, "Location latitude is required"),
    location_lng: z.string().min(1, "Location longitude is required"),
    entrance_address: z.string().min(1, "Entrance address is required"),
    entrance_lat: z.string().min(1, "Entrance latitude is required"),
    entrance_lng: z.string().min(1, "Entrance longitude is required"),
    acres: z.string().min(1, "Acres is required"),
    property_name: z.string().min(1, "Property name is required"),
    property_type: z.string().min(1, "Property type is required"),
    website_url: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
    languages: z.string().min(1, "Languages spoken is required"),
    property_rules: z.string().optional(),
    short_description: z.string().optional(),
    has_insurance: z.string().optional(),
    enrollment_period: z.string().optional(),
    typically_covered: z.string().optional(),
    not_covered: z.string().optional(),
    payout_method: z.string().min(1, "Payout method is required"),
    insurance_policy_file: z.string().optional(),
    is_tax_applicable: z.string().min(1, "Tax applicability is required"),
    tax_collection_method: z.string().optional(),
    tax_name: z.string().optional(),
    tax_rate: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true; // Allow empty for optional field
          const num = parseFloat(val);
          return !isNaN(num) && num >= 0 && num <= 100;
        },
        {
          message: "Tax rate must be a valid number between 0 and 100.",
        }
      ),
    tax_notes: z.string().optional(),
    agreed_to_terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to terms and conditions",
    }),
  })
  .refine(
    (data) => {
      // Additional validation for tax fields when tax is applicable
      if (data.is_tax_applicable === "yes") {
        return (
          data.tax_name &&
          data.tax_name.trim() !== "" &&
          data.tax_rate &&
          data.tax_rate.trim() !== ""
        );
      }
      return true;
    },
    {
      message: "Tax name and rate are required when tax is applicable",
      path: ["tax_name"],
    }
  )
  .refine(
    (data) => {
      // Additional validation for tax_rate when tax is applicable
      if (data.is_tax_applicable === "yes") {
        return data.tax_rate && data.tax_rate.trim() !== "";
      }
      return true;
    },
    {
      message: "Tax rate is required when tax is applicable",
      path: ["tax_rate"],
    }
  );

type PropertyFormData = z.infer<typeof propertyFormSchema>;

const PropertyForm: React.FC<PropertyFormProps> = () => {
  // Function to call properties/enums API and console results
  const callPropertiesEnumsAPI = async () => {
    try {
      console.log("Calling properties/enums API...");
      const result = await apiRequest("properties/enums");
      console.log("Properties/enums API response:", result);
      return result;
    } catch (error) {
      console.error("Error calling properties/enums API:", error);
      throw error;
    }
  };

  // Call the API when component mounts
  useEffect(() => {
    callPropertiesEnumsAPI();
  }, []);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [entranceSearch, setEntranceSearch] = useState("");
  const [entranceSuggestions, setEntranceSuggestions] = useState<any[]>([]);
  const [isEntranceLoading, setIsEntranceLoading] = useState(false);
  const [showEntranceSuggestions, setShowEntranceSuggestions] = useState(false);
  const mapRef = useRef<PropertyLocationMapRef>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [uploadedVideos, setUploadedVideos] = useState<File[]>([]);
  const router = useRouter();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    mode: "onTouched",
    defaultValues: {
      location_address: "",
      location_lat: "",
      location_lng: "",
      entrance_address: "",
      entrance_lat: "",
      entrance_lng: "",
      acres: "",
      property_name: "",
      property_type: "",
      website_url: "",
      languages: "",
      property_rules: "",
      short_description: "",
      has_insurance: "",
      enrollment_period: "",
      typically_covered: "",
      not_covered: "",
      payout_method: "",
      insurance_policy_file: "",
      is_tax_applicable: "",
      tax_collection_method: "collected_at_checkin",
      tax_name: "tax",
      tax_rate: "15",
      tax_notes: "",
      agreed_to_terms: false,
    },
  });

  // Watch form values for real-time updates
  const formData = watch();

  // Debug form data changes and set default values
  useEffect(() => {
    if (formData.is_tax_applicable === "yes") {
      console.log("Tax form data:", {
        is_tax_applicable: formData.is_tax_applicable,
        tax_collection_method: formData.tax_collection_method,
        tax_name: formData.tax_name,
        tax_rate: formData.tax_rate,
      });

      // Set default values if they're not already set
      if (!formData.tax_collection_method) {
        setValue("tax_collection_method", "collected_at_checkin");
      }
      if (!formData.tax_name) {
        setValue("tax_name", "tax");
      }
      if (!formData.tax_rate) {
        setValue("tax_rate", "15");
      }
    }
  }, [
    formData.is_tax_applicable,
    formData.tax_collection_method,
    formData.tax_name,
    formData.tax_rate,
    setValue,
  ]);

  // Debug radio button values
  useEffect(() => {
    console.log(
      "Current tax_collection_method value:",
      formData.tax_collection_method
    );
  }, [formData.tax_collection_method]);

  // Map location state
  const [selectedLocation, setSelectedLocation] = useState<{
    coords: [number, number] | null;
    name: string;
  }>({
    coords: null,
    name: "",
  });

  // Memoize selected location to prevent unnecessary re-renders
  const memoizedSelectedLocation = useMemo(
    () => selectedLocation,
    [selectedLocation.coords, selectedLocation.name]
  );

  // Section refs for scrolling
  const locationRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const insuranceRef = useRef<HTMLDivElement>(null);
  const payoutsRef = useRef<HTMLDivElement>(null);

  const sections = [
    {
      id: "location",
      title: "Property Location",
      icon: "📍",
      ref: locationRef,
      requiredFields: ["entrance_address"], // Entrance location is required, not general property location
    },
    {
      id: "overview",
      title: "Property Overview",
      icon: "📋",
      ref: overviewRef,
      requiredFields: ["acres", "property_name", "property_type", "languages"],
    },
    {
      id: "images",
      title: "Property Images/Videos",
      icon: "📷",
      ref: imagesRef,
      requiredFields: [], // Images are optional
    },
    {
      id: "insurance",
      title: "Insurance",
      icon: "🛡️",
      ref: insuranceRef,
      requiredFields: ["enrollment_period"],
    },
    {
      id: "payouts",
      title: "Payouts and Taxes",
      icon: "💰",
      ref: payoutsRef,
      requiredFields: ["payout_method", "is_tax_applicable"],
    },
  ];

  const propertyTypes = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "villa", label: "Villa" },
    { value: "condo", label: "Condo" },
    { value: "hotel", label: "Hotel" },
    { value: "hostel", label: "Hostel" },
    { value: "guesthouse", label: "Guesthouse" },
    { value: "bnb", label: "Bed & Breakfast" },
  ];

  const languages = [
    { value: "english", label: "English" },
    { value: "urdu", label: "Urdu" },
    { value: "punjabi", label: "Punjabi" },
    { value: "arabic", label: "Arabic" },
    { value: "french", label: "French" },
    { value: "spanish", label: "Spanish" },
    { value: "german", label: "German" },
    { value: "chinese", label: "Chinese" },
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
      // Location section is complete when exact entrance location is set
      return (
        formData.entrance_address && formData.entrance_address.trim() !== ""
      );
    }

    if (section.id === "insurance") {
      // Insurance section is complete if enrollment_period has a value
      return (
        formData.enrollment_period && formData.enrollment_period.trim() !== ""
      );
    }

    if (section.id === "payouts") {
      return baseComplete;
    }

    if (section.id === "images") {
      return uploadedImages.length > 0 || coverImage !== null; // At least one image uploaded or cover image
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

  // Autocomplete for search input (general area search)
  useEffect(() => {
    if (search.length < 2) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        search
      )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&autocomplete=true&limit=5&types=place,region,locality,district`
    )
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data.features || []);
        setIsLoading(false);
      });
  }, [search]);

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
      fetchEntranceSuggestions(entranceSearch);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [entranceSearch, fetchEntranceSuggestions]);

  // Handle suggestion click for location search
  const handleSuggestionClick = (feature: any) => {
    setSearch(feature.place_name);
    setValue("location_address", feature.place_name);
    setValue(
      "location_lat",
      feature.center ? feature.center[1].toString() : ""
    );
    setValue(
      "location_lng",
      feature.center ? feature.center[0].toString() : ""
    );
    setSuggestions([]);
    setShowSuggestions(false);

    // Store the general area coordinates for entrance search context
    if (feature.center) {
      setSelectedLocation({
        coords: [feature.center[0], feature.center[1]],
        name: feature.place_name,
      });
    }

    // Only fly to the location, don't add marker yet
    if (mapRef.current && feature.center) {
      const [lng, lat] = feature.center;
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
        coordinates = suggestion.center;
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
    } catch (error) {
      console.error("Error handling entrance suggestion click:", error);
    }
  };

  // Handle map location selection - this is for entrance location
  const handleMapLocationSelect = useCallback(
    (coords: [number, number], placeName: string) => {
      setEntranceSearch(placeName);
      setValue("entrance_address", placeName);
      setValue("entrance_lat", coords[1].toString());
      setValue("entrance_lng", coords[0].toString());
      setSelectedLocation({
        coords,
        name: placeName,
      });
    },
    [setValue]
  );

  const [isFilters, setIsFilters] = useState<boolean>(false);

  const handleFileUpload = (
    files: File[],
    type: "image" | "video" = "image"
  ) => {
    if (type === "image") {
      setUploadedImages((prev) => [...prev, ...files]);
    } else {
      setUploadedVideos((prev) => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setUploadedVideos((prev) => prev.filter((_, i) => i !== index));
  };

  // Form submission handler
  const onSubmit = async (data: PropertyFormData) => {
    console.log(data, "Form data---------------------");
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") || "<PASTE_VALID_TOKEN_HERE>"
        : "<PASTE_VALID_TOKEN_HERE>";

    console.log(token, "Token---------------------");

    // Construct FormData for file and text fields
    const form = new FormData();

    // Append basic text fields - only send real data, no fallbacks
    form.append("location_address", data.location_address);
    form.append("location_lat", data.location_lat);
    form.append("location_lng", data.location_lng);
    form.append("entrance_address", data.entrance_address);
    form.append("entrance_lat", data.entrance_lat);
    form.append("entrance_lng", data.entrance_lng);
    form.append("acres", data.acres);
    form.append("property_name", data.property_name);
    form.append("property_type", data.property_type);
    form.append("short_description", data.short_description || "");
    form.append("website_url", data.website_url || "");
    form.append("languages", data.languages);
    form.append("property_rules", data.property_rules || "");
    // Derive has_insurance based on enrollment_period
    const hasInsurance =
      data.enrollment_period && data.enrollment_period.trim() !== ""
        ? true
        : false;
    form.append("has_insurance", hasInsurance ? "1" : "0");
    form.append("enrollment_period", data.enrollment_period || "");
    form.append("typically_covered", data.typically_covered || "");
    form.append("not_covered", data.not_covered || "");
    form.append("payout_method", data.payout_method);
    // Convert is_tax_applicable to boolean
    const isTaxApplicable = data.is_tax_applicable === "yes" ? true : false;
    form.append("is_tax_applicable", isTaxApplicable ? "1" : "0");

    // Log the values being sent for debugging
    console.log("Form data being sent:", {
      has_insurance: hasInsurance,
      is_tax_applicable: isTaxApplicable,
      payout_method: data.payout_method,
      tax_collection_method:
        data.tax_collection_method || "collected_at_checkin",
      tax_name: data.tax_name || "tax",
      tax_rate: data.tax_rate || "15",
      tax_rate_parsed: data.tax_rate ? parseFloat(data.tax_rate) : 15,
      is_tax_applicable_raw: data.is_tax_applicable,
      formData: data,
    });
    form.append("insurance_policy_file", data.insurance_policy_file || "");
    // Handle tax fields - always append with appropriate values
    if (data.is_tax_applicable === "yes") {
      // Map the tax collection method from label to enum value
      const taxCollectionMethodMap: { [key: string]: string } = {
        "Included in nightly rate": "included_in_rate",
        "Collected separately at check-in": "collected_at_checkin",
        "Collected by HighTribe at checkout": "collected_by_hightribe",
      };

      // Get the correct enum value for tax collection method
      const taxCollectionMethod =
        taxCollectionMethodMap[data.tax_collection_method || ""] ||
        "collected_at_checkin";
      const taxName = data.tax_name || "tax";
      const taxRate = data.tax_rate || "15";

      // Always append tax fields when tax is applicable
      form.append("tax_collection_method", taxCollectionMethod);
      form.append("tax_name", taxName);
      form.append("tax_rate", taxRate);

      console.log("Tax fields being sent (tax applicable):", {
        tax_collection_method: taxCollectionMethod,
        tax_name: taxName,
        tax_rate: taxRate,
        original_value: data.tax_collection_method,
      });
    } else {
      // When tax is not applicable, send empty values or defaults
      form.append("tax_collection_method", "");
      form.append("tax_name", "");
      form.append("tax_rate", "");

      console.log("Tax fields being sent (tax not applicable):", {
        tax_collection_method: "",
        tax_name: "",
        tax_rate: "",
      });
    }
    form.append("tax_notes", data.tax_notes || "");
    form.append("agreed_to_terms", data.agreed_to_terms ? "1" : "0");

    // Append uploaded images
    if (uploadedImages.length > 0) {
      uploadedImages.forEach((file) => {
        form.append("media[]", file);
      });
    } else {
      // If no images uploaded, send a placeholder
      form.append(
        "media[]",
        new Blob([""], { type: "image/png" }),
        "placeholder.png"
      );
    }
    form.append("type", "image");

    // Debug: Log all form data being sent
    console.log("All form data being sent:");
    for (let [key, value] of form.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Send form data to backend
    try {
      const response = await fetch("https://api.hightribe.com/api/properties", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          // Remove Content-Type header - let browser set it automatically for FormData
        },
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server response:", errorData);

        // Try to parse as JSON for better error display
        try {
          const errorJson = JSON.parse(errorData);
          if (errorJson.errors) {
            const errorMessages = Object.entries(errorJson.errors)
              .map(
                ([field, messages]) =>
                  `${field}: ${
                    Array.isArray(messages) ? messages.join(", ") : messages
                  }`
              )
              .join("\n");
            toast.error(`Validation Error:\n${errorMessages}`);
          } else {
            toast.error(`Server Error: ${response.status} - ${errorData}`);
          }
        } catch {
          toast.error(`Server Error: ${response.status} - ${errorData}`);
        }
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
              {sections.map((section, index) => {
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
                    <span className={`font-medium text-sm `}>
                      {section.title}
                    </span>
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
              <div className=" ">
                <h2 className="text-[16px] font-bold text-[#1C231F]">
                  Property Location
                </h2>
              </div>
              <div className=" bg-white rounded-lg shadow-sm mt-4">
                <div className="flex items-center justify-between p-3 bg-[#F8F8F8] md:px-6 relative">
                  <div className="flex items-center gap-2 w-full  relative">
                    <div className="flex items-center px-2 py-1 group gap-2 bg-white border border-[#EEEEEE] rounded-full w-full relative max-w-[200px]">
                      <Location className="flex-shrink-0 text-[#696969] group-hover:text-[#F6691D]" />
                      <input
                        type="text"
                        className="outline-none bg-transparent text-sm w-full"
                        placeholder="Property Location"
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
                    <div className="flex items-center px-2 py-1 gap-2 bg-white border border-[#EEEEEE] rounded-full w-full relative max-w-[200px]">
                      <DestinationSvg className="flex-shrink-0" />
                      <input
                        type="text"
                        className="outline-none bg-transparent text-sm w-full"
                        placeholder="Property Entrance"
                        value={entranceSearch}
                        onChange={(e) => {
                          setEntranceSearch(e.target.value);
                          setShowEntranceSuggestions(true);
                        }}
                        onFocus={() => setShowEntranceSuggestions(true)}
                        onBlur={() =>
                          setTimeout(
                            () => setShowEntranceSuggestions(false),
                            150
                          )
                        }
                        autoComplete="off"
                      />
                      {isEntranceLoading && (
                        <span className="ml-2 text-xs text-gray-400">
                          Loading...
                        </span>
                      )}
                      {showEntranceSuggestions &&
                        entranceSuggestions.length > 0 && (
                          <div className="absolute left-0 top-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-auto">
                            {entranceSuggestions.map(
                              (suggestion: any, index: number) => (
                                <div
                                  key={
                                    suggestion.place_id ||
                                    suggestion.id ||
                                    index
                                  }
                                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                                  onClick={() =>
                                    handleEntranceSuggestionClick(suggestion)
                                  }
                                >
                                  {suggestion.structured_formatting ? (
                                    // Google Places suggestion
                                    <div>
                                      <div className="font-medium text-gray-900">
                                        {
                                          suggestion.structured_formatting
                                            .main_text
                                        }
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
                <div className="overflow-hidden h-fit ">
                  <PropertyLocationMap
                    ref={mapRef}
                    selectedLocation={memoizedSelectedLocation}
                    onLocationSelect={handleMapLocationSelect}
                  />
                </div>
              </div>
            </div>

            {/* Property Overview Section */}
            <div ref={overviewRef} className="  ">
              <div className=" ">
                <h2 className="text-[16px] font-bold text-[#1C231F]">
                  Property Overview
                </h2>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm mt-4">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="grid gap-1 h-fit">
                    <GlobalTextInput
                      label={
                        <span>
                          Acres<span className="text-red-500">*</span>
                        </span>
                      }
                      type="number"
                      placeholder=""
                      {...register("acres")}
                      error={errors.acres?.message}
                    />
                    <GlobalSelect
                      label={
                        <span>
                          Property Type<span className="text-red-500">*</span>
                        </span>
                      }
                      {...register("property_type")}
                      error={errors.property_type?.message}
                    >
                      <option value="">Select property type</option>
                      {propertyTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </GlobalSelect>
                    <GlobalSelect
                      label="Languages Spoken at Property"
                      {...register("languages")}
                      error={errors.languages?.message}
                    >
                      <option value="">Select language</option>
                      {languages.map((language) => (
                        <option key={language.value} value={language.value}>
                          {language.label}
                        </option>
                      ))}
                    </GlobalSelect>

                    <div className="-mt-1">
                      <GlobalTextArea
                        label="Short Description"
                        {...register("short_description")}
                        error={errors.short_description?.message}
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="grid gap-1 h-fit">
                    <GlobalTextInput
                      label={
                        <span>
                          Property Name<span className="text-red-500">*</span>
                        </span>
                      }
                      type="text"
                      placeholder=""
                      {...register("property_name")}
                      error={errors.property_name?.message}
                    />
                    <GlobalTextInput
                      label="Website"
                      type="url"
                      {...register("website_url")}
                      error={errors.website_url?.message}
                    />

                    <GlobalTextArea
                      label="Property Rules"
                      {...register("property_rules")}
                      error={errors.property_rules?.message}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Property Images/Videos Section */}
            <div ref={imagesRef} className="">
              <div className=" ">
                <h2 className="text-[16px] font-bold text-[#1C231F]">
                  Property Images/Videos
                </h2>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm mt-4">
                {/* Upload Images Section */}
                <div className="mb-8">
                  <label className="block text-[14px] font-medium  text-[#1C231F] mb-4">
                    Upload images
                  </label>
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
                          Upload image
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Upload Video Section */}
                <div className="mb-8">
                  <label className="block text-[14px] font-medium  text-[#1C231F] mb-4">
                    Upload optimal short video
                  </label>
                  <div className="grid grid-cols-5 gap-4">
                    {/* Video preview or placeholder */}
                    {uploadedVideos.length > 0 &&
                      uploadedVideos.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <video
                              src={URL.createObjectURL(file)}
                              className="w-full h-full object-cover"
                              controls
                            />
                            <button
                              onClick={() => removeVideo(index)}
                              className="absolute z-10 -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              type="button"
                              aria-label="Remove video"
                            >
                              ×
                            </button>
                          </div>
                          <div className="mt-2 text-xs text-gray-500 truncate">
                            {file.name}
                          </div>
                        </div>
                      ))}

                    {/* Video upload button */}
                    <div className="aspect-video border-2 p-4 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
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
                          Upload Mp4
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Choose Cover Image Section */}
                <div>
                  <label className="block text-[14px] font-medium  text-[#1C231F] mb-4">
                    Choose a cover image
                  </label>
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
                      <div className="aspect-video border-2 p-4 h-fit w-fit border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            // Only allow one cover image to be selected
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
                </div>
              </div>
            </div>

            {/* Insurance Section */}
            <div ref={insuranceRef} className="">
              <div className=" ">
                <h2 className="text-[16px] font-bold text-[#1C231F]">
                  Insurance
                </h2>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm mt-4">
                <div className="text-[12px] font-bold mb-4">
                  You are not currently covered under the HighTribe Insurance
                  Policy
                </div>

                {/* Enrollment period - full width */}
                <div className="mb-4">
                  <GlobalTextInput
                    label="Enrollment period"
                    type="text"
                    {...register("enrollment_period")}
                    error={errors.enrollment_period?.message}
                  />
                </div>

                {/* Two columns for covered/not covered */}
                <div className="grid grid-cols-2 gap-4">
                  <GlobalSelect
                    label="Examples of what is typically covered"
                    {...register("typically_covered")}
                    error={errors.typically_covered?.message}
                  >
                    <option value="">Select an example</option>
                    <option value="property_damage">Property damage</option>
                    <option value="liability">Liability</option>
                    <option value="theft">Theft</option>
                    <option value="fire">Fire</option>
                  </GlobalSelect>
                  <GlobalSelect
                    label="Examples of what is not covered"
                    {...register("not_covered")}
                    error={errors.not_covered?.message}
                  >
                    <option value="">Select an example</option>
                    <option value="wear_tear">Normal wear and tear</option>
                    <option value="intentional_damage">
                      Intentional damage
                    </option>
                    <option value="pets">Pet damage</option>
                    <option value="acts_of_god">Acts of God</option>
                  </GlobalSelect>
                </div>
              </div>
            </div>

            {/* Payouts and Taxes Section */}
            <div ref={payoutsRef} className="">
              <div className=" ">
                <h2 className="text-[16px] font-bold text-[#1C231F]">
                  Payouts and Taxes<span className="text-red-500">*</span>
                </h2>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm mt-4">
                {/* Payout Methods Section */}
                <div className="mb-8">
                  <div className="text-[12px] font-bold mb-4">
                    The user should be able to select their payout/checkout
                    method
                  </div>
                  <div className="space-y-3">
                    {[
                      { value: "stripe", label: "Stripe" },
                      { value: "credit_cards", label: "Credit/Debit Cards" },
                      { value: "paypal", label: "PayPal" },
                      { value: "payoneer", label: "Payoneer" },
                      { value: "venmo", label: "Venmo" },
                      { value: "bank_transfer", label: "Bank Transfer" },
                      { value: "other", label: "More methods TBD" },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className="flex items-center gap-3 text-sm cursor-pointer"
                      >
                        <input
                          type="radio"
                          value={method.value}
                          {...register("payout_method")}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-[#1C231F]">{method.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.payout_method && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.payout_method.message}
                    </div>
                  )}
                </div>

                {/* Taxes Section */}
                <div className="mb-8">
                  <div className="text-[12px] font-bold mb-4">
                    The user should be able to set up taxes (required). Display
                    the following content
                  </div>

                  {/* Tax Subject Question */}
                  <div className="mb-4">
                    <div className="text-[12px] font-bold mb-3">
                      Is your property subject to local stay or occupancy tax?
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          value="yes"
                          {...register("is_tax_applicable")}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-[#1C231F]">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          value="no"
                          {...register("is_tax_applicable")}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-[#1C231F]">No</span>
                      </label>
                    </div>
                    {errors.is_tax_applicable && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.is_tax_applicable.message}
                      </div>
                    )}
                  </div>

                  {/* Collection Method (shown when Yes is selected) */}
                  {formData.is_tax_applicable === "yes" && (
                    <div className="space-y-4">
                      <div>
                        <div className="text-[12px] font-bold mb-3">
                          If yes, how should it be collected?
                        </div>
                        <div className="space-y-3">
                          {[
                            {
                              value: "included_in_rate",
                              label: "Included in nightly rate",
                            },
                            {
                              value: "collected_at_checkin",
                              label: "Collected separately at check-in",
                            },
                            {
                              value: "collected_by_hightribe",
                              label: "Collected by HighTribe at checkout",
                            },
                          ].map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center gap-3 text-sm cursor-pointer"
                            >
                              <input
                                type="radio"
                                value={option.value}
                                checked={
                                  formData.tax_collection_method ===
                                  option.value
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setValue(
                                      "tax_collection_method",
                                      option.value
                                    );
                                  }
                                }}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                              />
                              <span className="text-[#1C231F]">
                                {option.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Tax Name and Rate */}
                      <div className="grid grid-cols-2 gap-4">
                        <GlobalTextInput
                          label="Tax Name"
                          type="text"
                          {...register("tax_name")}
                          error={errors.tax_name?.message}
                        />
                        <GlobalTextInput
                          label="Tax Rate"
                          //   type="text"
                          type="number"
                          max="100"
                          min="0"
                          step="0.01"
                          {...register("tax_rate")}
                          error={errors.tax_rate?.message}
                        />
                      </div>

                      {/* Additional Notes */}
                      <GlobalTextArea
                        label="Additional Notes"
                        placeholder="Notes"
                        {...register("tax_notes")}
                        error={errors.tax_notes?.message}
                        rows={3}
                      />
                    </div>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    {...register("agreed_to_terms")}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-[#1C231F] select-none cursor-pointer"
                  >
                    Terms and Conditions of HighTribe for Property Listing
                  </label>
                </div>
                {errors.agreed_to_terms && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.agreed_to_terms.message}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 gap-4">
              <button
                type="button"
                className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors text-sm shadow-sm"
                onClick={() => {
                  /* handle exit logic */
                }}
              >
                Exit
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save & Next"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
