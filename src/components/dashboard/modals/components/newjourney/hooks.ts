import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { apiRequest } from "@/lib/api";
import { toast } from "react-hot-toast";
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

    // Category validation - make it required
    if (!step.category || step.category.trim() === "") {
      stepError.category = "Stop category is required";
    } else if (!stopCategories.find(cat => cat.id.toString() === step.category)) {
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

  // Step suggestions - now allows any location selection
  const fetchStepSuggestions = useCallback(async (query: string): Promise<MapboxFeature[]> => {
    let url: string;

    if (!query || query.trim() === "") {
      // When no query, fetch popular places globally
      url = `${MAPBOX_GEOCODE_URL}places.json?types=poi,address&limit=20&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
    } else {
      // When there's a query, perform global search
      url = `${MAPBOX_GEOCODE_URL}${encodeURIComponent(
        query
      )}.json?limit=20&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();

      return (data.features || []);
    } catch (error) {
      console.error('Error fetching step suggestions:', error);
      return [];
    }
  }, []);

  // Data fetching
  useEffect(() => {
    setLoadingCategories(true);
    setLoadingUsers(true);

    const fetchData = async () => {
      try {
        console.log('Fetching categories and users...');

        // Fetch categories and users from API
        const categoriesPromise = apiRequest<any>("posts/stops/categories", { method: "GET" });
        const usersPromise = apiRequest<any>("users", { method: "GET" });

        const [categoriesData, usersData] = await Promise.all([categoriesPromise, usersPromise]);

        console.log('Categories data received:', categoriesData);
        console.log('Users data received:', usersData);

        // Handle categories data structure
        let categories = [];
        if (Array.isArray(categoriesData)) {
          categories = categoriesData;
        } else if (categoriesData?.categories && Array.isArray(categoriesData.categories)) {
          categories = categoriesData.categories;
        } else if (categoriesData && typeof categoriesData === 'object' && categoriesData.data && Array.isArray(categoriesData.data)) {
          categories = categoriesData.data;
        }

        // Map categories to expected structure
        const mappedCategories = categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          label: cat.name,
        }));

        console.log('Processed categories:', mappedCategories);

        // Handle users data structure
        let users = [];
        if (Array.isArray(usersData)) {
          users = usersData;
        } else if (usersData?.users && Array.isArray(usersData.users)) {
          users = usersData.users;
        } else if (usersData && typeof usersData === 'object' && usersData.data && Array.isArray(usersData.data)) {
          users = usersData.data;
        }

        // Map users to expected structure
        const mappedUsers = users.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }));

        console.log('Processed users:', mappedUsers);

        setStopCategories(mappedCategories);
        setUsers(mappedUsers);

      } catch (error) {
        console.error('Error fetching data:', error);

        // Set some default categories for testing
        const defaultCategories = [
          { id: 1, name: "Hotel", label: "Hotel" },
          { id: 2, name: "Restaurant", label: "Restaurant" },
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

      // Validate that we have at least basic journey data
      if (!startLocation.coords || !endLocation.coords) {
        validation.setErrors({
          startLocation: !startLocation.coords ? "Start location is required" : "",
          endLocation: !endLocation.coords ? "End location is required" : "",
        });
        return false;
      }

      // Transform data for API - match the API structure
      const stops = steps
        .filter(step => step.location.coords && step.location.name) // Only include steps with valid location
        .map((step) => {
          const modeMapping: { [key: string]: string } = {
            plane: "airplane",
            train: "train",
            car: "car",
            bus: "bus",
            walk: "foot",
            bike: "bike",
            info: "other",
          };
          const transportMode = modeMapping[step.mediumOfTravel] || step.mediumOfTravel || "car";

          return {
            title: step.name || step.location.name || "Untitled Stop",
            stop_category_id: step.category ? parseInt(step.category) : 1,
            location: {
              name: step.location.name,
              lat: step.location.coords ? step.location.coords[1].toString() : null,
              lng: step.location.coords ? step.location.coords[0].toString() : null,
            },
            transport_mode: transportMode,
            transport_mode_other: step.mediumOfTravel === "info" ? step.notes : null,
            start_date: step.startDate,
            end_date: step.endDate,
            notes: step.notes,
            media: step.media && Array.isArray(step.media)
              ? step.media.map((media: any) => ({
                url: media.url,
                type: media.type,
                file_name: media.file_name,
              }))
              : [],
          };
        });

      // Create FormData with the correct structure
      const formData = new FormData();

      // Add basic journey data
      formData.append('title', data.title.trim());
      formData.append('description', data.description?.trim() || "");
      formData.append('start_location_name', startLocation.name || "");
      formData.append('start_lat', startLocation.coords ? startLocation.coords[1].toString() : "");
      formData.append('start_lng', startLocation.coords ? startLocation.coords[0].toString() : "");
      formData.append('end_location_name', endLocation.name || "");
      formData.append('end_lat', endLocation.coords ? endLocation.coords[1].toString() : "");
      formData.append('end_lng', endLocation.coords ? endLocation.coords[0].toString() : "");
      formData.append('start_date', data.startDate || "");
      formData.append('end_date', data.endDate || "");
      formData.append('privacy', visibility || "public");
      formData.append('planning_mode', "manual");
      formData.append('date_mode', "specific");
      formData.append('type', "mapping_journey");
      formData.append('status', "draft");

      // Add optional fields that might be required
      formData.append('month', new Date(data.startDate).toLocaleString('default', { month: 'short' }));
      formData.append('days_count', Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)).toString());

      // Add tagged users (only if there are any)
      const taggedUserIds = data.friends.map((user) => user.id);
      if (taggedUserIds.length > 0) {
        taggedUserIds.forEach((userId, index) => {
          formData.append(`tagged_users[${index}]`, userId.toString());
        });
      }

      // Add stops data (only if there are valid stops)
      const validStops = steps.filter(step => step.location.coords && step.location.name);
      if (validStops.length > 0) {
        validStops.forEach((step, stepIndex) => {
          const modeMapping: { [key: string]: string } = {
            plane: "airplane",
            train: "train",
            car: "car",
            bus: "bus",
            walk: "foot",
            bike: "bike",
            info: "other",
          };
          const transportMode = modeMapping[step.mediumOfTravel] || step.mediumOfTravel || "car";

          formData.append(`stops[${stepIndex}][title]`, step.name || step.location.name || "Untitled Stop");
          formData.append(`stops[${stepIndex}][stop_category_id]`, step.category ? step.category : "1");
          formData.append(`stops[${stepIndex}][location][name]`, step.location.name || "");
          formData.append(`stops[${stepIndex}][location][lat]`, step.location.coords ? step.location.coords[1].toString() : "");
          formData.append(`stops[${stepIndex}][location][lng]`, step.location.coords ? step.location.coords[0].toString() : "");
          formData.append(`stops[${stepIndex}][transport_mode]`, transportMode);
          formData.append(`stops[${stepIndex}][start_date]`, step.startDate || "");
          formData.append(`stops[${stepIndex}][end_date]`, step.endDate || "");
          formData.append(`stops[${stepIndex}][notes]`, step.notes || "");

          // Add media files for this step
          if (step.media && Array.isArray(step.media)) {
            step.media.forEach((media: any, mediaIndex: number) => {
              if (media.fileObject && media.fileObject instanceof File) {
                // If it's a File object, append it directly
                formData.append(`stops[${stepIndex}][media][${mediaIndex}]`, media.fileObject);
              }
            });
          }
        });
      }

      // Validate stops data before submission
      if (validStops.length === 0) {
        console.warn("No valid stops to submit - creating journey without stops");
      }

      console.log("Creating journey with FormData");
      console.log("Number of valid stops:", validStops.length);
      console.log("Valid stops data:", validStops);

      // Debug FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Submit to API using FormData with direct fetch (like the working example)
      const token = localStorage.getItem("token") || "<PASTE_VALID_TOKEN_HERE>";

      const response = await fetch('http://3.6.115.88/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Journey created successfully:", responseData);

      // Show success message
      toast.success("Journey created successfully!");

      return responseData;

      // Handle successful response
      if (responseData && responseData.post) {
        console.log("Created journey details:", responseData.post);
        return true;
      } else {
        console.log("Journey created but no post data returned");
        return true;
      }
    } catch (error: any) {
      console.error("Error creating journey:", error);

      // Log detailed error information
      if (error.response) {
        try {
          const errorData = await error.response.json();
          console.error("Server error details:", errorData);
        } catch (parseError) {
          console.error("Could not parse error response:", parseError);
        }
      }

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