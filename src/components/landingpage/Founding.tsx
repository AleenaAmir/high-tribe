import React from 'react';

const Founding = () => {
  return (
    <div className="w-full bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading and Subtitle */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Join The founding Tribe
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Be one of the first to shape this movement. We're not launching at you.
            <br />
            We're building with you.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1: Explore Soulful Stays */}
          <div className="bg-[#F1F9FF] rounded-xl p-6  border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16  rounded-full flex items-center justify-center mb-6 mx-auto">
            <img src="/dashboard/landingpage/Featured icon 1.png" alt="Explore Soulful Stays" className="w-11 h-11" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
              Explore Soulful Stays
            </h3>
            <p className="text-[#4d4f50] text-center leading-relaxed">
              Be the first to explore unique stays & local experiences curated for connection.
            </p>
          </div>

          {/* Card 2: Unlock Exclusive Perks */}
          <div className="bg-[#F1F9FF] rounded-xl p-6  border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16  rounded-full flex items-center justify-center mb-6 mx-auto">
            <img src="/dashboard/landingpage/Featured icon 2.png" alt="Unlock Exclusive Perks" className="w-11 h-11" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
              Unlock Exclusive Perks
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Get free bookings, limited edition invites, and special access as a founding member.
            </p>
          </div>

          {/* Card 3: Shape the Community */}
          <div className="bg-[#F1F9FF] rounded-xl p-6  border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16  rounded-full flex items-center justify-center mb-6 mx-auto">
            <img src="/dashboard/landingpage/Featured icon 3.png" alt="Shape the Community" className="w-11 h-11" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
              Shape the Community
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Your voice matters. Help us shape the future of community-powered travel.
            </p>
          </div>

          {/* Card 4: Private Group Access */}
          <div className="bg-[#F1F9FF] rounded-xl p-6  border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16  rounded-full flex items-center justify-center mb-6 mx-auto relative">
            <img src="/dashboard/landingpage/Featured icon 4.png" alt="Private Group Access" className="w-11 h-11" />
              <div className="absolute inset-0 border-2 border-white border-dashed rounded-full"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
              Private Group Access
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Join our inner circle, get early host listing privileges, and test beta features first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Founding;














