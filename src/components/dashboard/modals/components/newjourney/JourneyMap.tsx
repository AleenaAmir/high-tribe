import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import mapboxgl from "mapbox-gl";
import { MapSkeleton } from "../../../../global/LoadingSkeleton";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

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

// Check if Mapbox token is available
if (!MAPBOX_ACCESS_TOKEN) {
  console.error(
    "❌ MAPBOX_ACCESS_TOKEN is not set! Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your environment variables."
  );
} else {
  console.log("✅ Mapbox access token is configured");
}

// Helper for reverse geocoding
async function reverseGeocode(lng: number, lat: number): Promise<string> {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.features && data.features.length > 0) {
    return data.features[0].place_name;
  }
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

// Helper to fetch driving route from Mapbox Directions API
async function fetchDrivingRoute(
  start: LatLng,
  end: LatLng
): Promise<LatLng[]> {
  try {
    const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`;
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

// Helper to fetch complete route through all points
async function fetchCompleteRoute(points: LatLng[]): Promise<LatLng[]> {
  if (points.length < 2) return [];

  try {
    // Create waypoints string for the API
    const waypoints = points
      .map((point) => `${point[0]},${point[1]}`)
      .join(";");
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;

    console.log("🔍 Fetching complete route from:", url);
    console.log("📍 Points:", points);

    const response = await fetch(url);
    const data = await response.json();

    console.log("📡 API Response:", data);

    if (data.routes && data.routes.length > 0) {
      // Extract coordinates from the GeoJSON geometry
      const coordinates = data.routes[0].geometry.coordinates;
      console.log("✅ Extracted route coordinates:", coordinates.length);
      return coordinates as LatLng[];
    }

    console.log("⚠️ No routes found in API response, using fallback");
    // Fallback: create route by connecting points with straight lines
    const fallbackRoute: LatLng[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      fallbackRoute.push(points[i], points[i + 1]);
    }
    return fallbackRoute;
  } catch (error) {
    console.error("❌ Error fetching complete route:", error);
    // Fallback: create route by connecting points with straight lines
    const fallbackRoute: LatLng[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      fallbackRoute.push(points[i], points[i + 1]);
    }
    return fallbackRoute;
  }
}

// Types
export type LatLng = [number, number];

interface JourneyMapProps {
  startLocation: LatLng | null;
  endLocation: LatLng | null;
  steps: LatLng[];
  onStartChange: (loc: LatLng) => void;
  onEndChange: (loc: LatLng) => void;
  onStepsChange: (locs: LatLng[]) => void;
  activeMapSelect?: "start" | "end";
  setActiveMapSelect: (select: "start" | "end") => void;
}

const markerColors = {
  start: "#22c55e", // green
  end: "#ef4444", // red
  step: "#2563eb", // blue
};

// Helper to create a colored dot marker
function createDotMarker(color: string) {
  const el = document.createElement("div");
  el.style.width = "16px";
  el.style.height = "16px";
  el.style.background = color;
  el.style.borderRadius = "50%";

  el.style.boxShadow = "0 0 4px rgba(0,0,0,0.2)";
  return el;
}

// Helper to create a user placeholder marker
function createUserMarker() {
  const el = document.createElement("div");
  el.style.width = "28px";
  el.style.height = "28px";
  el.style.borderRadius = "50%";
  el.style.border = "2px solid #ffffff"; // blue border
  el.style.background = "#fff";
  el.style.overflow = "hidden";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  // Use a generic user SVG or emoji as placeholder
  el.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="7" r="4" fill="#2563eb"/><ellipse cx="10" cy="15.5" rx="6" ry="3.5" fill="#2563eb" fill-opacity="0.3"/></svg>`;
  return el;
}

const JourneyMap = forwardRef<any, JourneyMapProps>(
  (
    {
      startLocation,
      endLocation,
      steps,
      onStartChange,
      onEndChange,
      onStepsChange,
      activeMapSelect,
      setActiveMapSelect,
    },
    ref
  ) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markers = useRef<mapboxgl.Marker[]>([]);
    const [styleLoaded, setStyleLoaded] = useState(false);
    const [completeRoute, setCompleteRoute] = useState<LatLng[]>([]);
    const [isLoadingRoute, setIsLoadingRoute] = useState(false);
    const [shouldRedraw, setShouldRedraw] = useState(false); // force redraw after style loads
    const activeMapSelectRef = useRef(activeMapSelect);
    const debouncedFetchRoute = useRef<((allPoints: LatLng[]) => void) | null>(
      null
    );

    // Update ref when activeMapSelect changes
    useEffect(() => {
      activeMapSelectRef.current = activeMapSelect;
    }, [activeMapSelect]);

    // Expose flyTo method to parent
    useImperativeHandle(ref, () => ({
      flyTo: (opts: { center: [number, number]; zoom?: number }) => {
        if (map.current) {
          map.current.flyTo({ center: opts.center, zoom: opts.zoom || 4 });
        }
      },
    }));
    // Debounced route fetching
    useEffect(() => {
      debouncedFetchRoute.current = debounce(async (allPoints) => {
        setIsLoadingRoute(true);
        try {
          const route = await fetchCompleteRoute(allPoints);
          setCompleteRoute(route);
          setShouldRedraw(true);
          setTimeout(() => fitMapToRoute(route), 100);
        } catch (error) {
          const fallbackRoute = allPoints;
          setCompleteRoute(fallbackRoute);
          setShouldRedraw(true);
        } finally {
          setIsLoadingRoute(false);
        }
      }, 400);
    }, []);

    // Only fetch route if all points are valid
    useEffect(() => {
      // Only fetch route if start, end, and all steps are valid [lng, lat] arrays
      const isValidPoint = (pt: any): pt is LatLng =>
        Array.isArray(pt) && pt.length === 2 && pt.every(Number.isFinite);
      if (
        isValidPoint(startLocation) &&
        isValidPoint(endLocation) &&
        steps.every(isValidPoint)
      ) {
        const allPoints = [startLocation, ...steps, endLocation];
        if (debouncedFetchRoute.current) debouncedFetchRoute.current(allPoints);
      } else {
        setCompleteRoute([]); // clear route if not all points are valid
        setShouldRedraw(true);
      }
    }, [startLocation, endLocation, steps]);

    // Helper: check if a point is between start and end (simple bounding box for now)
    function isBetweenStartEnd(point: LatLng): boolean {
      if (!startLocation || !endLocation) return false;
      const [x1, y1] = startLocation;
      const [x2, y2] = endLocation;
      const [px, py] = point;
      const minX = Math.min(x1, x2),
        maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2),
        maxY = Math.max(y1, y2);
      return px >= minX && px <= maxX && py >= minY && py <= maxY;
    }

    // Fly to location on map
    function flyToOnMap(lng: number, lat: number) {
      if (map.current && map.current.flyTo) {
        map.current.flyTo({ center: [lng, lat], zoom: 4 });
      }
    }

    // Fit map to route bounds
    function fitMapToRoute(route: LatLng[]) {
      if (!map.current || route.length === 0) return;

      const bounds = new mapboxgl.LngLatBounds();
      route.forEach((coord) => {
        bounds.extend(coord);
      });

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
    }

    // Map click handler - using ref to avoid stale closure
    const handleMapClick = async (e: mapboxgl.MapMouseEvent) => {
      const currentActiveMapSelect = activeMapSelectRef.current;
      if (!currentActiveMapSelect) return;

      const clickedPoint: LatLng = [e.lngLat.lng, e.lngLat?.lat];

      console.log("Map clicked, activeMapSelect:", currentActiveMapSelect);

      if (currentActiveMapSelect === "start") {
        console.log("Setting start location and switching to end");
        onStartChange(clickedPoint);
        console.log('Calling setActiveMapSelect("end")');
        setActiveMapSelect("end");
      } else if (currentActiveMapSelect === "end") {
        console.log("Setting end location and switching to start");
        onEndChange(clickedPoint);
        console.log('Calling setActiveMapSelect("start")');
        setActiveMapSelect("start");
      }

      // Fly to the clicked location
      flyToOnMap(e.lngLat.lng, e.lngLat?.lat);
    };

    // Initialize map
    useEffect(() => {
      if (!mapContainer.current || map.current) return;
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [69.2, 41.3],
        zoom: 4,
        preserveDrawingBuffer: false,
        antialias: false,
      });
      map.current.on("style.load", () => {
        setStyleLoaded(true);
        setShouldRedraw(true);
      });
      map.current.on("click", handleMapClick);
    }, []);

    // Redraw route/markers after style loads or route changes
    useEffect(() => {
      if (!map.current || !styleLoaded) return;
      if (!shouldRedraw) return;
      setShouldRedraw(false);
      // Remove old markers
      markers.current.forEach((m) => m.remove());
      markers.current = [];
      // Show start marker if valid
      if (
        Array.isArray(startLocation) &&
        startLocation.length === 2 &&
        startLocation.every(Number.isFinite)
      ) {
        const marker = new mapboxgl.Marker({
          element: createDotMarker("#22c55e"),
        }) // green
          .setLngLat(startLocation)
          .addTo(map.current);
        markers.current.push(marker);
      }
      // Show end marker if valid
      if (
        Array.isArray(endLocation) &&
        endLocation.length === 2 &&
        endLocation.every(Number.isFinite)
      ) {
        const marker = new mapboxgl.Marker({
          element: createDotMarker("#ef4444"),
        }) // red
          .setLngLat(endLocation)
          .addTo(map.current);
        markers.current.push(marker);
      }
      // Show step markers for valid steps
      steps.forEach((loc, index) => {
        if (
          Array.isArray(loc) &&
          loc.length === 2 &&
          loc.every(Number.isFinite)
        ) {
          const marker = new mapboxgl.Marker({ element: createUserMarker() })
            .setLngLat(loc)
            .addTo(map.current!);
          markers.current.push(marker);
        }
      });
      // Draw complete route if available
      if (completeRoute.length > 0) {
        try {
          if (map.current.getSource("route")) {
            (map.current.getSource("route") as mapboxgl.GeoJSONSource).setData({
              type: "Feature",
              properties: {},
              geometry: { type: "LineString", coordinates: completeRoute },
            });
          } else {
            map.current.addSource("route", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: { type: "LineString", coordinates: completeRoute },
              },
            });
            map.current.addLayer({
              id: "route",
              type: "line",
              source: "route",
              layout: { "line-join": "round", "line-cap": "round" },
              paint: {
                "line-color": "#000000",
                "line-width": 4,
                "line-opacity": 1,
                "line-dasharray": [2, 2],
              },
            });
          }
          if (map.current.getLayer("route")) {
            map.current.moveLayer("route");
          }
        } catch (error) {
          console.error("💥 Error drawing route:", error);
        }
      } else {
        // Remove route layer/source if present
        if (map.current.getLayer("route")) {
          map.current.removeLayer("route");
        }
        if (map.current.getSource("route")) {
          map.current.removeSource("route");
        }
      }
    }, [
      styleLoaded,
      shouldRedraw,
      completeRoute,
      startLocation,
      endLocation,
      steps,
    ]);

    // Show loading overlay while fetching route or waiting for style
    const showLoading = isLoadingRoute || !styleLoaded;

    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div
          ref={mapContainer}
          style={{
            width: "100%",
            height: "100%",
            minHeight: 400,
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
            overflow: "hidden",
            position: "relative",
            zIndex: 1,
          }}
        />
        {showLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 10,
            }}
          >
            <MapSkeleton height="h-full" />
          </div>
        )}
      </div>
    );
  }
);

export default JourneyMap;
