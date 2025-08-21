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
import Image from "next/image";
import Link from "next/link";
import Booking from "@/components/dashboard/rightside/Booking";
import FoodCard from "@/components/dashboard/rightside/FoodCard";

// const UserFeed = dynamic(
//   () => import("@/components/dashboard/center/UserFeed"),
//   { ssr: false }
// );
const UserFeed = dynamic(
  () => import("@/components/dashboard/center/feed/UserFeed"),
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
      <div className="flex-1  overflow-y-auto scrollbar-hide">
        <div className="px-6 py-2" >
          <div className="mx-auto flex flex-col gap-3">
            <StoriesBar />
            <PostFootPrint
              setJournyMap={setJournyMap}
              setFootprintModal={setFootprintModal}
              setAdvisoryModal={setAdvisoryModal}
              setTipModal={setTipModal}
            />
            <div className="bg-white shadow-sm flex justify-between items-center h-[50px] rounded-xl">
              <h2 className="text-[18px] font-[600] leading-[100%] tracking-[-3%]  text-[#000000] p-4 md:p-6 pb-2 font-gilroy border-[#EEEEEE] ">
                Trip Schedule
              </h2>

              <Link
                href={"/explore"}
                className="text-white font-bold cursor-pointer outline-none text-[12px] flex gap-4 justify-center font-poppins bg-gradient-to-r from-[#9243AC] via-[#B6459F] to-[#E74294] rounded-full w-[148px] h-[32px] p-1 items-center opacity-100 mr-4"
              >
                <Image
                  src={"/dashboard/map.svg"}
                  alt={"footprint3"}
                  width={12}
                  height={12}
                  className="md:w-[20px] md:h-[20px]"
                />
                <span className="transition-all duration-300 rounded-full p-1 text-[12px] font-gilroy font-[600] leading-[100%] tracking-[-3%] ">
                  Lets Plan
                </span>
              </Link>
            </div>

            {/* <MapDashboard /> */}
            <ReadyToHost />
            <UserFeed />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Independent Scroll */}
      <div className="max-w-[280px] hidden lg:block lg:flex-1 overflow-y-auto scrollbar-hide">
        <div className="pt-2  pr-8 pl-2">
          <div className="flex flex-col gap-6">
            <GroupsCard />
            <EventsCard />
            <Booking />
            <FoodCard />
            {/* <FindPeopleCard />
            <YourGroups />
            <NearbyPeopleGrid />
            <ContactsList /> */}
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
