import React, { useState } from 'react';
import { Search,  Heart, ChevronRight, Star } from 'lucide-react';
import  {MoreOptionsIcon } from "../center/PostCard";
const Booking = () => {
  const [selectedType, setSelectedType] = useState('Any type');
  const [isLiked, setIsLiked] = useState(false);

  const roomTypes = ['Any type', 'Room', 'Entire home'];

  return (
         <div className=" relative max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden w-[279px]">
      
      <div className="flex items-center justify-between p-6 pb-4">
        <h1 className="font-roboto font-semibold text-[15px] leading-[100%] tracking-[0.01em]">Room Booking</h1>
         <MoreOptionsIcon className="hover:text-[#0F62DE]" />
      </div>

     
      <div className="px-6 pb-4 ">
        <div className="relative h-full w-full" >
          <Search className=" absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="search"
            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-gray-200 text-sm"
          />
        </div>
      </div>

     
      <div className="px-6 pb-6">
        <div className="flex gap-1">
          {roomTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-2 rounded-full text-sm transition-all duration-200 border border-gray-200 font-gilroy font-medium text-[10px] leading-[22.4px] tracking-normal flex items-center justify-center whitespace-nowrap min-w-[80px] ${
                selectedType === type
                  ? 'bg-black text-white'
                  : 'bg-[#FFFFFF] text-[#030303] hover:bg-gray-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      
      <div className="px-6 pb-6  overflow-hidden">
        <div className="relative bg-white rounded-lg shadow-md overflow-hidden w-full h-[240px] ">
        
          <div className="relative bg-gradient-to-br">
            <img
              src="dashboard/Room.svg"
              alt="Bedroom"
              className="object-cover h-32 rounded-lg w-full"
            />
            
          
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
            >
              <Heart 
                className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </button>

          
            <button className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:bg-white z-10">
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Room Details */} <div className="p-2.5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-extrabold text-black">
                The wondering Riverside Retreat
              </p>
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-[10px] font-medium text-black">4.93(167)</span>
              </div>
            </div>
            
            <p className="text-black text-[10px] mb-1">
              2 bedrooms + 2beds + 1 Bathroom
            </p>
            
            <div className="flex items-center gap-1">
              <span className="text-black text-[10px]">Night stay</span>
              <span className="font-bold text-black text-[10px]">2000 PKR</span>
              <span className="text-black text-[10px]">Only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;