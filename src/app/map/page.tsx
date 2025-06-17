"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// You'll need to replace this with your actual Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoidW1lcmh1c3NhaW4iLCJhIjoiY20wZ2ZpMHYxMDA2azJqc2hkYXg5Ym1zNiJ9.ANK-VYlXWIqxisVsSNAtPQ";

export default function page() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(73.1166);
  const [lat, setLat] = useState(31.4273);
  const [zoom, setZoom] = useState(8);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add geolocate control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );

    // Add event listeners
    map.current.on("move", () => {
      if (!map.current) return;
      setLng(Number(map.current.getCenter().lng.toFixed(4)));
      setLat(Number(map.current.getCenter().lat.toFixed(4)));
      setZoom(Number(map.current.getZoom().toFixed(2)));
    });
  }, [lng, lat, zoom]);

  return (
    <div className="h-screen w-full">
      <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg">
        <div>Longitude: {lng}</div>
        <div>Latitude: {lat}</div>
        <div>Zoom: {zoom}</div>
      </div>
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
}
