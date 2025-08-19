# Comment Functionality Test Guide

## How to Test the Comment System

### 1. **Test Comment Display**

1. Navigate to any post in the dashboard
2. Look for the "Comments" button in the post footer
3. Click on the "Comments" button - it should show "(Show)" when hidden and "(Hide)" when visible
4. The comments section should appear with mock data including:
   - User avatars and names
   - Comment content
   - Timestamps
   - Like and Reply buttons

### 2. **Test Comment Submission**

1. Scroll down to the comment input field at the bottom of the post
2. Type a comment in the input field
3. Press Enter or click the send button
4. You should see a success toast notification
5. The comment should appear in the comments list (if comments are visible)

### 3. **Test Reply Functionality**

1. Click the "Reply" button on any existing comment
2. A reply input field should appear below the comment
3. Type your reply and press Enter or click "Reply"
4. You should see a success toast notification
5. The reply should appear nested under the original comment

### 4. **Test Nested Reply Functionality**

1. Click the "Reply" button on any existing reply (nested under a comment)
2. A reply input field should appear below the reply
3. Type your reply and press Enter or click "Reply"
4. You should see a success toast notification
5. The nested reply should appear with proper indentation
6. You can continue this pattern for multiple levels of nesting

### 5. **Test Comment Toggle**

1. Click the "Comments" button to show comments
2. Click it again to hide comments
3. The button text should change between "Comments (Show)" and "Comments (Hide)"

### 6. **Debug Information**

Open the browser console (F12) to see debug logs:

- When fetching comments: "Fetching comments for post: [postId] type: [postType]"
- Comments response: "Comments response: [response]"
- Setting comments: "Setting comments: [comments]"
- Rendering: "Comments state: { comments, loadingComments, showComments }"

## Expected Behavior

### ✅ **Working Features**

- Comments button toggles comment visibility
- Loading spinner appears while fetching comments
- Mock comments display with proper formatting
- Comment submission works with success notifications
- Reply functionality works with nested display
- **Nested replies** - users can reply to replies (multiple levels)
- Proper indentation for different reply levels
- Empty state shows "No comments yet" message
- Keyboard support (Enter to submit)

### 🔧 **Mock Data**

The system currently uses mock data for testing:

- **Posts**: 3 mock comments with nested replies (up to 2 levels deep)
- **Advisories**: 1 mock comment with nested replies
- **Journeys**: Will use same structure as posts
- **Tripboards**: Will use same structure as posts

**Nested Reply Structure:**

- Level 1: Main comments
- Level 2: Replies to comments
- Level 3: Replies to replies (nested replies)

### 🚀 **Next Steps**

Once you confirm the frontend is working:

1. Replace mock API responses with real backend calls
2. Update the API routes to connect to your actual backend
3. Test with real data from your database

## Troubleshooting

### **Comments Not Showing**

1. Check browser console for errors
2. Verify the API routes are accessible
3. Check if authentication token is present
4. Ensure the post has a valid ID

### **Comment Submission Fails**

1. Check network tab for API errors
2. Verify form data is being sent correctly
3. Check if the API route is responding properly

### **UI Issues**

1. Check for JavaScript errors in console
2. Verify all CSS classes are loading
3. Check if React components are rendering properly

## API Endpoints Being Tested

- `GET /api/posts/[postId]/comments` - Fetch comments
- `POST /api/posts/[postId]/comments` - Add comment
- `GET /api/advisories/[postId]/comments` - Fetch advisory comments
- `POST /api/advisories/[postId]/comments` - Add advisory comment
- Similar endpoints for journeys and tripboards

All endpoints currently return mock data for testing purposes.
