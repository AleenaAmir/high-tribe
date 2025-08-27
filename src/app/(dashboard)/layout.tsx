"use client";
import React, { useState } from "react";
import NavBar from "@/components/dashboard/NavBar";
import SideBar from "@/components/dashboard/SideBar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white flex-shrink-0">
        <NavBar onMenuClick={() => setIsSidebarOpen((v) => !v)} />
      </header>

      {/* Content Row: sidebar + main (no height hacks, just flex with min-h-0) */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Mobile/Tablet Sidebar Overlay */}
        {isSidebarOpen && (
          <button
            aria-label="Close sidebar overlay"
            className="fixed inset-0 bg-black/15 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar (slides in on mobile, static on lg+) */}
        {pathname === "/dashboard" && (
          <aside
            className={[
              "fixed inset-y-0 left-0 z-50 bg-white flex flex-col",
              "transform transition-transform duration-300 ease-in-out",
              "w-[280px] xl:w-[300px] flex-shrink-0",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full",
              "lg:static lg:translate-x-0 lg:z-40",
            ].join(" ")}
            aria-hidden={!isSidebarOpen}
          >
            <div className="flex-1 flex flex-col pl-8 pr-2 pt-2 overflow-y-auto">
              <SideBar onItemClick={() => setIsSidebarOpen(false)} />
            </div>
          </aside>
        )}

        {/* Main content (scrollable) */}
        <main className="flex-1 overflow-y-auto bg-[#f9f9f9]">{children}</main>
      </div>
    </div>
  );
}
