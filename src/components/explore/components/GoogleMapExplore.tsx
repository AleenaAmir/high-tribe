// components/explore/ExploreMapGoogle.tsx
"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
  Circle,
  OverlayView,
  Libraries,
} from "@react-google-maps/api";
import Image from "next/image";

/* ========= 1) STABLE LOADER CONFIG (reuse everywhere) ========= */
const GMAPS_ID = "gmap-script";
const GMAPS_LIBRARIES = ["places", "marker"] as const;
type LibrariesFix = ReadonlyArray<string>;

/* ========= Types & props ========= */
export type InteractiveMapRef = {
  centerMap: (lng: number, lat: number, label?: string) => void;
};

type ExploreMapGoogleProps = {
  className?: string;
  activeFilter?: string;
  myAvatarUrl?: string;
};

type FamousPlace = google.maps.places.PlaceResult & {
  position: google.maps.LatLngLiteral;
};

type GPlaceType = NonNullable<google.maps.places.PlaceSearchRequest["type"]>;

type FilterConfig = {
  types?: GPlaceType[];
  keyword?: string;
  openNow?: boolean;
  radius?: number;
};

// Storage keys for localStorage
const STORAGE_KEYS = {
  PLACES: "explore_map_places",
  CENTER: "explore_map_center",
  ZOOM: "explore_map_zoom",
  FILTER: "explore_map_filter",
} as const;

const containerStyle: React.CSSProperties = { width: "100%", height: "100%" };

// Show all POIs by default - remove the hiding styles
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  // You can add custom styles here if needed, but we're not hiding POIs anymore
];

const OPEN_NOW_DEFAULT = false;
const MAX_RESULTS = 60;

const ALLOWED_TYPES: GPlaceType[] = ["restaurant", "lodging", "museum"];

const FILTER_MAP: Record<string, FilterConfig> = {
  "All feeds": { types: ALLOWED_TYPES },
  Restaurants: { types: ["restaurant"], openNow: true },
  Hotels: { types: ["lodging"], openNow: true },
  Museums: { types: ["museum"] },
};

/* ========= Storage utilities ========= */
const saveToStorage = (key: string, data: any) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    console.warn("Failed to save to localStorage:", error);
  }
};

const loadFromStorage = function <T>(key: string, defaultValue: T): T {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    }
  } catch (error) {
    console.warn("Failed to load from localStorage:", error);
  }
  return defaultValue;
};

const clearStorage = (key: string) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn("Failed to clear localStorage:", error);
  }
};

/* ========= simple icons ========= */
const ForkKnife = () => (
  <svg
    width="15"
    height="19"
    viewBox="0 0 15 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.73 18.93V10.39C2.94 10.18 2.27 9.74 1.74 9.09C1.2 8.43 0.93 7.67 0.93 6.8V0.27H2.8V6.8H3.73V0.27H5.6V6.8H6.53V0.27H8.4V6.8C8.4 7.67 8.13 8.43 7.59 9.09C7.06 9.74 6.39 10.18 5.6 10.39V18.93H3.73ZM13.07 18.93V11.47H10.27V4.93C10.27 3.64 10.72 2.54 11.63 1.63C12.54 0.72 13.64 0.27 14.93 0.27V18.93H13.07Z"
      fill="white"
    />
  </svg>
);
const BedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="21"
    height="21"
    fill="none"
    viewBox="0 0 21 21"
  >
    <path
      fill="url(#pattern0_5529_42047)"
      d="M.618.235h20.265V20.5H.618z"
    ></path>
    <defs>
      <pattern
        id="pattern0_5529_42047"
        width="1"
        height="1"
        patternContentUnits="objectBoundingBox"
      >
        <use xlinkHref="#image0_5529_42047" transform="scale(.00195)"></use>
      </pattern>
      <image
        xlinkHref="data:image/png;base64,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"
        id="image0_5529_42047"
        width="512"
        height="512"
        preserveAspectRatio="none"
      ></image>
    </defs>
  </svg>
);
const MuseumIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="15"
    fill="none"
    viewBox="0 0 19 15"
  >
    <path
      fill="#fff"
      d="m17.58 6.437-.228.085a1.71 1.71 0 0 1-2.198-1.001 1.71 1.71 0 0 1 1.02-2.19l.23-.084-.96-2.601L.8 6.05l.96 2.602.229-.085A1.71 1.71 0 0 1 4.187 9.57a1.71 1.71 0 0 1-1.02 2.188l-.23.085.96 2.601L18.542 9.04zm-12.185.205 2.438-.9.898 2.434-2.438.9zM13.81 8.31l-7.131 2.632-.17-.457 7.132-2.632zm-.688-1.864L10.183 7.53l-.169-.457 2.939-1.085zm-.689-1.866L9.495 5.665l-.17-.458 2.94-1.084z"
    ></path>
  </svg>
);

