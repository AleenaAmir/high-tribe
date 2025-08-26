const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_LOCATION_API_KEY;
const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export interface GooglePlace {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface GooglePlaceDetails {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
}

export interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number];
  text: string;
  context?: Array<{ text: string }>;
}

// Fallback to Mapbox when Google Places fails
async function fetchMapboxSuggestions(input: string): Promise<GooglePlace[]> {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json?access_token=${MAPBOX_API_KEY}&limit=10`;
    const response = await fetch(url);
    const data = await response.json();
    
    return (data.features || []).map((feature: MapboxFeature) => ({
      place_id: feature.id,
      description: feature.place_name,
      structured_formatting: {
        main_text: feature.text,
        secondary_text: feature.context ? feature.context.map(c => c.text).join(', ') : feature.place_name
      }
    }));
  } catch (error) {
    console.error('Error fetching Mapbox suggestions:', error);
    return [];
  }
}

export async function fetchGooglePlaceSuggestions(
  input: string,
  location?: { lat: number; lng: number }
): Promise<GooglePlace[]> {
  try {
    // Try Google Places first
    if (GOOGLE_API_KEY) {
      const params = new URLSearchParams({
        input,
        key: GOOGLE_API_KEY,
        types: 'establishment|geocode',
      });

      // Only add location and radius if location is provided
      if (location) {
        params.append('location', `${location.lat},${location.lng}`);
        params.append('radius', '500000');
      }

      const response = await fetch(`/api/google-places?action=autocomplete&${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if Google API returned an error
      if (data.status === 'REQUEST_DENIED' || data.status === 'OVER_QUERY_LIMIT') {
        console.warn('Google Places API failed, falling back to Mapbox:', data.error_message);
        return await fetchMapboxSuggestions(input);
      }
      
      return data.predictions || [];
    } else {
      // No Google API key, use Mapbox directly
      return await fetchMapboxSuggestions(input);
    }
  } catch (error) {
    console.error('Error fetching Google Places suggestions, falling back to Mapbox:', error);
    return await fetchMapboxSuggestions(input);
  }
}

async function getMapboxPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
  try {
    // For Mapbox, we need to geocode the place name
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(placeId)}.json?access_token=${MAPBOX_API_KEY}&limit=1`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      return {
        place_id: feature.id,
        formatted_address: feature.place_name,
        geometry: {
          location: {
            lat: feature.center[1],
            lng: feature.center[0]
          }
        },
        name: feature.text
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching Mapbox place details:', error);
    return null;
  }
}

export async function getGooglePlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
  try {
    // Try Google Places first
    if (GOOGLE_API_KEY) {
      const params = new URLSearchParams({
        place_id: placeId,
        key: GOOGLE_API_KEY,
        fields: 'place_id,formatted_address,geometry,name',
      });

      const response = await fetch(`/api/google-places?action=details&${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if Google API returned an error
      if (data.status === 'REQUEST_DENIED' || data.status === 'OVER_QUERY_LIMIT') {
        console.warn('Google Places API failed, falling back to Mapbox:', data.error_message);
        return await getMapboxPlaceDetails(placeId);
      }
      
      return data.result || null;
    } else {
      // No Google API key, use Mapbox directly
      return await getMapboxPlaceDetails(placeId);
    }
  } catch (error) {
    console.error('Error fetching Google Place details, falling back to Mapbox:', error);
    return await getMapboxPlaceDetails(placeId);
  }
}

export async function getCoordinatesForGooglePlace(placeId: string): Promise<[number, number] | null> {
  try {
    const details = await getGooglePlaceDetails(placeId);
    if (details && details.geometry) {
      return [details.geometry.location.lng, details.geometry.location.lat];
    }
    return null;
  } catch (error) {
    console.error('Error getting coordinates for Google Place:', error);
    return null;
  }
} 