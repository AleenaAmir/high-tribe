"use client";
import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  SiteFormState,
  SiteFormContextType,
  FormData,
  SelectedLocation,
  RVDetails,
} from "../types/sites";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const initialState: SiteFormState = {
  formData: {
    siteLocation: "",
    entranceLocation: "",
    siteManagement: "",
    access: "",
    siteArea: "",
    siteName: "",
    siteType: "",
    website: "",
    languagesSpoken: "",
    siteRules: "",
    shortDescription: "",
    safetyMeasures: "",
    contactMethods: [],
    payoutMethod: "Credit/Debit Cards",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountHolderName: "",
    taxInfo: "",
    taxCountry: "",
    activities: [],
    difficultyLevel: "",
    maxGroupSize: "",
    minAge: "",
    duration: "",
    equipmentProvided: "",
    seasonalAvailability: "",
    emergencyProtocol: "",
    isLocalTax: "yes",
    taxCollectionMethod: "Included in activity rate",
    taxName: "",
    taxRate: "",
    taxNotes: "",
    termsAccepted: false,
    pricing: "",
    arrivalInstructions: "",
    checkInTime: "",
    checkOutTime: "",
    bookingAdvanceNotice: "",
    cancellationPolicy: "",
    extraServices: [],
    parkingAvailable: "",
    petPolicy: "",
    smokingPolicy: "",
    rvType: "",
    campsiteType: "",
    sitePrivacy: "",
    // houseOccupants: [],
    siteAmenities: [],
    siteFacilities: [],
    safetyItems: [],
    otherAmenities: "",
    otherFacilities: "",
    otherSafety: "",
    parkingVehicles: "",
    paidParkingVehicles: "",
    accommodation_type: "",
    house_sharing: [],

    // Site Pricing and Capacity properties
    siteSize: "",
    otherBedType: "",
    minStayDuration: "",
    maxStayDuration: "",
    refundDays: "",
  },
  selectedLocation: {
    coords: null,
    name: "",
  },
  uploadedImages: [],
  uploadedVideos: [],
  coverImage: null,
  bedCounts: Array(7).fill(0), // 7 bed types
  siteCapacity: "",
  guestMin: "",
  guestMax: "",
  rvDetails: {
    hookupType: "",
    antennas: "",
    maxLength: "",
    maxWidth: "",
    drivewaySurface: "",
    turningRadius: "",
    amperes: "",
  },
  pricingType: "",
  allowRefunds: "no",
  refundType: "",
  autoRefunds: "no",
  selectedDays: [],
  selectDaysChecked: false,
  selectedDates: [],
  selectDateChecked: false,
  noticePeriod: "",
  advanceBookingLimit: "",
  cancellationPolicy: "",
  bookingType: "request",
  errors: {},
};

type Action =
  | { type: "UPDATE_FORM_DATA"; field: string; value: string | string[] }
  | { type: "UPDATE_SELECTED_LOCATION"; location: SelectedLocation }
  | { type: "UPDATE_UPLOADED_IMAGES"; images: File[] }
  | { type: "UPDATE_UPLOADED_VIDEOS"; videos: File[] }
  | { type: "UPDATE_COVER_IMAGE"; image: File | null }
  | { type: "UPDATE_BED_COUNTS"; counts: number[] }
  | { type: "UPDATE_SITE_CAPACITY"; capacity: string }
  | { type: "UPDATE_GUEST_MIN"; min: string }
  | { type: "UPDATE_GUEST_MAX"; max: string }
  | { type: "UPDATE_RV_DETAILS"; details: RVDetails }
  | { type: "UPDATE_PRICING_TYPE"; pricingType: string }
  | { type: "UPDATE_ALLOW_REFUNDS"; allow: string }
  | { type: "UPDATE_REFUND_TYPE"; refundType: string }
  | { type: "UPDATE_AUTO_REFUNDS"; auto: string }
  | { type: "UPDATE_SELECTED_DAYS"; days: string[] }
  | { type: "UPDATE_SELECT_DAYS_CHECKED"; checked: boolean }
  | { type: "UPDATE_SELECTED_DATES"; dates: Date[] }
  | { type: "UPDATE_SELECT_DATE_CHECKED"; checked: boolean }
  | { type: "UPDATE_NOTICE_PERIOD"; period: string }
  | { type: "UPDATE_ADVANCE_BOOKING_LIMIT"; limit: string }
  | { type: "UPDATE_CANCELLATION_POLICY"; policy: string }
  | { type: "UPDATE_BOOKING_TYPE"; bookingType: string }
  | { type: "SET_ERROR"; field: string; error: string }
  | { type: "CLEAR_ERROR"; field: string };

