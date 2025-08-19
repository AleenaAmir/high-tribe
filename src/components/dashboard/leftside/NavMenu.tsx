"use client";
import React from "react";
import Image from "next/image";

const navItems = [
  {
    label: "Home",
    icon: "/dashboard/navsvg1.svg",
  },
  {
    label: "Messaging",
    icon: "/dashboard/navsvg3.svg",
  },
  {
    label: "Notifications",
    icon: "/dashboard/navsvg6.svg",
  },
  {
    label: "Friends",
    icon: "/dashboard/navsvg2.svg",
  },
  {
    label: "My Tribe",
    icon: "/dashboard/navsvg5.svg",
  },
];

interface NavMenuProps {
  active?: string;
  onItemClick?: () => void;
  isSidebar?: boolean;
}

const NavMenu = ({ active, onItemClick, isSidebar }: NavMenuProps) => (
  <div className="py-1">
    {/* Navigation Items */}
    <div className="py-1">
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={onItemClick}
          className={`w-full flex items-center space-x-3 px-4 py-2 text-sm text-[#000000] font-gilroy font-[7e00] leading-[100%] tracking-[-3%] hover:bg-gray-100 ${active === item.label ? "bg-gray-50" : ""
            }`}
        >
          <Image
            src={item.icon}
            alt={item.label}
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span>{item.label}</span>
        </button>
      ))}
    </div>

    {/* Switch to Hosting Button - Show on sidebar or mobile */}
    {isSidebar && (
      <div className="px-4 py-2 border-t">
        <button className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900">
              Switch to hosting
            </span>
          </div>
          <svg
            className="w-4 h-4 text-gray-600"
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
      </div>
    )}
  </div>
);

export default NavMenu;
