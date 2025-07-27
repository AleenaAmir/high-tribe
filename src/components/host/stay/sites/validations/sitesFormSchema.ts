import { z } from "zod";

// Schema for RV Details
export const rvDetailsSchema = z.object({
  hookupType: z.string().optional(),
  antennas: z.string().optional(),
  maxLength: z.string().optional(),
  maxWidth: z.string().optional(),
  drivewaySurface: z.string().optional(),
  turningRadius: z.string().optional(),
  amperes: z.string().optional(),
});

// Schema for Extra Services
export const extraServiceSchema = z.object({
  type: z.string().min(1, "Service type is required"),
  name: z.string().min(1, "Service name is required"),
  image: z.any().optional(),
  currency: z.string().min(1, "Currency is required"),
  rate: z.string().min(1, "Rate is required"),
  rateType: z.string().min(1, "Rate type is required"),
  approval: z.string().min(1, "Approval status is required"),
});

// Schema for Selected Location
export const selectedLocationSchema = z.object({
  coords: z.tuple([z.number(), z.number()]).nullable(),
  name: z.string().min(1, "Location name is required"),
});

// Main Sites Form Schema with comprehensive validation
export const sitesFormSchema = z.object({
  // Location Section
  siteLocation: z.string().min(1, "Site location is required"),
  entranceLocation: z.string().min(1, "Entrance location is required"),
  siteManagement: z.string().optional(),
  access: z.string().optional(),

  // Overview Section
  siteArea: z.string().min(1, "Site area is required"),
  siteName: z.string()
    .min(1, "Site name is required")
    .max(100, "Site name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Site name can only contain letters, numbers, spaces, hyphens, and underscores"),
  siteType: z.string().min(1, "Site type is required"),
  website: z.string()
    .url("Please enter a valid website URL")
    .optional()
    .or(z.literal("")),
  languagesSpoken: z.string().min(1, "Languages spoken is required"),
  siteRules: z.string().optional(),
  shortDescription: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  safetyMeasures: z.string().min(1, "Safety measures are required"),
  contactMethods: z.array(z.string()).optional(),
  
  // Financial Section
  payoutMethod: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  accountHolderName: z.string().optional(),
  taxInfo: z.string().optional(),
  taxCountry: z.string().optional(),
  
  // Activities Section
  activities: z.array(z.string()).min(1, "At least one activity is required"),
  difficultyLevel: z.string().optional(),
  maxGroupSize: z.string()
    .min(1, "Maximum group size is required")
    .regex(/^\d+$/, "Group size must be a number"),
  minAge: z.string()
    .regex(/^\d+$/, "Minimum age must be a number")
    .optional()
    .or(z.literal("")),
  duration: z.string().optional(),
  equipmentProvided: z.string().optional(),
  seasonalAvailability: z.string().optional(),
  emergencyProtocol: z.string().optional(),
  
  // Tax Section
  isLocalTax: z.string().optional(),
  taxCollectionMethod: z.string().optional(),
  taxName: z.string().optional(),
  taxRate: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, "Tax rate must be a valid number")
    .optional()
    .or(z.literal("")),
  taxNotes: z.string().optional(),
  
  // Pricing Section
  pricing: z.string()
    .min(1, "Pricing is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Pricing must be a valid number"),
  
  // Arrival Section
  arrivalInstructions: z.string().min(1, "Arrival instructions are required"),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  bookingAdvanceNotice: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  
  // Extras Section
  extraServices: z.array(z.string()).optional(),
  
  // Policies Section
  parkingAvailable: z.string().optional(),
  petPolicy: z.string().optional(),
  smokingPolicy: z.string().optional(),
  
  // RV/Campsite Specific
  rvType: z.string().optional(),
  campsiteType: z.string().optional(),
  sitePrivacy: z.string().optional(),
  
  // Amenities Section
  siteAmenities: z.array(z.string()).optional(),
  siteFacilities: z.array(z.string()).optional(),
  safetyItems: z.array(z.string()).optional(),
  otherAmenities: z.string().optional(),
  otherFacilities: z.string().optional(),
  otherSafety: z.string().optional(),
  parkingVehicles: z.string().optional(),
  
  // Accommodation Section
  accommodation_type: z.string().optional(),
  house_sharing: z.array(z.string()).optional(),
  
  // Terms
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  
  // RV Details
  rvDetails: rvDetailsSchema.optional(),
  
  // Additional fields for form state
  uploadedImages: z.array(z.any()).optional(),
  uploadedVideos: z.array(z.any()).optional(),
  coverImage: z.any().optional(),
  bedCounts: z.array(z.number()).optional(),
  siteCapacity: z.string().optional(),
  guestMin: z.string()
    .regex(/^\d+$/, "Minimum guests must be a number")
    .optional()
    .or(z.literal("")),
  guestMax: z.string()
    .regex(/^\d+$/, "Maximum guests must be a number")
    .optional()
    .or(z.literal("")),
  pricingType: z.string().optional(),
  allowRefunds: z.string().optional(),
  refundType: z.string().optional(),
  autoRefunds: z.string().optional(),
  selectedDays: z.array(z.string()).optional(),
  selectDaysChecked: z.boolean().optional(),
  selectedDates: z.array(z.any()).optional(),
  selectDateChecked: z.boolean().optional(),
  noticePeriod: z.string().optional(),
  advanceBookingLimit: z.string().optional(),
  bookingType: z.string().optional(),
  
  // Selected Location
  selectedLocation: selectedLocationSchema.optional(),
});

export type SitesFormData = z.infer<typeof sitesFormSchema>;

// Section-specific schemas for partial validation
export const locationSectionSchema = z.object({
  siteLocation: z.string().min(1, "Site location is required"),
  entranceLocation: z.string().min(1, "Entrance location is required"),
});

export const overviewSectionSchema = z.object({
  siteArea: z.string().min(1, "Site area is required"),
  siteName: z.string()
    .min(1, "Site name is required")
    .max(100, "Site name must be less than 100 characters"),
  siteType: z.string().min(1, "Site type is required"),
  languagesSpoken: z.string().min(1, "Languages spoken is required"),
});

export const amenitiesSectionSchema = z.object({
  activities: z.array(z.string()).min(1, "At least one activity is required"),
});

export const pricingSectionSchema = z.object({
  maxGroupSize: z.string()
    .min(1, "Maximum group size is required")
    .regex(/^\d+$/, "Group size must be a number"),
  pricing: z.string()
    .min(1, "Pricing is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Pricing must be a valid number"),
});

export const availabilitySectionSchema = z.object({
  safetyMeasures: z.string().min(1, "Safety measures are required"),
});

export const arrivalSectionSchema = z.object({
  arrivalInstructions: z.string().min(1, "Arrival instructions are required"),
});

export const reviewSectionSchema = z.object({
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

// Validation helper functions
export const validateSection = (sectionId: string, data: any) => {
  const schemas: Record<string, z.ZodSchema> = {
    location: locationSectionSchema,
    overview: overviewSectionSchema,
    amenities: amenitiesSectionSchema,
    pricing: pricingSectionSchema,
    availability: availabilitySectionSchema,
    arrival: arrivalSectionSchema,
    review: reviewSectionSchema,
  };

  const schema = schemas[sectionId];
  if (!schema) {
    return { success: true, errors: {} };
  }

  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, errors: {} };
  } else {
    const errors: Record<string, string> = {};
    result.error.errors.forEach((error) => {
      if (error.path.length > 0) {
        errors[error.path[0]] = error.message;
      }
    });
    return { success: false, errors };
  }
}; 