"use client";
import NavBar from "@/components/host/NavBar";
import React, { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="">
      {/* Fixed Header */}
      <div className="h-fit sticky top-0 z-50 bg-white flex-shrink-0">
        <NavBar />
      </div>

      <main className="bg-white">{children}</main>
    </div>
  );
}
