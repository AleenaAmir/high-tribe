import Image from 'next/image';
import React from 'react';
import Form from './Form';
import Discount from './Disconect';
import HighTribe from './HighTribe';
import Message from './Message';
import Founding from './Founding';
import Tour from './Tour';
import Principles from './Principles';
import Footer from './Footer';
import image2 from '../../../public/dashboard/landingpage/highLogo.png'
const Landing = () => {
  return (
    <div className="relative">
      {/* Top Section - Hero with Campfire Background */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image - Campfire scene */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/dashboard/landingpage/landing.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto text-white">
          {/* Logo */}
          <div className="mb-12 pl-[350px]">
                <Image
                   src={image2}
                    alt="Logo"
                    width={250}
                    height={250} 
                    />
          </div>

          {/* Main Headline */}
          <div className="mb-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white mb-6">
              Join the tribe of{' '}
              <span className="text-pink-400">curious</span>
              <br />
              <span className="text-pink-400">explorers</span>,{' '}
              <span className="text-pink-400">heartfelt hosts</span>,
              <br />
              and <span className="text-pink-400">soulful storytellers</span>
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white mb-16 opacity-95 font-medium">
            Apply for early access — help build where people truly belong.
          </p>

          {/* Call to Action Button */}
          <button className="px-12 py-5 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white font-bold text-xl rounded-full  hover:from-purple-700 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25">
            Join the founding Tribe
          </button>
        </div>
      </div>
                          {/* Form Section */}
       <Form />
       <div  className=''>
       <Discount />

       </div>
       <HighTribe /> 
       <Founding/> 
       <Message />
       <Tour />
       
      
       <Principles />
       
      
       <Footer />
    </div>
  );
};

export default Landing;
