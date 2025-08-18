"use client"
import api from "@/lib/api";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface SideExploreProps {
  onExploreClick?: () => void;
}

const SideExplore = ({ onExploreClick }: SideExploreProps) => {

  const [activeSection, setActiveSection] = useState<string | null>("explore");

  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("token"); // if you must use it
        const res = await api.get("journeys", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // depending on your api wrapper, res could be Response or already JSON:
        const data = res.json ? await res.json() : res;
        // @ts-ignore
        setTrips(data.data); // adapt to API shape
      } catch (e) {
        console.error(e);
      }
    };
    fetchTrips();
  }, []);

  console.log(trips, "trips11111111111111111111111111111");
  return (
    <div className="w-60 bg-white shadow-sm h-full flex flex-col">
      {/* Header with Search Icon */}
      <button
        type="button"
        onClick={() => {
          onExploreClick?.();
          setActiveSection("explore");
        }}
        className={`flex items-center gap-2 p-4 ${activeSection === "explore" ? "bg-[#1164E2] text-white" : "bg-white"
          } font-semibold text-left`}
      >
        <div
          className={`w-6 h-6 rounded flex items-center justify-center ${activeSection === "explore" ? "bg-white" : "bg-black"
            }`}
        >
          <svg
            className={`w-4 h-4 ${activeSection === "explore" ? "text-[#1164E2]" : "text-white"
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <span>Explore</span>
      </button>

      {/* Menu Items */}
      <div className="flex-1">
        {/* My Journey header row */}
        <button
          type="button"
          onClick={() =>
            setActiveSection((prev) => (prev === "journey" ? null : "journey"))
          }
          className={`w-full flex items-center gap-3 p-4 border-b border-gray-100 ${activeSection === "journey"
            ? "bg-[#1164E2] text-white"
            : "hover:bg-gray-50"
            }`}
        >
          <div
            className={`w-8 h-8 rounded flex items-center justify-center ${activeSection === "journey" ? "bg-white" : "bg-black"
              }`}
          >
            <Image
              src="/journey.png"
              alt="My Journey"
              width={16}
              height={16}
              className={`w-8 h-8 ${activeSection === "journey" ? "" : "filter brightness-0 invert"
                }`}
            />
          </div>
          <span
            className={`font-medium ${activeSection === "journey" ? "text-white" : "text-gray-800"
              }`}
          >
            My Journey
          </span>
          <svg
            className={`w-4 h-4 ml-auto ${activeSection === "journey" ? "text-white" : "text-gray-400"
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                activeSection === "journey" ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"
              }
            />
          </svg>
        </button>

        {/* Expanded Trips list */}
        {activeSection === "journey" && (
          <div className="px-4 py-3 space-y-3">
            <div className="text-sm font-medium text-gray-800">Trips</div>
            {trips.map((trip, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden">
                  <Image
                    src="https://via.placeholder.com/150?text=No+Image"

                    alt="trip image"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-gray-900 truncate max-w-[180px]">
                    {trip.title}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Date {trip.start_date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideExplore;
