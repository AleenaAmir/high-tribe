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
  accommodation_type: string;
  house_sharing: string[];
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
  amperes: string;
} 