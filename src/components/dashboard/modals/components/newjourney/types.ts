export type LatLng = [number, number];

export interface LocationData {
  coords: LatLng | null;
  name: string;
}

export interface Step {
  name: string; // Step name/title (separate from location name)
  location: LocationData;
  notes: string;
  media: File[];
  mediumOfTravel: string;
  startDate: string;
  endDate: string;
  category?: string;
  dateError?: string;
}

export interface NewJourneyForm {
  title: string;
  startLocation: string;
  endLocation: string;
  startDate: string;
  endDate: string;
  description: string;
  steps: Step[];
  summary: string;
  summaryMedia: File[];
  friends: { id: number; name: string; email?: string; avatar?: string }[];
  tags: string[];
}

export interface TravelMedium {
  name: string;
  icon: React.ReactNode;
}

export interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number];
}

export interface StopCategory {
  id: number;
  name: string;
  label?: string;
}

export interface User {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
}

export type VisibilityType = "public" | "tribe" | "private";

export interface ValidationErrors {
  [key: string]: string;
}

export interface StepErrors {
  [key: number]: { [field: string]: string };
}

export interface LocationInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (feature: MapboxFeature) => void;
  suggestions: MapboxFeature[];
  showDropdown?: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  startDateError?: string;
  endDateError?: string;
  startLabel?: string;
  endLabel?: string;
}

export interface TravelModeSelectorProps {
  selectedMode: string;
  onModeSelect: (mode: string) => void;
  modes?: TravelMedium[];
  error?: string;
}

export interface VisibilitySelectorProps {
  value: VisibilityType;
  onChange: (visibility: VisibilityType) => void;
  options?: VisibilityType[];
}

// Existing Journey Types
export interface ExistingJourney {
  id: string;
  title: string;
  description: string;
  startLocation: LocationData;
  endLocation: LocationData;
  startDate: string;
  endDate: string;
  steps: Step[];
  visibility: VisibilityType;
  createdAt: string;
  updatedAt: string;
  userId: string;
  friends: User[];
  tags: string[];
  totalDistance?: number;
  totalDuration?: string;
  status: "draft" | "pending" | "published" | "archived";
  userData?: User;
}

export interface ExistingJourneyUpdate {
  journeyId: string;
  newSteps: Step[];
  updatedFields?: Partial<Pick<ExistingJourney, 'title' | 'description' | 'endDate' | 'visibility' | 'status'>> & {
    taggedFriends?: User[];
  };
}

export interface ExistingJourneyListItem {
  id: string;
  title: string;
  startLocation: string;
  endLocation: string;
  startDate: string;
  endDate: string;
  status: "draft" | "pending" | "published" | "archived";
  totalSteps: number;
  thumbnail?: string;
} 