"use client";
import api from "@/lib/api";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface SideExploreProps {
  onExploreClick?: () => void;
  onJourneyClick?: (journey: any) => void;
}

const SideExplore = ({ onExploreClick, onJourneyClick }: SideExploreProps) => {
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
        className={`flex items-center gap-2 p-4 ${
          activeSection === "explore" ? "bg-[#1164E2] text-white" : "bg-white"
        } font-semibold text-left`}
      >
        <div
          className={`w-6 h-6 rounded flex items-center justify-center ${
            activeSection === "explore" ? "bg-white" : "bg-black"
          }`}
        >
          <svg
            className={`w-4 h-4 ${
              activeSection === "explore" ? "text-[#1164E2]" : "text-white"
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
          className={`w-full flex items-center gap-3 p-4 border-b border-gray-100 ${
            activeSection === "journey"
              ? "bg-[#1164E2] text-white"
              : "hover:bg-gray-50"
          }`}
        >
          <div
            className={`w-8 h-8 rounded flex items-center justify-center ${
              activeSection === "journey" ? "bg-white" : "bg-black"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="19"
              fill="none"
              viewBox="0 0 20 19"
            >
              <g clipPath="url(#clip0_1032_48189)">
                <path
                  fill={activeSection === "journey" ? "#000" : "#fff"}
                  fillRule="evenodd"
                  d="m17.713 6.44 1.12-1.073a.737.737 0 0 0 0-1.073.815.815 0 0 0-1.12 0l-1.119 1.073-1.12-1.073a.815.815 0 0 0-1.119 0 .737.737 0 0 0 0 1.073l1.12 1.074-1.12 1.073a.737.737 0 0 0 0 1.074.8.8 0 0 0 .56.222.8.8 0 0 0 .56-.222l1.12-1.074 1.118 1.074a.8.8 0 0 0 .56.222.8.8 0 0 0 .56-.222.737.737 0 0 0 0-1.074zm-1.119 3.417c-.438 0-.792.34-.792.76v.759c0 .42.354.759.792.759s.792-.34.792-.76v-.759c0-.419-.354-.759-.792-.759m-5.033 3.771a2.75 2.75 0 0 1-.836-.78.81.81 0 0 0-1.098-.21.74.74 0 0 0-.22 1.052c.34.49.794.913 1.313 1.225.131.079.276.115.42.115a.8.8 0 0 0 .671-.355.74.74 0 0 0-.25-1.047m3.282-.241c-.3.25-.645.43-1.023.537a.756.756 0 0 0-.535.944.79.79 0 0 0 .76.543q.112 0 .224-.031a4.4 4.4 0 0 0 1.609-.844.737.737 0 0 0 .081-1.07.813.813 0 0 0-1.116-.08M3.137 8.167c-.437 0-.792.341-.792.76v1.45c0 .418.355.759.792.759s.792-.34.792-.76V8.927c0-.419-.355-.76-.792-.76M4.55 4.557a3.95 3.95 0 0 0-1.432 1.15.74.74 0 0 0 .167 1.063.816.816 0 0 0 1.107-.16 2.4 2.4 0 0 1 .86-.692A.746.746 0 0 0 5.61 4.9a.81.81 0 0 0-1.06-.344m4.816 2.317a.74.74 0 0 0 .206-1.055 3.9 3.9 0 0 0-1.388-1.2.813.813 0 0 0-1.073.307.745.745 0 0 0 .32 1.03c.332.17.62.42.835.72a.815.815 0 0 0 1.1.197m.896 3.613v-1.45c0-.419-.354-.759-.791-.759s-.792.34-.792.76v1.449c0 .419.355.759.792.759s.791-.34.791-.76m-7.124 2.028c-.437 0-.792.34-.792.76v.759c0 .42.355.759.792.759s.792-.34.792-.76v-.758c0-.42-.355-.76-.792-.76"
                  clipRule="evenodd"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_1032_48189">
                  <path
                    fill={activeSection === "journey" ? "#000" : "#fff"}
                    d="M.762.275H19.76v18.22H.762z"
                  ></path>
                </clipPath>
              </defs>
            </svg>
          </div>
          <span
            className={`font-medium ${
              activeSection === "journey" ? "text-white" : "text-gray-800"
            }`}
          >
            My Journey
          </span>
          <svg
            className={`w-4 h-4 ml-auto ${
              activeSection === "journey" ? "text-white" : "text-gray-400"
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
                className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onJourneyClick?.(trip)}
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden">
                  <img
                    src="https://placehold.co/400"
                    alt="trip image"
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
