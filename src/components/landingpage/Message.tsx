import React from 'react';
import Avtar from '../../../public/dashboard/landingpage/Avatar.png'
const Message = () => {
  return (
         <div className="w-full min-h-screen bg-black relative">
       
       <div className="absolute inset-0 opacity-10">
         <div className="w-full h-full" style={{
           backgroundImage: `
             linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
           `,
           backgroundSize: '50px 50px'
         }}></div>
       </div>
     
       <div className="relative w-full max-w-3xl mx-auto px-4 py-16">
       
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            <span className="text-purple-400">Message from </span>
            <span className="text-pink-400">Founder</span>
          </h1>
        </div>

       
        <div className="grid lg:grid-cols-2 gap-12 items-center">
         
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              {/* Orange background circle with purple border */}
              <div className="w-64 h-64 md:w-80 md:h-80 bg-orange-500 rounded-full border-2 border-purple-400 flex items-center justify-center overflow-hidden">
                {/* Placeholder for founder image - replace with actual image */}
                {/* <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold"></span>
                </div> */}
                {/* Uncomment and replace with actual image when available */}
                <img 
                  src={Avtar.src}
                  alt="Founder" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Right Section - Message Text */}
          <div className="space-y-6 font-bold">
            <p className="text-lg md:text-base lg:text-lg text-gray-300 leading-relaxed mb-8 ">
              I've spent the last 21 years building places that didn't just serve—they held people.
            </p>
            
            <p className="text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed">
              Seventeen restaurants. Twenty-six glamping locations. Thousands of people. Hundreds of gatherings under open skies. We built communities.
            </p>
            
            <p className="text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed">
              But a few years ago, I stepped away. I had to disconnect—from business, from metrics, from endless doing. I didn't know what I was looking for; I just knew I needed space to ask better questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
