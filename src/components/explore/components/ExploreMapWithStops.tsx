"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ExploreMapGoogle, { InteractiveMapRef } from "./GoogleMapExplore";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
if (MAPBOX_ACCESS_TOKEN) {
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
}

// Google Polyline Decoder
function decodePolyline(encoded: string): [number, number][] {
  const poly: [number, number][] = [];
  let index = 0,
    len = encoded.length;
  let lat = 0,
    lng = 0;

  while (index < len) {
    let shift = 0,
      result = 0;

    do {
      let b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (result >= 0x20);

    let dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      let b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (result >= 0x20);

    let dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    poly.push([lng / 1e5, lat / 1e5] as [number, number]);
  }

  return poly;
}

// Journey stop type for map display
type JourneyStop = {
  id: number;
  title?: string;
  location_name?: string;
  lat?: string | number;
  lng?: string | number;
  notes?: string;
  transport_mode?: string;
  start_date?: string;
  end_date?: string;
  stop_category_id?: string | number;
  category?: {
    id: number;
    name: string;
  };
  media?: Array<{
    url: string;
    type: string;
  }>;
};

type ExploreMapWithStopsProps = {
  className?: string;
  activeFilter?: string;
  myAvatarUrl?: string;
  journeyStops?: JourneyStop[];
};

export type ExploreMapWithStopsRef = {
  centerMap: (lng: number, lat: number, label?: string) => void;
  fitToJourneyStops: (stops: JourneyStop[]) => void;
};

const ExploreMapWithStops = forwardRef<
  ExploreMapWithStopsRef,
  ExploreMapWithStopsProps
>(({ className, activeFilter, myAvatarUrl, journeyStops }, ref) => {
  const googleMapRef = useRef<InteractiveMapRef>(null);
  const mapboxContainerRef = useRef<HTMLDivElement>(null);
  const mapboxMapRef = useRef<mapboxgl.Map | null>(null);
  const stopMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const routeSourceRef = useRef<string | null>(null);
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [showMapbox, setShowMapbox] = useState(false);

  // Determine which map to show
  useEffect(() => {
    const hasValidStops = Boolean(
      journeyStops &&
      journeyStops.length > 0 &&
      journeyStops.some((stop) => {
        const lat = parseFloat(String(stop?.lat));
        const lng = parseFloat(String(stop.lng));
        return !isNaN(lat) && !isNaN(lng);
      })
    );

    setShowMapbox(hasValidStops);
  }, [journeyStops]);

  // Initialize Mapbox map
  useEffect(() => {
    if (!showMapbox || !mapboxContainerRef.current || mapboxMapRef.current)
      return;

    // Calculate initial center and zoom based on available stops
    let initialCenter: [number, number] = [74.3587, 31.5204]; // Default to Lahore
    let initialZoom = 10;

    if (journeyStops && journeyStops.length > 0) {
      const validStops = journeyStops.filter((stop) => {
        const lat = parseFloat(String(stop?.lat));
        const lng = parseFloat(String(stop.lng));
        return !isNaN(lat) && !isNaN(lng);
      });

      if (validStops.length > 0) {
        const lats = validStops.map((stop) => parseFloat(String(stop?.lat)));
        const lngs = validStops.map((stop) => parseFloat(String(stop.lng)));

        const avgLat = lats.reduce((sum, lat) => sum + lat, 0) / lats.length;
        const avgLng = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length;

        initialCenter = [avgLng, avgLat];
        initialZoom = validStops.length === 1 ? 12 : 8; // Zoom in more for single stop
      }
    }

    mapboxMapRef.current = new mapboxgl.Map({
      container: mapboxContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: initialCenter,
      zoom: initialZoom,
      preserveDrawingBuffer: false,
      antialias: true,
    });

    mapboxMapRef.current.on("style.load", () => {
      setStyleLoaded(true);
    });

    // Add load event listener to ensure map is fully ready
    mapboxMapRef.current.on("load", () => {
      // Fit to stops after map is fully loaded
      if (journeyStops && journeyStops.length > 0) {
        const validStops = journeyStops.filter((stop) => {
          const lat = parseFloat(String(stop?.lat));
          const lng = parseFloat(String(stop.lng));
          return !isNaN(lat) && !isNaN(lng);
        });

        if (validStops.length > 0) {
          const stopCoords: [number, number][] = validStops.map((stop) => {
            const lat = parseFloat(String(stop?.lat));
            const lng = parseFloat(String(stop.lng));
            return [lng, lat] as [number, number];
          });

          const bounds = new mapboxgl.LngLatBounds();
          stopCoords.forEach((coord) => bounds.extend(coord));

          mapboxMapRef.current!.fitBounds(bounds, {
            padding: 50,
            duration: 1000,
            maxZoom: 15,
          });
        }
      }
    });

    // Add navigation controls
    mapboxMapRef.current.addControl(
      new mapboxgl.NavigationControl(),
      "top-right"
    );

    return () => {
      if (mapboxMapRef.current) {
        mapboxMapRef.current.remove();
        mapboxMapRef.current = null;
      }
    };
  }, [showMapbox]);

  // Clear all stop markers
  const clearStopMarkers = useCallback(() => {
    stopMarkersRef.current.forEach((marker) => marker.remove());
    stopMarkersRef.current = [];
  }, []);

  // Remove route line
  const removeRouteLine = useCallback(() => {
    if (!mapboxMapRef.current || !routeSourceRef.current) return;

    if (mapboxMapRef.current.getSource(routeSourceRef.current)) {
      mapboxMapRef.current.removeLayer(`${routeSourceRef.current}-line`);
      mapboxMapRef.current.removeSource(routeSourceRef.current);
    }
    routeSourceRef.current = null;
  }, []);

  // Add route line with proper directions using Google Directions API
  const addRouteLine = useCallback(
    async (coordinates: [number, number][]) => {
      if (!mapboxMapRef.current || coordinates.length < 2) return;

      removeRouteLine();

      const sourceId = `route-${Date.now()}`;
      routeSourceRef.current = sourceId;

      try {
        // Get Google Maps API key from environment
        const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!GOOGLE_API_KEY) {
          throw new Error("Google Maps API key not found");
        }

        // Build waypoints for Google Directions API
        const origin = coordinates[0].join(",");
        const destination = coordinates[coordinates.length - 1].join(",");

        // Add waypoints if there are more than 2 coordinates
        let waypoints = "";
        if (coordinates.length > 2) {
          const intermediatePoints = coordinates
            .slice(1, -1)
            .map((coord) => coord.join(","));
          waypoints = `&waypoints=${intermediatePoints.join("|")}`;
        }

        // Get directions from Google Directions API
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}${waypoints}&key=${GOOGLE_API_KEY}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch directions from Google API");
        }

        const data = await response.json();

        if (data.status === "OK" && data.routes && data.routes.length > 0) {
          // Decode the polyline from Google's response
          const route = data.routes[0];
          const polyline = route.overview_polyline.points;

          // Decode polyline to get coordinates
          const decodedCoords = decodePolyline(polyline);

          // Convert to GeoJSON format for Mapbox
          const routeGeometry = {
            type: "Feature" as const,
            properties: {},
            geometry: {
              type: "LineString" as const,
              coordinates: decodedCoords,
            },
          };

          mapboxMapRef.current.addSource(sourceId, {
            type: "geojson",
            data: routeGeometry,
          });
        } else {
          // Fallback to straight line if no route found
          mapboxMapRef.current.addSource(sourceId, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: coordinates,
              },
            },
          });
        }

        // Add the layer with the same styling as before
        mapboxMapRef.current.addLayer({
          id: `${sourceId}-line`,
          type: "line",
          source: sourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#000000",
            "line-width": 2,
            "line-dasharray": [2, 2],
          },
        });
      } catch (error) {
        console.error("Error fetching route directions:", error);

        // Fallback to straight line on error
        mapboxMapRef.current.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coordinates,
            },
          },
        });

        mapboxMapRef.current.addLayer({
          id: `${sourceId}-line`,
          type: "line",
          source: sourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#000000",
            "line-width": 2,
            "line-dasharray": [2, 2],
          },
        });
      }
    },
    [removeRouteLine]
  );

  // Update stop markers and route
  useEffect(() => {
    if (!mapboxMapRef.current || !styleLoaded || !journeyStops) return;

    clearStopMarkers();
    removeRouteLine();

    const validStops = journeyStops.filter((stop) => {
      const lat = parseFloat(String(stop?.lat));
      const lng = parseFloat(String(stop.lng));
      return !isNaN(lat) && !isNaN(lng);
    });

    if (validStops.length === 0) return;

    const stopCoords: [number, number][] = [];

    // Create stop markers
    validStops.forEach((stop, index) => {
      const lat = parseFloat(String(stop?.lat));
      const lng = parseFloat(String(stop.lng));
      const coords: [number, number] = [lng, lat];
      stopCoords.push(coords);

      // Create numbered marker element
      const el = document.createElement("div");
      el.style.width = "40px";
      el.style.height = "40px";
      el.style.borderRadius = "50%";
      el.style.background = "linear-gradient(135deg, #9743AA 0%, #B6459F 100%)";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.color = "#fff";
      el.style.fontWeight = "bold";
      el.style.fontSize = "14px";
      el.style.border = "2px solid #fff";
      el.style.boxShadow =
        "0 2px 8px rgba(0,0,0,0.3), 0 0 0 2px rgba(151, 67, 170, 0.3)";
      el.style.zIndex = "1000";
      el.style.cursor = "pointer";
      //   el.style.transition = "all 0.2s ease";
      el.textContent = String(index + 1);

      // Create popup content
      const popupContent = document.createElement("div");
      popupContent.style.padding = "12px";
      popupContent.style.fontFamily = "Arial, sans-serif";
      popupContent.style.fontSize = "14px";
      popupContent.style.maxWidth = "250px";

      const title = document.createElement("div");
      title.style.fontWeight = "bold";
      title.style.marginBottom = "4px";
      title.textContent =
        stop.title || stop.location_name || `Stop ${index + 1}`;

      const location = document.createElement("div");
      location.style.color = "#666";
      location.style.fontSize = "12px";
      location.textContent = stop.location_name || "";

      popupContent.appendChild(title);
      if (stop.location_name && stop.location_name !== title.textContent) {
        popupContent.appendChild(location);
      }

      // Create popup
      const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
        maxWidth: "300px",
      }).setDOMContent(popupContent);

      // Create marker with popup
      const stopMarker = new mapboxgl.Marker(el)
        .setLngLat(coords)
        .setPopup(popup)
        .addTo(mapboxMapRef.current!);

      stopMarkersRef.current.push(stopMarker);
    });

    // Add route line if we have multiple stops
    if (stopCoords.length > 1) {
      addRouteLine(stopCoords).catch((error) => {
        console.error("Error adding route line:", error);
      });
    }

    // Fit map to show all stops with improved logic
    if (stopCoords.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      stopCoords.forEach((coord) => bounds.extend(coord));

      // Use a small delay to ensure the map is fully ready
      setTimeout(() => {
        if (mapboxMapRef.current && mapboxMapRef.current.isStyleLoaded()) {
          mapboxMapRef.current.fitBounds(bounds, {
            padding: 50,
            duration: 1000,
            maxZoom: 15, // Prevent over-zooming
          });
        }
      }, 100);
    }

    // Cleanup function
    return () => {
      clearStopMarkers();
      removeRouteLine();
    };
  }, [
    journeyStops,
    styleLoaded,
    clearStopMarkers,
    removeRouteLine,
    addRouteLine,
  ]);

  // Additional effect to ensure map fits to stops on initial load
  useEffect(() => {
    if (
      !mapboxMapRef.current ||
      !styleLoaded ||
      !journeyStops ||
      journeyStops.length === 0
    )
      return;

    const validStops = journeyStops.filter((stop) => {
      const lat = parseFloat(String(stop?.lat));
      const lng = parseFloat(String(stop.lng));
      return !isNaN(lat) && !isNaN(lng);
    });

    if (validStops.length === 0) return;

    const stopCoords: [number, number][] = validStops.map((stop) => {
      const lat = parseFloat(String(stop?.lat));
      const lng = parseFloat(String(stop.lng));
      return [lng, lat] as [number, number];
    });

    // Fit map to show all stops on initial load
    if (stopCoords.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      stopCoords.forEach((coord) => bounds.extend(coord));

      // Use a small delay to ensure the map is fully ready
      setTimeout(() => {
        if (mapboxMapRef.current && mapboxMapRef.current.isStyleLoaded()) {
          mapboxMapRef.current.fitBounds(bounds, {
            padding: 50,
            duration: 1000,
            maxZoom: 15, // Prevent over-zooming
          });
        }
      }, 200);
    }
  }, [styleLoaded, journeyStops]);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    centerMap: (lng: number, lat: number, label?: string) => {
      if (showMapbox && mapboxMapRef.current) {
        mapboxMapRef.current.flyTo({
          center: [lng, lat],
          zoom: 12,
          duration: 1000,
        });
      } else if (googleMapRef.current) {
        googleMapRef.current.centerMap(lng, lat, label);
      }
    },
    fitToJourneyStops: (stops: JourneyStop[]) => {
      if (!showMapbox || !mapboxMapRef.current || !stops.length) return;

      const validStops = stops
        .map((stop) => {
          const lat = parseFloat(String(stop?.lat));
          const lng = parseFloat(String(stop.lng));
          return isNaN(lat) || isNaN(lng)
            ? null
            : ([lng, lat] as [number, number]);
        })
        .filter((point) => point !== null) as [number, number][];

      if (validStops.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        validStops.forEach((point) => bounds.extend(point));

        mapboxMapRef.current.fitBounds(bounds, {
          padding: 50,
          duration: 1000,
        });
      }
    },
  }));

  if (showMapbox) {
    return (
      <div className={className} style={{ position: "relative" }}>
        <div ref={mapboxContainerRef} className="h-full w-full" />

        {!styleLoaded && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-gray-500">Loading map...</div>
          </div>
        )}
      </div>
    );
  }

  // Show Google Maps for general use
  return (
    <ExploreMapGoogle
      ref={googleMapRef}
      className={className}
      activeFilter={activeFilter}
      myAvatarUrl={myAvatarUrl}
    />
  );
});

ExploreMapWithStops.displayName = "ExploreMapWithStops";
export default ExploreMapWithStops;
