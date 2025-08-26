import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { MapSkeleton } from "./LoadingSkeleton";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

interface Stop {
  id: number;
  title?: string;
  location_name?: string;
  lat?: string | number;
  lng?: string | number;
  date?: string;
  end_date?: string;
}

interface LocationMapProps {
  location: {
    coords: [number, number] | null;
    name: string;
  };
  onLocationSelect?: (coords: [number, number], name: string) => void;
  markerColor?: string; // e.g. "#22c55e"
  markerIconUrl?: string; // optional avatar/icon url
  stops?: Stop[]; // Array of stops to display on the map
  showRoute?: boolean; // Whether to show the route line connecting stops
}

// Get user info from localStorage
function getUserInfo() {
  try {
    if (typeof window !== "undefined") {
      const userName = localStorage.getItem("name");
      console.log("User name from localStorage:", userName);
      if (userName) {
        return {
          name: userName,
          avatar: null,
        };
      }
    }
  } catch (e) {
    console.log(e);
  }
  return { name: "U", avatar: null };
}

// Reverse geocoding function
const reverseGeocode = async (coords: [number, number]): Promise<string> => {
  try {
    const [lng, lat] = coords;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      return data.features[0].place_name;
    }
  } catch (error) {
    console.error("Error reverse geocoding:", error);
  }
  return "";
};

