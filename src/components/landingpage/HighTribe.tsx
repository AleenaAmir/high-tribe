"use client";

import React from 'react';

const HighTribe = () => {
  return (
    <div className="w-full h-[780px] min-h-screen bg-black flex p-1  ">
      {/* Left Section - Campfire Photo */}
      <div className="w-2/5 relative rounded-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-2xl "
          style={{
            backgroundImage: `url('/dashboard/landingpage/high.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark overlay for better text readability if needed */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </div>

      {/* Right Section - Text Content */}
      <div className="w-3/5 bg-black relative ">
        {/* Subtle purple gradient on right edge */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-purple-900/30 to-transparent "></div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-12 lg:px-16 xl:px-20">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            <span className="text-purple-400">HighTribe</span>
            <span className="text-white"> is different</span>
          </h1>
          
          {/* Main Text */}
          <p className="text-lg md:text-xl lg:text-2xl text-white leading-relaxed mb-8 max-w-2xl">
            HighTribe is our response — a human-powered, soul-first platform built to reconnect people, stories, and shared experiences.
          </p>
          
          {/* Quoted Text */}
          <blockquote className="text-base md:text-lg lg:text-xl text-white leading-relaxed max-w-2xl italic">
            "We bring people back to the center - where planning is personal, hosting is human, and every event, space, and story begins with real connection"
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default HighTribe;
