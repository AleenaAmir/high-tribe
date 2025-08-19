import React, { useState } from 'react';
import Image from 'next/image';

interface Friend {
  id: string;
  name: string;
  avatarUrl: string;
  mutualFriends: number;
}

interface FriendsListProps {
  friends: Friend[];
  onItemClick?: () => void;
}

const FriendsList = ({ friends, onItemClick }: FriendsListProps) => {
  const [showFriendsList, setShowFriendsList] = useState(false);

  const toggleFriendsList = () => {
    setShowFriendsList(!showFriendsList);
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-[#FFFFFF] p-3 font-roboto">
             
       <div className=" border border-[#F2F2F1] rounded-xl overflow-hidden">
       
         <div className=" px-4 py-2 flex justify-between items-center">
           <h1 className=" text-md font-semibold text-gray-800">
             Friends <span className=" text-blue-500">82</span>
           </h1>
           <div 
             className="w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-br from-[#9243AC] via-[#B6459F] to-[#E74294] cursor-pointer hover:opacity-80 transition-opacity"
             onClick={toggleFriendsList}
           >
             <img
               src="/dashboard/upArrow.svg" 
               alt="Arrow"
               className={`w-3 h-3 transition-transform duration-200 ${showFriendsList ? 'rotate-180' : ''}`}
             />
           </div>
         </div>

       
         {showFriendsList && (
           <div className="p-2 bg-white border-t border-gray-200">
           <div className="space-y-1">
             {friends.map((friend) => (
               <button
                 key={friend.id}
                 onClick={onItemClick}
                 className="w-full flex items-center space-x-3 justify-between px-4 py-2 hover:bg-gray-100 transition-colors rounded-lg"
               >
                 <div className="flex items-center gap-2">
                   <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                     <img
                       src={friend.avatarUrl}
                       alt={friend.name}
                       className="w-full h-full object-cover"
                       onError={(e) => {
                         e.currentTarget.src = '/dashboard/Profile.svg';
                       }}
                     />
                   </div>
                   <div className="flex-1 text-left">
                     <h4 className="text-sm font-medium text-gray-900">
                       {friend.name}
                     </h4>
                     <p className="text-xs text-gray-500">
                       {friend.mutualFriends} mutual friends
                     </p>
                   </div>
                 </div>
                 <Image
                   src="/dashboard/smileface.svg"
                   alt="msg"
                   width={20}
                   height={20}
                 />
               </button>
             ))}
           </div>
               <button className="w-full mt-4 bg-gradient-to-r from-[#9243AC] via-[#B6459F] to-[#E74294] text-white rounded-full py-2 hover:opacity-90 transition-all">
             See all Friends
           </button>
         </div>
       )}
         </div>

        
        <div className="relative rounded-3xl overflow-hidden shadow-lg mt-4">
          <div className="relative h-64">
            <img 
              src="/dashboard/airoplan2.svg" 
              alt="Airplane sunset view" 
              className="w-full h-full object-cover object-center"
            />
           
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
           
           <div className="absolute bottom-4 left-4 text-white">
             <h2 className="w-[52px] h-[23px] opacity-100 font-bold text-[20px] leading-[100%] tracking-[1%] mb-0">Tours</h2>
             <h4 className="w-[145px] h-[18px] opacity-100 font-semibold text-[15px] leading-[100%] tracking-[1%] mb-1">Santorini Sunset Loft</h4>
             <p className="w-[157px] h-[25px] opacity-100 font-semibold text-[8px] leading-[9px] text-gray-200 mb-2">
               Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et.
             </p>
             <button className="w-[185px] h-[25px] rounded-[50px] opacity-100 font-semibold text-[12px] leading-[100%] tracking-[1%] bg-white text-[#000000] hover:bg-gray-100 transition-colors">
               Book now
             </button>
           </div>
         </div>
       </div>
    </div>
  );
}

export default FriendsList;