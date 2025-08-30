import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import mapboxgl from "mapbox-gl";
import { MapSkeleton } from "./LoadingSkeleton";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

// Check if Mapbox token is available
if (!MAPBOX_ACCESS_TOKEN) {
  console.error(
    "❌ MAPBOX_ACCESS_TOKEN is not set! Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your environment variables."
  );
} else {
  console.log("✅ Mapbox access token is configured");
}

// Debounce utility
function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Types
export type LatLng = [number, number];

export interface RoutePoint {
  id?: string | number;
  coords: LatLng;
  name?: string;
  color?: string;
  icon?: string;
  metadata?: Record<string, any>;
}

export interface RouteSegment {
  from: LatLng;
  to: LatLng;
  color?: string;
  width?: number;
  style?: "solid" | "dashed" | "dotted";
}

export interface GlobalRouteMapProps {
  // Route configuration
  startPoint?: RoutePoint;
  endPoint?: RoutePoint;
  waypoints?: RoutePoint[];
  segments?: RouteSegment[];

  // Map configuration
  center?: LatLng;
  zoom?: number;
  style?: string;

  // Interaction options
  interactive?: boolean;
  onPointClick?: (point: RoutePoint, index: number) => void;
  onMapClick?: (coords: LatLng) => void;

  // Display options
  showMarkers?: boolean;
  showRoute?: boolean;
  autoFitBounds?: boolean;
  showRouteInfo?: boolean;

  // Customization
  markerSize?: number;
  routeColor?: string;
  routeWidth?: number;
  routeStyle?: "solid" | "dashed" | "dotted";

  // Loading and error handling
  onRouteLoad?: (route: LatLng[]) => void;
  onError?: (error: Error) => void;

  // Container styling
  className?: string;
  height?: string;
  width?: string;
}

// Helper to fetch driving route from Mapbox Directions API
async function fetchDrivingRoute(
  start: LatLng,
  end: LatLng,
  waypoints: LatLng[] = []
): Promise<LatLng[]> {
  try {
    const allPoints = [start, ...waypoints, end];
    const coordinates = allPoints
      .map((point) => `${point[0]},${point[1]}`)
      .join(";");

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      // Extract coordinates from the GeoJSON geometry
      const coordinates = data.routes[0].geometry.coordinates;
      return coordinates as LatLng[];
    }

    // Fallback to straight line if no route found
    return [start, end];
  } catch (error) {
    console.error("Error fetching driving route:", error);
    // Fallback to straight line
    return [start, end];
  }
}

// Helper to create a colored dot marker
function createDotMarker(color: string, size: number = 16) {
  const el = document.createElement("div");
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.background = color;
  el.style.borderRadius = "50%";
  el.style.boxShadow = "0 0 4px rgba(0,0,0,0.2)";
  el.style.border = "2px solid white";
  return el;
}

// Helper to create a custom icon marker
function createIconMarker(iconUrl: string, size: number = 32) {
  const el = document.createElement("div");
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = "50%";
  el.style.border = "2px solid white";
  el.style.background = `url(${iconUrl}) center/cover`;
  el.style.boxShadow = "0 0 4px rgba(0,0,0,0.2)";
  return el;
}