function sitesFormReducer(state: SiteFormState, action: Action): SiteFormState {
  switch (action.type) {
    case "UPDATE_FORM_DATA":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        },
      };
    case "UPDATE_SELECTED_LOCATION":
      return {
        ...state,
        selectedLocation: action.location,
      };
    case "UPDATE_UPLOADED_IMAGES":
      return {
        ...state,
        uploadedImages: action.images,
      };
    case "UPDATE_UPLOADED_VIDEOS":
      return {
        ...state,
        uploadedVideos: action.videos,
      };
    case "UPDATE_COVER_IMAGE":
      return {
        ...state,
        coverImage: action.image,
      };
    case "UPDATE_BED_COUNTS":
      return {
        ...state,
        bedCounts: action.counts,
      };
    case "UPDATE_SITE_CAPACITY":
      return {
        ...state,
        siteCapacity: action.capacity,
      };
    case "UPDATE_GUEST_MIN":
      return {
        ...state,
        guestMin: action.min,
      };
    case "UPDATE_GUEST_MAX":
      return {
        ...state,
        guestMax: action.max,
      };
    case "UPDATE_RV_DETAILS":
      return {
        ...state,
        rvDetails: action.details,
      };
    case "UPDATE_PRICING_TYPE":
      return {
        ...state,
        pricingType: action.pricingType,
      };
    case "UPDATE_ALLOW_REFUNDS":
      return {
        ...state,
        allowRefunds: action.allow,
      };
    case "UPDATE_REFUND_TYPE":
      return {
        ...state,
        refundType: action.refundType,
      };
    case "UPDATE_AUTO_REFUNDS":
      return {
        ...state,
        autoRefunds: action.auto,
      };
    case "UPDATE_SELECTED_DAYS":
      return {
        ...state,
        selectedDays: action.days,
      };
    case "UPDATE_SELECT_DAYS_CHECKED":
      return {
        ...state,
        selectDaysChecked: action.checked,
      };
    case "UPDATE_SELECTED_DATES":
      return {
        ...state,
        selectedDates: action.dates,
      };
    case "UPDATE_SELECT_DATE_CHECKED":
      return {
        ...state,
        selectDateChecked: action.checked,
      };
    case "UPDATE_NOTICE_PERIOD":
      return {
        ...state,
        noticePeriod: action.period,
      };
    case "UPDATE_ADVANCE_BOOKING_LIMIT":
      return {
        ...state,
        advanceBookingLimit: action.limit,
      };
    case "UPDATE_CANCELLATION_POLICY":
      return {
        ...state,
        cancellationPolicy: action.policy,
      };
    case "UPDATE_BOOKING_TYPE":
      return {
        ...state,
        bookingType: action.bookingType,
      };
    case "SET_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error,
        },
      };
    case "CLEAR_ERROR":
      const newErrors = { ...state.errors };
      delete newErrors[action.field];
      return {
        ...state,
        errors: newErrors,
      };
    default:
      return state;
  }
}

const SitesFormContext = createContext<SiteFormContextType | undefined>(
  undefined
);

export const useSitesForm = () => {
  const context = useContext(SitesFormContext);
  if (context === undefined) {
    throw new Error("useSitesForm must be used within a SitesFormProvider");
  }
  return context;
};

interface SitesFormProviderProps {
  children: ReactNode;
}

