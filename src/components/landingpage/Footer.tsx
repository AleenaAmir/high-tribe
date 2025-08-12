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
               {/* Logo Image */}
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
              <p className="text-sm md:text-base text-white/80 leading-relaxed">
                Building a platform where humans connect, not just scroll.
              </p>
              <p className="text-sm md:text-base text-white/80 leading-relaxed">
                Join the movement, not just another app.
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
                className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
              >
                <span className="text-black font-bold text-sm">f</span>
              </a>
              
              {/* YouTube */}
              <a 
                href="#" 
                className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center hover:bg-purple-700 transition-colors"
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
                className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
              >
                <svg 
                  className="w-5 h-5 text-black" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox=""
                
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              
              {/* LinkedIn */}
              <a 
                href="#" 
                className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center hover:bg-purple-700 transition-colors"
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
