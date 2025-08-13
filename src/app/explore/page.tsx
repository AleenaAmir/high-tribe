"use client";
import { useRef, useState } from "react";
import Explore from "@/components/explore/Explore";
import SideExplore from "@/components/explore/SideExplore";
import ExploreMap, { InteractiveMapRef } from "@/components/explore/ExploreMap";
import ExploreHotels from "@/components/explore/ExploreHotels";
const Page = () => {
  const handleMenuClick = () => {};
  const mapRef = useRef<InteractiveMapRef>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All feeds");
  const [isExplorePanelOpen, setIsExplorePanelOpen] = useState<boolean>(false);

  return (
    <div className="h-[calc(100vh-210px)] bg-gray-50">
      <Explore
        onMenuClick={handleMenuClick}
        onPlaceSelected={(lng: number, lat: number, name?: string) => {
          mapRef.current?.centerMap(lng, lat, name);
        }}
        onFilterChange={(filter: string) => setActiveFilter(filter)}
      />

      <div className="flex">
        <SideExplore onExploreClick={() => setIsExplorePanelOpen(true)} />
        <div className="flex-1">
          <ExploreMap
            ref={mapRef}
            className="h-[calc(100vh-210px)]"
            activeFilter={activeFilter}
          />
        </div>
      </div>

      {isExplorePanelOpen && (
      <ExploreHotels setIsExplorePanelOpen={setIsExplorePanelOpen} />
      )}
    </div>
  );
};

export default Page;
