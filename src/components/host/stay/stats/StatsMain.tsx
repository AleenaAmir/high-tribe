import React, { useState } from "react";
import StatsSideSection from "./StatsSideSection";
import StatsSummaryCards from "./StatsSummaryCards";
import StatsGraph from "./StatsGraph";

export default function StatsMain() {
  const [activeTab, setActiveTab] = useState("stats");
  const [filters, setFilters] = useState("stats");
  return (
    <div>
      <div className="p-3 md:px-4 md:py-1 lg:px-6 lg:py-1 flex items-center justify-between bg-[#F8F8F8]">
        <div className="flex items-center gap-2">
          <button
            className={`cursor-pointer py-1 px-3 rounded-md text-[12px] ${
              activeTab === "stats"
                ? "bg-white font-bold"
                : "hover:bg-white hover:font-bold"
            }`}
            onClick={() => setActiveTab("stats")}
          >
            Stats
          </button>
          <button
            className={`cursor-pointer py-1 px-3 rounded-md text-[12px] ${
              activeTab === "report"
                ? "bg-white font-bold"
                : "hover:bg-white hover:font-bold"
            }`}
            onClick={() => setActiveTab("report")}
          >
            Report
          </button>
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          <p>Filter by</p>
          <button
            onClick={() => setFilters("all")}
            className={`cursor-pointer py-1 px-3 rounded-full   border border-[#1D1D1D] ${
              filters === "all"
                ? "bg-black text-white"
                : "text-black text-[12px] hover:bg-black bg-white hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilters("monthly")}
            className={`cursor-pointer py-1 px-3 rounded-full  text-[12px]  border border-[#1D1D1D] ${
              filters === "monthly"
                ? "bg-black text-white"
                : "text-black text-[12px] hover:bg-black bg-white hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setFilters("yearly")}
            className={`cursor-pointer py-1 px-3 rounded-full  text-[12px]  border border-[#1D1D1D] ${
              filters === "yearly"
                ? "bg-black text-white"
                : "text-black text-[12px] hover:bg-black bg-white hover:text-white"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className=" grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3 p-3 md:px-4 md:py-3 lg:px-6 lg:py-4">
          <StatsSideSection />
        </div>
        <div className="lg:col-span-9 bg-white p-3 md:px-4 md:py-3 lg:px-6 lg:py-4">
          <StatsSummaryCards />
          <StatsGraph />
        </div>
      </div>
    </div>
  );
}
