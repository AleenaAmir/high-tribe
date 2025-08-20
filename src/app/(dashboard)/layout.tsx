"use client";
import React, { useState } from "react";
import NavBar from "@/components/dashboard/NavBar";
import SideBar from "@/components/dashboard/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="h-fit sticky top-0 z-50 bg-white flex-shrink-0">
        <NavBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      {/* Main Container with fixed height */}
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-80px)]">
        {/* Mobile/Tablet Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/15 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar - Independent Scroll */}
        <aside
          className={`
            fixed lg:relative inset-y-0 left-0 lg:z-40 z-50
            w-[280px] flex-shrink-0
            bg-white flex flex-col
            transform transition-transform duration-300 ease-in-out
            lg:transform-none
            h-full
            ${isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
            }
          `}
        >
          <div className="flex-1 flex flex-col pl-8 pr-2 pt-2 overflow-y-auto scrollbar-hide">
            <SideBar onItemClick={() => setIsSidebarOpen(false)} />
          </div>
        </aside>

        {/* Main Content Area - Independent Scroll */}
        <main className="flex-1 overflow-hidden bg-[#f9f9f9]">{children}</main>
      </div>
    </div>
  );
}
