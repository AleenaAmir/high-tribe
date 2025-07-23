"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
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
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface PropertyFormProps {}

const PropertyForm: React.FC<PropertyFormProps> = () => {
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  // Form state
  const [formData, setFormData] = useState({
    tripLocation: "",
    entranceLocation: "123 Main St, Anytown, USA",
    propertyPresence: "",
    location_address: "123 Main St, Anytown, USA",
    access: "",
    acres: "",
    propertyName: "",
    propertyType: "",
    website: "",
    languagesSpoken: "",
    propertyRules: "",
    shortDescription: "",
    insurance: "Insurance is required",
    contactMethods: [] as string[],
    payoutMethod: "Credit/Debit Cards",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountHolderName: "",
    taxInfo: "Tax is 10% of the nightly rate",
    taxCountry: "United States",
    amenities: [] as string[],
    enrollmentPeriod: "",
    coveredExample: "",
    notCoveredExample: "",
    isLocalTax: "yes",
    taxCollectionMethod: "Included in nightly rate",
    taxName: "Tax",
    taxRate: "10",
    taxNotes: "Tax is 10% of the nightly rate",
    termsAccepted: false,
  });

  const sections = [
    {
      id: "location",
      title: "Property Location",
      icon: "📍",
      ref: locationRef,
      requiredFields: ["entranceLocation"], // Entrance location is required, not general property location
    },
    {
      id: "overview",
      title: "Property Overview",
      icon: "📋",
      ref: overviewRef,
      requiredFields: [
        "acres",
        "propertyName",
        "propertyType",
        "languagesSpoken",
      ],
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
      requiredFields: ["insurance"],
    },
    {
      id: "payouts",
      title: "Payouts and Taxes",
      icon: "💰",
      ref: payoutsRef,
      requiredFields: ["payoutMethod", "taxInfo", "taxCountry"],
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

  // Add additional validation for bank fields when bank is selected
  const isBankSectionComplete = () => {
    if (formData.payoutMethod !== "bank") return true;
    return (
      formData.bankName &&
      formData.accountNumber &&
      formData.routingNumber &&
      formData.accountHolderName
    );
  };

  // Enhanced section completion check
  const getSectionStatus = (section: (typeof sections)[0]) => {
    const baseComplete = isSectionCompleted(section);

    if (section.id === "location") {
      // Location section is complete when exact entrance location is set
      return formData.entranceLocation;
    }

    if (section.id === "payouts") {
      return baseComplete && isBankSectionComplete();
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

  // Autocomplete for entrance search input
  useEffect(() => {
    if (entranceSearch.length < 2) {
      setEntranceSuggestions([]);
      return;
    }
    setIsEntranceLoading(true);

    // Build search query with property location context if available
    let searchQuery = entranceSearch;
    let apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      searchQuery
    )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&autocomplete=true&limit=5`;

    // Configure API for detailed address/street results
    apiUrl += `&types=address,poi,place,locality,neighborhood`;

    // If property location is set, bias the search towards that area
    if (formData.tripLocation) {
      // Add the property location as context to the search
      searchQuery = `${entranceSearch}, ${formData.tripLocation}`;
      apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        searchQuery
      )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&autocomplete=true&limit=10&types=address,poi,place,locality,neighborhood`;

      // If we have coordinates from the selected location, use proximity bias
      if (selectedLocation.coords) {
        const [lng, lat] = selectedLocation.coords;
        apiUrl += `&proximity=${lng},${lat}`;
      }
    }

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setEntranceSuggestions(data.features || []);
        setIsEntranceLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching entrance suggestions:", error);
        setEntranceSuggestions([]);
        setIsEntranceLoading(false);
      });
  }, [entranceSearch, formData.tripLocation, selectedLocation.coords]);

  // Handle suggestion click
  const handleSuggestionClick = (feature: any) => {
    setSearch(feature.place_name);
    setFormData((prev) => ({ ...prev, tripLocation: feature.place_name }));
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

  // Handle entrance suggestion click
  const handleEntranceSuggestionClick = (feature: any) => {
    setEntranceSearch(feature.place_name);
    setFormData((prev) => ({ ...prev, entranceLocation: feature.place_name }));
    setEntranceSuggestions([]);
    setShowEntranceSuggestions(false);

    // Add marker at the exact entrance location
    if (mapRef.current && feature.center) {
      const [lng, lat] = feature.center;
      mapRef.current.addMarker(lng, lat, feature.place_name);
      setSelectedLocation({ coords: [lng, lat], name: feature.place_name });
    }
  };

  // Handle map location selection - this is for entrance location
  const handleMapLocationSelect = useCallback(
    (coords: [number, number], placeName: string) => {
      setEntranceSearch(placeName);
      setFormData((prev) => ({ ...prev, entranceLocation: placeName }));
      setSelectedLocation({
        coords,
        name: placeName,
      });
    },
    []
  );

  const [isFilters, setIsFilters] = useState<boolean>(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    console.log(formData, "---------------------");
  };

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    // Validate required fields
    sections.forEach((section) => {
      section.requiredFields.forEach((field) => {
        const value = formData[field as keyof typeof formData];
        if (Array.isArray(value) ? value.length === 0 : !value) {
          newErrors[field] = "This field is required";
        }
      });
    });

    if (formData.payoutMethod === "bank") {
      [
        "bankName",
        "accountNumber",
        "routingNumber",
        "accountHolderName",
      ].forEach((field) => {
        if (!formData[field as keyof typeof formData]) {
          newErrors[field] = "This field is required";
        }
      });
    }

    if (uploadedImages.length === 0 && !coverImage) {
      newErrors["uploadedImages"] =
        "At least one image or cover image is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") || "<PASTE_VALID_TOKEN_HERE>"
        : "<PASTE_VALID_TOKEN_HERE>";

    // Construct FormData for file and text fields
    const form = new FormData();

    // Append basic text fields
    form.append(
      "location_address",
      formData.tripLocation || "123 Main St, Anytown, USA"
    );
    form.append(
      "entrance_address",
      formData.entranceLocation || "123 Main St, Anytown, USA"
    );
    form.append("acres", formData.acres);
    form.append("property_name", formData.propertyName);
    form.append("property_type", formData.propertyType);
    form.append("short_description", formData.shortDescription);
    form.append("website_url", formData.website);
    form.append("languages", formData.languagesSpoken);
    form.append("property_rules", formData.propertyRules);
    form.append("has_insurance", formData.insurance ? "1" : "0");
    form.append("enrollment_period", formData.enrollmentPeriod || "");
    form.append("typically_covered", formData.coveredExample || "");
    form.append("not_covered", formData.notCoveredExample || "");
    form.append("payout_method", formData.payoutMethod);
    form.append("is_tax_applicable", formData.isLocalTax === "yes" ? "1" : "0");
    form.append("tax_collection_method", formData.taxCollectionMethod);
    form.append("tax_name", formData.taxName);
    form.append("tax_rate", formData.taxRate);
    form.append("tax_notes", formData.taxNotes);
    form.append("agreed_to_terms", formData.termsAccepted ? "1" : "0");

    // Append optional bank fields
    if (formData.payoutMethod === "bank") {
      form.append("bank_name", formData.bankName);
      form.append("account_number", formData.accountNumber);
      form.append("routing_number", formData.routingNumber);
      form.append("account_holder_name", formData.accountHolderName);
    }

    // Append uploaded images
    uploadedImages.forEach((file) => {
      form.append("media[]", file);
    });

    // Append cover image
    if (coverImage) {
      form.append("cover_image", coverImage);
    }

    // Append uploaded videos (if supported by backend)
    uploadedVideos.forEach((file) => {
      form.append("videos[]", file);
    });
    console.log(token, "---------------------");
    // Send form data to backend
    try {
      const response = await fetch(
        "https://high-tribe-backend.hiconsolutions.com/api/properties",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // "Accept": "application/json",
            // "Content-Type": "multipart/form-data",
          },
          body: form,
        }
      );

      if (!response.ok) {
        toast.error(`Server Error: ${response.status}`);
      }

      toast.success("Property created successfully!");
      // for debugging
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
            onSubmit={handleSubmit}
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
                            {entranceSuggestions.map((feature) => (
                              <div
                                key={feature.id}
                                className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm"
                                onClick={() =>
                                  handleEntranceSuggestionClick(feature)
                                }
                              >
                                {feature.place_name}
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
                      type="text"
                      placeholder=""
                      value={formData.acres || ""}
                      onChange={(e) =>
                        handleInputChange("acres", e.target.value)
                      }
                    />
                    <GlobalSelect
                      label={
                        <span>
                          Property Type<span className="text-red-500">*</span>
                        </span>
                      }
                      value={formData.propertyType}
                      onChange={(e) =>
                        handleInputChange("propertyType", e.target.value)
                      }
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
                      value={formData.languagesSpoken}
                      onChange={(e) =>
                        handleInputChange("languagesSpoken", e.target.value)
                      }
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
                        value={formData.shortDescription}
                        onChange={(e) =>
                          handleInputChange("shortDescription", e.target.value)
                        }
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
                      value={formData.propertyName}
                      onChange={(e) =>
                        handleInputChange("propertyName", e.target.value)
                      }
                    />
                    <GlobalTextInput
                      label="Website"
                      type="url"
                      value={formData.website}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                    />

                    <GlobalTextArea
                      label="Property Rules"
                      value={formData.propertyRules}
                      onChange={(e) =>
                        handleInputChange("propertyRules", e.target.value)
                      }
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
                  <label className="block text-sm font-medium text-gray-700 mb-4">
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
                        <span className="text-gray-400 text-4xl mb-1">+</span>
                        <span className="text-gray-500 text-xs">
                          Upload image
                        </span>
                      </label>
                    </div>
                  </div>
                  {/* <div className="text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        handleFileUpload(files, "image");
                      }}
                      className="hidden"
                      id="additional-image-upload"
                    />
                    <label
                      htmlFor="additional-image-upload"
                      className="text-gray-600 text-sm cursor-pointer hover:text-gray-800"
                    >
                      Upload image
                    </label>
                  </div> */}
                </div>

                {/* Upload Video Section */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
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
                        <span className="text-gray-400 text-4xl mb-1">+</span>
                        <span className="text-gray-500 text-xs">
                          Upload Mp4
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Choose Cover Image Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
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
                          <span className="text-gray-400 text-4xl mb-1">+</span>
                          <span className="text-gray-500 text-xs">
                            Upload cover
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {errors.uploadedImages && (
                  <div className="text-red-500 text-xs mt-4">
                    {errors.uploadedImages}
                  </div>
                )}
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
                <div className="text-sm font-bold mb-4">
                  You are not currently covered under the HighTribe Insurance
                  Policy
                </div>

                {/* Enrollment period - full width */}
                <div className="mb-4">
                  <GlobalTextInput
                    label="Enrollment period"
                    type="text"
                    value={formData.enrollmentPeriod || ""}
                    onChange={(e) =>
                      handleInputChange("enrollmentPeriod", e.target.value)
                    }
                  />
                </div>

                {/* Two columns for covered/not covered */}
                <div className="grid grid-cols-2 gap-4">
                  <GlobalSelect
                    label="Examples of what is typically covered"
                    value={formData.coveredExample || ""}
                    onChange={(e) =>
                      handleInputChange("coveredExample", e.target.value)
                    }
                  >
                    <option value="">Select an example</option>
                    <option value="property_damage">Property damage</option>
                    <option value="liability">Liability</option>
                    <option value="theft">Theft</option>
                    <option value="fire">Fire</option>
                  </GlobalSelect>
                  <GlobalSelect
                    label="Examples of what is not covered"
                    value={formData.notCoveredExample || ""}
                    onChange={(e) =>
                      handleInputChange("notCoveredExample", e.target.value)
                    }
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
                  <div className="text-sm font-bold mb-4">
                    The user should be able to select their payout/checkout
                    method
                  </div>
                  <div className="space-y-3">
                    {[
                      "Stripe",
                      "Credit/Debit Cards",
                      "PayPal",
                      "Payoneer",
                      "Venmo",
                      "Bank Transfer",
                      "More methods TBD",
                    ].map((method) => (
                      <label
                        key={method}
                        className="flex items-center gap-3 text-sm cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="payoutMethod"
                          value={method}
                          checked={formData.payoutMethod === method}
                          onChange={() =>
                            handleInputChange("payoutMethod", method)
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-[#1C231F]">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Taxes Section */}
                <div className="mb-8">
                  <div className="text-sm font-bold mb-4">
                    The user should be able to set up taxes (required). Display
                    the following content
                  </div>

                  {/* Tax Subject Question */}
                  <div className="mb-4">
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="isLocalTax"
                          value="no"
                          checked={formData.isLocalTax === "no"}
                          onChange={() => handleInputChange("isLocalTax", "no")}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-[#1C231F]">
                          {" "}
                          Is your property subject to local stay or occupancy
                          tax?
                        </span>
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="isLocalTax"
                          value="yes"
                          checked={formData.isLocalTax === "yes"}
                          onChange={() =>
                            handleInputChange("isLocalTax", "yes")
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-[#1C231F]">Yes</span>
                      </label>
                    </div>
                  </div>

                  {/* Collection Method (shown when Yes is selected) */}
                  {formData.isLocalTax === "yes" && (
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-bold mb-3">
                          If yes, how should it be collected?
                        </div>
                        <div className="space-y-3">
                          {[
                            "Included in nightly rate",
                            "Collected separately at check-in",
                            "Collected by HighTribe at checkout",
                          ].map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-3 text-sm cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="taxCollectionMethod"
                                value={option}
                                checked={
                                  formData.taxCollectionMethod === option
                                }
                                onChange={() =>
                                  handleInputChange(
                                    "taxCollectionMethod",
                                    option
                                  )
                                }
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                              />
                              <span className="text-[#1C231F]">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Tax Name and Rate */}
                      <div className="grid grid-cols-2 gap-4">
                        <GlobalTextInput
                          label="Tax Name"
                          type="text"
                          value={formData.taxName || ""}
                          onChange={(e) =>
                            handleInputChange("taxName", e.target.value)
                          }
                        />
                        <GlobalTextInput
                          label="Tax Rate"
                          type="text"
                          value={formData.taxRate || ""}
                          onChange={(e) =>
                            handleInputChange("taxRate", e.target.value)
                          }
                        />
                      </div>

                      {/* Additional Notes */}
                      <GlobalTextArea
                        label="Additional Notes"
                        placeholder="Notes"
                        value={formData.taxNotes || ""}
                        onChange={(e) =>
                          handleInputChange("taxNotes", e.target.value)
                        }
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
                    checked={formData.termsAccepted || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        termsAccepted: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-[#1C231F] select-none cursor-pointer"
                  >
                    Terms and Conditions of HighTribe for Property Listing
                  </label>
                </div>
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
              >
                Save & Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
