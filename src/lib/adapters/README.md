# Data Adapters Pattern

This directory contains data adapters that transform API responses into component-ready formats.

## Why Use Adapters?

1. **Separation of Concerns**: API data structure is separate from component data structure
2. **Reusability**: Transform logic can be shared across multiple components
3. **Type Safety**: Clear interfaces for both API and component data
4. **Maintainability**: Changes to API structure only require adapter updates
5. **Testing**: Components can be tested with mock data that matches their expected format

## Current Adapters

### PostAdapter (`postAdapter.ts`)

Transforms API post data into component-ready post format.

#### Usage:

```typescript
import {
  transformApiPostToPost,
  transformApiPostsToPosts,
  Post,
  ApiPost,
  ApiResponse,
  getPostType
} from '@/lib/adapters/postAdapter';

// Transform single post
const apiPost: ApiPost = /* from API */;
const componentPost: Post = transformApiPostToPost(apiPost);

// Transform multiple posts from API response
const apiResponse: ApiResponse = /* from API */;
const componentPosts: Post[] = transformApiPostsToPosts(apiResponse.data.data);

// Detect post type
const postType = getPostType(componentPost); // 'journey' | 'advisory' | 'footprint' | 'tip'
```

#### Key Features:

- **Type Detection**: Automatically detects post types (journey, advisory, footprint, tip)
- **Media Handling**: Normalizes media URLs and types
- **User Transformation**: Standardizes user data format (handles null users)
- **Journey Support**: Handles complex journey data with stops and transport modes
- **Utility Functions**: Provides common utilities like `formatDate`, `isExpired`

## Best Practices

### 1. Keep Adapters Pure

Adapters should be pure functions with no side effects:

```typescript
// ✅ Good
export const transformApiPostToPost = (apiPost: ApiPost): Post => {
  // Pure transformation logic
};

// ❌ Bad
export const transformApiPostToPost = (apiPost: ApiPost): Post => {
  // Side effects like API calls, DOM manipulation
};
```

### 2. Handle Errors Gracefully

Always validate input data and provide fallbacks:

```typescript
export const transformApiPostToPost = (apiPost: ApiPost): Post => {
  if (!apiPost || !apiPost.id || !apiPost.user) {
    throw new Error("Invalid API post data");
  }

  return {
    // ... transformation with fallbacks
    user: {
      name: apiPost.user.name || "Unknown User",
      // ... other fields
    },
  };
};
```

### 3. Use TypeScript Interfaces

Define clear interfaces for both API and component data:

```typescript
// API interface (what the API returns)
export interface ApiPost {
  id: number;
  user: ApiUser;
  // ... other fields
}

// Component interface (what components expect)
export interface Post {
  id: number;
  user: PostUser;
  // ... other fields
}
```

### 4. Batch Transformations

Provide both single and batch transformation functions:

```typescript
// Single transformation
export const transformApiPostToPost = (apiPost: ApiPost): Post => {
  /* ... */
};

// Batch transformation with error handling
export const transformApiPostsToPosts = (apiPosts: ApiPost[]): Post[] => {
  return apiPosts
    .map((post, index) => {
      try {
        return transformApiPostToPost(post);
      } catch (error) {
        console.error(`Error transforming post ${index}:`, error);
        return null;
      }
    })
    .filter((post): post is Post => post !== null);
};
```

## When to Create New Adapters

Create a new adapter when:

1. **New API Endpoint**: You have a new API endpoint with different data structure
2. **Different Component Needs**: A component needs data in a different format
3. **Complex Transformations**: The transformation logic is complex or reused
4. **Type Safety**: You want to ensure type safety between API and component data

## Example: Creating a New Adapter

```typescript
// userAdapter.ts
export interface ApiUser {
  id: number;
  first_name: string;
  last_name: string;
  email_address: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export const transformApiUserToUser = (apiUser: ApiUser): User => {
  return {
    id: apiUser.id,
    name: `${apiUser.first_name} ${apiUser.last_name}`,
    email: apiUser.email_address,
  };
};
```

## Migration Guide

When migrating existing components to use adapters:

1. **Create the adapter** with proper interfaces
2. **Update the component** to import from adapter instead of defining types locally
3. **Remove duplicate logic** from components
4. **Test thoroughly** to ensure transformations work correctly
5. **Update other components** that use the same data structure

This pattern makes your codebase more maintainable and scalable as it grows.