/* ========= Bubble marker ========= */
const BubbleMarker: React.FC<{
  position: google.maps.LatLngLiteral;
  text: string;
  category: "hotel" | "restaurant" | "museum";
  icon: React.ReactNode;
  onClick?: () => void;
  zIndex?: number;
}> = ({ position, text, category, icon, onClick, zIndex }) => {
  const DIAM = 40; // px

  const getBackground = (category: string) => {
    switch (category) {
      case "hotel":
        return "linear-gradient(127.48deg, #2E2E2E 17.92%, #878787 84.47%)";
      case "restaurant":
        return "linear-gradient(90.76deg, #9243AC 0.54%, #B6459F 50.62%, #E74294 99.26%)";
      case "museum":
        return "var(--Color-neww, #AFAFAF)";
      default:
        return "linear-gradient(135deg, #C43CFF 0%, #8A2BE2 100%)";
    }
  };

  return (
    <OverlayView position={position} mapPaneName="overlayMouseTarget">
      <div
        onClick={onClick}
        className="relative flex items-center cursor-pointer select-none isolate"
        style={{ transform: `translate(-${DIAM / 2}px, -50%)` }}
      >
        <div
          className="relative z-10 flex items-center justify-center rounded-full border-2 border-white text-white"
          style={{
            width: DIAM,
            height: DIAM,
            aspectRatio: "1 / 1",
            background: getBackground(category),
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          }}
        >
          {icon}
        </div>

        <div
          className="relative z-0 ml-[-15px] rounded-xl bg-white/50 shadow flex items-center"
          style={{ height: 32, boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }}
        >
          <span
            className="px-6 text-[12px] font-medium whitespace-nowrap overflow-hidden text-ellipsis leading-[18px]"
            style={{ maxWidth: 220 }}
            title={text}
          >
            {text}
          </span>
        </div>
      </div>
    </OverlayView>
  );
};

/* ========= helpers ========= */
type Category = "food" | "hotel" | "museum" | null;
const categoryFromTypes = (
  types: readonly string[] = [],
  name?: string
): Category => {
  const t = new Set(types);
  if (
    t.has("restaurant") ||
    t.has("cafe") ||
    t.has("bakery") ||
    t.has("bar") ||
    t.has("food") ||
    t.has("hotel") ||
    t.has("foot point") ||
    t.has("fast food") ||
    t.has("grill") ||
    t.has("burger") ||
    t.has("pizza") ||
    t.has("meat") ||
    t.has("take away") ||
    t.has("broast") ||
    t.has("wrap") ||
    t.has("kfc")
  )
    return "food";
  if (t.has("lodging")) return "hotel";
  if (t.has("museum") || t.has("art_gallery")) return "museum";
  if (name) {
    if (/\b(hotel|inn|motel|resort|guest\s*house)\b/i.test(name))
      return "hotel";
    if (/\b(museum|gallery)\b/i.test(name)) return "museum";
    if (/\b(cafe|restaurant|diner|bistro|eatery)\b/i.test(name)) return "food";
  }
  return null;
};

