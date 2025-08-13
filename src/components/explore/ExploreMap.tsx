"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import mapboxgl from "mapbox-gl";
import { MapSkeleton } from "@/components/global/LoadingSkeleton";
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
  activeFilter?: string;
}

// --- POI ICON MAP & PLACE DETAILS UTILS (shared) ---
const poiIconMap: Record<string, string> = {
  restaurant:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="#F35735"><path d="M7 2c-.55 0-1 .45-1 1v7c0 1.66 1.34 3 3 3s3-1.34 3-3V3c0-.55-.45-1-1-1s-1 .45-1 1v7c0 .55-.45 1-1 1s-1-.45-1-1V3c0-.55-.45-1-1-1zm7.5 0c-.28 0-.5.22-.5.5V10c0 2.21 1.79 4 4 4s4-1.79 4-4V2.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V10c0 1.38-1.12 2.5-2.5 2.5S17 11.38 17 10V2.5c0-.28-.22-.5-.5-.5z"/></svg>',
  attraction:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="#257CFF"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  park: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#4CAF50"><circle cx="12" cy="12" r="10"/></svg>',
  entertainment:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="#A020F0"><circle cx="12" cy="12" r="10"/></svg>',
  default:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="#333"><circle cx="12" cy="12" r="10"/></svg>',
};
const getPlaceDetails = (placeName: string, category: string) => {
  const foodSpots = {
    "Joe's Pizza": {
      type: "🍕 Famous Pizza Joint",
      rating: "4.8/5",
      price: "$$",
      hours: "11 AM - 11 PM",
      description:
        "Best pizza in NYC since 1975. Famous for their classic Margherita and pepperoni slices.",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
      popular: "Margherita Pizza, Pepperoni Slice",
    },
    "Katz's Delicatessen": {
      type: "🥪 Iconic Deli",
      rating: "4.6/5",
      price: "$$$",
      hours: "8 AM - 10:45 PM",
      description:
        "Famous Jewish deli known for pastrami sandwiches. Featured in 'When Harry Met Sally'.",
      image:
        "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300&h=200&fit=crop",
      popular: "Pastrami Sandwich, Matzo Ball Soup",
    },
    "Magnolia Bakery": {
      type: "🧁 Famous Bakery",
      rating: "4.4/5",
      price: "$$",
      hours: "8 AM - 9 PM",
      description:
        "Iconic bakery famous for cupcakes and banana pudding. A must-visit dessert spot.",
      image:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop",
      popular: "Vanilla Cupcakes, Banana Pudding",
    },
  };

  const attractions = {
    "Empire State Building": {
      type: "🏢 Iconic Skyscraper",
      rating: "4.5/5",
      price: "$28",
      hours: "8 AM - 2 AM",
      description:
        "Art Deco masterpiece offering stunning 360° views of NYC from the 86th floor observatory.",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&h=200&fit=crop",
      popular: "86th Floor Observatory, Sunset Views",
    },
    "Central Park": {
      type: "🌳 Urban Oasis",
      rating: "4.8/5",
      price: "Free",
      hours: "6 AM - 10 PM",
      description:
        "843-acre park in the heart of Manhattan. Perfect for walking, biking, and outdoor activities.",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
      popular: "Bethesda Fountain, Bow Bridge",
    },
  };

  const events = {
    "Broadway Show": {
      type: "🎭 Live Theater",
      rating: "4.9/5",
      price: "$80-200",
      hours: "Varies by show",
      description:
        "Experience world-class theater on Broadway. From musicals to dramas, there's something for everyone.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
      popular: "Hamilton, Wicked, The Lion King",
    },
  };

  // Return appropriate data based on place name or category
  if (foodSpots[placeName as keyof typeof foodSpots]) {
    return foodSpots[placeName as keyof typeof foodSpots];
  } else if (attractions[placeName as keyof typeof attractions]) {
    return attractions[placeName as keyof typeof attractions];
  } else if (events[placeName as keyof typeof events]) {
    return events[placeName as keyof typeof events];
  } else {
    // Default data for unknown places
    return {
      type:
        category === "restaurant"
          ? "🍽️ Local Restaurant"
          : category === "museum"
          ? "🏛️ Museum"
          : category === "park"
          ? "🌳 Park"
          : "📍 Point of Interest",
      rating: "4.2/5",
      price: "$$",
      hours: "9 AM - 6 PM",
      description: `A great ${category || "place"} to visit in the area.`,
      image:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop",
      popular: "Local favorites",
    };
  }
};