const LocationMap: React.FC<LocationMapProps> = ({
  location,
  onLocationSelect,
  markerColor = "#22c55e",
  markerIconUrl,
  stops = [],
  showRoute = true,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const stopMarkers = useRef<mapboxgl.Marker[]>([]);
  const routeSource = useRef<string | null>(null);
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    avatar: string | null;
  }>({ name: "U", avatar: null });

  // Get user info from localStorage
  useEffect(() => {
    setUserInfo(getUserInfo());
  }, []);

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
    });
    // Add click handler with reverse geocoding
    map.current.on("click", async (e) => {
      if (onLocationSelect) {
        const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
        const locationName = await reverseGeocode(coords);
        onLocationSelect(coords, locationName);
      }
    });
  }, []);

  // Clear all stop markers
  const clearStopMarkers = () => {
    stopMarkers.current.forEach((marker) => marker.remove());
    stopMarkers.current = [];
  };

  // Remove route line
  const removeRouteLine = () => {
    if (map.current && routeSource.current) {
      if (map.current.getLayer("route-line")) {
        map.current.removeLayer("route-line");
      }
      if (map.current.getSource(routeSource.current)) {
        map.current.removeSource(routeSource.current);
      }
      routeSource.current = null;
    }
  };

  // Add route line connecting stops
  const addRouteLine = (stopCoords: [number, number][]) => {
    if (!map.current || !styleLoaded || stopCoords.length < 2 || !showRoute)
      return;

    // Remove existing route
    removeRouteLine();

    const sourceId = `route-${Date.now()}`;
    routeSource.current = sourceId;

    // Add route source
    map.current.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: stopCoords,
        },
      },
    });

    // Add route layer
    map.current.addLayer({
      id: "route-line",
      type: "line",
      source: sourceId,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#000000",
        "line-width": 3,
        "line-dasharray": [2, 2], // Dashed line
      },
    });
  };

  // Update stop markers and route
  useEffect(() => {
    if (!map.current || !styleLoaded) return;

    console.log("LocationMap: Updating stops, total stops:", stops.length);
    console.log("LocationMap: Stops data:", stops);

    // Clear existing stop markers
    clearStopMarkers();

    // Filter stops with valid coordinates
    const validStops = stops.filter(
      (stop) =>
        stop.lat &&
        stop.lng &&
        !isNaN(parseFloat(String(stop.lat))) &&
        !isNaN(parseFloat(String(stop.lng)))
    );

    console.log(
      "LocationMap: Valid stops with coordinates:",
      validStops.length
    );
    console.log("LocationMap: Valid stops data:", validStops);

    if (validStops.length === 0) {
      console.log("LocationMap: No valid stops to display");
      return;
    }

    const stopCoords: [number, number][] = [];

    // Create stop markers
    validStops.forEach((stop, index) => {
      const lat = parseFloat(String(stop.lat));
      const lng = parseFloat(String(stop.lng));
      const coords: [number, number] = [lng, lat];
      stopCoords.push(coords);

      console.log(
        `LocationMap: Creating marker ${index + 1} at coordinates:`,
        coords
      );

      // Create numbered marker element
      const el = document.createElement("div");
      el.style.width = "32px";
      el.style.height = "32px";
      el.style.borderRadius = "50%";
      el.style.background = "#9743AA"; // Purple color like in the image
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.color = "#fff";
      el.style.fontWeight = "bold";
      el.style.fontSize = "14px";
      el.style.border = "2px solid #fff";
      el.style.boxShadow =
        "0 2px 8px rgba(0,0,0,0.3), 0 0 0 2px rgba(151, 67, 170, 0.3)"; // Added glow effect
      el.style.zIndex = "1000";
      el.style.cursor = "pointer";
      el.style.transition = "all 0.2s ease";
      el.textContent = String(index + 1);

      // Add hover effect
      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.1)";
        el.style.boxShadow =
          "0 4px 12px rgba(0,0,0,0.4), 0 0 0 3px rgba(151, 67, 170, 0.4)";
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
        el.style.boxShadow =
          "0 2px 8px rgba(0,0,0,0.3), 0 0 0 2px rgba(151, 67, 170, 0.3)";
      });

      // Create popup content
      const popupContent = document.createElement("div");
      popupContent.style.padding = "8px";
      popupContent.style.fontFamily = "Arial, sans-serif";
      popupContent.style.fontSize = "14px";
      popupContent.style.maxWidth = "200px";

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
        .addTo(map.current!);

      stopMarkers.current.push(stopMarker);
    });

    // Add route line if we have multiple stops
    if (stopCoords.length > 1) {
      addRouteLine(stopCoords);
    }

    // Fit map to show all stops
    if (stopCoords.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      stopCoords.forEach((coord) => bounds.extend(coord));

      map.current.fitBounds(bounds, {
        padding: 50,
        duration: 1000,
      });
    }

    // Cleanup function
    return () => {
      clearStopMarkers();
      removeRouteLine();
    };
  }, [stops, styleLoaded, showRoute]);

  // Update single location marker when location changes
  useEffect(() => {
    if (!map.current || !styleLoaded) return;
    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }
    if (location.coords) {
      let el: HTMLDivElement;
      if (markerIconUrl) {
        el = document.createElement("div");
        el.style.width = "36px";
        el.style.height = "36px";
        el.style.borderRadius = "50%";
        el.style.overflow = "hidden";
        el.style.border = "2px solid #fff";
        el.style.boxShadow = "0 0 4px rgba(0,0,0,0.3)";
        el.innerHTML = `<img src='${markerIconUrl}' style='width:100%;height:100%;object-fit:cover;border-radius:50%;' alt='Marker' />`;
      } else {
        el = document.createElement("div");
        el.style.width = "36px";
        el.style.height = "36px";
        el.style.borderRadius = "50%";
        el.style.background = markerColor;
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.color = "#fff";
        el.style.fontWeight = "bold";
        el.style.fontSize = "18px";
        el.style.border = "2px solid #fff";
        el.style.boxShadow = "0 0 4px rgba(0,0,0,0.3)";
        el.textContent = userInfo.name.charAt(0).toUpperCase();
      }
      marker.current = new mapboxgl.Marker(el)
        .setLngLat(location.coords)
        .addTo(map.current!);
      map.current.flyTo({
        center: location.coords,
        zoom: 5,
        duration: 2000,
      });
    }
  }, [location.coords, styleLoaded, markerIconUrl, markerColor, userInfo]);

  return (
    <div className="h-full w-full relative">
      <div
        ref={mapContainer}
        className="h-full w-full rounded-r-[20px] overflow-hidden"
      />
      {!styleLoaded && (
        <div className="absolute inset-0 rounded-r-[20px]">
          <MapSkeleton height="h-full" />
        </div>
      )}
    </div>
  );
};

export default LocationMap;
