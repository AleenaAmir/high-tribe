"use client";
import { useState } from "react";
import Explore from "@/components/explore/Explore";
import SideExplore from "@/components/explore/SideExplore";
import ExploreMap from "@/components/explore/ExploreMap";
const Page = () => {
  const handleMenuClick = () => {
    
  };

  return (
    <div className="min-h-screen bg-gray-50"> 
      <Explore onMenuClick={handleMenuClick} />
      
      <div className="flex">
        <SideExplore />
        <div className="flex-1">        
          <ExploreMap />
        </div>
      </div>
    </div>
  );
};

export default Page;