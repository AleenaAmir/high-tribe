"use client";
import React, { useState } from "react";
import HostSideBarIcon1 from "./svgs/HostSideBarIcon1";
import HostSideBarIcon2 from "./svgs/HostSideBarIcon2";
import HostSideBarIcon3 from "./svgs/HostSideBarIcon3";
import HostSideBarIcon4 from "./svgs/HostSideBarIcon4";
import HostSideBarIcon5 from "./svgs/HostSideBarIcon5";
import HostSideBarIcon6 from "./svgs/HostSideBarIcon6";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HostSideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebar = [
    {
      title: "home",
      icon: <HostSideBarIcon1 />,
    },
    {
      title: "stay",
      icon: <HostSideBarIcon2 />,
    },
    {
      title: "cooking",
      icon: <HostSideBarIcon3 />,
    },
    {
      title: "guide",
      icon: <HostSideBarIcon4 />,
    },
    {
      title: "events",
      icon: <HostSideBarIcon5 />,
    },
    {
      title: "community",
      icon: <HostSideBarIcon6 />,
    },
  ];

  const pathname = usePathname();

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-2 left-1 z-50 p-1 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 transition-all duration-300"
        aria-label="Toggle Sidebar"
      >
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
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
      </button>

      {/* Sidebar */}
      <div
        className={`bg-white p-2 w-[75px]  h-screen flex flex-col transition-all duration-300 ${
          isOpen
            ? "translate-x-0 border-r fixed z-40 border-[#F3F3F3]"
            : "-translate-x-full lg:translate-x-0 lg:border-r lg:border-[#F3F3F3]"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col gap-2 justify-start items-center h-full pt-12 lg:pt-0">
          {sidebar.map((item) => (
            <Link
              key={item.title}
              className={`p-2 flex items-center justify-center aspect-square transition-all duration-300 cursor-pointer rounded-lg ${
                item.title === pathname.split("/")[2]
                  ? "bg-[#1179FA] text-white"
                  : "bg-white text-[#B9B9B9] hover:bg-[#1179FA] hover:text-white"
              }`}
              href={`/host/${item.title}`}
              onClick={() => setIsOpen(false)} // Close sidebar on mobile when item is clicked
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
