"use client";

import React from 'react';

const Disconect = () => {
  return (
         <div className="relative w-full h-[788px] min-h-screen bg-black flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0  bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/dashboard/landingpage/discount.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
      
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
      <div className="relative z-10 text-center px-4 sm:px-4 lg:px-8 max-w-4xl mx-auto">
       
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 sm:mb-10 lg:mb-12 text-pink-400">
          The Disconnect
        </h1>
        <div className="text-left text-white text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-8 sm:mb-10 lg:mb-12 space-y-4 sm:space-y-6 max-w-3xl mx-auto">
          <p>
            Some <span className="text-purple-400">maps</span> will tell you where, but never why.
          </p>
          <p>
            Some <span className="text-purple-400">spaces</span> have become algorithmic books of ads — and <span className="text-purple-400">feeds that feed on you</span>.
          </p>
          <p>
            Some stays feel like a <span className="text-purple-400">transactional BnB</span> — floating in the air, never grounded.
          </p>
          <p>
            Some event sites are <span className="text-purple-400">brite on tickets</span>, but dim on belonging.
          </p>
        </div>

        <button className="px-8 sm:px-10 lg:px-12 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg sm:text-xl rounded-full hover:from-purple-700 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25">
          Join the founding Tribe
        </button>
      </div>
      
    </div>
  );
};

export default Disconect;
