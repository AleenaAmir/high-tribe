export type Extra = {
  type: string;
  name: string;
  image: File | null;
  currency: string;
  rate: string;
  rateType: string;
  approval: string;
};

export interface FormData {
  siteLocation: string;
  entranceLocation: string;
  siteManagement: string;
  access: string;
  siteArea: string;
  siteName: string;
  siteType: string;
  website: string;
  languagesSpoken: string;
  siteRules: string;
  shortDescription: string;
  safetyMeasures: string;
  contactMethods: string[];
  payoutMethod: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountHolderName: string;
  taxInfo: string;
  taxCountry: string;
  activities: string[];
  difficultyLevel: string;
  maxGroupSize: string;
  minAge: string;
  duration: string;
  equipmentProvided: string;
  seasonalAvailability: string;
  emergencyProtocol: string;
  isLocalTax: string;
  taxCollectionMethod: string;
  taxName: string;
  taxRate: string;
  taxNotes: string;
  termsAccepted: boolean;
  pricing: string;
  arrivalInstructions: string;
  checkInTime: string;
  checkOutTime: string;
  bookingAdvanceNotice: string;
  cancellationPolicy: string;
  extraServices: string[];
  parkingAvailable: string;
  petPolicy: string;
  smokingPolicy: string;
  rvType: string;
  campsiteType: string;
  sitePrivacy: string;
  houseOccupants: string[];
  siteAmenities: string[];
  siteFacilities: string[];
  safetyItems: string[];
  otherAmenities: string;
  otherFacilities: string;
  otherSafety: string;
  parkingVehicles: string;
}

export interface SelectedLocation {
  coords: [number, number] | null;
  name: string;
}

export interface Section {
  id: string;
  title: string;
  icon: string;
  ref: React.RefObject<HTMLDivElement | null>;
  requiredFields: string[];
}

export interface RVDetails {
  hookupType: string;
  antennas: string;
  maxLength: string;
  maxWidth: string;
  drivewaySurface: string;
  turningRadius: string;
}

export interface SiteFormState {
  formData: FormData;
  selectedLocation: SelectedLocation;
  uploadedImages: File[];
  uploadedVideos: File[];
  coverImage: File | null;
  bedCounts: number[];
  siteCapacity: string;
  guestMin: string;
  guestMax: string;
  rvDetails: RVDetails;
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
  errors: { [key: string]: string };
}

export interface SiteFormContextType {
  state: SiteFormState;
  updateFormData: (field: string, value: string | string[]) => void;
  updateSelectedLocation: (location: SelectedLocation) => void;
  updateUploadedImages: (images: File[]) => void;
  updateUploadedVideos: (videos: File[]) => void;
  updateCoverImage: (image: File | null) => void;
  updateBedCounts: (counts: number[]) => void;
  updateSiteCapacity: (capacity: string) => void;
  updateGuestMin: (min: string) => void;
  updateGuestMax: (max: string) => void;
  updateRvDetails: (details: RVDetails) => void;
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
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  saveSection: (sectionId: string, data: any) => Promise<void>;
  publishSite: () => Promise<void>;
} 