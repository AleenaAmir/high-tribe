import React from 'react';
import Image from 'next/image';

const Message = () => {
  return (
    <div className="w-full min-h-screen relative bg-[#f5f4f4]">
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        
        {/* Main Heading */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-gray-900">
            Message from Founder
          </h1>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left Section - Profile Picture and Info */}
          <div className="flex flex-col items-center lg:items-start space-y-4 sm:space-y-6 order-2 lg:order-1">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-40 xl:w-48 lg:h-40 xl:h-48 rounded-full border-2 border-[#b445a0] flex items-center justify-center overflow-hidden">
                <Image 
                  src="/dashboard/landingpage/Avatar.png"
                  alt="Umer Hussain - Founder"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            
            {/* Name and Title */}
            <div className="text-center lg:text-left">
              <h2 className="text-xl sm:text-2xl lg:text-xl xl:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                Umer Hussain
              </h2>
              <p className="text-base sm:text-lg lg:text-base xl:text-lg text-gray-700">
                Founder @Hightribe
              </p>
            </div>
          </div>

          {/* Right Section - Message Text */}
          <div className="order-1 lg:order-2">
            {/* Text content with left padding for border */}
            <div className="pl-6 sm:pl-8 space-y-4 sm:space-y-6 relative">
              {/* Purple border line - only covering the text height */}
              <div className="absolute left-0 top-0 bottom-0  lg:h-[20%] w-1 sm:w-2 bg-[#b445a0] rounded-full"></div>
              
              <p className="font-inter font-normal text-base sm:text-lg lg:text-lg xl:text-xl 2xl:text-2xl leading-relaxed sm:leading-[32px] tracking-[-0.01%] text-[#1C1C24]">
                For 16 years I built spaces that held people 17 restaurants, 26 glamping sites, and countless nights where stars lit the conversations. Then I stepped away, not to chase more, but to find what's real — the kind of connection that feels like home.
              </p>
              
              <p className="font-inter font-normal text-base sm:text-lg lg:text-lg xl:text-xl 2xl:text-2xl leading-relaxed sm:leading-[32px] tracking-[-0.01%] text-[#1C1C24]">
                HighTribe was born from that search. A place where modern tools empower us, not own us; where communities grow stronger, and stories travel farther.
              </p>
              
              <p className="font-inter font-normal text-base sm:text-lg lg:text-lg xl:text-xl 2xl:text-2xl leading-relaxed sm:leading-[32px] tracking-[-0.01%] text-[#1C1C24]">
                We open this September. Come be a founding tribe member. You already belong.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