const GlobalRouteMap = forwardRef<any, GlobalRouteMapProps>(
  (
    {
      startPoint,
      endPoint,
      waypoints = [],
      segments = [],
      center = [69.2, 41.3],
      zoom = 4,
      style = "mapbox://styles/mapbox/streets-v12",
      interactive = true,
      onPointClick,
      onMapClick,
      showMarkers = true,
      showRoute = true,
      autoFitBounds = true,
      showRouteInfo = false,
      markerSize = 16,
      routeColor = "#2563eb",
      routeWidth = 4,
      routeStyle = "solid",
      onRouteLoad,
      onError,
      className = "",
      height = "400px",
      width = "100%",
    },
    ref
  ) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markers = useRef<mapboxgl.Marker[]>([]);
    const [styleLoaded, setStyleLoaded] = useState(false);
    const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
    const [isLoadingRoute, setIsLoadingRoute] = useState(false);
    const [shouldRedraw, setShouldRedraw] = useState(false);
    const [routeInfo, setRouteInfo] = useState<{
      distance?: number;
      duration?: number;
    }>({});

    // Debounced route fetching
    const debouncedFetchRoute = useRef<((points: LatLng[]) => void) | null>(
      null
    );

    useEffect(() => {
      debouncedFetchRoute.current = debounce(async (points) => {
        if (points.length < 2) return;

        setIsLoadingRoute(true);
        try {
          const route = await fetchDrivingRoute(
            points[0],
            points[points.length - 1],
            points.slice(1, -1)
          );
          setRouteCoordinates(route);
          setShouldRedraw(true);

          if (onRouteLoad) {
            onRouteLoad(route);
          }

          // Calculate route info (simplified)
          if (route.length > 1) {
            let totalDistance = 0;
            for (let i = 1; i < route.length; i++) {
              const [lng1, lat1] = route[i - 1];
              const [lng2, lat2] = route[i];
              const R = 6371; // Earth's radius in km
              const dLat = ((lat2 - lat1) * Math.PI) / 180;
              const dLng = ((lng2 - lng1) * Math.PI) / 180;
              const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((lat1 * Math.PI) / 180) *
                  Math.cos((lat2 * Math.PI) / 180) *
                  Math.sin(dLng / 2) *
                  Math.sin(dLng / 2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              totalDistance += R * c;
            }
            setRouteInfo({ distance: totalDistance });
          }
        } catch (error) {
          console.error("Error fetching route:", error);
          if (onError) {
            onError(error as Error);
          }
        } finally {
          setIsLoadingRoute(false);
        }
      }, 400);
    }, [onRouteLoad, onError]);

    // Fetch route when points change
    useEffect(() => {
      const allPoints: LatLng[] = [];

      if (startPoint?.coords) allPoints.push(startPoint.coords);
      waypoints.forEach((point) => {
        if (point.coords) allPoints.push(point.coords);
      });
      if (endPoint?.coords) allPoints.push(endPoint.coords);

      if (allPoints.length >= 2 && debouncedFetchRoute.current) {
        debouncedFetchRoute.current(allPoints);
      } else {
        setRouteCoordinates([]);
        setRouteInfo({});
      }
    }, [startPoint, endPoint, waypoints]);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      flyTo: (opts: { center: LatLng; zoom?: number }) => {
        if (map.current) {
          map.current.flyTo({ center: opts.center, zoom: opts.zoom || zoom });
        }
      },
      fitBounds: (bounds: [LatLng, LatLng]) => {
        if (map.current) {
          const mapboxBounds = new mapboxgl.LngLatBounds();
          bounds.forEach((coord) => mapboxBounds.extend(coord));
          map.current.fitBounds(mapboxBounds, { padding: 50 });
        }
      },
      getMap: () => map.current,
    }));

    // Initialize map
    useEffect(() => {
      if (!mapContainer.current || map.current) return;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style,
        center,
        zoom,
        preserveDrawingBuffer: false,
        antialias: false,
        interactive,
      });

      map.current.on("style.load", () => {
        setStyleLoaded(true);
        setShouldRedraw(true);
      });

      if (onMapClick) {
        map.current.on("click", (e) => {
          onMapClick([e.lngLat?.lng, e.lngLat?.lat]);
        });
      }
    }, [style, center, zoom, interactive, onMapClick]);

    // Fit map to bounds when autoFitBounds is enabled
    const fitMapToBounds = useCallback(() => {
      if (!map.current || !autoFitBounds) return;

      const bounds = new mapboxgl.LngLatBounds();
      let hasPoints = false;

      if (startPoint?.coords) {
        bounds.extend(startPoint.coords);
        hasPoints = true;
      }

      waypoints.forEach((point) => {
        if (point.coords) {
          bounds.extend(point.coords);
          hasPoints = true;
        }
      });

      if (endPoint?.coords) {
        bounds.extend(endPoint.coords);
        hasPoints = true;
      }

      if (hasPoints) {
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
        });
      }
    }, [startPoint, endPoint, waypoints, autoFitBounds]);

    // Redraw markers and route
    useEffect(() => {
      if (!map.current || !styleLoaded || !shouldRedraw) return;

      setShouldRedraw(false);

      // Remove old markers
      markers.current.forEach((m) => m.remove());
      markers.current = [];

      // Add markers
      if (showMarkers) {
        const allPoints = [
          { point: startPoint, index: 0, type: "start" },
          ...waypoints.map((point, index) => ({
            point,
            index: index + 1,
            type: "waypoint",
          })),
          { point: endPoint, index: waypoints.length + 1, type: "end" },
        ];

        allPoints.forEach(({ point, index, type }) => {
          if (!point?.coords) return;

          let markerElement: HTMLElement;

          if (point.icon) {
            markerElement = createIconMarker(point.icon, markerSize);
          } else {
            const color =
              point.color ||
              (type === "start"
                ? "#22c55e"
                : type === "end"
                ? "#ef4444"
                : "#2563eb");
            markerElement = createDotMarker(color, markerSize);
          }

          const marker = new mapboxgl.Marker({
            element: markerElement,
          })
            .setLngLat(point.coords)
            .addTo(map.current!);

          if (onPointClick) {
            marker.getElement().addEventListener("click", () => {
              onPointClick(point, index);
            });
          }

          markers.current.push(marker);
        });
      }

      // Draw route
      if (showRoute && routeCoordinates.length > 0) {
        try {
          const routeSourceId = "route-source";
          const routeLayerId = "route-layer";

          // Remove existing route
          if (map.current.getLayer(routeLayerId)) {
            map.current.removeLayer(routeLayerId);
          }
          if (map.current.getSource(routeSourceId)) {
            map.current.removeSource(routeSourceId);
          }

          // Add new route
          map.current.addSource(routeSourceId, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: routeCoordinates,
              },
            },
          });

          const dashArray =
            routeStyle === "dashed"
              ? [2, 2]
              : routeStyle === "dotted"
              ? [1, 1]
              : null;

          map.current.addLayer({
            id: routeLayerId,
            type: "line",
            source: routeSourceId,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": routeColor,
              "line-width": routeWidth,
              "line-opacity": 1,
              ...(dashArray && { "line-dasharray": dashArray }),
            },
          });
        } catch (error) {
          console.error("Error drawing route:", error);
        }
      }

      // Fit bounds after drawing
      setTimeout(fitMapToBounds, 100);
    }, [
      styleLoaded,
      shouldRedraw,
      startPoint,
      endPoint,
      waypoints,
      showMarkers,
      showRoute,
      routeCoordinates,
      markerSize,
      routeColor,
      routeWidth,
      routeStyle,
      onPointClick,
      fitMapToBounds,
    ]);

    const showLoading = isLoadingRoute || !styleLoaded;

    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        <div
          ref={mapContainer}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        />

        {showLoading && (
          <div className="absolute inset-0 z-10">
            <MapSkeleton height="h-full" />
          </div>
        )}

        {showRouteInfo && routeInfo.distance && (
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-20">
            <div className="text-sm font-medium text-gray-900">
              Distance: {routeInfo.distance.toFixed(1)} km
            </div>
            {routeInfo.duration && (
              <div className="text-sm text-gray-600">
                Duration: {Math.round(routeInfo.duration / 60)} min
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

GlobalRouteMap.displayName = "GlobalRouteMap";

export default GlobalRouteMap;
