# GlobalRouteMap Component

A reusable React component for displaying interactive route maps using Mapbox GL JS. This component provides a flexible and customizable way to show routes between multiple points with various styling options.

## Features

- 🗺️ **Interactive Route Display**: Show driving routes between start, end, and waypoints
- 🎯 **Customizable Markers**: Support for custom colors, icons, and sizes
- 🎨 **Flexible Styling**: Customizable route colors, widths, and line styles
- 📱 **Responsive Design**: Works on all screen sizes
- 🔄 **Real-time Updates**: Automatically updates when route data changes
- 📊 **Route Information**: Optional distance and duration display
- 🎮 **Interactive Controls**: Click handlers for points and map interactions
- 🚀 **Performance Optimized**: Debounced API calls and efficient rendering

## Installation

Make sure you have the required dependencies:

```bash
npm install mapbox-gl
```

And set up your Mapbox access token in your environment variables:

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

## Basic Usage

```tsx
import GlobalRouteMap, { RoutePoint } from "@/components/global/GlobalRouteMap";

const MyComponent = () => {
  const startPoint: RoutePoint = {
    coords: [69.2, 41.3], // Tashkent
    name: "Tashkent",
    color: "#22c55e",
  };

  const endPoint: RoutePoint = {
    coords: [74.3587, 31.5204], // Lahore
    name: "Lahore",
    color: "#ef4444",
  };

  const waypoints: RoutePoint[] = [
    {
      coords: [72.8777, 19.076], // Mumbai
      name: "Mumbai",
      color: "#2563eb",
    },
  ];

  return (
    <GlobalRouteMap
      startPoint={startPoint}
      endPoint={endPoint}
      waypoints={waypoints}
      showRouteInfo={true}
      height="400px"
    />
  );
};
```

## Props

### Route Configuration

| Prop         | Type                      | Default     | Description                         |
| ------------ | ------------------------- | ----------- | ----------------------------------- |
| `startPoint` | `RoutePoint \| undefined` | `undefined` | Starting point of the route         |
| `endPoint`   | `RoutePoint \| undefined` | `undefined` | Ending point of the route           |
| `waypoints`  | `RoutePoint[]`            | `[]`        | Intermediate points along the route |
| `segments`   | `RouteSegment[]`          | `[]`        | Custom route segments (advanced)    |

### Map Configuration

| Prop     | Type     | Default                                | Description            |
| -------- | -------- | -------------------------------------- | ---------------------- |
| `center` | `LatLng` | `[69.2, 41.3]`                         | Initial map center     |
| `zoom`   | `number` | `4`                                    | Initial map zoom level |
| `style`  | `string` | `"mapbox://styles/mapbox/streets-v12"` | Mapbox style URL       |

### Interaction Options

| Prop           | Type                                         | Default     | Description                       |
| -------------- | -------------------------------------------- | ----------- | --------------------------------- |
| `interactive`  | `boolean`                                    | `true`      | Whether the map is interactive    |
| `onPointClick` | `(point: RoutePoint, index: number) => void` | `undefined` | Callback when a marker is clicked |
| `onMapClick`   | `(coords: LatLng) => void`                   | `undefined` | Callback when the map is clicked  |

### Display Options

| Prop            | Type      | Default | Description                                      |
| --------------- | --------- | ------- | ------------------------------------------------ |
| `showMarkers`   | `boolean` | `true`  | Whether to show markers                          |
| `showRoute`     | `boolean` | `true`  | Whether to show the route line                   |
| `autoFitBounds` | `boolean` | `true`  | Whether to automatically fit map to route bounds |
| `showRouteInfo` | `boolean` | `false` | Whether to show distance/duration info           |

### Customization

| Prop         | Type                              | Default     | Description               |
| ------------ | --------------------------------- | ----------- | ------------------------- |
| `markerSize` | `number`                          | `16`        | Size of markers in pixels |
| `routeColor` | `string`                          | `"#2563eb"` | Color of the route line   |
| `routeWidth` | `number`                          | `4`         | Width of the route line   |
| `routeStyle` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'`   | Style of the route line   |

### Container Styling

| Prop        | Type     | Default   | Description                 |
| ----------- | -------- | --------- | --------------------------- |
| `className` | `string` | `""`      | Additional CSS classes      |
| `height`    | `string` | `"400px"` | Height of the map container |
| `width`     | `string` | `"100%"`  | Width of the map container  |

### Callbacks

| Prop          | Type                        | Description                 |
| ------------- | --------------------------- | --------------------------- |
| `onRouteLoad` | `(route: LatLng[]) => void` | Called when route is loaded |
| `onError`     | `(error: Error) => void`    | Called when an error occurs |

## Types

### RoutePoint

```tsx
interface RoutePoint {
  id?: string | number;
  coords: LatLng; // [longitude, latitude]
  name?: string;
  color?: string;
  icon?: string; // URL to custom icon
  metadata?: Record<string, any>;
}
```

### RouteSegment

```tsx
interface RouteSegment {
  from: LatLng;
  to: LatLng;
  color?: string;
  width?: number;
  style?: "solid" | "dashed" | "dotted";
}
```

### LatLng

```tsx
type LatLng = [number, number]; // [longitude, latitude]
```

## Advanced Usage

### Custom Icons

```tsx
const customPoint: RoutePoint = {
  coords: [69.2, 41.3],
  name: "Custom Location",
  icon: "/path/to/custom-icon.png",
  color: "#ff6b6b",
};
```

### Interactive Map with Callbacks

```tsx
const handlePointClick = (point: RoutePoint, index: number) => {
  console.log(`Clicked on ${point.name} at index ${index}`);
};

const handleMapClick = (coords: LatLng) => {
  console.log(`Map clicked at: ${coords[0]}, ${coords[1]}`);
};

<GlobalRouteMap
  startPoint={startPoint}
  endPoint={endPoint}
  waypoints={waypoints}
  onPointClick={handlePointClick}
  onMapClick={handleMapClick}
  showRouteInfo={true}
/>;
```

### Custom Styling

```tsx
<GlobalRouteMap
  startPoint={startPoint}
  endPoint={endPoint}
  waypoints={waypoints}
  routeColor="#8b5cf6"
  routeWidth={6}
  routeStyle="dashed"
  markerSize={20}
  className="border border-purple-200 rounded-lg"
/>
```

### Read-only Map

```tsx
<GlobalRouteMap
  startPoint={startPoint}
  endPoint={endPoint}
  waypoints={waypoints}
  interactive={false}
  showRouteInfo={true}
/>
```

## Ref Methods

The component exposes the following methods through ref:

```tsx
const mapRef = useRef<any>(null);

// Fly to a specific location
mapRef.current?.flyTo({ center: [69.2, 41.3], zoom: 8 });

// Fit map to specific bounds
mapRef.current?.fitBounds([
  [69.2, 41.3],
  [74.3587, 31.5204],
]);

// Get the underlying Mapbox map instance
const mapInstance = mapRef.current?.getMap();
```

## Error Handling

The component includes built-in error handling:

- Falls back to straight-line routes if Mapbox API fails
- Shows loading skeleton while map is initializing
- Provides error callback for custom error handling

## Performance Considerations

- Route fetching is debounced to prevent excessive API calls
- Markers are efficiently managed and cleaned up
- Map resources are properly disposed of when component unmounts

## Browser Support

- Modern browsers with WebGL support
- Requires Mapbox GL JS compatibility
- Fallback handling for unsupported features

## Examples

See `GlobalRouteMapExample.tsx` for comprehensive usage examples including:

- Basic route display
- Custom styling
- Interactive features
- Read-only mode
- Various configurations
