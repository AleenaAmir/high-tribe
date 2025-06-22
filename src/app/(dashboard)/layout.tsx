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
    <div className="relative min-h-screen flex flex-col">
      <div className="h-fit sticky top-0 z-50 bg-white">
        <NavBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile/Tablet Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/15 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <aside
          className={`
            fixed lg:relative inset-y-0 left-0 lg:z-40 z-50
            w-[276px] flex-shrink-0
            bg-white flex flex-col
            transform transition-transform duration-300 ease-in-out
            lg:transform-none
            overflow-y-auto
            ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
        >
          <div className="flex-1 flex flex-col space-y-4 p-4">
            <SideBar onItemClick={() => setIsSidebarOpen(false)} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#f9f9f9]">{children}</main>
      </div>
    </div>
  );
}
