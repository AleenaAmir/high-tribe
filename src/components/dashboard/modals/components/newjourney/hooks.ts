import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { apiRequest } from "@/lib/api";
import { 
  NewJourneyForm, 
  Step, 
  LocationData, 
  LatLng, 
  MapboxFeature, 
  StopCategory, 
  User, 
  VisibilityType,
  ValidationErrors,
  StepErrors 
} from './types';
import { DEFAULT_FORM_VALUES, MAPBOX_GEOCODE_URL } from './constants';

// Debounce utility
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Geocoding utilities
export async function geocodeLocation(query: string): Promise<LatLng | null> {
  if (!query) return null;
  const url = `${MAPBOX_GEOCODE_URL}${encodeURIComponent(
    query
  )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.features && data.features.length > 0) {
    const [lng, lat] = data.features[0].center;
    return [lng, lat];
  }
  return null;
}

export async function reverseGeocode(lng: number, lat: number): Promise<string> {
  const url = `${MAPBOX_GEOCODE_URL}${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.features && data.features.length > 0) {
    return data.features[0].place_name;
  }
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

// Location autocomplete hook
export function useLocationAutocomplete() {
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const url = `${MAPBOX_GEOCODE_URL}${encodeURIComponent(
          query
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
        const response = await fetch(url);
        const data = await response.json();
        setSuggestions(data.features || []);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  return { suggestions, loading, fetchSuggestions, setSuggestions };
}

// Validation hook
export function useJourneyValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [stepErrors, setStepErrors] = useState<StepErrors>({});

  const validateTitle = useCallback((title: string) => {
    if (!title || title.trim() === "") {
      return "Title is required";
    }
    if (title.length > 100) {
      return "Title must not exceed 100 characters";
    }
    if (!/^[a-zA-Z0-9\s]+$/.test(title)) {
      return "Title can only contain letters, numbers, and spaces";
    }
    return "";
  }, []);

  const validateDescription = useCallback((description: string) => {
    if (description && description.length > 500) {
      return "Description must not exceed 500 characters";
    }
    return "";
  }, []);

  const validateLocation = useCallback((location: LocationData, fieldName: string) => {
    if (!location.coords || !location.name.trim()) {
      return `${fieldName} is required`;
    }
    if (location.coords[1] < -90 || location.coords[1] > 90) {
      return `Invalid latitude for ${fieldName.toLowerCase()}`;
    }
    if (location.coords[0] < -180 || location.coords[0] > 180) {
      return `Invalid longitude for ${fieldName.toLowerCase()}`;
    }
    return "";
  }, []);

  const validateDates = useCallback((startDate: string, endDate: string) => {
    const errors: { startDate?: string; endDate?: string } = {};
    
    if (!startDate) {
      errors.startDate = "Start date is required";
    }
    if (!endDate) {
      errors.endDate = "End date is required";
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        errors.endDate = "End date cannot be before start date";
      }
    }
    return errors;
  }, []);

  const validateStep = useCallback((step: Step, index: number, stopCategories: StopCategory[]) => {
    const stepError: ValidationErrors = {};

    // Name validation
    if (!step.name || step.name.trim() === "") {
      stepError.name = "Step name is required";
    } else if (step.name.length > 100) {
      stepError.name = "Step name must not exceed 100 characters";
    }

    // Location validation
    const locationError = validateLocation(step.location, "Location");
    if (locationError) stepError.location = locationError;

    // Travel mode validation
    if (!step.mediumOfTravel || step.mediumOfTravel.trim() === "") {
      stepError.travelMode = "Travel medium is required";
    }

    // Date validation
    const dateErrors = validateDates(step.startDate, step.endDate);
    if (dateErrors.startDate) stepError.startDate = dateErrors.startDate;
    if (dateErrors.endDate) stepError.endDate = dateErrors.endDate;

    // Notes validation
    if (step.notes && step.notes.length > 500) {
      stepError.notes = "Notes must not exceed 500 characters";
    }

    // Category validation
    if (step.category && !stopCategories.find(cat => cat.id.toString() === step.category)) {
      stepError.category = "Invalid stop category";
    }

    return stepError;
  }, [validateLocation, validateDates]);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const setStepFieldError = useCallback((stepIndex: number, field: string, error: string) => {
    setStepErrors(prev => ({
      ...prev,
      [stepIndex]: {
        ...prev[stepIndex],
        [field]: error
      }
    }));
  }, []);

  const clearStepFieldError = useCallback((stepIndex: number, field: string) => {
    setStepErrors(prev => {
      const newStepErrors = { ...prev };
      if (newStepErrors[stepIndex]) {
        delete newStepErrors[stepIndex][field];
        if (Object.keys(newStepErrors[stepIndex]).length === 0) {
          delete newStepErrors[stepIndex];
        }
      }
      return newStepErrors;
    });
  }, []);

  return {
    errors,
    stepErrors,
    validateTitle,
    validateDescription,
    validateLocation,
    validateDates,
    validateStep,
    setFieldError,
    clearFieldError,
    setStepFieldError,
    clearStepFieldError,
    setErrors,
    setStepErrors,
  };
}

// Main journey form hook
export function useJourneyForm() {
  const form = useForm<NewJourneyForm>({ defaultValues: DEFAULT_FORM_VALUES });
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "steps",
  });

  // State management
  const [startLocation, setStartLocation] = useState<LocationData>({ coords: null, name: "" });
  const [endLocation, setEndLocation] = useState<LocationData>({ coords: null, name: "" });
  const [steps, setSteps] = useState<Step[]>([
    {
      name: "Stop 1",
      location: { coords: null, name: "" },
      notes: "",
      media: [],
      mediumOfTravel: "",
      startDate: "",
      endDate: "",
      category: "",
      dateError: "",
    },
  ]);
  const [visibility, setVisibility] = useState<VisibilityType>("public");
  const [stopCategories, setStopCategories] = useState<StopCategory[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const validation = useJourneyValidation();

  // Map reference
  const mapRef = useRef<any>(null);

  // Helper functions
  const canAddStep = startLocation.coords && startLocation.name.trim() && 
                    endLocation.coords && endLocation.name.trim();

  const flyToOnMap = useCallback((lng: number, lat: number) => {
    if (mapRef.current && mapRef.current.flyTo) {
      mapRef.current.flyTo({ center: [lng, lat], zoom: 2 });
    }
  }, []);

  // Step suggestions filtered between start and end
  const fetchStepSuggestions = useCallback(async (query: string): Promise<MapboxFeature[]> => {
    if (!startLocation.coords || !endLocation.coords) return [];
    
    // Calculate bounding box with some padding for better coverage
    const [x1, y1] = startLocation.coords!;
    const [x2, y2] = endLocation.coords!;
    const padding = 0.5; // degrees padding
    const minX = Math.min(x1, x2) - padding;
    const maxX = Math.max(x1, x2) + padding;
    const minY = Math.min(y1, y2) - padding;
    const maxY = Math.max(y1, y2) + padding;
    
    let url: string;
    
    if (!query || query.trim() === "") {
      // When no query, fetch popular places in the area using bbox
      url = `${MAPBOX_GEOCODE_URL}places.json?bbox=${minX},${minY},${maxX},${maxY}&types=poi,address&limit=10&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
    } else {
      // When there's a query, search with proximity to route center
      const centerLng = (x1 + x2) / 2;
      const centerLat = (y1 + y2) / 2;
      url = `${MAPBOX_GEOCODE_URL}${encodeURIComponent(
        query
      )}.json?proximity=${centerLng},${centerLat}&bbox=${minX},${minY},${maxX},${maxY}&limit=10&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
    }
    
    try {
      const res = await fetch(url);
      const data = await res.json();
      
      return (data.features || []).filter((f: any) => {
        const [lng, lat] = f.center;
        // Additional filtering to ensure results are actually between start and end
        return lng >= Math.min(x1, x2) && lng <= Math.max(x1, x2) && 
               lat >= Math.min(y1, y2) && lat <= Math.max(y1, y2);
      });
    } catch (error) {
      console.error('Error fetching step suggestions:', error);
      return [];
    }
  }, [startLocation.coords, endLocation.coords]);

  // Data fetching
  useEffect(() => {
    setLoadingCategories(true);
    setLoadingUsers(true);
    
    const fetchData = async () => {
      try {
        console.log('Fetching categories and users...');
        
        // Try different possible endpoints for categories
        const categoriesPromise = Promise.race([
          // Try the current endpoint
          apiRequest<any>("posts/stops/categories", { method: "get" }).catch(err => {
            console.log('First endpoint failed:', err.message);
            // Try alternative endpoints
            return apiRequest<any>("journeys/stops/categories", { method: "get" });
          }).catch(err => {
            console.log('Second endpoint failed:', err.message);
            return apiRequest<any>("stops/categories", { method: "get" });
          }).catch(err => {
            console.log('Third endpoint failed:', err.message);
            return apiRequest<any>("categories", { method: "get" });
          })
        ]);
        
        const usersPromise = apiRequest<any>("users", { method: "get" });
        
        const [categoriesData, usersData] = await Promise.all([categoriesPromise, usersPromise]);
        
        console.log('Categories data received:', categoriesData);
        console.log('Users data received:', usersData);
        
        // Handle different possible data structures for categories
        let categories = [];
        if (Array.isArray(categoriesData)) {
          categories = categoriesData;
        } else if (categoriesData?.categories && Array.isArray(categoriesData.categories)) {
          categories = categoriesData.categories;
        } else if (categoriesData?.data && Array.isArray(categoriesData.data)) {
          categories = categoriesData.data;
        } else if (categoriesData?.items && Array.isArray(categoriesData.items)) {
          categories = categoriesData.items;
        }
        
        console.log('Processed categories:', categories);
        
        // Handle different possible data structures for users
        let users = [];
        if (Array.isArray(usersData)) {
          users = usersData;
        } else if (usersData?.users && Array.isArray(usersData.users)) {
          users = usersData.users;
        } else if (usersData?.data && Array.isArray(usersData.data)) {
          users = usersData.data;
        }
        
        setStopCategories(categories);
        setUsers(users);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        
        // Set some default categories for testing
        const defaultCategories = [
          { id: 1, name: "Restaurant", label: "Restaurant" },
          { id: 2, name: "Hotel", label: "Hotel" },
          { id: 3, name: "Tourist Attraction", label: "Tourist Attraction" },
          { id: 4, name: "Shopping", label: "Shopping" },
          { id: 5, name: "Entertainment", label: "Entertainment" },
          { id: 6, name: "Transportation", label: "Transportation" },
          { id: 7, name: "Other", label: "Other" }
        ];
        
        console.log('Using default categories:', defaultCategories);
        setStopCategories(defaultCategories);
        setUsers([]);
      } finally {
        setLoadingCategories(false);
        setLoadingUsers(false);
      }
    };
    
    fetchData();
  }, []);

  // User search
  const searchUsers = useCallback((query: string) => {
    if (!query.trim()) return [];
    
    return users.filter(user =>
      user.name?.toLowerCase().includes(query.toLowerCase()) ||
      user.email?.toLowerCase().includes(query.toLowerCase())
    );
  }, [users]);

  // Form submission
  const submitJourney = useCallback(async (data: NewJourneyForm) => {
    setIsSubmitting(true);
    
    try {
      // Validation
      const titleError = validation.validateTitle(data.title);
      const descriptionError = validation.validateDescription(data.description);
      const startLocationError = validation.validateLocation(startLocation, "Start location");
      const endLocationError = validation.validateLocation(endLocation, "End location");
      const dateErrors = validation.validateDates(data.startDate, data.endDate);

      // Step validation
      const stepValidationErrors: StepErrors = {};
      steps.forEach((step, index) => {
        const stepError = validation.validateStep(step, index, stopCategories);
        if (Object.keys(stepError).length > 0) {
          stepValidationErrors[index] = stepError;
        }
      });

      // Check for errors
      const hasErrors = titleError || descriptionError || startLocationError || 
                       endLocationError || dateErrors.startDate || dateErrors.endDate ||
                       Object.keys(stepValidationErrors).length > 0;

      if (hasErrors) {
        validation.setErrors({
          title: titleError,
          description: descriptionError,
          startLocation: startLocationError,
          endLocation: endLocationError,
          startDate: dateErrors.startDate || "",
          endDate: dateErrors.endDate || "",
        });
        validation.setStepErrors(stepValidationErrors);
        return false;
      }

      // Transform data for API
      const stops = steps.map((step) => {
        const modeMapping: { [key: string]: string } = {
          plane: "airplane",
          train: "train",
          car: "car",
          bus: "bus",
          walk: "foot",
          bike: "bike",
          info: "other",
        };
        const transportMode = modeMapping[step.mediumOfTravel] || step.mediumOfTravel;

        return {
          title: step.location.name || "Untitled Stop",
          stop_category_id: step.category ? parseInt(step.category) : null,
          location: {
            name: step.location.name,
            lat: step.location.coords ? step.location.coords[1] : null,
            lng: step.location.coords ? step.location.coords[0] : null,
          },
          transport_mode: transportMode,
          transport_mode_other: step.mediumOfTravel === "info" ? step.notes : null,
          start_date: step.startDate,
          end_date: step.endDate,
          notes: step.notes,
          media: step.media.map((file) => URL.createObjectURL(file)),
        };
      });

      const taggedUsers = data.friends.map((user) => user.id);

      const completeData = {
        title: data.title.trim(),
        description: data.description?.trim() || "",
        start_location_name: startLocation.name,
        start_lat: startLocation.coords ? startLocation.coords[1] : null,
        start_lng: startLocation.coords ? startLocation.coords[0] : null,
        end_location_name: endLocation.name,
        end_lat: endLocation.coords ? endLocation.coords[1] : null,
        end_lng: endLocation.coords ? endLocation.coords[0] : null,
        start_date: data.startDate,
        end_date: data.endDate,
        privacy: visibility,
        planning_mode: "manual",
        date_mode: "specific",
        journey_types: ["adventure"],
        tagged_users: taggedUsers,
        stops: stops,
      };

      // Submit to API
      const response = await apiRequest("post/journeys", {
        method: "POST",
        body: JSON.stringify(completeData),
      });

      console.log("Journey created successfully:", response);
      return true;
    } catch (error) {
      console.error("Error creating journey:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [startLocation, endLocation, steps, visibility, stopCategories, validation]);

  return {
    // Form control
    form,
    fields,
    append,
    remove,
    update,

    // State
    startLocation,
    endLocation,
    steps,
    visibility,
    stopCategories,
    users,
    loadingCategories,
    loadingUsers,
    isSubmitting,

    // State setters
    setStartLocation,
    setEndLocation,
    setSteps,
    setVisibility,

    // Computed values
    canAddStep,

    // Helper functions
    flyToOnMap,
    fetchStepSuggestions,
    searchUsers,
    submitJourney,

    // Validation
    ...validation,

    // Refs
    mapRef,
  };
} 