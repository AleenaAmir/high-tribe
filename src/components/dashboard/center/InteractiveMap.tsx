"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

// Types
interface Footprint {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  coordinates: [number, number];
  userAvatar?: string;
  timestamp: string;
  category?: string;
}

export interface InteractiveMapRef {
  centerMap: (lng: number, lat: number, placeName?: string) => void;
}

interface MapProps {
  className?: string;
}

const InteractiveMap = forwardRef<InteractiveMapRef, MapProps>(
  ({ className = "" }, ref) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(
      null
    );
    const [isLoading, setIsLoading] = useState(true);
    const [currentLocation, setCurrentLocation] = useState<string>("");
    const [poiMarkers, setPoiMarkers] = useState<mapboxgl.Marker[]>([]);

    // Sample footprint data with more variety
    const footprints: Footprint[] = [
      {
        id: "1",
        title: "Central Park Adventure",
        description:
          "Amazing day exploring the heart of NYC! Met some incredible people and discovered hidden gems.",
        imageUrl:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        coordinates: [-73.9654, 40.7829],
        userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
        timestamp: "2 hours ago",
        category: "Nature",
      },
      {
        id: "2",
        title: "Brooklyn Bridge Sunset",
        description:
          "Breathtaking sunset views from the iconic Brooklyn Bridge. Perfect evening for photography!",
        imageUrl:
          "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        coordinates: [-73.9969, 40.7061],
        userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
        timestamp: "5 hours ago",
        category: "Architecture",
      },
      {
        id: "3",
        title: "Times Square Night",
        description:
          "The city that never sleeps! Times Square at night is absolutely magical.",
        imageUrl:
          "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
        coordinates: [-73.9855, 40.758],
        userAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
        timestamp: "1 day ago",
        category: "Entertainment",
      },
      {
        id: "4",
        title: "High Line Walk",
        description:
          "Urban oasis above the city streets. The High Line offers such a unique perspective of NYC.",
        imageUrl:
          "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        coordinates: [-74.0049, 40.7484],
        userAvatar: "https://randomuser.me/api/portraits/women/23.jpg",
        timestamp: "2 days ago",
        category: "Nature",
      },
      {
        id: "5",
        title: "Empire State Building",
        description:
          "Iconic views from the top of the Empire State Building. NYC from above is simply stunning!",
        imageUrl:
          "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
        coordinates: [-73.9857, 40.7484],
        userAvatar: "https://randomuser.me/api/portraits/men/89.jpg",
        timestamp: "3 days ago",
        category: "Architecture",
      },
      {
        id: "6",
        title: "Chelsea Market Food Tour",
        description:
          "Delicious food adventure through Chelsea Market. So many amazing local vendors!",
        imageUrl:
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
        coordinates: [-74.006, 40.7421],
        userAvatar: "https://randomuser.me/api/portraits/women/56.jpg",
        timestamp: "4 days ago",
        category: "Food",
      },
      {
        id: "7",
        title: "Metropolitan Museum",
        description:
          "Spent hours exploring the incredible art collections at the Met. A cultural feast!",
        imageUrl:
          "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        coordinates: [-73.9632, 40.7794],
        userAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
        timestamp: "5 days ago",
        category: "Culture",
      },
      {
        id: "8",
        title: "Washington Square Park",
        description:
          "Vibrant atmosphere at Washington Square Park. Street performers and chess players everywhere!",
        imageUrl:
          "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        coordinates: [-73.9973, 40.7308],
        userAvatar: "https://randomuser.me/api/portraits/women/78.jpg",
        timestamp: "1 week ago",
        category: "Entertainment",
      },
    ];

    // Get user location and reverse geocode
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { longitude, latitude } = position.coords;
            setUserLocation([longitude, latitude]);

            // Reverse geocode to get location name
            try {
              const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}&types=place,neighborhood,address`
              );
              const data = await response.json();
              if (data.features && data.features.length > 0) {
                setCurrentLocation(data.features[0].place_name);
              }
            } catch (error) {
              console.log("Error reverse geocoding:", error);
            }
          },
          (error) => {
            setUserLocation([-73.935242, 40.73061]);
            setCurrentLocation("New York, NY");
          }
        );
      } else {
        setUserLocation([-73.935242, 40.73061]);
        setCurrentLocation("New York, NY");
      }
    }, []);

    // Initialize map and add markers
    useEffect(() => {
      if (!mapContainer.current || !userLocation || map.current) return;
      setIsLoading(true);
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/standard",
        center: userLocation,
        zoom: 12,
        pitch: 45,
        bearing: 0,
        antialias: true,
      });
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
          showUserHeading: true,
          showAccuracyCircle: true,
        }),
        "top-right"
      );
      // Add route line connecting footprints
      map.current.on("load", () => {
        if (!map.current) return;
        const routeCoordinates = footprints.map((fp) => fp.coordinates);
        map.current.addSource("route", {
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
        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": "#257CFF",
            "line-width": 3,
            "line-opacity": 0.8,
            "line-dasharray": [2, 2],
          },
        });
        // Add footprint markers
        footprints.forEach((footprint) => {
          const markerEl = document.createElement("div");
          markerEl.className = "footprint-marker";
          markerEl.style.width = "40px";
          markerEl.style.height = "40px";
          markerEl.style.borderRadius = "50%";
          markerEl.style.background =
            "linear-gradient(135deg, #257CFF, #0F62DE)";
          markerEl.style.border = "3px solid white";
          markerEl.style.boxShadow = "0 4px 12px rgba(37, 124, 255, 0.3)";
          markerEl.style.cursor = "pointer";
          markerEl.style.display = "flex";
          markerEl.style.alignItems = "center";
          markerEl.style.justifyContent = "center";
          markerEl.style.position = "relative";
          markerEl.style.transition = "all 0.3s ease";
          if (footprint.userAvatar) {
            const avatar = document.createElement("img");
            avatar.src = footprint.userAvatar;
            avatar.style.width = "32px";
            avatar.style.height = "32px";
            avatar.style.borderRadius = "50%";
            avatar.style.objectFit = "cover";
            markerEl.appendChild(avatar);
          } else {
            markerEl.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          `;
          }
          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            closeOnClick: true,
            className: "footprint-popup",
          }).setHTML(`
          <div class="popup-content" style="min-width: 104px; width: fit-content;">
            <div class="popup-image" style="width: 100%; border-radius: 12px; overflow: hidden; margin-bottom: 12px; position: relative; ">
              <img src="${footprint.imageUrl}" alt="${
            footprint.title
          }" style="width: 100%;  object-fit: contain;">
              
            </div>
           <div style="width: 100%; padding: 10px;">
            <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 8px 0; color: #333; line-height: 1.3;">${
              footprint.title
            }</h3>
            <p style="font-size: 14px; color: #666; margin: 0 0 12px 0; line-height: 1.4;">${
              footprint.description
            }</p>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #999;">
              <span style="display: flex; align-items: center; gap: 4px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#999">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                ${footprint.timestamp}
              </span>
              ${
                footprint.userAvatar
                  ? `<img src="${footprint.userAvatar}" style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid #f0f0f0;">`
                  : ""
              }
            </div>
           </div>
          </div>
        `);
          const marker = new mapboxgl.Marker(markerEl)
            .setLngLat(footprint.coordinates)
            .setPopup(popup)
            .addTo(map.current!);
          markerEl.addEventListener("mouseenter", () => {
            markerEl.style.transform = "scale(1.15) translateY(-2px)";
            markerEl.style.boxShadow = "0 6px 20px rgba(37, 124, 255, 0.4)";
          });
          markerEl.addEventListener("mouseleave", () => {
            markerEl.style.transform = "scale(1) translateY(0)";
            markerEl.style.boxShadow = "0 4px 12px rgba(37, 124, 255, 0.3)";
          });
        });
        setIsLoading(false);
      });
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    }, [userLocation]);

    // Expose centerMap function to parent
    useImperativeHandle(ref, () => ({
      centerMap: async (lng: number, lat: number, placeName?: string) => {
        if (!map.current) return;
        map.current.flyTo({ center: [lng, lat], zoom: 13, speed: 1.2 });
        if (placeName) setCurrentLocation(placeName);
        // Remove old POI markers
        poiMarkers.forEach((marker) => marker.remove());
        // Fetch and add new POIs
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=poi&limit=15&radius=10000`
          );
          const data = await response.json();
          const newMarkers: mapboxgl.Marker[] = [];
          data.features.forEach((poi: any) => {
            const poiMarker = document.createElement("div");
            poiMarker.className = "poi-marker";
            poiMarker.style.width = "16px";
            poiMarker.style.height = "16px";
            poiMarker.style.borderRadius = "50%";
            poiMarker.style.background = "#F35735";
            poiMarker.style.border = "2px solid white";
            poiMarker.style.boxShadow = "0 2px 6px rgba(243, 87, 53, 0.3)";
            poiMarker.style.cursor = "pointer";
            poiMarker.style.transition = "all 0.2s ease";
            const poiPopup = new mapboxgl.Popup({ offset: 15 }).setHTML(`
              <div style="min-width: 200px;">
                <h4 style="font-size: 14px; font-weight: 600; margin: 0 0 4px 0; color: #333;">${
                  poi.text
                }</h4>
                <p style="font-size: 12px; color: #666; margin: 0; line-height: 1.3;">${
                  poi.properties?.address || poi.place_name
                }</p>
                ${
                  poi.properties?.category
                    ? `<div style=\"margin-top: 6px;\"><span style=\"background: #f0f0f0; color: #666; padding: 2px 6px; border-radius: 8px; font-size: 10px;\">${poi.properties.category}</span></div>`
                    : ""
                }
              </div>
            `);
            const marker = new mapboxgl.Marker(poiMarker)
              .setLngLat(poi.center)
              .setPopup(poiPopup)
              .addTo(map.current!);
            poiMarker.addEventListener("mouseenter", () => {
              poiMarker.style.transform = "scale(1.2)";
              poiMarker.style.boxShadow = "0 3px 10px rgba(243, 87, 53, 0.4)";
            });
            poiMarker.addEventListener("mouseleave", () => {
              poiMarker.style.transform = "scale(1)";
              poiMarker.style.boxShadow = "0 2px 6px rgba(243, 87, 53, 0.3)";
            });
            newMarkers.push(marker);
          });
          setPoiMarkers(newMarkers);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Error fetching POIs:", error);
        }
      },
    }));

    return (
      <div className={`relative ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10 rounded-b-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600 font-medium">
                Loading interactive map...
              </span>
            </div>
          </div>
        )}
        <div
          ref={mapContainer}
          className="w-full h-[400px] rounded-b-lg"
          style={{ minHeight: "400px" }}
        />
        <style jsx global>{`
          .footprint-popup .mapboxgl-popup-content {
            padding: 0;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            border: none;
            overflow: hidden;
          }
          .footprint-popup .mapboxgl-popup-tip {
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
);

InteractiveMap.displayName = "InteractiveMap";

export default InteractiveMap;
