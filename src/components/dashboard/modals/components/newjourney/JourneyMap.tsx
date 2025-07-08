import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

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
    const activeMapSelectRef = useRef(activeMapSelect);

    // Update ref when activeMapSelect changes
    useEffect(() => {
      activeMapSelectRef.current = activeMapSelect;
    }, [activeMapSelect]);

    // Expose flyTo method to parent
    useImperativeHandle(ref, () => ({
      flyTo: (opts: { center: [number, number]; zoom?: number }) => {
        if (map.current) {
          map.current.flyTo({ center: opts.center, zoom: opts.zoom || 10 });
        }
      },
    }));

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

    // Map click handler - using ref to avoid stale closure
    const handleMapClick = async (e: mapboxgl.MapMouseEvent) => {
      const currentActiveMapSelect = activeMapSelectRef.current;
      if (!currentActiveMapSelect) return;

      const clickedPoint: LatLng = [e.lngLat.lng, e.lngLat.lat];

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
      flyToOnMap(e.lngLat.lng, e.lngLat.lat);
    };

    // Initialize map
    useEffect(() => {
      if (!mapContainer.current || map.current) return;
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/standard",
        center: [69.2, 41.3], // Central Asia default
        zoom: 2,
        preserveDrawingBuffer: false,
        antialias: false,
      });
      // map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Listen for style.load event
      map.current.on("style.load", () => {
        setStyleLoaded(true);
      });

      // Register click handler once
      map.current.on("click", handleMapClick);
    }, []); // Empty dependency array - only run once

    // Update markers and route line
    useEffect(() => {
      if (!map.current || !styleLoaded) return;
      // Remove old markers
      markers.current.forEach((m) => m.remove());
      markers.current = [];
      // Add start marker
      if (startLocation) {
        const marker = new mapboxgl.Marker({ color: markerColors.start })
          .setLngLat(startLocation)
          .addTo(map.current);
        markers.current.push(marker);
      }
      // Add end marker
      if (endLocation) {
        const marker = new mapboxgl.Marker({ color: markerColors.end })
          .setLngLat(endLocation)
          .addTo(map.current);
        markers.current.push(marker);
      }
      // Add step markers
      steps.forEach((loc) => {
        const marker = new mapboxgl.Marker({ color: markerColors.step })
          .setLngLat(loc)
          .addTo(map.current!);
        markers.current.push(marker);
      });
      // Draw route line
      const route = [
        ...(startLocation ? [startLocation] : []),
        ...steps,
        ...(endLocation ? [endLocation] : []),
      ];
      if (map.current.getSource("route")) {
        (map.current.getSource("route") as mapboxgl.GeoJSONSource).setData({
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: route },
        });
      } else {
        map.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: route },
          },
        });
        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": "#000",
            "line-width": 4,
            "line-dasharray": [2, 2],
            "line-opacity": 1,
          },
        });
      }
    }, [startLocation, endLocation, steps, styleLoaded]);

    return (
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
    );
  }
);

export default JourneyMap;
