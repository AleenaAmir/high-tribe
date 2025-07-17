# LoadingSkeleton Components

A comprehensive set of skeleton loading components for the High Tribe application. These components provide smooth loading states that match the actual content structure.

## Components

### Main Component
- `LoadingSkeleton` - The main component with multiple types

### Convenience Components
- `TextSkeleton` - For text content loading
- `AvatarSkeleton` - For user avatars with text
- `CardSkeleton` - For card layouts
- `ButtonSkeleton` - For buttons
- `ImageSkeleton` - For images
- `ListItemSkeleton` - For list items
- `PostCardSkeleton` - For post cards (specifically designed for the feed)
- `MapSkeleton` - For map components

## Usage

### Basic Usage

```tsx
import { PostCardSkeleton } from "../../global/LoadingSkeleton";

// Show loading state
if (loading) {
  return (
    <div className="space-y-4">
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
    </div>
  );
}
```

### Main Component with Type

```tsx
import LoadingSkeleton from "../../global/LoadingSkeleton";

// Text skeleton with custom lines
<LoadingSkeleton type="text" lines={5} />

// Custom skeleton
<LoadingSkeleton 
  type="custom" 
  width="w-64" 
  height="h-32" 
  rounded="lg"
/>
```

### Available Props

#### LoadingSkeleton Props
- `type`: 'text' | 'avatar' | 'card' | 'button' | 'image' | 'list-item' | 'post-card' | 'map' | 'custom'
- `lines`: number (for text type, default: 3)
- `className`: string (additional CSS classes)
- `width`: string | number (width of the skeleton)
- `height`: string | number (height of the skeleton)
- `rounded`: 'none' | 'sm' | 'md' | 'lg' | 'full' (border radius)
- `animation`: 'pulse' | 'wave' (animation type)

## Examples

### Text Loading
```tsx
import { TextSkeleton } from "../../global/LoadingSkeleton";

<TextSkeleton lines={4} />
```

### Avatar with Text
```tsx
import { AvatarSkeleton } from "../../global/LoadingSkeleton";

<AvatarSkeleton />
```

### Post Card Loading
```tsx
import { PostCardSkeleton } from "../../global/LoadingSkeleton";

// Show multiple post skeletons
<div className="space-y-4">
  <PostCardSkeleton />
  <PostCardSkeleton />
  <PostCardSkeleton />
</div>
```

### Map Loading
```tsx
import { MapSkeleton } from "../../global/LoadingSkeleton";

<MapSkeleton height="h-96" />
```

### Custom Skeleton
```tsx
import LoadingSkeleton from "../../global/LoadingSkeleton";

<LoadingSkeleton
  type="custom"
  width="w-full"
  height="h-20"
  rounded="lg"
  className="bg-gradient-to-r from-blue-200 to-purple-200"
/>
```

## Integration Examples

### UserFeed Component
```tsx
// Before
if (loading && posts.length === 0) {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

// After
if (loading && posts.length === 0) {
  return (
    <div className="space-y-4">
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
    </div>
  );
}
```

### Map Components
```tsx
// Before
{isLoading && (
  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)}

// After
{isLoading && (
  <div className="absolute inset-0 z-10">
    <MapSkeleton height="h-full" />
  </div>
)}
```

## Demo Page

Visit `/skeleton-demo` to see all skeleton components in action.

## Best Practices

1. **Match Content Structure**: Use skeletons that closely match the actual content layout
2. **Consistent Spacing**: Use the same spacing as the actual content
3. **Appropriate Count**: Show 2-3 skeletons for lists, 1 for single items
4. **Animation**: Use 'pulse' for subtle loading, 'wave' for more prominent loading
5. **Dark Mode**: Skeletons automatically adapt to dark mode

## Styling

All skeletons use Tailwind CSS classes and automatically support:
- Dark mode (`dark:` variants)
- Responsive design
- Custom animations
- Gradient backgrounds (for custom skeletons)

## Performance

- Skeletons are lightweight and don't impact performance
- Use `key` props when rendering multiple skeletons in lists
- Consider lazy loading for large lists of skeletons 