'use client'
import React, { useState } from "react";
import Image from 'next/image';

type BadgesProps = {
  badges?: any[];
};

const Badges = ({ badges }: BadgesProps) => {
  const [showBadges, setShowBadges] = useState(false);

  const toggleBadges = () => {
    setShowBadges(!showBadges);
  };
  return (
    <div className={`w-full mx-auto bg-[#FFFFFF] border border-[#F2F2F1] p-4 mb-2 rounded-lg shadow-sm font-gilroy transition-all duration-300 `}>

      {/* Header */}

      <div className="flex justify-between items-center">
        <h1 className="text-[16px] font-[500] text-[#000000]font-gilroy ">Recent Badges</h1>
        <div className="relative">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br from-[#9243AC] via-[#B6459F] to-[#E74294] cursor-pointer hover:opacity-80 transition-opacity"
            onClick={toggleBadges}
          >
            <img
              src="/dashboard/upArrow.svg"
              alt="Arrow"
              className={`w-3 h-3 transition-transform duration-200 ${showBadges ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </div>
      {/* <div className="flex justify-between items-center mb-3 mt-1">
                   <h1 className="w-[113px] h-[19px] opacity-100 top-[1311px] left-[303px] font-gilroy font-medium text-[16px] leading-[100%] tracking-[0%] capitalize text-gray-800">Recent Badges</h1>
         <div 
           className="w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-br from-[#9243AC] via-[#B6459F] to-[#E74294] cursor-pointer hover:opacity-80 transition-opacity"
           onClick={toggleBadges}
         >
           <img
             src="/dashboard/upArrow.svg" 
             alt="Arrow" 
             className={`w-2.5 h-2.5 transition-transform duration-200 ${showBadges ? 'rotate-180' : ''}`}
           />
         </div>
       </div> */}

      {/* Badge Image Container */}
      {showBadges && (
        <div className="flex justify-center">
          <div className="w-36 h-40">
            <Image
              src="/dashboard/bage.svg"
              alt="Badge"
              width={140}
              height={150}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Badges;


// import Image from 'next/image';
// import React from 'react';

// const  Badges =()=> {
//   return (
//     <div className="max-w-md mx-auto bg-white min-h-screen p-4">
//       {/* Header */}
//       <div className="mb-8 mt-2">
//         <h1 className="text-2xl font-semibold text-gray-800">Recent Badges</h1>
//       </div>

//       {/* Badge Image Container */}
//       <div className="flex justify-center mb-12">
//         <div className="w-64 h-72">
//           <Image
//             src="/dashboard/bage.svg"
//             alt="Badge"
//             className="w-full h-full object-contain"
//           />
//         </div>
//       </div>


//     </div>
//   );
// }
// export default Badges;