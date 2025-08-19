import React from "react";

interface UserStatsProps {
  stats: {
    footprints: number;
    photos: number;
    likes: number;
  };
}

const UserStats = ({
  stats = {
    footprints: 268,
    photos: 1.4,
    likes: 2.5,
  },
}: UserStatsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-center">
        <div>
          <p className="font-medium text-gray-900">{stats.footprints}</p>
          <p className="text-xs text-gray-500">Footprints</p>
        </div>
        <div>
          <p className="font-medium text-gray-900">{stats.photos}k</p>
          <p className="text-xs text-gray-500">Photos</p>
        </div>
        <div>
          <p className="font-medium text-gray-900">{stats.likes}k</p>
          <p className="text-xs text-gray-500">Likes</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button className="bg-gray-900 text-white text-xs font-medium py-2 px-4 rounded">
          Followw
        </button>
        <button className="bg-gray-900 text-white text-xs font-medium py-2 px-4 rounded">
          Calendar
        </button>
        <button className="bg-gray-900 text-white text-xs font-medium py-2 px-4 rounded">
          Share
        </button>
      </div>
      <button className="w-full py-2 bg-blue-600 text-white rounded text-sm font-medium">
        Bucket list
      </button>
    </div>
  );
};

export default UserStats;



// import React, { useState } from 'react';

// const UserStats = () => {
//   const [stats, setStats] = useState({
//     footsteps: 268,
//     photos: 1400,
//     likes: 2500
//   });

//   const formatNumber = (num: number) => {
//     if (num >= 1000) {
//       return (num / 1000).toFixed(1) + 'k';
//     }
//     return num.toString();
//   };

//   const incrementStat = (statType: string) => {
//     setStats(prev => ({
//       ...prev,
//       [statType as keyof typeof prev]: prev[statType as keyof typeof prev] + 1
//     }));
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 mt-8">
//       <div className="flex justify-around items-center">
        
//         {/* Footsteps */}
//         <div className="text-center cursor-pointer transform hover:scale-105 transition-transform" 
//              onClick={() => incrementStat('footsteps')}>
//           <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-3 mx-auto hover:bg-blue-600 transition-colors overflow-hidden">
//             <img src="YOUR_FOOTSTEPS_ICON_URL_HERE" alt="Footsteps" className="w-8 h-8 object-cover" />
//           </div>
//           <div className="text-2xl font-bold text-gray-800 mb-1">
//             {stats.footsteps}
//           </div>
//           <div className="text-gray-600 text-sm font-medium">
//             Footsteps
//           </div>
//         </div>

//         {/* Vertical Divider */}
//         <div className="w-px h-20 bg-gray-200"></div>

//         {/* Photos */}
//         <div className="text-center cursor-pointer transform hover:scale-105 transition-transform"
//              onClick={() => incrementStat('photos')}>
//           <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-3 mx-auto hover:bg-gray-700 transition-colors overflow-hidden">
//             <img src="YOUR_PHOTOS_ICON_URL_HERE" alt="Photos" className="w-8 h-8 object-cover" />
//           </div>
//           <div className="text-2xl font-bold text-gray-800 mb-1">
//             {formatNumber(stats.photos)}
//           </div>
//           <div className="text-gray-600 text-sm font-medium">
//             Photos
//           </div>
//         </div>

//         {/* Vertical Divider */}
//         <div className="w-px h-20 bg-gray-200"></div>

//         {/* Likes */}
//         <div className="text-center cursor-pointer transform hover:scale-105 transition-transform"
//              onClick={() => incrementStat('likes')}>
//           <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-3 mx-auto hover:bg-red-600 transition-colors overflow-hidden">
//             <img src="YOUR_LIKES_ICON_URL_HERE" alt="Likes" className="w-8 h-8 object-cover" />
//           </div>
//           <div className="text-2xl font-bold text-gray-800 mb-1">
//             {formatNumber(stats.likes)}
//           </div>
//           <div className="text-gray-600 text-sm font-medium">
//             Likes
//           </div>
//         </div>

//       </div>

//       <div className="mt-6 text-center">
//         <p className="text-xs text-gray-400">
//           Tap any stat to increment it
//         </p>
//       </div>
//     </div>
//   );
// }
// export default UserStats;