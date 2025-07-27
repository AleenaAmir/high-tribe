import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = 'AIzaSyBp5MLzQRWKHDrnyNRWJkByjh14RRyC2pg';

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
    const fields = searchParams.get('fields') || 'place_id,formatted_address,geometry,name';

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

  return Response.json({ error: 'Invalid action' }, { status: 400 });
} 