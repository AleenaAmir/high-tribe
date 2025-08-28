import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_LOCATION_API_KEY;

// Debug log to check API key
// console.log('Google Places API Route - Environment Check:', {
//   hasGoogleApiKey: !!GOOGLE_API_KEY,
//   googleApiKeyLength: GOOGLE_API_KEY?.length,
//   googleApiKeyPrefix: GOOGLE_API_KEY?.substring(0, 10) + '...'
// });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'autocomplete') {
    const input = searchParams.get('input');
    const location = searchParams.get('location');
    const radius = searchParams.get('radius') || '500000';

    if (!input) {
      return Response.json({ error: 'Input parameter is required' }, { status: 400 });
    }

    let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_API_KEY}&types=establishment|geocode`;

    // Only add location and radius if location is provided
    if (location) {
      url += `&location=${location}&radius=${radius}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      return Response.json(data);
    } catch (error) {
      console.error('Error fetching from Google Places API:', error);
      return Response.json({ error: 'Failed to fetch from Google Places API' }, { status: 500 });
    }
  }

  if (action === 'details') {
    const placeId = searchParams.get('place_id');
          const fields = searchParams.get('fields') || 'place_id,formatted_address,geometry,name,photos';

    if (!placeId) {
      return Response.json({ error: 'Place ID is required' }, { status: 400 });
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return Response.json(data);
    } catch (error) {
      console.error('Error fetching place details from Google Places API:', error);
      return Response.json({ error: 'Failed to fetch place details' }, { status: 500 });
    }
  }

  if (action === 'photo') {
    const photoreference = searchParams.get('photoreference');
    const maxwidth = searchParams.get('maxwidth') || '800';

    if (!photoreference) {
      return Response.json({ error: 'Photo reference is required' }, { status: 400 });
    }

    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${photoreference}&key=${GOOGLE_API_KEY}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Google Places Photos API error: ${response.status}`);
      }

      // The Google Places Photos API returns the image directly
      // We need to return the URL that the client can use to fetch the image
      return Response.json({ 
        status: 'OK',
        photo_url: url 
      });
    } catch (error) {
      console.error('Error fetching photo from Google Places API:', error);
      return Response.json({ error: 'Failed to fetch photo' }, { status: 500 });
    }
  }

  return Response.json({ error: 'Invalid action' }, { status: 400 });
} 