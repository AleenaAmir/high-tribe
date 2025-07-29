const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_LOCATION_API_KEY;

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

export async function fetchGooglePlaceSuggestions(
  input: string,
  location?: { lat: number; lng: number }
): Promise<GooglePlace[]> {
  try {
    const params = new URLSearchParams({
      input,
      key: GOOGLE_API_KEY || '',
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
    return data.predictions || [];
  } catch (error) {
    console.error('Error fetching Google Places suggestions:', error);
    return [];
  }
}

export async function getGooglePlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
  try {
    const params = new URLSearchParams({
      place_id: placeId,
      key: GOOGLE_API_KEY || '',
      fields: 'place_id,formatted_address,geometry,name',
    });

    const response = await fetch(`/api/google-places?action=details&${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data = await response.json();
    return data.result || null;
  } catch (error) {
    console.error('Error fetching Google Place details:', error);
    return null;
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