export const SitesFormProvider: React.FC<SitesFormProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(sitesFormReducer, initialState);

  const updateFormData = (field: string, value: string | string[]) => {
    dispatch({ type: "UPDATE_FORM_DATA", field, value });
  };

  const updateSelectedLocation = (location: SelectedLocation) => {
    dispatch({ type: "UPDATE_SELECTED_LOCATION", location });
  };

  const updateUploadedImages = (images: File[]) => {
    dispatch({ type: "UPDATE_UPLOADED_IMAGES", images });
  };

  const updateUploadedVideos = (videos: File[]) => {
    dispatch({ type: "UPDATE_UPLOADED_VIDEOS", videos });
  };

  const updateCoverImage = (image: File | null) => {
    dispatch({ type: "UPDATE_COVER_IMAGE", image });
  };

  const updateBedCounts = (counts: number[]) => {
    dispatch({ type: "UPDATE_BED_COUNTS", counts });
  };

  const updateSiteCapacity = (capacity: string) => {
    dispatch({ type: "UPDATE_SITE_CAPACITY", capacity });
  };

  const updateGuestMin = (min: string) => {
    dispatch({ type: "UPDATE_GUEST_MIN", min });
  };

  const updateGuestMax = (max: string) => {
    dispatch({ type: "UPDATE_GUEST_MAX", max });
  };

  const updateRvDetails = (details: RVDetails) => {
    dispatch({ type: "UPDATE_RV_DETAILS", details });
  };

  const updatePricingType = (type: string) => {
    dispatch({ type: "UPDATE_PRICING_TYPE", pricingType: type });
  };

  const updateAllowRefunds = (allow: string) => {
    dispatch({ type: "UPDATE_ALLOW_REFUNDS", allow });
  };

  const updateRefundType = (type: string) => {
    dispatch({ type: "UPDATE_REFUND_TYPE", refundType: type });
  };

  const updateAutoRefunds = (auto: string) => {
    dispatch({ type: "UPDATE_AUTO_REFUNDS", auto });
  };

  const updateSelectedDays = (days: string[]) => {
    dispatch({ type: "UPDATE_SELECTED_DAYS", days });
  };

  const updateSelectDaysChecked = (checked: boolean) => {
    dispatch({ type: "UPDATE_SELECT_DAYS_CHECKED", checked });
  };

  const updateSelectedDates = (dates: Date[]) => {
    dispatch({ type: "UPDATE_SELECTED_DATES", dates });
  };

  const updateSelectDateChecked = (checked: boolean) => {
    dispatch({ type: "UPDATE_SELECT_DATE_CHECKED", checked });
  };

  const updateNoticePeriod = (period: string) => {
    dispatch({ type: "UPDATE_NOTICE_PERIOD", period });
  };

  const updateAdvanceBookingLimit = (limit: string) => {
    dispatch({ type: "UPDATE_ADVANCE_BOOKING_LIMIT", limit });
  };

  const updateCancellationPolicy = (policy: string) => {
    dispatch({ type: "UPDATE_CANCELLATION_POLICY", policy });
  };

  const updateBookingType = (type: string) => {
    dispatch({ type: "UPDATE_BOOKING_TYPE", bookingType: type });
  };

  const setError = (field: string, error: string) => {
    dispatch({ type: "SET_ERROR", field, error });
  };

  const clearError = (field: string) => {
    dispatch({ type: "CLEAR_ERROR", field });
  };

  const saveSection = async (sectionId: string, data: any) => {
    try {
      // Here you would make API calls to save section data
      console.log(`Saving section ${sectionId}:`, data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, just show success message
      // alert(`${sectionId} data saved successfully!`);
    } catch (error) {
      console.error(`Error saving ${sectionId}:`, error);
      alert(`Error saving ${sectionId} data`);
    }
  };

  const publishSite = async () => {
    try {
      // Validate required fields
      const requiredFields = [
        "entranceLocation",
        "siteArea",
        "siteName",
        "siteType",
        "languagesSpoken",
        "activities",
        "maxGroupSize",
        "pricing",
        "safetyMeasures",
        "arrivalInstructions",
        "termsAccepted",
      ];

      const missingFields = requiredFields.filter((field) => {
        const value = state.formData[field as keyof FormData];
        if (Array.isArray(value)) {
          return value.length === 0;
        }
        return !value || value.toString().trim() === "";
      });

      if (missingFields.length > 0) {
        alert(
          `Please complete the following required fields: ${missingFields.join(
            ", "
          )}`
        );
        return;
      }

      // Here you would make API call to publish the site
      console.log("Publishing site with data:", state);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Site published successfully! Your site is now live.");
    } catch (error) {
      console.error("Error publishing site:", error);
      alert("Error publishing site");
    }
  };

  const value: SiteFormContextType = {
    state,
    updateFormData,
    updateSelectedLocation,
    updateUploadedImages,
    updateUploadedVideos,
    updateCoverImage,
    updateBedCounts,
    updateSiteCapacity,
    updateGuestMin,
    updateGuestMax,
    updateRvDetails,
    updatePricingType,
    updateAllowRefunds,
    updateRefundType,
    updateAutoRefunds,
    updateSelectedDays,
    updateSelectDaysChecked,
    updateSelectedDates,
    updateSelectDateChecked,
    updateNoticePeriod,
    updateAdvanceBookingLimit,
    updateCancellationPolicy,
    updateBookingType,
    setError,
    clearError,
    saveSection,
    publishSite,
  };

  return (
    <SitesFormContext.Provider value={value}>
      {children}
    </SitesFormContext.Provider>
  );
};
