import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { MapSkeleton } from "./LoadingSkeleton";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

interface LocationMapProps {
  location: {
    coords: [number, number] | null;
    name: string;
  };
  onLocationSelect?: (coords: [number, number], name: string) => void;
  markerColor?: string; // e.g. "#22c55e"
  markerIconUrl?: string; // optional avatar/icon url
}

// Get user info from localStorage
function getUserInfo() {
  //   if (typeof window === "undefined") return { name: "U", avatar: null };
  try {
    if (typeof window !== 'undefined') {
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
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
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

  // Update marker when location changes
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
