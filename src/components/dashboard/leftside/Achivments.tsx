// import Image from "next/image";
// import React from "react";
// import Msg from "../svgs/Msg";
// import Clock from "../svgs/Clock";

// const Achivments = () => {
//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col gap-4">
//       <h3 className="text-[#6C6868] text-[16px]">Achieved milestones</h3>

//       <div className="flex items-center gap-2 justify-between">
//         <div className="flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-[#247BFE] to-[#1063E0]">
//           <Msg fill="#fff" />
//         </div>
//         <div className=" w-full">
//           <h3 className="text-[10px] text-[#6C6868]">1 Chats</h3>
//         </div>
//       </div>
//       <p className="text-[12px] text-[#6C6868] font-bold">
//         Next milestones Badges
//       </p>
//       <div className="flex items-center gap-2 justify-between">
//         <div className="flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-[#247BFE] to-[#1063E0]">
//           <Clock fill="#fff" />
//         </div>
//         <div className=" w-full">
//           <h3 className="text-[10px] text-[#6C6868]">Level 1</h3>
//           <div className="w-full h-1 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex">
//             <div className="bg-[#1063E0] h-1 rounded-full rounded-bl-full w-5/12 text-center text-white text-xs"></div>
//           </div>
//         </div>
//       </div>
//       <div className="flex items-center gap-2 justify-between">
//         <div className="flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-[#247BFE] to-[#1063E0]">
//           <Clock fill="#fff" />
//         </div>
//         <div className=" w-full">
//           <h3 className="text-[10px] text-[#6C6868]">Level 2</h3>
//           <div className="w-full h-1 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex">
//             <div className="bg-[#1063E0] h-1 rounded-full rounded-bl-full w-5/12 text-center text-white text-xs"></div>
//           </div>
//         </div>
//       </div>
//       <div className="flex items-center gap-2 justify-between">
//         <div className="flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-[#247BFE] to-[#1063E0]">
//           <Clock fill="#fff" />
//         </div>
//         <div className=" w-full">
//           <h3 className="text-[10px] text-[#6C6868]">Level 3</h3>
//           <div className="w-full h-1 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex">
//             <div className="bg-[#1063E0] h-1 rounded-full rounded-bl-full w-5/12 text-center text-white text-xs"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Achivments;



import React, { useState } from 'react';
import { ChevronUp } from 'lucide-react';

const Achievements=()=> {
  const [showAchievements, setShowAchievements] = useState(false);

  const toggleAchievements = () => {
    setShowAchievements(!showAchievements);
  };
  const milestones = [
    { id: 1, title: "Chats", imageUrl: "dashboard/chats.svg", achieved: true },
    { id: 2, title: "Level 4", imageUrl: "dashboard/level-4.svg", achieved: false },
    { id: 3, title: "Level 3", imageUrl: "dashboard/level-3.svg", achieved: false },
    { id: 4, title: "Level 2", imageUrl: "dashboard/level-2.svg",  achieved: false },
    { id: 5, title: "Level 1", imageUrl: "dashboard/level-1.svg",  achieved: false }
  ];

  // Timeline images URLs
  const timelineImages = {
    verticalLine:"dashboard/line-1.svg",
     inactiveVerticalLine: "dashboard/line-2.svg", 
    activeDot: "dashboard/dot-1.svg", 
    inactiveDot: "dashboard/dot-2.svg"
     
  };

  return (
         <div className="w-[240px] ml-auto mr-4 bg-gray-50 p-4 font-gilroy border border-gray-200 rounded-lg ">
             {/* Header */}
               <div className="flex justify-between items-center mb-3 mt-1">
                     <h1 className="text-bold font-gilroy font-medium text-gray-800 leading-[100%] tracking-[0%] capitalize">Achieved Milestones</h1>
          <div 
            className="gap-1 w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-br from-[#9243AC] via-[#B6459F] to-[#E74294] cursor-pointer hover:opacity-80 transition-opacity"
            onClick={toggleAchievements}
          >
             <img
               src="dashboard/upArrow.svg" 
               alt="Arrow" 
               className={`w-3 h-3 transition-transform duration-200 ${showAchievements ? 'rotate-180' : ''}`}
             />
           </div>
        </div>

      {/* Timeline Container */}
      {showAchievements && (
        <div className="relative">
                    {/* Vertical Timeline Line - Custom Image */}
                      <div className="absolute left-1 top-9 bottom-0 w-6 flex justify-center ">
              <div className="h-[95px] w-0 border-l-2 border-dashed opacity-100" style={{ borderColor: '#E24295' }}></div>
            </div>
{/* invertical lines  */}
 <div className="absolute left-1 w-6 flex justify-center top-[110px] bottom-0">
            <div className="h-[215px] w-0 border-l-2 border-dashed opacity-100" style={{ borderColor: '#B7B8B8' }}></div>
          </div>
              {/* Achieved Section */}
            <div className="relative mb-4">
              {/* Timeline Dot - Active Custom Image */}
              <div className="absolute left-3 top-8 w-2.5 h-2.5">
                <img src={timelineImages.activeDot} alt="Active Dot" className="w-full h-full object-contain" />
              </div>
              {/* Milestone Card */}
              <div className="ml-8 bg-white rounded border border-gray-200 p-2 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.12)] w-[162.83px] h-[54.76px]">
                <div className="flex items-center space-x-1">
                                   <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                     <img src={milestones[0].imageUrl} alt={milestones[0].title} className="w-7 h-7 object-contain" />
                   </div>
                            <span className="text-xs font-gilroy font-medium text-gray-800 leading-[100%] tracking-[0%] capitalize">{milestones[0].title}</span>
                </div>
              </div>
            </div>
                                  {/* Next Milestones Section */}
            <div className="mb-3">
                             <h2 className="text-xs font-gilroy font-medium text-gray-800 leading-[100%] tracking-[0%] capitalize ml-8">Next Milestones Badges</h2>
            </div>

            {/* Remaining Milestones */}
            {milestones.slice(1).map((milestone, index) => (
              <div key={milestone.id} className="relative mb-3">
                {/* Timeline Dot - Inactive Custom Image */}
                <div className="absolute left-3 top-6 w-2.5 h-2.5">
                  <img src={timelineImages.inactiveDot} alt="Inactive Dot" className="w-full h-full object-contain" />
                </div>
                
                {/* Milestone Card */}
                <div className="ml-8 bg-white rounded border border-gray-200 p-2 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.12)] w-[162.83px] h-[54.76px]">
                  <div className="flex items-center space-x-1">
                                       <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                       <img src={milestone.imageUrl} alt={milestone.title} className="w-7 h-7 object-contain" />
                     </div>
                                                                               <span className="text-xs font-gilroy font-medium text-gray-800 leading-[100%] tracking-[0%] capitalize">{milestone.title}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
export default   Achievements;