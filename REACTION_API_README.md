# Reaction API Implementation

This document describes the complete reaction functionality implemented for the PostCard component in the High Tribe application.

## Overview

The reaction system allows users to:

- **Add reactions** to different types of posts (posts, advisories, journeys, tripboards, footprints, tips)
- **Toggle reactions** (like/unlike) with optimistic UI updates
- **View reaction counts** in real-time
- **Handle reaction states** with proper loading and error handling

## API Endpoints

### 1. Regular Posts

- **POST** `/api/posts/[postId]/reactions` - Add/update reaction to a post

### 2. Travel Advisories

- **POST** `/api/advisories/[postId]/reactions` - Add/update reaction to a travel advisory

### 3. Journeys

- **POST** `/api/journeys/[postId]/reactions` - Add/update reaction to a journey

### 4. Trip Boards

- **POST** `/api/tripboards/[postId]/reactions` - Add/update reaction to a trip board

### 5. Footprints

- **POST** `/api/footprints/[postId]/reactions` - Add/update reaction to a footprint

### 6. Tips

- **POST** `/api/tips/[postId]/reactions` - Add/update reaction to a tip

## Request Parameters

### POST Reaction

- `type` (required): The reaction type (currently only "like" is supported)
- `reactionable_type` (automatically added): The model class name for the post type (e.g., "App\\Models\\Post", "App\\Models\\Journey")

## Authentication

All endpoints require a valid Bearer token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Frontend Implementation

### PostCard Component Features

1. **Reaction Buttons**

   - Heart icon for like reactions
   - Like icon for alternative like reactions
   - Visual feedback when user has reacted
   - Loading states during API calls

2. **Optimistic Updates**

   - Immediate UI updates when user clicks reaction
   - Reverts changes if API call fails
   - Smooth user experience

3. **State Management**
   - Local reaction count tracking
   - User reaction state tracking
   - Loading states for better UX

### API Helper Function

The `addReaction` function in `src/lib/api.ts` provides:

- Automatic token handling
- FormData creation
- Error handling with user-friendly messages
- Success notifications
- Development logging

## Usage Example

```typescript
import { addReaction } from "@/lib/api";

// Add a like reaction to a post
const handleLike = async () => {
  try {
    await addReaction(
      "posts", // post type
      "123", // post ID
      "like", // reaction type
      "Reaction added!" // success message
    );
  } catch (error) {
    console.error("Failed to add reaction:", error);
  }
};
```

## Error Handling

The API provides comprehensive error handling:

- **400**: Invalid reaction type or missing parameters
- **401**: Authentication required
- **403**: Access denied
- **404**: Post not found
- **500**: Server error

## Future Enhancements

1. **Multiple Reaction Types**: Support for different reaction types (love, laugh, wow, etc.)
2. **Reaction Analytics**: Track and display reaction statistics
3. **Reaction Notifications**: Notify users when their posts receive reactions
4. **Reaction History**: Allow users to view their reaction history

## Backend Integration

The Next.js API routes forward requests to the backend API:

- Validates input parameters
- Handles authentication
- Forwards requests to appropriate backend endpoints
- Returns standardized responses

## Testing

To test the reaction functionality:

1. Ensure you have a valid authentication token
2. Navigate to any post in the application
3. Click the heart or like button
4. Verify the reaction count updates
5. Check that the button state changes (filled/unfilled)
6. Test error scenarios by using invalid tokens or post IDs
