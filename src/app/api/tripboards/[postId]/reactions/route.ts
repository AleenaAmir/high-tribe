import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    
    // Get the form data from the request
    const formData = await request.formData();
    const type = formData.get('type') as string;

    // Validate the reaction type
    if (!type || !type.trim()) {
      return NextResponse.json(
        { error: 'Reaction type is required' },
        { status: 400 }
      );
    }

    // Validate reaction type (only allow 'like' for now)
    if (type !== 'like') {
      return NextResponse.json(
        { error: 'Invalid reaction type. Only "like" is supported.' },
        { status: 400 }
      );
    }

    // Add the reactionable_type for tripboards
    formData.append('reactionable_type', 'App\\Models\\TripBoard');

    // Get the authorization token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token is required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Forward the request to the backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.hightribe.com/api';
    const response = await fetch(`${backendUrl}/tripboards/${postId}/reactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to add reaction' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Error adding reaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
