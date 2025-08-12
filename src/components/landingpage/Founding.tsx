import React from 'react';

const Founding = () => {
  return (
         <div className="w-full  min-h-screen bg-black relative">
       {/* Background Image */}
       <div 
         className="w-full absolute inset-0 bg-cover bg-center bg-no-repeat"
         style={{
           backgroundImage: `url('/dashboard/landingpage/founding.png')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
         }}
       >
         {/* Dark overlay for better text readability */}
         <div className="absolute inset-0 bg-black/60"></div>
       </div>
       
       {/* Main Content */}
       <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-16">
                 <div className="text-center mb-24">
           <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
             <span className="text-pink-400">Become a Part of The Following Tribe</span>
           </h1>
             <p className="text-sm md:text-base lg:text-lg text-gray-300 max-w-2xl mx-auto">
             Be one of the first to shape this movement. We're not launching at you.
             <br />
             We're building with you
            </p>
         </div>

        {/* Founding Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                     {/* Benefit Card 1 */}
           <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 border border-gray-600 hover:border-pink-400 transition-all duration-300">
             <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
               <img src="/dashboard/landingpage/Featured icon 1.png" alt="Explore Soulful Stays" className="w-11 h-11" />
             </div>
            <h3 className="text-lg font-semibold text-white mb-3">Explore Soulful Stays</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Be among the first to explore unique stays & local experiences curated for connection.
            </p>
          </div>

                     {/* Benefit Card 2 */}
           <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 border border-gray-600 hover:border-pink-400 transition-all duration-300">
             <div className="w-12 h-12  rounded-lg flex items-center justify-center mb-4">
               <img src="/dashboard/landingpage/Featured icon 2.png" alt="Unlock Exclusive Perks" className="w-11 h-11" />
             </div>
            <h3 className="text-lg font-semibold text-white mb-3">Unlock Exclusive Perks</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Get tree booidrgs, limited edition merch, and premium status on the platform
            </p>
          </div>

                     {/* Benefit Card 3 */}
           <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 border border-gray-600 hover:border-pink-400 transition-all duration-300">
             <div className="w-12 h-12  rounded-lg flex items-center justify-center mb-4">
               <img src="/dashboard/landingpage/Featured icon 3.png" alt="Shape the Community" className="w-11 h-11" />
             </div>
            <h3 className="text-lg font-semibold text-white mb-3">Shape the Community</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Help shape the platform's direction with direct input on features and priorities
            </p>
          </div>

                     {/* Benefit Card 4 */}
           <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 border border-gray-600 hover:border-pink-400 transition-all duration-300">
             <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
               <img src="/dashboard/landingpage/Featured icon 4.png" alt="Private Group Access" className="w-11 h-11" />
             </div>
            <h3 className="text-lg font-semibold text-white mb-3">Private Group Access</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Connect with other founding members in private channels and exclusive events
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Founding;
