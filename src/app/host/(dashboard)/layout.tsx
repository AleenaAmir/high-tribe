import HostSideBar from "@/components/host/HostSideBar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="lg:flex bg-[#fbfbfb]">
      {/* Desktop Sidebar - sticky on lg+ */}
      <div className="hidden lg:block">
        <div className="sticky top-16 h-[calc(100vh-80px)] overflow-hidden">
          <HostSideBar />
        </div>
      </div>

      {/* Mobile Sidebar - overlay behavior, no space taken */}
      <div className="lg:hidden absolute top-0 left-0 z-50">
        <HostSideBar />
      </div>

      {/* Main Content - full width on mobile, with gap on desktop */}
      <main className=" w-full lg:grow">{children}</main>
    </div>
  );
}
