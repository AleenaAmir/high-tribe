import React from 'react';
import Image from 'next/image';
import image2 from '../../../public/dashboard/landingpage/highLogo.png'

const Footer = () => {
  return (
    <div className="w-full bg-black py-10">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          {/* Left Section - Logo and Tagline */}
          <div className="space-y-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src={image2}
                  alt="Logo"
                  width={200}
                  height={200} 
                />
              </div>
            </div>
            
            {/* Tagline */}
            <div className="space-y-1">
              <p className="text-[16px] leading-[150%] font-normal text-[#FFFFFF] tracking-[0%] font-inter">
                Building a platform were humans connect, not just
              </p>
              <p className="text-[16px] leading-[150%] font-normal text-[#FFFFFF] tracking-[0%] font-inter">
                scroll. Join the movement, not just another app
              </p>
            </div>
          </div>

          {/* Right Section - Follow Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Follow Us
            </h3>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              {/* Facebook */}
              <a 
                href="#" 
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors border border-gray-300"
              >
                <span className="text-black font-bold text-sm">f</span>
              </a>
              
              {/* YouTube */}
              <a 
                href="#" 
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors border border-gray-300"
              >
                <svg 
                  className="w-5 h-5 text-black" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </a>
              
              {/* Instagram */}
              <a 
                href="#" 
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors border border-gray-300"
              >
                <svg 
                  className="w-5 h-5 text-black" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              
              {/* LinkedIn */}
              <a 
                href="#" 
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors border border-gray-300"
              >
                <span className="text-black font-bold text-sm">in</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
