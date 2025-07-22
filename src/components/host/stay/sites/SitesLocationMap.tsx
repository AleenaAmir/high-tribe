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

      useImperativeHandle(ref, () => ({
        centerMap: (lng: number, lat: number, placeName?: string) => {
          if (map.current) {
            map.current.flyTo({ center: [lng, lat], zoom: 14 });
            if (placeName && onLocationSelect) {
              onLocationSelect([lng, lat], placeName);
            }
          }
        },
        addMarker: (lng: number, lat: number, placeName?: string) => {
          if (map.current) {
            // Remove existing marker
            if (marker.current) {
              marker.current.remove();
            }

            // Add new marker with site-specific styling
            marker.current = new mapboxgl.Marker({
              color: "#16a34a", // Green color for sites
              scale: 1.2,
            })
              .setLngLat([lng, lat])
              .addTo(map.current);

            if (placeName && onLocationSelect) {
              onLocationSelect([lng, lat], placeName);
            }
          }
        },
        removeMarker: () => {
          if (marker.current) {
            marker.current.remove();
            marker.current = null;
          }
        },
      }));

      useEffect(() => {
        if (!mapContainer.current || !MAPBOX_ACCESS_TOKEN) return;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/outdoors-v12", // Use outdoors style for adventure sites
          center: [74.3587, 31.5204], // Lahore, Pakistan
          zoom: 10,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

        map.current.on("load", () => {
          setIsLoading(false);
        });

        // Handle map clicks for site location selection
        map.current.on("click", async (e) => {
          const { lng, lat } = e.lngLat;

          // Remove existing marker
          if (marker.current) {
            marker.current.remove();
          }

          // Add new marker
          marker.current = new mapboxgl.Marker({
            color: "#16a34a", // Green color for sites
            scale: 1.2,
          })
            .setLngLat([lng, lat])
            .addTo(map.current!);

          // Get place name and call callback
          if (onLocationSelect) {
            const placeName = await reverseGeocode([lng, lat]);
            onLocationSelect([lng, lat], placeName);
          }
        });

        return () => {
          if (map.current) {
            map.current.remove();
          }
        };
      }, [onLocationSelect]);

      // Effect to handle selected location changes
      useEffect(() => {
        if (selectedLocation?.coords && map.current && !isLoading) {
          const [lng, lat] = selectedLocation.coords;

          // Remove existing marker
          if (marker.current) {
            marker.current.remove();
          }

          // Add marker at selected location
          marker.current = new mapboxgl.Marker({
            color: "#16a34a", // Green color for sites
            scale: 1.2,
          })
            .setLngLat([lng, lat])
            .addTo(map.current);

          // Center map on the location
          map.current.flyTo({ center: [lng, lat], zoom: 14 });
        }
      }, [selectedLocation, isLoading]);

      if (isLoading) {
        return <MapSkeleton className={className} />;
      }

      return (
        <div className={`relative ${className}`}>
          <div
            ref={mapContainer}
            className="w-full h-full rounded-lg overflow-hidden"
            style={{ minHeight: "400px" }}
          />
          <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md">
            <p className="text-sm font-medium text-gray-700">
              Click on the map to select your adventure site location
            </p>
          </div>
        </div>
      );
    }
  )
);

SitesLocationMap.displayName = "SitesLocationMap";

export default SitesLocationMap;
