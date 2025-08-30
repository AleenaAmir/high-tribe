"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import mapboxgl from "mapbox-gl";
import { MapSkeleton } from "../../../global/LoadingSkeleton";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

export interface SitesLocationMapRef {
  centerMap: (lng: number, lat: number, placeName?: string) => void;
  addMarker: (lng: number, lat: number, placeName?: string) => void;
  removeMarker: () => void;
}

interface SitesLocationMapProps {
  onLocationSelect?: (coords: [number, number], placeName: string) => void;
  selectedLocation?: {
    coords: [number, number] | null;
    name: string;
  };
  className?: string;
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
  return "Unknown Location";
};

const SitesLocationMap = React.memo(
  forwardRef<SitesLocationMapRef, SitesLocationMapProps>(
    ({ onLocationSelect, selectedLocation, className = "" }, ref) => {
      const mapContainer = useRef<HTMLDivElement>(null);
      const map = useRef<mapboxgl.Map | null>(null);
      const marker = useRef<mapboxgl.Marker | null>(null);
      const [isLoading, setIsLoading] = useState(true);
      const [userLocation, setUserLocation] = useState<[number, number] | null>(
        null
      );

      // Get user location
      useEffect(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { longitude, latitude } = position.coords;
              setUserLocation([longitude, latitude]);
            },
            (error) => {
              console.log("Geolocation error:", error);
              // Default to Lahore, Pakistan if geolocation fails
              setUserLocation([74.3587, 31.5204]);
            }
          );
        } else {
          // Default to Lahore, Pakistan if geolocation not available
          setUserLocation([74.3587, 31.5204]);
        }
      }, []);

      // Initialize map only once
      useEffect(() => {
        if (!mapContainer.current || !userLocation || map.current) return;

        setIsLoading(true);

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/outdoors-v12", // Use outdoors style for adventure sites
          center: userLocation,
          zoom: 10,
          preserveDrawingBuffer: false,
          antialias: true,
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

        // Add click handler with reverse geocoding
        const handleMapClick = async (e: mapboxgl.MapMouseEvent) => {
          if (onLocationSelect) {
            const coords: [number, number] = [e.lngLat.lng, e.lngLat?.lat];
            const locationName = await reverseGeocode(coords);
            onLocationSelect(coords, locationName);
          }
        };

        map.current.on("click", handleMapClick);

        map.current.on("load", () => {
          setIsLoading(false);
        });

        return () => {
          if (map.current) {
            map.current.off("click", handleMapClick);
            map.current.remove();
            map.current = null;
          }
        };
      }, [userLocation]); // Removed onLocationSelect from dependencies to prevent re-initialization

      // Update marker when selectedLocation changes
      useEffect(() => {
        if (!map.current || isLoading) return;

        // Remove existing marker
        if (marker.current) {
          marker.current.remove();
          marker.current = null;
        }

        // Add new marker if location is selected
        if (selectedLocation?.coords) {
          const markerEl = document.createElement("div");
          markerEl.style.width = "40px";
          markerEl.style.height = "40px";
          markerEl.style.borderRadius = "50%";
          markerEl.style.background = "#16a34a"; // Green color for sites
          markerEl.style.border = "3px solid #fff";
          markerEl.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.4)";
          markerEl.style.display = "flex";
          markerEl.style.alignItems = "center";
          markerEl.style.justifyContent = "center";
          markerEl.style.cursor = "pointer";
          markerEl.innerHTML = `
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            `;

          // Create popup with location info
          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: false,
            className: "site-location-popup",
          }).setHTML(`
              <div style="padding: 16px; min-width: 250px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#16a34a">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <h3 style="font-size: 16px; font-weight: 600; margin: 0; color: #333;">Adventure Site Location</h3>
                </div>
                <p style="font-size: 14px; color: #666; margin: 0; line-height: 1.4;">
                  ${selectedLocation.name}
                </p>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee;">
                  <div style="font-size: 12px; color: #999;">
                    <strong>Coordinates:</strong> ${selectedLocation.coords[1].toFixed(
            6
          )}, ${selectedLocation.coords[0].toFixed(6)}
                  </div>
                </div>
              </div>
            `);

          marker.current = new mapboxgl.Marker(markerEl)
            .setLngLat(selectedLocation.coords)
            .setPopup(popup)
            .addTo(map.current);

          // Center map on the new location
          map.current.flyTo({
            center: selectedLocation.coords,
            zoom: 13,
            duration: 1500,
          });
        }
      }, [selectedLocation, isLoading]);

      // Expose methods to parent component
      useImperativeHandle(ref, () => ({
        centerMap: (lng: number, lat: number, placeName?: string) => {
          if (!map.current) return;
          map.current.flyTo({
            center: [lng, lat],
            zoom: 13,
            duration: 1500,
          });
        },
        addMarker: (lng: number, lat: number, placeName?: string) => {
          if (!map.current) return;

          // Remove existing marker
          if (marker.current) {
            marker.current.remove();
            marker.current = null;
          }

          const markerEl = document.createElement("div");
          markerEl.style.width = "40px";
          markerEl.style.height = "40px";
          markerEl.style.borderRadius = "50%";
          markerEl.style.background = "#16a34a"; // Green color for sites
          markerEl.style.border = "3px solid #fff";
          markerEl.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.4)";
          markerEl.style.display = "flex";
          markerEl.style.alignItems = "center";
          markerEl.style.justifyContent = "center";
          markerEl.style.cursor = "pointer";
          markerEl.innerHTML = `
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            `;

          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: false,
            className: "site-location-popup",
          }).setHTML(`
              <div style="padding: 16px; min-width: 250px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#16a34a">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <h3 style="font-size: 16px; font-weight: 600; margin: 0; color: #333;">Adventure Site Location</h3>
                </div>
                <p style="font-size: 14px; color: #666; margin: 0; line-height: 1.4;">
                  ${placeName || "Selected Location"}
                </p>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee;">
                  <div style="font-size: 12px; color: #999;">
                    <strong>Coordinates:</strong> ${lat.toFixed(
            6
          )}, ${lng.toFixed(6)}
                  </div>
                </div>
              </div>
            `);

          marker.current = new mapboxgl.Marker(markerEl)
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map.current);

          map.current.flyTo({
            center: [lng, lat],
            zoom: 13,
            duration: 1500,
          });
        },
        removeMarker: () => {
          if (marker.current) {
            marker.current.remove();
            marker.current = null;
          }
        },
      }));

      return (
        <div className={`relative ${className}`}>
          {isLoading && (
            <div className="absolute inset-0 z-10 rounded-lg">
              <MapSkeleton height="h-[400px]" />
            </div>
          )}
          <div
            ref={mapContainer}
            className="w-full h-[400px] rounded-lg"
            style={{ minHeight: "400px" }}
          />

          <style jsx global>{`
            .site-location-popup .mapboxgl-popup-content {
              padding: 0;
              border-radius: 12px;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
              border: none;
              overflow: hidden;
            }
            .site-location-popup .mapboxgl-popup-tip {
              border-top-color: white;
            }
            .mapboxgl-ctrl-group {
              border-radius: 8px !important;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
            }
            .mapboxgl-ctrl-group button {
              border-radius: 8px !important;
            }
            .mapboxgl-ctrl-group button:hover {
              background-color: #f8f9ff !important;
            }
          `}</style>
        </div>
      );
    }
  )
);

SitesLocationMap.displayName = "SitesLocationMap";

export default SitesLocationMap;
