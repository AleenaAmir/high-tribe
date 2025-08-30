import React, { useState, useRef } from "react";
import GlobalRouteMap, { RoutePoint, LatLng } from "./GlobalRouteMap";

const GlobalRouteMapExample: React.FC = () => {
  const mapRef = useRef<any>(null);
  const [selectedPoint, setSelectedPoint] = useState<RoutePoint | null>(null);

  // Example route data
  const startPoint: RoutePoint = {
    id: "start",
    coords: [69.2, 41.3], // Tashkent
    name: "Tashkent",
    color: "#22c55e",
  };

  const endPoint: RoutePoint = {
    id: "end",
    coords: [74.3587, 31.5204], // Lahore
    name: "Lahore",
    color: "#ef4444",
  };

  const waypoints: RoutePoint[] = [
    {
      id: "waypoint1",
      coords: [72.8777, 19.076], // Mumbai
      name: "Mumbai",
      color: "#2563eb",
    },
    {
      id: "waypoint2",
      coords: [78.9629, 20.5937], // Delhi
      name: "Delhi",
      color: "#2563eb",
    },
  ];

  const handlePointClick = (point: RoutePoint, index: number) => {
    console.log("Point clicked:", point, "Index:", index);
    setSelectedPoint(point);
  };

  const handleMapClick = (coords: LatLng) => {
    console.log("Map clicked at:", coords);
  };

  const handleRouteLoad = (route: LatLng[]) => {
    console.log("Route loaded with", route.length, "coordinates");
  };

  const flyToStart = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({ center: startPoint.coords, zoom: 8 });
    }
  };

  const flyToEnd = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({ center: endPoint.coords, zoom: 8 });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Global Route Map Examples
        </h1>
        <p className="text-gray-600">
          Demonstrating different configurations of the GlobalRouteMap component
        </p>
      </div>

      {/* Basic Route Map */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Basic Route Map</h2>
        <GlobalRouteMap
          ref={mapRef}
          startPoint={startPoint}
          endPoint={endPoint}
          waypoints={waypoints}
          showRouteInfo={true}
          onPointClick={handlePointClick}
          onMapClick={handleMapClick}
          onRouteLoad={handleRouteLoad}
          height="400px"
          className="border border-gray-200 rounded-lg"
        />

        <div className="flex gap-2">
          <button
            onClick={flyToStart}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Fly to Start
          </button>
          <button
            onClick={flyToEnd}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Fly to End
          </button>
        </div>

        {selectedPoint && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Selected: <strong>{selectedPoint.name}</strong> at{" "}
              {selectedPoint.coords[0].toFixed(4)},{" "}
              {selectedPoint.coords[1].toFixed(4)}
            </p>
          </div>
        )}
      </div>

      {/* Custom Styled Route Map */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Custom Styled Route Map
        </h2>
        <GlobalRouteMap
          startPoint={startPoint}
          endPoint={endPoint}
          waypoints={waypoints}
          routeColor="#8b5cf6"
          routeWidth={6}
          routeStyle="dashed"
          markerSize={20}
          showRouteInfo={true}
          height="300px"
          className="border border-purple-200 rounded-lg"
        />
      </div>

      {/* Read-only Route Map */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Read-only Route Map
        </h2>
        <GlobalRouteMap
          startPoint={startPoint}
          endPoint={endPoint}
          waypoints={waypoints}
          interactive={false}
          showRouteInfo={true}
          height="300px"
          className="border border-gray-200 rounded-lg"
        />
      </div>

      {/* Route Map without Markers */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Route Map without Markers
        </h2>
        <GlobalRouteMap
          startPoint={startPoint}
          endPoint={endPoint}
          waypoints={waypoints}
          showMarkers={false}
          showRouteInfo={true}
          height="300px"
          className="border border-gray-200 rounded-lg"
        />
      </div>

      {/* Route Map without Route Line */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Route Map without Route Line
        </h2>
        <GlobalRouteMap
          startPoint={startPoint}
          endPoint={endPoint}
          waypoints={waypoints}
          showRoute={false}
          showRouteInfo={false}
          height="300px"
          className="border border-gray-200 rounded-lg"
        />
      </div>
    </div>
  );
};

export default GlobalRouteMapExample;
