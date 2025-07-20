"use client";
import React, { useState, useRef, useEffect } from "react";
import PropertyLocationMap, {
  PropertyLocationMapRef,
} from "./PropertyLocationMap";
import GlobalInput from "../../../global/GlobalInput";
import GlobalSelect from "../../../global/GlobalSelect";
import GlobalTextArea from "../../../global/GlobalTextArea";
import GlobalFileUpload from "../../../global/GlobalFileUpload";
import GlobalRadioGroup from "../../../global/GlobalRadioGroup";
import GlobalCheckboxGroup from "../../../global/GlobalCheckboxGroup";
import GlobalTagInput from "../../../global/GlobalTagInput";
import Image from "next/image";
import { filtersArray } from "@/components/dashboard/center/MapDashboard";
import DestinationSvg from "@/components/dashboard/svgs/DestinationSvg";
import Location from "@/components/dashboard/svgs/Location";
import Filters from "@/components/dashboard/svgs/Filters";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface PropertyFormProps {}

const PropertyForm: React.FC<PropertyFormProps> = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const mapRef = useRef<PropertyLocationMapRef>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number | null>(null);
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

  // Section refs for scrolling
  const locationRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const insuranceRef = useRef<HTMLDivElement>(null);
  const payoutsRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    tripLocation: "",
    propertyPresence: "",
    access: "",
    acres: "",
    propertyName: "",
    propertyType: "",
    website: "",
    languagesSpoken: "",
    propertyRules: "",
    shortDescription: "",
    insurance: "",
    contactMethods: [] as string[],
    payoutMethod: "Credit/Debit Cards",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountHolderName: "",
    taxInfo: "",
    taxCountry: "",
    amenities: [] as string[],
    enrollmentPeriod: "",
    coveredExample: "",
    notCoveredExample: "",
    isLocalTax: "yes",
    taxCollectionMethod: "Included in nightly rate",
    taxName: "",
    taxRate: "",
    taxNotes: "",
    termsAccepted: false,
  });

  const sections = [
    {
      id: "location",
      title: "Property Location",
      icon: "📍",
      ref: locationRef,
      requiredFields: ["tripLocation", "propertyPresence"],
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

  const propertyPresenceOptions = [
    { value: "owner-occupied", label: "Owner Occupied" },
    { value: "managed", label: "Professionally Managed" },
    { value: "self-service", label: "Self Service" },
    { value: "hybrid", label: "Hybrid Management" },
  ];

  const taxCountries = [
    { value: "us", label: "United States" },
    { value: "pk", label: "Pakistan" },
    { value: "uk", label: "United Kingdom" },
    { value: "ca", label: "Canada" },
    { value: "au", label: "Australia" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
  ];

  const insuranceOptions = [
    {
      id: "basic",
      title: "Basic Protection",
      description:
        "Coverage up to $1,000,000 for property damage and liability",
      price: "$15/month",
      features: [
        "Property damage protection",
        "Liability coverage",
        "24/7 support",
      ],
    },
    {
      id: "premium",
      title: "Premium Protection",
      description: "Enhanced coverage with additional benefits",
      price: "$25/month",
      features: [
        "Property damage protection",
        "Liability coverage",
        "Income protection",
        "Legal assistance",
        "24/7 priority support",
      ],
    },
    {
      id: "comprehensive",
      title: "Comprehensive Protection",
      description: "Complete coverage for maximum peace of mind",
      price: "$35/month",
      features: [
        "Property damage protection",
        "Liability coverage",
        "Income protection",
        "Legal assistance",
        "Emergency accommodation",
        "24/7 concierge support",
      ],
    },
  ];

  const contactMethods = [
    { id: "phone", label: "Phone calls", icon: "📞" },
    { id: "text", label: "Text messages", icon: "💬" },
    { id: "email", label: "Email", icon: "📧" },
    { id: "whatsapp", label: "WhatsApp", icon: "📱" },
    { id: "messenger", label: "Messenger", icon: "💭" },
  ];

  // 1. Add amenities options
  const amenitiesOptions = [
    { value: "wifi", label: "Wi-Fi" },
    { value: "parking", label: "Parking" },
    { value: "pool", label: "Pool" },
    { value: "kitchen", label: "Kitchen" },
    { value: "ac", label: "Air Conditioning" },
    { value: "tv", label: "TV" },
    { value: "laundry", label: "Laundry" },
    { value: "breakfast", label: "Breakfast" },
    { value: "pets", label: "Pets Allowed" },
    { value: "gym", label: "Gym" },
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

    if (section.id === "payouts") {
      return baseComplete && isBankSectionComplete();
    }

    if (section.id === "images") {
      return uploadedImages.length > 0; // At least one image uploaded
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

  // Autocomplete for search input
  useEffect(() => {
    if (search.length < 2) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        search
      )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&autocomplete=true&limit=5`
    )
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data.features || []);
        setIsLoading(false);
      });
  }, [search]);

  // Handle suggestion click
  const handleSuggestionClick = (feature: any) => {
    setSearch(feature.place_name);
    setFormData((prev) => ({ ...prev, tripLocation: feature.place_name }));
    setSuggestions([]);
    setShowSuggestions(false);

    // Update selected location for map
    if (feature.center) {
      setSelectedLocation({
        coords: [feature.center[0], feature.center[1]],
        name: feature.place_name,
      });
    }
  };

  // Handle map location selection
  const handleMapLocationSelect = (
    coords: [number, number],
    placeName: string
  ) => {
    setSearch(placeName);
    setFormData((prev) => ({ ...prev, tripLocation: placeName }));
    setSelectedLocation({
      coords,
      name: placeName,
    });
  };

  const [isFilters, setIsFilters] = useState<boolean>(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleContactMethodChange = (methodId: string) => {
    setFormData((prev) => ({
      ...prev,
      contactMethods: prev.contactMethods.includes(methodId)
        ? prev.contactMethods.filter((id) => id !== methodId)
        : [...prev.contactMethods, methodId],
    }));
  };

  const handleAmenitiesChange = (value: string[]) => {
    setFormData((prev) => ({ ...prev, amenities: value }));
  };
  const handleCoverImageSelect = (index: number) => {
    setCoverImageIndex(index);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newErrors: { [key: string]: string } = {};
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
    if (uploadedImages.length === 0) {
      newErrors["uploadedImages"] = "At least one image is required";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    console.log("Form submitted:", formData);
    console.log("Uploaded images:", uploadedImages);
    console.log("Uploaded videos:", uploadedVideos);
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white shadow-lg h-screen overflow-y-auto fixed">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Property Setup
            </h1>
            <div className="space-y-3">
              {sections.map((section, index) => {
                const isCompleted = getSectionStatus(section);
                return (
                  <div
                    key={section.id}
                    className="flex items-center p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                    onClick={() => scrollToSection(section.ref)}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-medium ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? "✓" : ""}
                    </div>
                    <span
                      className={`font-medium text-sm ${
                        isCompleted ? "text-green-600" : "text-gray-700"
                      }`}
                    >
                      {section.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-80 p-6">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            {/* Property Location Section */}
            <div
              ref={locationRef}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Property Location
                </h2>
              </div>
              <div className="">
                <div className="flex items-center justify-between p-3 bg-[#F8F8F8] md:px-6 relative">
                  <div className="flex items-center gap-2 w-full  relative">
                    <div className="flex items-center px-2 py-1 group gap-2 bg-white border border-[#EEEEEE] rounded-full w-full relative max-w-[160px]">
                      <Location className="flex-shrink-0 text-[#696969] group-hover:text-[#F6691D]" />
                      <input
                        type="text"
                        className="outline-none bg-transparent text-sm w-full"
                        placeholder="Search for places..."
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
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
                    <div className="flex items-center px-2 py-1 gap-2 bg-white border border-[#EEEEEE] rounded-full w-full relative max-w-[160px]">
                      <DestinationSvg className="flex-shrink-0" />
                      <input
                        type="text"
                        className="outline-none bg-transparent text-sm w-full"
                        placeholder="Search for places..."
                      />
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
                  <button
                    className="p-2 rounded-lg w-fit text-white border-none cursor-pointer hover:shadow-lg transition-shadow"
                    type="button"
                    style={{
                      background:
                        "linear-gradient(93.8deg, #F2306A 5.92%, #F35735 95.98%)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="15"
                      fill="none"
                      viewBox="0 0 13 15"
                    >
                      <path
                        fill="#fff"
                        fillRule="evenodd"
                        d="M4.727 5.934c1.399 0 2.533-1.107 2.533-2.473S6.126.99 4.727.99c-1.398 0-2.532 1.107-2.532 2.472 0 1.366 1.134 2.473 2.532 2.473m0 .989c-1.958 0-3.545-1.55-3.545-3.462C1.182 1.55 2.769 0 4.727 0s3.546 1.55 3.546 3.461c0 1.912-1.588 3.462-3.546 3.462m3.714 5.995V11.36c-.046-1.506-1.66-2.789-3.714-2.789-2.048 0-3.66 1.277-3.713 2.779v3.155H8.44zm1.014 1.587H0s0-3.152.002-3.189c.073-2.072 2.16-3.734 4.725-3.734 2.571 0 4.663 1.67 4.726 3.749zm-4.023-3.058c.096.154.3.299.479.34l1.349.317-.923 1.03a.77.77 0 0 0-.173.556L6.337 15l-1.316-.514a.88.88 0 0 0-.591.007L3.218 15l.087-1.32a.8.8 0 0 0-.196-.546l-.914-.978 1.365-.352a.87.87 0 0 0 .472-.347l.696-1.139zm1.929-3.799c.507-1.648 2.397-2.802 3.41-.956S13 5.242 13 5.242V9s-2.938 3.402-3.208 1.252c-.27-2.149-2.708-2.466-2.431-2.604"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div className="overflow-hidden h-fit ">
                  <PropertyLocationMap
                    ref={mapRef}
                    selectedLocation={selectedLocation}
                    onLocationSelect={handleMapLocationSelect}
                  />
                </div>
              </div>
            </div>

            {/* Property Overview Section */}
            <div
              ref={overviewRef}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Property Overview
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <GlobalInput
                    label="Acres*"
                    type="text"
                    placeholder=""
                    value={formData.acres || ""}
                    onChange={(e) => handleInputChange("acres", e.target.value)}
                  />
                  <GlobalInput
                    label="Property Name*"
                    type="text"
                    placeholder=""
                    value={formData.propertyName}
                    onChange={(e) =>
                      handleInputChange("propertyName", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <GlobalSelect
                    label="Property Type*"
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
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <GlobalInput
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
                <div>
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
            </div>

            {/* Property Images/Videos Section */}
            <div
              ref={imagesRef}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Property Images/Videos
                </h2>
              </div>
              <div className="p-6">
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

                    {/* Upload button for remaining slots */}
                    {uploadedImages.length < 4 && (
                      <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
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
                          <span className="text-gray-400 text-2xl mb-1">+</span>
                          <span className="text-gray-500 text-xs">
                            Upload image
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
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
                  </div>
                </div>

                {/* Upload Video Section */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Upload optimal short video
                  </label>
                  <div className="grid grid-cols-2 gap-4 max-w-md">
                    {/* Video preview or placeholder */}
                    {uploadedVideos.length > 0 ? (
                      <div className="relative">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          <video
                            src={URL.createObjectURL(uploadedVideos[0])}
                            className="w-full h-full object-cover"
                            controls
                          />
                        </div>
                        <div className="mt-2 text-xs text-gray-500 truncate">
                          {uploadedVideos[0].name}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {/* Video upload button */}
                    <div className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
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
                        <span className="text-gray-400 text-2xl mb-1">+</span>
                        <span className="text-gray-500 text-xs">
                          Upload Max
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Choose Cover Image Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Choose a cover images
                  </label>
                  <div className="max-w-xs">
                    <div className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length > 0) {
                            setCoverImageIndex(uploadedImages.length);
                            handleFileUpload(files, "image");
                          }
                        }}
                        className="hidden"
                        id="cover-upload"
                      />
                      <label
                        htmlFor="cover-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <span className="text-gray-400 text-2xl mb-1">+</span>
                        <span className="text-gray-500 text-xs">
                          Upload cover
                        </span>
                      </label>
                    </div>
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
            <div
              ref={insuranceRef}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Insurance
                </h2>
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-700 mb-6">
                  You are not currently covered under the HighTribe Insurance
                  Policy
                </div>

                {/* Enrollment period - full width */}
                <div className="mb-4">
                  <GlobalInput
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
            <div
              ref={payoutsRef}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Payouts and Taxes<span className="text-red-500">*</span>
                </h2>
              </div>
              <div className="p-6">
                {/* Payout Methods Section */}
                <div className="mb-8">
                  <div className="text-sm text-gray-700 mb-4">
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
                        <span className="text-gray-900">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Taxes Section */}
                <div className="mb-8">
                  <div className="text-sm text-gray-700 mb-4">
                    The user should be able to set up taxes (required). Display
                    the following content
                  </div>

                  {/* Tax Subject Question */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-900 mb-3">
                      Is your property subject to local stay or occupancy tax?
                    </div>
                    <div className="flex gap-8">
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
                        <span className="text-gray-900">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="isLocalTax"
                          value="no"
                          checked={formData.isLocalTax === "no"}
                          onChange={() => handleInputChange("isLocalTax", "no")}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-gray-900">No</span>
                      </label>
                    </div>
                  </div>

                  {/* Collection Method (shown when Yes is selected) */}
                  {formData.isLocalTax === "yes" && (
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-900 mb-3">
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
                              <span className="text-gray-900">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Tax Name and Rate */}
                      <div className="grid grid-cols-2 gap-4">
                        <GlobalInput
                          label="Tax Name"
                          type="text"
                          value={formData.taxName || ""}
                          onChange={(e) =>
                            handleInputChange("taxName", e.target.value)
                          }
                        />
                        <GlobalInput
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
                    className="text-sm text-gray-900 select-none cursor-pointer"
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
