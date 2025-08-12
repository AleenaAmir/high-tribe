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
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
       
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          The Disconnect
        </h1>
        <div className="text-left text-white text-lg md:text-xl lg:text-2xl leading-relaxed mb-12 space-y-6">
          <p>
            In a digital world obsessed with technology, connection feels harder than ever.
          </p>
          <p>
            Google maps will tell you where, but never why.
          </p>
          <p>
            Social media has become algorithmic books of ads - feeds that feed on you.
          </p>
          <p>
            Stays feel like floating, transactional BnBs, never rooted, never grounded.
          </p>
          <p>
            Event sites are often brite on tickets, but dim on belonging.
          </p>
        </div>

        <button className="px-12 py-5 bg-fuchsia-600 text-white font-bold text-xl rounded-full hover:bg-fuchsia-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-fuchsia-500/25">
          But what if technology could bring us closer instead?
        </button>
      </div>
      
    </div>
  );
};

export default Disconect;
