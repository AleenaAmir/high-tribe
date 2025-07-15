import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

interface FootprintMapProps {
  location: {
    coords: [number, number] | null;
    name: string;
  };
  onLocationSelect?: (coords: [number, number]) => void;
}

function getUserInfo() {
  if (typeof window === "undefined") return { name: "U", avatar: null };
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return {
        name: user.name || "U",
        avatar: user.avatar || null,
      };
    }
  } catch (e) {}
  return { name: "U", avatar: null };
}

const FootprintMap: React.FC<FootprintMapProps> = ({
  location,
  onLocationSelect,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    avatar: string | null;
  }>({ name: "U", avatar: null });

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
    // Add click handler
    map.current.on("click", (e) => {
      if (onLocationSelect) {
        onLocationSelect([e.lngLat.lng, e.lngLat.lat]);
      }
    });
  }, []);

  // Get user info from localStorage
  useEffect(() => {
    setUserInfo(getUserInfo());
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
      if (userInfo.avatar) {
        el = document.createElement("div");
        el.style.width = "36px";
        el.style.height = "36px";
        el.style.borderRadius = "50%";
        el.style.overflow = "hidden";
        el.style.border = "2px solid #fff";
        el.style.boxShadow = "0 0 4px rgba(0,0,0,0.3)";
        el.innerHTML = `<img src='${userInfo.avatar}' style='width:100%;height:100%;object-fit:cover;border-radius:50%;' alt='User' />`;
      } else {
        el = document.createElement("div");
        el.style.width = "36px";
        el.style.height = "36px";
        el.style.borderRadius = "50%";
        el.style.background = "#ef4444";
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
        zoom: 12,
        duration: 2000,
      });
    }
  }, [location.coords, styleLoaded, userInfo]);

  return (
    <div className="h-full w-full relative">
      <div
        ref={mapContainer}
        className="h-full w-full rounded-r-[20px] overflow-hidden"
      />
      {!styleLoaded && (
        <div className="absolute inset-0 bg-gray-100 rounded-r-[20px] flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin mb-2"></div>
            <p className="text-sm">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FootprintMap;
