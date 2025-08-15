"use client";
import React from 'react';

const Disconect = () => {
  return (
    <div className="w-full bg-gray-50 flex items-center justify-center p-2 relative ">
     
      <div className="absolute bottom-3 left-4 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 opacity-10 pointer-events-none">
        <img src="/dashboard/landingpage/star.png" alt="star" className="w-full h-full translate-y-2" />
      </div>
    
    {/* Main Card Container - Fixed size like the image */}
    <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg overflow-hidden relative">
      <div className="flex flex-col lg:flex-row min-h-[400px] lg:h-[620px] pb-3">
        
        {/* Left Section - Text Content - 60% width */}
        <div className="w-full lg:w-3/4 p-4 lg:p-6 flex flex-col justify-center items-start order-2 lg:order-1">
          {/* Heading */}
          <div className="mb-2 relative">
          <div className="absolute top-0 left-8 sm:left-10 lg:left-12">
            <img src="/dashboard/landingpage/star.png" alt="star" className="w-12 h-7 sm:w-14 sm:h-8 lg:w-16 lg:h-9 opacity-100" />
          </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
              The Disconnect
            </h1>
          </div>
          
          {/* Bullet Points */}
          <div className="space-y-2 mt-6 lg:mt-10">
            {/* Point 1 - Maps */}
            <div className="flex items-start gap-3 lg:gap-4">
              <div className="w-[32px] h-[32px] lg:w-[36px] lg:h-[36px] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <img src="/dashboard/landingpage/map.svg" alt="map" className="w-10 h-5 lg:w-12 lg:h-6" />
              </div>
              <p className="text-black text-base lg:text-lg font-medium leading-relaxed">
                Google maps will tell you where, but never why.
              </p>
            </div>
            
            {/* Point 2 - Social Media */}
            <div className="flex items-start gap-3 lg:gap-4">
              <div className="w-[32px] h-[32px] lg:w-[36px] lg:h-[36px] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <img src="/dashboard/landingpage/share.svg" alt="share" className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <p className="text-black text-base lg:text-lg font-medium leading-relaxed">
                Social media has become algorithmic books of ads - feeds that feed on you.
              </p>
            </div>
            
            {/* Point 3 - Stays */}
            <div className="flex items-start gap-3 lg:gap-4">
              <div className="w-[32px] h-[32px] lg:w-[36px] lg:h-[36px] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <img src="/dashboard/landingpage/home.svg" alt="home" className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <p className="text-black text-base lg:text-lg font-medium leading-relaxed">
                Stays feel like floating, transactional BnBs, never rooted, never grounded.
              </p>
            </div>
            
            {/* Point 4 - Events */}
            <div className="flex items-start gap-3 lg:gap-4">
              <div className="w-[32px] h-[32px] lg:w-[36px] lg:h-[36px] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <img src="/dashboard/landingpage/event.svg" alt="event" className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <p className="text-black text-base lg:text-lg font-medium leading-relaxed">
                Event sites are often bright on tickets, but dim on belonging.
              </p>
            </div>
          </div>
          
          {/* Call-to-Action Button */}
          <div className="mb-4 flex justify-start">
            <button className="mt-6 lg:mt-10 w-fit py-3 px-6 bg-[#BA50C0] text-white font-semibold text-base lg:text-lg rounded-full hover:bg-[#FFACE4] transition-all duration-200 shadow-lg">
              Join The Founding Tribe
            </button>
          </div>
          
          {/* Star below button */}
          <div className="absolute bottom-0 left-2 sm:left-3 lg:left-4">
            <img src="/dashboard/landingpage/star.png" alt="star" className="w-20 h-16 sm:w-24 sm:h-20 lg:w-30 lg:h-25 opacity-100" />
          </div>
        </div>
        
        {/* Right Section - Campfire Image Container - 40% width */}
        <div className="w-full lg:w-2/5 relative flex items-center justify-center p-4 order-1 lg:order-2">
          {/* Inner div for image - vertical rounded rectangle */}
          <div className="w-full max-w-sm h-[300px] sm:h-[350px] lg:h-[450px] bg-gray-100 rounded-2xl overflow-hidden">
            {/* Image container */}
            <div className="w-full h-full relative">
              <img 
                src="/dashboard/landingpage/disconect.png" 
                alt="People gathered around campfire"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to a placeholder if image doesn't exist
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.display = 'flex';
                  e.currentTarget.style.alignItems = 'center';
                  e.currentTarget.style.justifyContent = 'center';
                  e.currentTarget.innerHTML = '<div class="text-gray-500 text-center"><svg class="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><p>Campfire Image</p></div>';
                }}
              />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
  );
};

export default Disconect;