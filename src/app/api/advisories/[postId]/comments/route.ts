import { NextRequest, NextResponse } from 'next/server';



export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    
    // Get the form data from the request
    const formData = await request.formData();
    const content = formData.get('content') as string;
    const parentId = formData.get('parent_id') as string;

    // Validate the content
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    // Get the authorization token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token is required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // TODO: Replace with actual backend API call when available
    // For now, return mock success response to test the frontend
    const mockComment = {
      id: Date.now().toString(),
      content: content.trim(),
      user: {
        name: 'Current User',
        avatarUrl: 'https://via.placeholder.com/32x32/6366F1/FFFFFF?text=U'
      },
      timestamp: 'Just now',
      likes: 0,
      parent_id: parentId || null
    };

    return NextResponse.json({
      message: parentId ? 'Reply added successfully' : 'Comment added successfully',
      comment: mockComment
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const { searchParams } = new URL(request.url);
    
    const perPage = parseInt(searchParams.get('per_page') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const withReplies = searchParams.get('with_replies') === 'true';
    
    // Get the authorization token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token is required' },
        { status: 401 }
      );
    }

    // TODO: Replace with actual backend API call when available
    // For now, return mock data to test the frontend
    const mockComments = [
      {
        id: '1',
        content: 'This travel advisory is very helpful!',
        user: {
          name: 'Travel Expert',
          avatarUrl: 'https://via.placeholder.com/32x32/4F46E5/FFFFFF?text=TE'
        },
        timestamp: '1h ago',
        likes: 3,
                 replies: withReplies ? [
           {
             id: '2',
             content: 'I agree, this saved me a lot of trouble.',
             user: {
               name: 'Adventure Seeker',
               avatarUrl: 'https://via.placeholder.com/24x24/10B981/FFFFFF?text=AS'
             },
             timestamp: '30m ago',
             parent_id: '1',
             replies: [
               {
                 id: '3',
                 content: 'Absolutely! Travel advisories are crucial.',
                 user: {
                   name: 'Travel Expert',
                   avatarUrl: 'https://via.placeholder.com/20x20/4F46E5/FFFFFF?text=TE'
                 },
                 timestamp: '15m ago',
                 parent_id: '2'
               }
             ]
           }
         ] : []
      }
    ];

    return NextResponse.json({
      data: mockComments,
      pagination: {
        current_page: page,
        per_page: perPage,
        total: mockComments.length,
        total_pages: Math.ceil(mockComments.length / perPage)
      }
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
