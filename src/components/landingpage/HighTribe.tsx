"use client";

import React from 'react';

const HighTribe = () => {
  return (
    <div className="w-full min-h-screen relative items-center justify-center bg-center bg-no-repeat mb-1 ">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-70"
        style={{
          backgroundImage: `url('/dashboard/landingpage/high.png')`,
          
        }}
      ></div>
      
                          {/* Dark Overlay */}
        <div className="absolute inset-0   bg-black/55  "></div> 
       
       {/* Content Container */}
       <div className="relative  h-full flex items-center justify-center pt-20">
         <div className="text-center max-w-4.5xl px-8">
           {/* Main Heading */}
           <h1 className="text-white mb-16 text-center text-7xl font-bold leading-[61.6px] tracking-[-1.12px]">
             HighTribe is different
           </h1>
           
                       {/* Body Text */}
            <div className="space-y-4 mb-16 text-center text-2xl font-medium leading-[157%]">
              <p className="text-white">Some maps will tell you where, but never why.</p>
              
              <p className="text-white">
                Some spaces have become algorithmic books of ads — and feeds that feed on <br />
                you.
              </p>
              
              <p className="text-white">
                Some stays feel like a transactional BnB — floating in the air, never grounded.
              </p>
              
              <p className="text-white">Some event sites are brite on tickets, but dim on belonging.</p>
            </div>
          
                     {/* Call-to-Action Button */}
           <div className="flex justify-center">
             <button className="bg-white text-black font-semibold text-lg px-15 py-4 rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-lg">
               Join the founding Tribe
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HighTribe;
