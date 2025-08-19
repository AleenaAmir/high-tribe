// import React from "react";

// type IntarctionsProps = {
//   footprint?: string;
//   likes?: string;
//   photos?: string;
// };
// const Intarctions = ({ footprint, likes, photos }: IntarctionsProps) => {
//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col gap-4">
//       <div className="flex items-center justify-between">
//         <div className="text-center">
//           <p className="text-[18px] font-bold">{footprint ?? "100"}</p>
//           <p className="text-[10px] text-gray-500">Footprints</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="text-center">
//             <p className="text-[18px] font-bold">{photos ?? "100"}</p>
//             <p className="text-[10px] text-gray-500">Photos</p>
//           </div>
//           <div className="text-center">
//             <p className="text-[18px] font-bold">{likes ?? "100"}</p>
//             <p className="text-[10px] text-gray-500">Likes</p>
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-center items-center gap-2">
//         <button className="w-full bg-gray-700 text-white text-[8px] rounded-full px-3 py-2 hover:bg-gray-600 transition-colors">
//           Follow
//         </button>
//         <button className="w-full bg-gray-700 text-white text-[8px] rounded-full px-3 py-2 hover:bg-gray-600 transition-colors">
//           Calendar
//         </button>
//         <button className="w-full bg-gray-700 text-white text-[8px] rounded-full px-3 py-2 hover:bg-gray-600 transition-colors">
//           Share
//         </button>
//       </div>
//       <button className="w-full bg-gradient-to-r from-[#247BFE] to-[#1063E0] text-white rounded-md py-2 hover:bg-blue-500 transition-colors">
//         Bucket list
//       </button>
//     </div>
//   );
// };

// export default Intarctions;



import React, { useState } from 'react';

interface IntarctionsProps {
  footprint?: string;
  likes?: string;
  photos?: string;
}

const Intarctions = ({ footprint = "268", likes = "2.5K", photos = "1.4K" }: IntarctionsProps) => {
  const [stats, setStats] = useState({
    footsteps: parseInt(footprint) || 268,
    photos: 1400,
    likes: 2500
  });

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const incrementStat = (statType: string) => {
    setStats(prev => ({
      ...prev,
      [statType as keyof typeof prev]: prev[statType as keyof typeof prev] + 1
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 mt-8 border border-gray-100" >
      <div className="flex justify-around items-center">

        <div className="text-center cursor-pointer transform hover:scale-105 transition-transform" 
             onClick={() => incrementStat('footsteps')}>
          <div className="w-16 h-16   flex items-center justify-center mb-3 mx-auto transition-colors overflow-hidden">
            <img src="dashboard/foot.svg" alt="Footsteps" className="w-8 h-8 object-cover" />
          </div>
          <div className="text-[18px] font-gilroy font-semibold text-gray-800 mb-1 leading-[100%] tracking-[0px] text-center">
            {stats.footsteps}
          </div>
          <div className="text-gray-600 font-gilroy font-normal text-[14px] leading-[20px] tracking-[0%]">
            Footsteps
          </div>
        </div>

        <div className="w-px h-20 bg-gray-200"></div>

        <div className="text-center cursor-pointer transform hover:scale-105 transition-transform"
             onClick={() => incrementStat('photos')}>
          <div className="w-16 h-16 flex items-center justify-center mb-3 mx-auto  transition-colors overflow-hidden">
            <img src="dashboard/photo.svg" alt="Photos" className="w-8 h-8 object-cover" />
          </div>
          <div className="text-[18px] font-gilroy font-semibold text-gray-800 mb-1 leading-[100%] tracking-[0px] text-center">
            {formatNumber(stats.photos)}
          </div>
          <div className="text-gray-600 font-gilroy font-normal text-[14px] leading-[20px] tracking-[0%]">
            Photos
          </div>
        </div>

        <div className="w-px h-20 bg-gray-200"></div>

        <div className="text-center cursor-pointer transform hover:scale-105 transition-transform"
             onClick={() => incrementStat('likes')}>
          <div className="w-16 h-16  flex items-center justify-center mb-3 mx-auto transition-colors overflow-hidden">
            <img src="dashboard/like.svg" alt="Likes" className="w-8 h-8 object-cover" />
          </div>
          <div className="text-[18px] font-gilroy font-semibold text-gray-800 mb-1 leading-[100%] tracking-[0px] text-center">
            {formatNumber(stats.likes)}
          </div>
          <div className="text-gray-600 font-gilroy font-normal text-[14px] leading-[20px] tracking-[0%]">
            Likes
          </div>
        </div>
      </div>
    </div>
  );
}
export default Intarctions;