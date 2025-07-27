import NavBar from "@/components/host/NavBar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white flex-shrink-0">
        <NavBar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
