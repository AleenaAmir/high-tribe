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
import React, { useState } from "react";
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

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Center Content */}
      <div className="lg:col-span-3 flex flex-col gap-6">
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

      {/* Right Sidebar */}
      <div className="hidden lg:block lg:col-span-1">
        <div className="flex flex-col gap-6">
          <GroupsCard />
          <FindPeopleCard />
          <YourGroups />
          <EventsCard />
          <NearbyPeopleGrid />
          <ContactsList />
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
