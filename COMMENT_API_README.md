# Comment API Implementation

This document describes the complete comment functionality implemented for the PostCard component in the High Tribe application.

## Overview

The comment system allows users to:

- **Add comments** to different types of posts (posts, advisories, journeys, tripboards)
- **Fetch and display comments** with pagination and reply support
- **Reply to comments** with nested reply functionality
- **View comment interactions** (likes, timestamps, user information)

## API Endpoints

### 1. Regular Posts

- **POST** `/api/posts/[postId]/comments` - Add a comment to a post
- **GET** `/api/posts/[postId]/comments` - Get comments for a post

### 2. Travel Advisories

- **POST** `/api/advisories/[postId]/comments` - Add a comment to a travel advisory
- **GET** `/api/advisories/[postId]/comments` - Get comments for a travel advisory

### 3. Journeys

- **POST** `/api/journeys/[postId]/comments` - Add a comment to a journey
- **GET** `/api/journeys/[postId]/comments` - Get comments for a journey

### 4. Trip Boards

- **POST** `/api/tripboards/[postId]/comments` - Add a comment to a trip board
- **GET** `/api/tripboards/[postId]/comments` - Get comments for a trip board

## Request Parameters

### GET Comments

- `per_page` (optional): Number of comments per page (default: 10)
- `page` (optional): Page number (default: 1)
- `with_replies` (optional): Include replies in response (default: false)

### POST Comment/Reply

- `content` (required): The comment text
- `parent_id` (optional): ID of parent comment for replies

## Authentication

All endpoints require a valid Bearer token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Frontend Implementation

### PostCard Component Features

1. **Comment Display**

   - Clickable "Comments" button to toggle comment visibility
   - Loading states with spinner animation
   - Empty state message when no comments exist
   - Nested reply display with proper indentation

2. **Comment Input**

   - Real-time input validation
   - Enter key support for quick submission
   - Loading states during submission
   - Success/error toast notifications

3. **Reply Functionality**

   - "Reply" button on each comment
   - Inline reply input form
   - Cancel reply option
   - Proper parent_id handling for API calls

4. **User Experience**
   - Responsive design with proper spacing
   - User avatars and names
   - Timestamp display
   - Like/Reply action buttons
   - Smooth animations and transitions

### State Management

The PostCard component manages several states:

- `comments`: Array of fetched comments
- `loadingComments`: Loading state for comment fetching
- `showComments`: Toggle for comment visibility
- `commentContent`: Main comment input value
- `replyTo`: Currently active reply target
- `replyContent`: Reply input value
- `isSubmittingComment`: Comment submission loading
- `isSubmittingReply`: Reply submission loading

### API Integration

The component uses the existing `apiRequest` and `apiFormDataWrapper` functions for:

- Consistent error handling
- Automatic authentication
- Built-in success notifications
- Proper request formatting

## Usage Example

```typescript
// In PostCard component
const handleCommentSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("content", commentContent.trim());

  await apiFormDataWrapper(
    `${postType}/${post.id}/comments`,
    formData,
    "Comment added successfully!"
  );
};

// Fetching comments
const fetchComments = async () => {
  const response = await apiRequest<{ data: Comment[] }>(
    `${postType}/${post.id}/comments?per_page=10&page=1&with_replies=true`
  );
  setComments(response.data || []);
};
```

## Error Handling

- **Authentication errors**: Redirect to login or show auth modal
- **Network errors**: Display user-friendly error messages
- **Validation errors**: Show specific field validation messages
- **Server errors**: Generic error messages with retry options

## Future Enhancements

1. **Comment Editing**: Allow users to edit their own comments
2. **Comment Deletion**: Allow users to delete their own comments
3. **Comment Moderation**: Admin tools for comment management
4. **Real-time Updates**: WebSocket integration for live comments
5. **Comment Search**: Search functionality within comments
6. **Comment Reactions**: Emoji reactions beyond simple likes
7. **Comment Threading**: Better visual hierarchy for deep reply chains
8. **Comment Notifications**: Push notifications for replies and mentions

## Testing

To test the comment functionality:

1. **Add a comment**: Type in the comment input and press Enter or click the send button
2. **View comments**: Click on the "Comments" button to toggle comment visibility
3. **Reply to a comment**: Click "Reply" on any comment and submit a reply
4. **Test pagination**: Add multiple comments to test pagination (if implemented)
5. **Test error handling**: Try submitting empty comments or with network issues

## Dependencies

- `react-hot-toast`: For success/error notifications
- `next/image`: For optimized image loading
- `ky`: For HTTP requests (via apiRequest wrapper)
- `react`: For state management and UI components
