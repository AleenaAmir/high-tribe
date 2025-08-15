import Image from 'next/image';
import React from 'react';
import Form from './Form2';
import Discount from './Disconect';
import HighTribe from './HighTribe';
import Message from './Message';
import Founding from './Founding';
// import Tour from './Tour';
// import Principles from './Principles';
import Footer from './Footer';
import image2 from '../../../public/dashboard/landingpage/highLogo.png'
import image3 from '../../../public/dashboard/landingpage/Arrow.svg'
import Card from './Card';

const Landing = () => {
  return (
    <div className="relative">
      {/* Top Section - Hero with Beach Background */}
      <div className="relative min-h-screen flex items-center justify-center lg:justify-start overflow-hidden">
        {/* Background Image - Beach scene */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/dashboard/landingpage/land.png')`,
          }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/20 lg:bg-black/10"></div>
          
          {/* Subtle gray gradient overlay on left side */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/40 via-gray-700/20 to-transparent lg:from-gray-800/30 lg:via-gray-700/10 lg:to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-15 max-w-2xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto lg:mx-0 lg:ml-8 xl:ml-12 2xl:ml-15">
          {/* Logo positioned on left with slight right offset */}
          <div className="mb-8 sm:mb-10 lg:mb-12 xl:mb-16 ml-1">
            <Image
              src={image2}
              alt="hightribe"
              width={200}
              height={100}
              className="w-32 sm:w-40 md:w-48 lg:w-56 h-auto brightness-0 invert drop-shadow-lg"
            />
          </div>

                     {/* Main Headline */}
           <div className="mb-2 sm:mb-4 lg:mb-6 max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl text-center lg:text-left">
             <h2 className="text-white mb-2 sm:mb-3 lg:mb-4 font-['Darker_Grotesque'] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-[65px] leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-tight 2xl:leading-[60 px] tracking-[0%] drop-shadow-lg">
               Join the tribe of curious explorers, heartfelt hosts, and soulful storytellers
             </h2>
           </div>

                                           {/* Subtitle */}
            <p className="text-white mb-2 sm:mb-4 lg:mb-6 xl:mb-8 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-medium leading-relaxed drop-shadow-md text-center lg:text-left">
              Apply for early access — help build where people truly belong.
            </p>

          {/* Call to Action Button */}
          <div className="text-center lg:text-left">
            <button className="px-6 sm:px-8 lg:px-10 xl:px-12 py-3 sm:py-4 lg:py-5 xl:py-6 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl rounded-full transition-all duration-300 transform hover:scale-105 bg-white text-black font-semibold border border-white/50 shadow-lg hover:shadow-2xl">
              Join the founding Tribe
            </button>
          </div>
        </div>

        {/* Blinking Scroll Arrow - Replace with your custom SVG */}
        <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-1/2 transform -translate-x-1/2 z-20">
          <div className="animate-bounce">
            <Image 
              src={image3} 
              alt="scroll" 
              width={20} 
              height={20} 
              className='w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white animate-pulse drop-shadow-lg' 
            />
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className='relative z-10'>
        <Form />
        <div className='relative z-10'>
          <Discount />
        </div>
        <HighTribe /> 
        <Card/>
        <Founding/> 
        <Message />
        {/* <Tour /> */}
        
        {/* <Principles /> */}
        
        <Footer />
      </div>
    </div>
  );
};

export default Landing;






















// import Image from 'next/image';
// import React from 'react';
// import Form2 from './Form2';
// import Discount from './Disconect';
// import HighTribe from './HighTribe';
// import Message from './Message';
// import Founding from './Founding';
// import Tour from './Tour';
// import Principles from './Principles';
// import Footer from './Footer';
// import image2 from '../../../public/dashboard/landingpage/logo.svg'

// const Landing = () => {
//   return (
//     <div className="relative">
//       {/* Top Section - Hero with Campfire Background */}
//       <div className="relative min-h-screen flex items-center overflow-hidden">
//         {/* Background Image - Campfire scene */}
//         <div 
//           className="absolute inset-0 bg-center bg-no-repeat w-full h-full"
//           style={{
//             backgroundImage: `url('/dashboard/landingpage/landing.png')`,
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             backgroundRepeat: 'no-repeat',
//           }}
//         >
//           {/* White gradient overlay on left side */}
//           <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 sm:via-white/80 to-transparent"></div>
//         </div>

//         {/* Hero Content */}
//         <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-20 max-w-4xl sm:max-w-5xl lg:max-w-6xl">
//           {/* Logo with dashed path */}
//           <div className="mb-6 sm:mb-8 lg:mb-10 xl:mb-12 flex flex-col items-end sm:items-end">
//             {/* Logo */}
//             <Image
//               src={image2}
//               alt="hightribe"
//               width={120}
//               height={48}
//               className="text-white font-bold text-lg sm:text-xl lg:text-2xl w-24 sm:w-32 md:w-40 lg:w-48 h-auto"
//             />
//           </div>

//           {/* Main Headline */}
//           <div className="mb-4 sm:mb-6 lg:mb-8 max-w-xs sm:max-w-xl lg:max-w-2xl">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-[72px] font-extrabold leading-[64px] text-gray-800 mb-2 sm:mb-3 lg:mb-4 tracking-[0%]">
//               Join the tribe of{' '}
//               <span className="text-[#9F40C8]">curious explorers, heartfelt hosts, and soulful storytellers</span>
//             </h2>
//           </div>

//           {/* Subtitle */}
//           <p className="font-inter font-medium text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[32px] leading-[1.3] sm:leading-[1.4] lg:leading-[41px] tracking-[0px] text-gray-700 mb-6 sm:mb-8 lg:mb-10 xl:mb-12 max-w-xs sm:max-w-lg lg:max-w-xl">
//             Apply for early access — help build where people truly belong.
//           </p>

//           {/* Call to Action Button */}
//           <button 
//             className="px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg xl:text-xl rounded-full transition-all duration-300 transform hover:scale-105"
//             style={{
//               background: '#FFFFFF',
//               border: '1px solid',
//               borderImageSource: 'linear-gradient(35.22deg, rgba(255, 255, 255, 0.5) 33.61%, rgba(255, 255, 255, 0.5) 89.19%)',
//               boxShadow: '0px 4px 4.6px 0px #BBBBBB40 inset',
//               color: '#000000',
//               fontWeight: '600'
//             }}
//           >
//             Join the founding Tribe
//           </button>
//         </div>
//       </div>

//       {/* Form Section */}
//       <div className=''>
//         <Form2 />
//         <Discount />
//         <HighTribe /> 
//         <Founding/> 
//         <Message />
//         <Tour />
//         <Principles />
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default Landing;

