"use client";

import MapDashboard from "@/components/dashboard/center/MapDashboard";
import PostSomething from "@/components/dashboard/center/PostSomething";
import ReadyToHost from "@/components/dashboard/center/ReadyToHost";
import StoriesBar from "@/components/dashboard/center/StoriesBar";
import ContactsList from "@/components/dashboard/rightside/ContactsList";
import EventsCard from "@/components/dashboard/rightside/EventsCard";
import FindPeopleCard from "@/components/dashboard/rightside/FindPeopleCard";
import GroupsCard from "@/components/dashboard/rightside/GroupsCard";
import YourGroups from "@/components/dashboard/rightside/YourGroups";
import React from "react";
import dynamic from "next/dynamic";

const UserFeed = dynamic(
  () => import("@/components/dashboard/center/UserFeed"),
  { ssr: false }
);
const NearbyPeopleGrid = dynamic(
  () => import("@/components/dashboard/explore/NearbyPeopleGrid"),
  { ssr: false }
);

const DashboardContent = () => {
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Center Content */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        <StoriesBar />
        <PostSomething />
        <MapDashboard />
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
    </div>
  );
};

export default DashboardContent;