/* ========= component ========= */
const ExploreMapGoogle = forwardRef<InteractiveMapRef, ExploreMapGoogleProps>(
  ({ className, activeFilter, myAvatarUrl }, ref) => {
    const { isLoaded } = useJsApiLoader({
      id: GMAPS_ID,
      version: "weekly",
      language: "en",
      region: "US",
      googleMapsApiKey: process.env
        .NEXT_PUBLIC_GOOGLE_LOCATION_API_KEY as string,
      //@ts-ignore
      libraries: GMAPS_LIBRARIES as Library[],
    });

    const mapRef = useRef<google.maps.Map | null>(null);

    // Load initial state from localStorage
    const [center, setCenter] = useState<google.maps.LatLngLiteral>(() =>
      loadFromStorage(STORAGE_KEYS.CENTER, { lat: 31.5204, lng: 74.3587 })
    );
    const [zoom, setZoom] = useState<number>(() =>
      loadFromStorage(STORAGE_KEYS.ZOOM, 14)
    );
    const [places, setPlaces] = useState<FamousPlace[]>([]);
    const [initialPlacesLoaded, setInitialPlacesLoaded] = useState(false);
    const [selected, setSelected] = useState<FamousPlace | null>(null);

    const [myLocation, setMyLocation] =
      useState<google.maps.LatLngLiteral | null>(null);
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const [geoError, setGeoError] = useState<string | null>(null);

    const fetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fetchSeqRef = useRef(0);

    const effectiveFilter: FilterConfig = useMemo(() => {
      const base = FILTER_MAP[activeFilter || ""] || { types: ALLOWED_TYPES };
      return { openNow: base.openNow ?? OPEN_NOW_DEFAULT, ...base };
    }, [activeFilter]);

    // Save places to localStorage whenever they change
    useEffect(() => {
      if (places.length > 0) {
        saveToStorage(STORAGE_KEYS.PLACES, places);
      }
    }, [places]);

    // Save center and zoom to localStorage whenever they change
    useEffect(() => {
      saveToStorage(STORAGE_KEYS.CENTER, center);
    }, [center]);

    useEffect(() => {
      saveToStorage(STORAGE_KEYS.ZOOM, zoom);
    }, [zoom]);

    // Save filter to localStorage
    useEffect(() => {
      saveToStorage(STORAGE_KEYS.FILTER, activeFilter || "All feeds");
    }, [activeFilter]);

    useImperativeHandle(ref, () => ({
      centerMap: (lng: number, lat: number) => {
        const c = { lat, lng };
        setCenter(c);
        if (mapRef.current) mapRef.current.panTo(c);
        debouncedFetchNearby(c, effectiveFilter);
      },
    }));

    const onLoad = (map: google.maps.Map) => {
      mapRef.current = map;
      console.log("Map loaded, initialPlacesLoaded:", initialPlacesLoaded);
      // Always fetch places on initial render
      if (!initialPlacesLoaded) {
        // First time loading - locate user and fetch places
        console.log("First time loading - locating user and fetching places");
        setInitialPlacesLoaded(true);
        locateMe(true);
      } else {
        // Subsequent loads - fetch places for current center
        console.log("Subsequent load - fetching places for current center");
        debouncedFetchNearby(center, effectiveFilter);
      }
    };
    const onUnmount = () => (mapRef.current = null);

    const debouncedFetchNearby = useCallback(
      (c: google.maps.LatLngLiteral, filter: FilterConfig) => {
        if (fetchTimer.current) clearTimeout(fetchTimer.current);
        fetchTimer.current = setTimeout(() => fetchNearby(c, filter), 300);
      },
      []
    );

    // New Places (searchNearby) with safe "any" types; fallback to legacy PlacesService.
    const fetchNearby = async (
      c: google.maps.LatLngLiteral,
      filter: FilterConfig
    ) => {
      console.log("fetchNearby called with center:", c, "filter:", filter);
      if (!mapRef.current || !isLoaded) {
        console.log("fetchNearby early return - mapRef or isLoaded not ready");
        return;
      }
      const myId = ++fetchSeqRef.current;

      /* ---- NEW API ---- */
      try {
        const placesLib: any = await (google.maps as any).importLibrary(
          "places"
        );
        const includedTypes = (filter.types?.length
          ? filter.types
          : ALLOWED_TYPES) as unknown as string[];

        const req: any = {
          locationRestriction: { center: c, radius: filter.radius ?? 3000 },
          fields: [
            "id",
            "displayName",
            "location",
            "types",
            "rating",
            "userRatingCount",
            "formattedAddress",
          ],
          includedTypes,
          maxResultCount: MAX_RESULTS,
          strictTypeFiltering: true,
        };
        if (filter.openNow) req.openNow = true;

        const resp = await placesLib.Place.searchNearby(req);
        const raw: any[] = resp?.places ?? [];

        const next: FamousPlace[] = raw
          .map((p, i) => {
            const pos =
              p.location && typeof p.location?.lat === "function"
                ? { lat: p.location?.lat(), lng: p.location.lng() }
                : p.geometry?.location
                  ? {
                    lat: p.geometry.location?.lat(),
                    lng: p.geometry.location.lng(),
                  }
                  : null;
            const pid =
              p.id || p.place_id || p.name || p.displayName?.text || `p-${i}`;
            return pos
              ? ({
                ...p,
                place_id: pid,
                name: p.displayName?.text || p.name,
                vicinity: p.formattedAddress || p.vicinity,
                user_ratings_total: p.userRatingCount ?? p.user_ratings_total,
                position: pos,
              } as FamousPlace)
              : null;
          })
          .filter(Boolean) as FamousPlace[];

        if (myId !== fetchSeqRef.current) return;
        next.sort(
          (a, b) =>
            (b.user_ratings_total ?? 0) - (a.user_ratings_total ?? 0) ||
            (b.rating ?? 0) - (a.rating ?? 0)
        );
        console.log(`Found ${next.length} places from NEW API`);
        setPlaces((prev) => (next.length ? next.slice(0, MAX_RESULTS) : prev));
        return;
      } catch {
        // fall through
      }

      /* ---- LEGACY API ---- */
      try {
        const svc = new google.maps.places.PlacesService(mapRef.current);
        const doSearch = (req: google.maps.places.PlaceSearchRequest) =>
          new Promise<google.maps.places.PlaceResult[]>((resolve) => {
            svc.nearbySearch(req, (results, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                results
              )
                resolve(results);
              else resolve([]);
            });
          });

        const queryTypes = (
          filter.types?.length ? filter.types : ALLOWED_TYPES
        ).filter((t) => ALLOWED_TYPES.includes(t));

        const { keyword, openNow, radius } = filter;
        const base: google.maps.places.PlaceSearchRequest = {
          location: c,
          openNow,
          keyword,
        };

        const calls: Promise<google.maps.places.PlaceResult[]>[] = [];
        const build = (t?: GPlaceType) =>
          radius
            ? doSearch({ ...base, radius, type: t })
            : doSearch({
              ...base,
              rankBy: google.maps.places.RankBy.DISTANCE,
              type: t,
            });

        queryTypes.forEach((t) => calls.push(build(t)));
        const buckets = await Promise.all(calls);
        if (myId !== fetchSeqRef.current) return;

        const flat = buckets.flat();
        const byId = new Map<string, FamousPlace>();
        flat.forEach((p) => {
          if (!p.place_id || !p.geometry?.location) return;
          byId.set(p.place_id, {
            ...p,
            position: {
              lat: p.geometry.location?.lat(),
              lng: p.geometry.location.lng(),
            },
          });
        });

        const next = Array.from(byId.values())
          .sort(
            (a, b) =>
              (b.user_ratings_total ?? 0) - (a.user_ratings_total ?? 0) ||
              (b.rating ?? 0) - (a.rating ?? 0)
          )
          .slice(0, MAX_RESULTS);

        console.log(`Found ${next.length} places from LEGACY API`);
        setPlaces((prev) => (next.length ? next : prev));
      } catch {
        // keep old markers to avoid flash
      }
    };

    const handleIdle = () => {
      if (!mapRef.current) return;
      const c = mapRef.current.getCenter();
      if (!c) return;
      const newCenter = { lat: c?.lat(), lng: c.lng() };
      setCenter(newCenter);
      debouncedFetchNearby(newCenter, effectiveFilter);
    };

    useEffect(() => {
      if (mapRef.current) debouncedFetchNearby(center, effectiveFilter);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [effectiveFilter]);

    // Load places from localStorage on mount (but don't prevent fresh fetch)
    useEffect(() => {
      const loadedPlaces = loadFromStorage(STORAGE_KEYS.PLACES, []);
      const validPlaces = loadedPlaces.filter(
        (p: any) =>
          p.position &&
          typeof p.position?.lat === "number" &&
          typeof p.position.lng === "number"
      );
      if (validPlaces.length > 0 && places.length === 0) {
        setPlaces(validPlaces);
      }
    }, []);

    // Always fetch places when component mounts
    useEffect(() => {
      if (isLoaded && mapRef.current) {
        debouncedFetchNearby(center, effectiveFilter);
      }
    }, [isLoaded]); // Only depend on isLoaded to avoid infinite loops

    const locateMe = (firstLoad = false) => {
      if (!window.isSecureContext) {
        setGeoError("🔒 Use HTTPS or http://localhost to enable location.");
        if (firstLoad) debouncedFetchNearby(center, effectiveFilter);
        return;
      }
      if (!navigator.geolocation) {
        setGeoError("❌ Geolocation not supported.");
        if (firstLoad) debouncedFetchNearby(center, effectiveFilter);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const c = { lat: pos.coords?.latitude, lng: pos.coords.longitude };
          setMyLocation(c);
          setAccuracy(pos.coords.accuracy ?? null);
          setGeoError(null);
          setCenter(c);
          if (mapRef.current) {
            mapRef.current.panTo(c);
            if (firstLoad) mapRef.current.setZoom(15);
          }
          debouncedFetchNearby(c, effectiveFilter);
        },
        (err) => {
          if (err.code === 1)
            setGeoError("📍 Allow location in site settings, then reload.");
          else if (err.code === 2) setGeoError("⚠ Turn on GPS / Internet.");
          else if (err.code === 3) setGeoError("⏱ Timed out. Try again.");
          else setGeoError("❌ Unable to fetch your location.");
          if (firstLoad) debouncedFetchNearby(center, effectiveFilter);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    const ControlButton: React.FC<{ onClick: () => void; label: string }> = ({
      onClick,
      label,
    }) => (
      <button
        onClick={onClick}
        className="absolute z-10 top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-md shadow text-sm hover:bg-white"
      >
        {label}
      </button>
    );

    if (!isLoaded) return <div className={className}>Loading Google Maps…</div>;
    const avatar = myAvatarUrl || "/dashboard/landingpage/Avatar.png";

    return (
      <div className={className} style={{ position: "relative" }}>
        <ControlButton onClick={() => locateMe(false)} label="Locate me" />

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          onLoad={onLoad}
          onZoomChanged={() => setZoom(mapRef.current?.getZoom() ?? 14)}
          onDragEnd={handleIdle}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            clickableIcons: false,
            styles: MAP_STYLES,
          }}
        >
          {/* my location */}
          {myLocation ? (
            <>
              <OverlayView
                position={myLocation}
                mapPaneName="overlayMouseTarget"
              >
                <div
                  className="relative inline-block -translate-x-1/2 -translate-y-1/2 select-none"
                  style={{ width: 90, height: 90, zIndex: 1200 }}
                >
                  {" "}
                  <Image
                    src="/dashboard/locater.png"
                    alt="Locator"
                    width={90}
                    height={90}
                    priority
                    draggable={false}
                    className="pointer-events-none select-none"
                  />{" "}
                  <img
                    src={avatar}
                    alt="You"
                    className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full object-cover shadow-lg ring-2 ring-white"
                  />
                </div>
              </OverlayView>

              {accuracy && accuracy < 200 && (
                <Circle
                  center={myLocation}
                  radius={Math.max(accuracy, 60)}
                  options={{
                    strokeOpacity: 0,
                    fillOpacity: 0.12,
                    fillColor: "#4285F4",
                    clickable: false,
                  }}
                />
              )}
            </>
          ) : (
            <OverlayView mapPaneName="overlayMouseTarget">
              <div
                className="relative inline-block -translate-x-1/2 -translate-y-1/2 select-none"
                style={{ width: 90, height: 90, zIndex: 1200 }}
              >
                {" "}
                <Image
                  src="/dashboard/locater.png"
                  alt="Locator"
                  width={90}
                  height={90}
                  priority
                  draggable={false}
                  className="pointer-events-none select-none"
                />{" "}
                <img
                  src={avatar}
                  alt="You"
                  className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full object-cover shadow-lg ring-2 ring-white"
                />
              </div>
            </OverlayView>
          )}

          {/* bubble markers */}
          {places
            .filter(
              (p) =>
                p.position &&
                typeof p.position?.lat === "number" &&
                typeof p.position.lng === "number"
            )
            .map((p, idx) => {
              const cat = categoryFromTypes(p.types || [], p.name || "");
              const zIndex =
                (p.user_ratings_total ?? 0) * 10 +
                Math.round((p.rating ?? 0) * 100) +
                idx;

              if (cat === "food") {
                return (
                  <BubbleMarker
                    key={
                      p.place_id || `${p.position?.lat},${p.position.lng},${idx}`
                    }
                    position={p.position}
                    text={p.name || "Restaurant"}
                    category="restaurant"
                    icon={<ForkKnife />}
                    onClick={() => setSelected(p)}
                    zIndex={zIndex}
                  />
                );
              }
              if (cat === "hotel") {
                return (
                  <BubbleMarker
                    key={
                      p.place_id || `${p.position?.lat},${p.position.lng},${idx}`
                    }
                    position={p.position}
                    text={p.name || "Hotel"}
                    category="hotel"
                    icon={<BedIcon />}
                    onClick={() => setSelected(p)}
                    zIndex={zIndex}
                  />
                );
              }
              if (cat === "museum") {
                return (
                  <BubbleMarker
                    key={
                      p.place_id || `${p.position?.lat},${p.position.lng},${idx}`
                    }
                    position={p.position}
                    text={p.name || "Museum"}
                    category="museum"
                    icon={<MuseumIcon />}
                    onClick={() => setSelected(p)}
                    zIndex={zIndex}
                  />
                );
              }
              return null;
            })}

          {selected &&
            selected.position &&
            typeof selected.position?.lat === "number" &&
            typeof selected.position.lng === "number" && (
              <InfoWindow
                position={selected.position}
                onCloseClick={() => setSelected(null)}
              >
                <div className="text-sm">
                  <div className="font-medium">{selected.name}</div>
                  {selected.rating && (
                    <div>
                      ⭐ {selected.rating} ({selected.user_ratings_total ?? 0})
                    </div>
                  )}
                  {selected.vicinity && <div>{selected.vicinity}</div>}
                </div>
              </InfoWindow>
            )}
        </GoogleMap>

        {/* geolocation tray */}
        {geoError && (
          <div className="absolute bottom-3 left-3 z-10 text-xs bg-white/95 px-3 py-2 rounded shadow flex items-center gap-2">
            <span>{geoError}</span>
            <button
              onClick={() => locateMe(false)}
              className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
            >
              Enable Location
            </button>
            {!window.isSecureContext && (
              <span className="text-red-600 font-medium ml-1">
                Use HTTPS / localhost
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

ExploreMapGoogle.displayName = "ExploreMapGoogle";
export default ExploreMapGoogle;
