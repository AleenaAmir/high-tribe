"use client";
import Link from "next/link";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PropertyMain from "./property/PropertyMain";
import StatsMain from "./stats/StatsMain";
import PropertyForm from "./property/PropertyFormUpdated";
import SitesForm from "./sites/SitesForm";
import BookingsMain from "./bookings/BookingsMain";

const stayTabs = [
  "stats",
  "booking",
  "property",
  "calendar",
  "inbox",
  "notifications",
];

export default function MainStayLayout() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "stats";
  const propertyTab = searchParams.get("property") || "false";
  const siteTab = searchParams.get("showSiteForm") || "false";
  const router = useRouter();

  const createTabUrl = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    return `?${params.toString()}`;
  };

  const handleBackToSites = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("showSiteForm");
    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center gap-4 p-3 md:px-4 md:py-3 lg:px-6 lg:py-4 bg-white h-fit sticky top-16 z-40">
        <div className="flex items-center gap-4">
          {(propertyTab === "true" || siteTab === "true") && (
            <button
              type="button"
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                router.push("/host/stay?tab=property");
              }}
            >
              <svg
                className={`w-4 h-4 transition-transform duration-300 rotate-180`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <p className="text-[14px] md:text-[16px] font-bold">Back</p>
            </button>
          )}
          <h3 className="text-[18px] font-bold md:text-[24px]">Stay</h3>
        </div>
        {propertyTab !== "true" && siteTab !== "true" && (
          <button
            type="button"
            className="text-white bg-[#3C83F6] py-2 px-5 rounded-lg text-[10px] md:text-[12px] cursor-pointer hover:shadow-md "
            onClick={() => {
              // Set the "property" search param to "true"
              const params = new URLSearchParams(window.location.search);
              params.set("property", "true");
              window.history.replaceState(
                {},
                "",
                `${window.location.pathname}?${params.toString()}`
              );
            }}
          >
            Add New Property
          </button>
        )}
      </div>

      {propertyTab !== "true" && siteTab !== "true" && (
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
      )}
      {/* Content according to the tabs */}

      {currentTab === "stats" &&
        propertyTab !== "true" &&
        siteTab !== "true" && (
          <div>
            <StatsMain />
          </div>
        )}
      {currentTab === "booking" &&
        propertyTab !== "true" &&
        siteTab !== "true" && (
          <div>
            <BookingsMain />
          </div>
        )}
      {currentTab === "property" &&
        propertyTab !== "true" &&
        siteTab !== "true" && (
          <div className="p-3 md:px-4 md:py-3 lg:px-6 lg:py-4">
            <PropertyMain />
          </div>
        )}
      {currentTab === "calendar" &&
        propertyTab !== "true" &&
        siteTab !== "true" && <div>Calendar</div>}
      {currentTab === "inbox" &&
        propertyTab !== "true" &&
        siteTab !== "true" && <div>Inbox</div>}
      {currentTab === "notifications" &&
        propertyTab !== "true" &&
        siteTab !== "true" && <div>Notifications</div>}
      {propertyTab === "true" && siteTab !== "true" && <PropertyForm />}
      {propertyTab !== "true" && siteTab === "true" && (
        <SitesForm onBack={handleBackToSites} />
      )}
    </div>
  );
}
