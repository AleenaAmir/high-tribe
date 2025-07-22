"use client";

// import MapDashboard from "@/components/dashboard/center/MapDashboard";
import PostFootPrint from "@/components/dashboard/center/PostFootPrint";
import ReadyToHost from "@/components/dashboard/center/ReadyToHost";
import StoriesBar from "@/components/dashboard/center/StoriesBar";
import ContactsList from "@/components/dashboard/rightside/ContactsList";
import EventsCard from "@/components/dashboard/rightside/EventsCard";
import FindPeopleCard from "@/components/dashboard/rightside/FindPeopleCard";
import GroupsCard from "@/components/dashboard/rightside/GroupsCard";
import YourGroups from "@/components/dashboard/rightside/YourGroups";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const UserFeed = dynamic(
  () => import("@/components/dashboard/center/UserFeed"),
  { ssr: false }
);
const NearbyPeopleGrid = dynamic(
  () => import("@/components/dashboard/explore/NearbyPeopleGrid"),
  { ssr: false }
);
const MainJourney = dynamic(
  () => import("@/components/dashboard/modals/journey/MainJourney"),
  { ssr: false }
);
const MainFootprint = dynamic(
  () => import("@/components/dashboard/modals/footprint/MainFootprint"),
  { ssr: false }
);
const MainAdvisory = dynamic(
  () => import("@/components/dashboard/modals/advisory/MainAdvisory"),
  { ssr: false }
);
const MainTip = dynamic(
  () => import("@/components/dashboard/modals/tip/MainTip"),
  { ssr: false }
);

const DashboardContent = () => {
  const [journyMap, setJournyMap] = useState<boolean>(false);
  const [footprintModal, setFootprintModal] = useState<boolean>(false);
  const [advisoryModal, setAdvisoryModal] = useState<boolean>(false);
  const [tipModal, setTipModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Check if user is a host and redirect to /host
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isHost = localStorage.getItem("isHost");
      if (isHost === "true") {
        router.push("/host/create");
        return; // Keep loading state while redirecting
      }
      // If not a host, stop loading
      setIsLoading(false);
    }
  }, [router]);

  // Show loading state while checking host status or redirecting
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Center Content - Independent Scroll */}
      <div className="flex-1 lg:flex-[3] overflow-y-auto scrollbar-hide">
        <div className="p-6">
          <div className="max-w-[780px] mx-auto flex flex-col gap-6">
            <StoriesBar />
            <PostFootPrint
              setJournyMap={setJournyMap}
              setFootprintModal={setFootprintModal}
              setAdvisoryModal={setAdvisoryModal}
              setTipModal={setTipModal}
            />
            {/* <MapDashboard /> */}
            <ReadyToHost />
            <UserFeed />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Independent Scroll */}
      <div className="hidden lg:block lg:flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-6">
          <div className="flex flex-col gap-6">
            <GroupsCard />
            <FindPeopleCard />
            <YourGroups />
            <EventsCard />
            <NearbyPeopleGrid />
            <ContactsList />
          </div>
        </div>
      </div>

      <MainJourney journyMap={journyMap} setJournyMap={setJournyMap} />
      <MainFootprint
        footprintModal={footprintModal}
        setFootprintModal={setFootprintModal}
      />
      <MainAdvisory
        advisoryModal={advisoryModal}
        setAdvisoryModal={setAdvisoryModal}
      />
      <MainTip tipModal={tipModal} setTipModal={setTipModal} />
    </div>
  );
};

export default DashboardContent;