const ExploreMap = forwardRef<InteractiveMapRef, MapProps>(
  ({ className = "", activeFilter }, ref) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(
      null
    );
    const [isLoading, setIsLoading] = useState(true);
    const [currentLocation, setCurrentLocation] = useState<string>("");
    const [poiMarkers, setPoiMarkers] = useState<mapboxgl.Marker[]>([]);
    const [footprintMarkers, setFootprintMarkers] = useState<mapboxgl.Marker[]>(
      []
    );

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
        const fpMarkers: mapboxgl.Marker[] = [];
        footprints.forEach((footprint) => {
          const markerEl = document.createElement("div");
          markerEl.className = "footprint-marker";
          markerEl.style.width = "44px";
          markerEl.style.height = "44px";
          markerEl.style.borderRadius = "50%";
          markerEl.style.background = "#fff";
          markerEl.style.border = "3px solid #257CFF";
          markerEl.style.boxShadow = "0 2px 8px rgba(37, 124, 255, 0.18)";
          markerEl.style.cursor = "pointer";
          markerEl.style.display = "flex";
          markerEl.style.alignItems = "center";
          markerEl.style.justifyContent = "center";
          markerEl.style.position = "relative";
          markerEl.dataset.type = "footprint";
          if (footprint.category)
            markerEl.dataset.category = footprint.category.toLowerCase();

          if (footprint.userAvatar) {
            const avatar = document.createElement("img");
            avatar.src = footprint.userAvatar;
            avatar.style.width = "36px";
            avatar.style.height = "36px";
            avatar.style.borderRadius = "50%";
            avatar.style.objectFit = "cover";
            avatar.style.border = "2px solid #fff";
            markerEl.appendChild(avatar);
          } else {
            markerEl.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#257CFF">
              <circle cx="12" cy="12" r="12"/>
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
          fpMarkers.push(marker);
          markerEl.addEventListener("mouseenter", () => {
            markerEl.style.boxShadow = "0 6px 20px rgba(37, 124, 255, 0.4)";
          });
          markerEl.addEventListener("mouseleave", () => {
            markerEl.style.boxShadow = "0 4px 12px rgba(37, 124, 255, 0.3)";
          });
        });
        setFootprintMarkers(fpMarkers);

        // Add initial POI markers with dummy data
        const initialPOIs = [
          {
            name: "Joe's Pizza",
            coordinates: [-73.9855, 40.758] as [number, number],
            category: "restaurant",
          },
          {
            name: "Empire State Building",
            coordinates: [-73.9857, 40.7484] as [number, number],
            category: "attraction",
          },
          {
            name: "Central Park",
            coordinates: [-73.9654, 40.7829] as [number, number],
            category: "park",
          },
          {
            name: "Katz's Delicatessen",
            coordinates: [-73.9911, 40.7223] as [number, number],
            category: "restaurant",
          },
          {
            name: "Magnolia Bakery",
            coordinates: [-74.006, 40.7421] as [number, number],
            category: "restaurant",
          },
          {
            name: "Broadway Show",
            coordinates: [-73.9877, 40.7505] as [number, number],
            category: "entertainment",
          },
        ];

        initialPOIs.forEach((poi) => {
          const poiMarker = document.createElement("div");
          poiMarker.className = "poi-marker";
          poiMarker.style.width = "44px";
          poiMarker.style.height = "44px";
          poiMarker.style.borderRadius = "50%";
          poiMarker.style.background = "#fff";
          poiMarker.style.border = `3px solid ${
            poi.category === "restaurant"
              ? "#F35735"
              : poi.category === "attraction"
              ? "#257CFF"
              : poi.category === "park"
              ? "#4CAF50"
              : poi.category === "entertainment"
              ? "#A020F0"
              : "#333"
          }`;
          poiMarker.style.boxShadow = "0 2px 8px rgba(0,0,0,0.18)";
          poiMarker.style.display = "flex";
          poiMarker.style.alignItems = "center";
          poiMarker.style.justifyContent = "center";
          poiMarker.style.cursor = "pointer";
          poiMarker.innerHTML = poiIconMap[poi.category] || poiIconMap.default;
          poiMarker.dataset.type = "poi";
          poiMarker.dataset.category = poi.category;
          const placeDetails = getPlaceDetails(poi.name, poi.category);

          // --- POI POPUP STYLE ---
          const poiPopup = new mapboxgl.Popup({
            offset: 15,
            maxWidth: "340px",
            className: "poi-popup",
          }).setHTML(`
            <div style="display: flex; height: 150px; min-width: 320px; max-width: 340px; background: #fff; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.13); overflow: hidden;">
              <div style="flex: 0 0 150px; height: 150px; overflow: hidden; position: relative;">
                <img src="${placeDetails.image}" alt="${
            poi.name
          }" style="width: 100%; height: 100%; object-fit: cover; border-radius: 16px 0 0 16px;" />
                <div style="position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.7); color: #fff; padding: 2px 8px; border-radius: 8px; font-size: 12px; font-weight: 600;">${
                  placeDetails.rating
                }</div>
              </div>
              <div style="flex: 1; padding: 14px 16px 14px 12px; display: flex; flex-direction: column; justify-content: space-between; min-width: 0; overflow: hidden;">
                <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                    <span style="font-size: 20px; flex-shrink: 0;">${
                      placeDetails.type.split(" ")[0]
                    }</span>
                    <span style="font-size: 15px; font-weight: 700; color: #222; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px; display: inline-block;">${
                      poi.name
                    }</span>
                  </div>
                  <div style="display: flex; gap: 6px; align-items: center; flex-shrink: 0;">
                    <span style="font-size: 15px; color: #257CFF;">★</span>
                    <span style="font-size: 13px; color: #666;">${
                      placeDetails.rating
                    }</span>
                  </div>
                </div>
                <div style="font-size: 12px; color: #888; margin: 2px 0 4px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">New York, NY</div>
                <div style="font-size: 12px; color: #444; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
                  placeDetails.description
                }</div>
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <span style="background: #f0f8ff; color: #257CFF; padding: 2px 8px; border-radius: 8px; font-size: 11px; font-weight: 500; white-space: nowrap;">💰 ${
                    placeDetails.price
                  }</span>
                  <span style="background: #fff3cd; color: #856404; padding: 2px 8px; border-radius: 8px; font-size: 11px; font-weight: 500; white-space: nowrap;">🕒 ${
                    placeDetails.hours
                  }</span>
                  <span style="background: #f8f9fa; color: #666; padding: 2px 8px; border-radius: 8px; font-size: 11px; font-weight: 500; white-space: nowrap;">${
                    placeDetails.popular
                  }</span>
                </div>
              </div>
            </div>
          `);
          const marker = new mapboxgl.Marker(poiMarker)
            .setLngLat(poi.coordinates)
            .setPopup(poiPopup)
            .addTo(map.current!);
          poiMarker.addEventListener("mouseenter", () => {
            poiMarker.style.boxShadow = "0 3px 10px rgba(243, 87, 53, 0.4)";
          });
          poiMarker.addEventListener("mouseleave", () => {
            poiMarker.style.boxShadow = "0 2px 6px rgba(243, 87, 53, 0.3)";
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
            poiMarker.style.width = "44px";
            poiMarker.style.height = "44px";
            poiMarker.style.borderRadius = "50%";
            poiMarker.style.background = "#fff";
            poiMarker.style.border = `3px solid ${
              poi.properties?.category === "restaurant"
                ? "#F35735"
                : poi.properties?.category === "attraction"
                ? "#257CFF"
                : poi.properties?.category === "park"
                ? "#4CAF50"
                : poi.properties?.category === "entertainment"
                ? "#A020F0"
                : "#333"
            }`;
            poiMarker.style.boxShadow = "0 2px 8px rgba(0,0,0,0.18)";
            poiMarker.style.display = "flex";
            poiMarker.style.alignItems = "center";
            poiMarker.style.justifyContent = "center";
            poiMarker.style.cursor = "pointer";
            poiMarker.innerHTML =
              poiIconMap[poi.properties?.category] || poiIconMap.default;
            poiMarker.dataset.type = "poi";
            if (poi.properties?.category) {
              poiMarker.dataset.category = String(poi.properties.category);
            }

            const placeDetails = getPlaceDetails(
              poi.text,
              poi.properties?.category
            );

            const poiPopup = new mapboxgl.Popup({
              offset: 15,
              maxWidth: "340px",
              className: "poi-popup",
            }).setHTML(`
              <div style="display: flex; height: 150px; min-width: 320px; max-width: 340px; background: #fff; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.13); overflow: hidden;">
                <div style="flex: 0 0 150px; height: 150px; overflow: hidden; position: relative;">
                  <img src="${placeDetails.image}" alt="${
              poi.text
            }" style="width: 100%; height: 100%; object-fit: cover; border-radius: 16px 0 0 16px;" />
                  <div style="position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.7); color: #fff; padding: 2px 8px; border-radius: 8px; font-size: 12px; font-weight: 600;">${
                    placeDetails.rating
                  }</div>
                </div>
                <div style="flex: 1; padding: 14px 16px 14px 12px; display: flex; flex-direction: column; justify-content: space-between; min-width: 0; overflow: hidden;">
                  <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                      <span style="font-size: 20px; flex-shrink: 0;">${
                        placeDetails.type.split(" ")[0]
                      }</span>
                      <span style="font-size: 15px; font-weight: 700; color: #222; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px; display: inline-block;">${
                        poi.text
                      }</span>
                    </div>
                    <div style="display: flex; gap: 6px; align-items: center; flex-shrink: 0;">
                      <span style="font-size: 15px; color: #257CFF;">★</span>
                      <span style="font-size: 13px; color: #666;">${
                        placeDetails.rating
                      }</span>
                    </div>
                  </div>
                  <div style="font-size: 12px; color: #888; margin: 2px 0 4px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">New York, NY</div>
                  <div style="font-size: 12px; color: #444; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
                    placeDetails.description
                  }</div>
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span style="background: #f0f8ff; color: #257CFF; padding: 2px 8px; border-radius: 8px; font-size: 11px; font-weight: 500; white-space: nowrap;">💰 ${
                      placeDetails.price
                    }</span>
                    <span style="background: #fff3cd; color: #856404; padding: 2px 8px; border-radius: 8px; font-size: 11px; font-weight: 500; white-space: nowrap;">🕒 ${
                      placeDetails.hours
                    }</span>
                    <span style="background: #f8f9fa; color: #666; padding: 2px 8px; border-radius: 8px; font-size: 11px; font-weight: 500; white-space: nowrap;">${
                      placeDetails.popular
                    }</span>
                  </div>
                </div>
              </div>
            `);
            const marker = new mapboxgl.Marker(poiMarker)
              .setLngLat(poi.center)
              .setPopup(poiPopup)
              .addTo(map.current!);
            poiMarker.addEventListener("mouseenter", () => {
              poiMarker.style.boxShadow = "0 3px 10px rgba(243, 87, 53, 0.4)";
            });
            poiMarker.addEventListener("mouseleave", () => {
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

    // React to activeFilter changes by hiding/showing markers
    useEffect(() => {
      const filter = (activeFilter || "All feeds").toLowerCase();
      const showAll = filter === "all feeds";
      const showOnlyFootprints = filter === "footprints";
      const poiCategoryFromFilter: Record<string, string> = {
        events: "entertainment",
        restaurants: "restaurant",
        parks: "park",
        attractions: "attraction",
      };
      const targetPoiCategory = poiCategoryFromFilter[filter];

      // Footprints
      footprintMarkers.forEach((marker) => {
        const el = marker.getElement();
        if (showAll || showOnlyFootprints) {
          el.style.display = showOnlyFootprints ? "block" : "block";
        } else {
          el.style.display = "none";
        }
      });

      // POIs
      poiMarkers.forEach((marker) => {
        const el = marker.getElement();
        const category = (el.dataset.category || "").toLowerCase();
        if (showAll) {
          el.style.display = "block";
        } else if (showOnlyFootprints) {
          el.style.display = "none";
        } else if (targetPoiCategory) {
          el.style.display = category === targetPoiCategory ? "block" : "none";
        } else {
          // Unknown filter → show all for now
          el.style.display = "block";
        }
      });
    }, [activeFilter, footprintMarkers, poiMarkers]);

    return (
      <div className={`relative ${className} `}>
        {isLoading && (
          <div className="absolute inset-0 z-10 rounded-b-lg ">
            <MapSkeleton height="h-[82vh]" />
          </div>
        )}
        <div
          ref={mapContainer}
          className="w-full h-[400px] rounded-b-lg"
          style={{ minHeight: "82vh" }}
        />
        <style jsx global>{`
          .footprint-marker {
            transition: box-shadow 0.2s;
          }
          .poi-marker {
            transition: box-shadow 0.2s;
          }
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
          .poi-popup .mapboxgl-popup-content {
            padding: 0;
            border-radius: 16px;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
            border: none;
            overflow: hidden;
            min-width: 320px;
            max-width: 340px;
          }
          .poi-popup .mapboxgl-popup-tip {
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

ExploreMap.displayName = "ExploreMap";

export default ExploreMap;
