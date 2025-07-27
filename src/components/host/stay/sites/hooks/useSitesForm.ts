import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sitesFormSchema, SitesFormData, validateSection } from "../validations/sitesFormSchema";
import { useState, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";

// Environment variable validation
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
if (!MAPBOX_ACCESS_TOKEN) {
  console.warn("MAPBOX_ACCESS_TOKEN is not defined. Map functionality may not work.");
}

interface UseSitesFormReturn extends UseFormReturn<SitesFormData> {
  // File upload states
  uploadedImages: File[];
  uploadedVideos: File[];
  coverImage: File | null;
  
  // File upload handlers
  updateUploadedImages: (images: File[]) => void;
  updateUploadedVideos: (videos: File[]) => void;
  updateCoverImage: (image: File | null) => void;
  
  // Additional form states
  bedCounts: number[];
  siteCapacity: string;
  guestMin: string;
  guestMax: string;
  pricingType: string;
  allowRefunds: string;
  refundType: string;
  autoRefunds: string;
  selectedDays: string[];
  selectDaysChecked: boolean;
  selectedDates: Date[];
  selectDateChecked: boolean;
  noticePeriod: string;
  advanceBookingLimit: string;
  cancellationPolicy: string;
  bookingType: string;
  
  // Section completion tracking
  completedSections: Set<string>;
  
  // Additional form handlers
  updateBedCounts: (counts: number[]) => void;
  updateSiteCapacity: (capacity: string) => void;
  updateGuestMin: (min: string) => void;
  updateGuestMax: (max: string) => void;
  updatePricingType: (type: string) => void;
  updateAllowRefunds: (allow: string) => void;
  updateRefundType: (type: string) => void;
  updateAutoRefunds: (auto: string) => void;
  updateSelectedDays: (days: string[]) => void;
  updateSelectDaysChecked: (checked: boolean) => void;
  updateSelectedDates: (dates: Date[]) => void;
  updateSelectDateChecked: (checked: boolean) => void;
  updateNoticePeriod: (period: string) => void;
  updateAdvanceBookingLimit: (limit: string) => void;
  updateCancellationPolicy: (policy: string) => void;
  updateBookingType: (type: string) => void;
  
  // Section validation
  validateSectionFields: (sectionId: string) => Promise<boolean>;
  
  // API handlers
  saveSection: (sectionId: string) => Promise<void>;
  publishSite: () => Promise<void>;
  saveAsDraft: () => Promise<void>;
  
  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  isPublishing: boolean;
}

const BED_TYPES_COUNT = 7; // Define bed types constant

const initialFormData: SitesFormData = {
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
  siteAmenities: [],
  siteFacilities: [],
  safetyItems: [],
  otherAmenities: "",
  otherFacilities: "",
  otherSafety: "",
  parkingVehicles: "",
  accommodation_type: "",
  house_sharing: [],
  selectedLocation: {
    coords: null,
    name: "",
  },
  uploadedImages: [],
  uploadedVideos: [],
  coverImage: null,
  bedCounts: Array(BED_TYPES_COUNT).fill(0),
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
  bookingType: "request",
};

export const useSitesForm = (): UseSitesFormReturn => {
  const searchParams = useSearchParams();
  const propertyId = searchParams?.get("propertyId");
  const siteId = searchParams?.get("siteId");

  const form = useForm<SitesFormData>({
    resolver: zodResolver(sitesFormSchema),
    defaultValues: initialFormData,
    mode: "onChange", // Enable real-time validation
  });

  // File upload states
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // Additional form states
  const [bedCounts, setBedCounts] = useState<number[]>(Array(BED_TYPES_COUNT).fill(0));
  const [siteCapacity, setSiteCapacity] = useState("");
  const [guestMin, setGuestMin] = useState("");
  const [guestMax, setGuestMax] = useState("");
  const [pricingType, setPricingType] = useState("");
  const [allowRefunds, setAllowRefunds] = useState("no");
  const [refundType, setRefundType] = useState("");
  const [autoRefunds, setAutoRefunds] = useState("no");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectDaysChecked, setSelectDaysChecked] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectDateChecked, setSelectDateChecked] = useState(false);
  const [noticePeriod, setNoticePeriod] = useState("");
  const [advanceBookingLimit, setAdvanceBookingLimit] = useState("");
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [bookingType, setBookingType] = useState("request");

  // Section completion tracking
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Load existing data if editing
  useEffect(() => {
    if (siteId) {
      setIsLoading(true);
      // TODO: Load existing site data
      // fetchSiteData(siteId).then(data => {
      //   form.reset(data);
      //   setIsLoading(false);
      // }).catch(error => {
      //   toast.error("Failed to load site data");
      //   setIsLoading(false);
      // });
      setIsLoading(false);
    }
  }, [siteId, form]);

  // File upload handlers
  const updateUploadedImages = useCallback((images: File[]) => {
    setUploadedImages(images);
    form.setValue("uploadedImages", images);
  }, [form]);

  const updateUploadedVideos = useCallback((videos: File[]) => {
    setUploadedVideos(videos);
    form.setValue("uploadedVideos", videos);
  }, [form]);

  const updateCoverImage = useCallback((image: File | null) => {
    setCoverImage(image);
    form.setValue("coverImage", image);
  }, [form]);

  // Additional form handlers
  const updateBedCounts = useCallback((counts: number[]) => {
    setBedCounts(counts);
    form.setValue("bedCounts", counts);
  }, [form]);

  const updateSiteCapacity = useCallback((capacity: string) => {
    setSiteCapacity(capacity);
    form.setValue("siteCapacity", capacity);
  }, [form]);

  const updateGuestMin = useCallback((min: string) => {
    setGuestMin(min);
    form.setValue("guestMin", min);
  }, [form]);

  const updateGuestMax = useCallback((max: string) => {
    setGuestMax(max);
    form.setValue("guestMax", max);
  }, [form]);

  const updatePricingType = useCallback((type: string) => {
    setPricingType(type);
    form.setValue("pricingType", type);
  }, [form]);

  const updateAllowRefunds = useCallback((allow: string) => {
    setAllowRefunds(allow);
    form.setValue("allowRefunds", allow);
  }, [form]);

  const updateRefundType = useCallback((type: string) => {
    setRefundType(type);
    form.setValue("refundType", type);
  }, [form]);

  const updateAutoRefunds = useCallback((auto: string) => {
    setAutoRefunds(auto);
    form.setValue("autoRefunds", auto);
  }, [form]);

  const updateSelectedDays = useCallback((days: string[]) => {
    setSelectedDays(days);
    form.setValue("selectedDays", days);
  }, [form]);

  const updateSelectDaysChecked = useCallback((checked: boolean) => {
    setSelectDaysChecked(checked);
    form.setValue("selectDaysChecked", checked);
  }, [form]);

  const updateSelectedDates = useCallback((dates: Date[]) => {
    setSelectedDates(dates);
    form.setValue("selectedDates", dates);
  }, [form]);

  const updateSelectDateChecked = useCallback((checked: boolean) => {
    setSelectDateChecked(checked);
    form.setValue("selectDateChecked", checked);
  }, [form]);

  const updateNoticePeriod = useCallback((period: string) => {
    setNoticePeriod(period);
    form.setValue("noticePeriod", period);
  }, [form]);

  const updateAdvanceBookingLimit = useCallback((limit: string) => {
    setAdvanceBookingLimit(limit);
    form.setValue("advanceBookingLimit", limit);
  }, [form]);

  const updateCancellationPolicy = useCallback((policy: string) => {
    setCancellationPolicy(policy);
    form.setValue("cancellationPolicy", policy);
  }, [form]);

  const updateBookingType = useCallback((type: string) => {
    setBookingType(type);
    form.setValue("bookingType", type);
  }, [form]);

  // Section validation
  const validateSectionFields = useCallback(async (sectionId: string): Promise<boolean> => {
    try {
      const formData = form.getValues();
      const result = validateSection(sectionId, formData);
      
      if (!result.success) {
        // Set errors in the form
        Object.entries(result.errors).forEach(([field, error]) => {
          form.setError(field as keyof SitesFormData, {
            type: "manual",
            message: error,
          });
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("Validation failed");
      return false;
    }
  }, [form]);

  // API handlers with proper error handling
  const saveSection = useCallback(async (sectionId: string) => {
    try {
      setIsSaving(true);
      
      const isValid = await validateSectionFields(sectionId);
      if (!isValid) {
        toast.error("Please fix the validation errors before saving");
        return;
      }

      const formData = form.getValues();
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

      const response = await fetch(`/api/sites/section/${sectionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          ...formData,
          propertyId,
          siteId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to save ${sectionId} section`);
      }

      // Mark section as completed
      setCompletedSections(prev => new Set([...prev, sectionId]));
      toast.success(`${sectionId} section saved successfully`);
      
    } catch (error) {
      console.error("Error saving section:", error);
      const message = error instanceof Error ? error.message : "An error occurred while saving";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }, [form, validateSectionFields, propertyId, siteId]);

  const publishSite = useCallback(async () => {
    try {
      setIsPublishing(true);
      
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error("Please fix all validation errors before publishing");
        return;
      }

      const formData = form.getValues();
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

      const response = await fetch("/api/sites/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          ...formData,
          propertyId,
          siteId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to publish site");
      }

      toast.success("Site published successfully!");
      
    } catch (error) {
      console.error("Error publishing site:", error);
      const message = error instanceof Error ? error.message : "An error occurred while publishing";
      toast.error(message);
    } finally {
      setIsPublishing(false);
    }
  }, [form, propertyId, siteId]);

  const saveAsDraft = useCallback(async () => {
    try {
      setIsSaving(true);
      
      const formData = form.getValues();
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

      const response = await fetch("/api/sites/draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          ...formData,
          propertyId,
          siteId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save as draft");
      }

      toast.success("Site saved as draft");
      
    } catch (error) {
      console.error("Error saving draft:", error);
      const message = error instanceof Error ? error.message : "An error occurred while saving draft";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }, [form, propertyId, siteId]);

  return {
    ...form,
    uploadedImages,
    uploadedVideos,
    coverImage,
    updateUploadedImages,
    updateUploadedVideos,
    updateCoverImage,
    bedCounts,
    siteCapacity,
    guestMin,
    guestMax,
    pricingType,
    allowRefunds,
    refundType,
    autoRefunds,
    selectedDays,
    selectDaysChecked,
    selectedDates,
    selectDateChecked,
    noticePeriod,
    advanceBookingLimit,
    cancellationPolicy,
    bookingType,
    completedSections,
    updateBedCounts,
    updateSiteCapacity,
    updateGuestMin,
    updateGuestMax,
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
    validateSectionFields,
    saveSection,
    publishSite,
    saveAsDraft,
    isLoading,
    isSaving,
    isPublishing,
  };
}; 