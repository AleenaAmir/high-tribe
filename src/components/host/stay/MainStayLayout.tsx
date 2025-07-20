"use client";
import Link from "next/link";
import React from "react";
import { useSearchParams } from "next/navigation";
import PropertyMain from "./property/PropertyMain";

const stayTabs = [
  "stats",
  "booking",
  "property",
  "sites",
  "calendar",
  "inbox",
  "notifications",
];

export default function MainStayLayout() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "stats";

  const createTabUrl = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    return `?${params.toString()}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center gap-4 p-3 md:px-4 md:py-3 lg:px-6 lg:py-4 bg-white">
        <h3 className="text-[18px] font-bold md:text-[24px]">Stay</h3>
        <button
          type="button"
          className="text-white bg-[#3C83F6] py-2 px-5 rounded-lg text-[10px] md:text-[12px] cursor-pointer hover:shadow-md "
        >
          Add New Property
        </button>
      </div>

      <div className="mt-1 flex items-center gap-2 md:gap-4 px-3 pt-2 md:px-4 md:pt-3 lg:px-6 lg:pt-4 bg-white">
        {stayTabs.map((tab) => (
          <Link
            key={tab}
            href={createTabUrl(tab)}
            className={`text-[12px] md:text-[16px] px-3 py-2  border-b-4  transition-colors capitalize ${
              currentTab === tab
                ? " text-black font-bold border-[#1179FA]"
                : "text-[#868686]  hover:bg-gray-100 border-white rounded-lg"
            }`}
          >
            {tab}
          </Link>
        ))}
      </div>
      {/* Content according to the tabs */}
      <div className="p-3 md:px-4 md:py-3 lg:px-6 lg:py-4">
        {currentTab === "stats" && <div>Stats</div>}
        {currentTab === "booking" && <div>Booking</div>}
        {currentTab === "property" && <PropertyMain />}
        {currentTab === "sites" && <div>Sites</div>}
        {currentTab === "calendar" && <div>Calendar</div>}
        {currentTab === "inbox" && <div>Inbox</div>}
        {currentTab === "notifications" && <div>Notifications</div>}
      </div>
    </div>
  );
}
