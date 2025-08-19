// import React from 'react';
// import { MoreHorizontal } from 'lucide-react';

// const FoodCard = () => {
//   return (
//     <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Food</h1>
//         <MoreHorizontal className="w-6 h-6 text-gray-600" />
//       </div>

//       {/* Food Card */}
//       <div className="relative bg-black rounded-3xl overflow-hidden shadow-xl">
//         {/* Background Food Image */}
//         <div className="relative h-96 bg-gradient-to-b from-transparent to-black/50">
//           <img
//             src="Dashboard/Food.svg"
//             alt="Karahi Chicken"
//             className="w-full h-full object-cover"
//           />
          
//           {/* Dark overlay */}
//           <div className="absolute inset-0 bg-black/30"></div>
          
//           {/* Host Profile */}
//           <div className="absolute top-4 left-4 flex items-center gap-3">
//             <img
//               src="dashboard/Profile.svg"
//               alt="Host"
//               className="w-12 h-12 rounded-full object-cover border-2 border-white"
//             />
//             <div className="text-white">
//               <p className="text-sm opacity-90">Hosted by</p>
//               <p className="font-semibold">Usama</p>
//             </div>
//           </div>

//           {/* Price */}
//           <div className="absolute top-4 right-4 text-white">
//             <p className="text-2xl font-bold">$395</p>
//           </div>

//           {/* Food Title */}
//           <div className="absolute bottom-20 left-4">
//             <h2 className="text-white text-3xl font-bold">Karahi Chicken</h2>
//           </div>

//           {/* Book Button */}
//           <div className="absolute bottom-4 left-4 right-4">
//             <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg">
//               Book
//             </button>
//           </div>

//           {/* Dots Indicator */}
//           <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2">
//             <div className="w-2 h-2 bg-white rounded-full"></div>
//             <div className="w-2 h-2 bg-white/50 rounded-full"></div>
//             <div className="w-2 h-2 bg-white/50 rounded-full"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FoodCard;











"use client"
import React, { useState, useEffect } from 'react';
// import { MoreHorizontal } from 'lucide-react';
import  {MoreOptionsIcon } from "../center/PostCard";

const Food = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Food cards data
  const foodCards = [
    {
      id: 1,
      title: "Karahi Chicken",
      price: "$395",
      host: "Usama",
      hostImage: "dashboard/Profile-2.jpg",
      foodImage: "dashboard/Food.svg"
    },
    {
      id: 2,
      title: "Biryani Special",
      price: "$450",
      host: "Ahmad",
      hostImage: "dashboard/Profile.svg",
      foodImage: "dashboard/Food.svg"
    },
    {
      id: 3,
      title: "BBQ Platter",
      price: "$520",
      host: "Ali",
      hostImage: "dashboard/Profile-2.jpg",
      foodImage: "dashboard/Food.svg"
    }
  ];

  // Auto-swipe functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % foodCards.length);
    }, 3500); // 3.5 seconds

    return () => clearInterval(interval);
  }, [foodCards.length]);

  const goToSlide = (index: React.SetStateAction<number>) => {
    setCurrentSlide(index);
  };
  return (
    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden p-6 w-[280px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Food</h1>
         <MoreOptionsIcon className="hover:text-[#0F62DE]" />
        {/* <MoreHorizontal className="w-6 h-6 text-gray-600" /> */}
      
      </div>

             {/* Food Cards Swiper */}
       <div className="relative bg-black rounded-3xl overflow-hidden shadow-xl w-[244px] mx-auto">
        {/* Swiper Container */}
        <div className="relative h-80 overflow-hidden w-[269px]" >
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {foodCards.map((card, index) => (
              <div key={card.id} className="w-[260px] h-full flex-shrink-0 relative">
                <img
                  src={card.foodImage}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Dark overlay */}
                {/* <div className="absolute inset-0 bg-black/30"></div> */}
                
                                 {/* Host Profile */}
                 <div className="absolute top-4 left-4 flex items-center gap-3">
                   <img
                     src={card.hostImage}
                     alt="Host"
                     className="w-12 h-12 rounded-full object-cover border-2 border-white"
                   />
                   <div className="text-white">
                     <p className="text-xs opacity-90 mb-0">Hosted by</p>
                     <p className="text-sm font-semibold">{card.host}</p>
                   </div>
                 </div>

                                 {/* Price */}
                 <div className="absolute top-8 right-8 text-white">
                   <p className="text-base font-bold">{card.price}</p>
                 </div>

                                   {/* Food Title */}
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                    <h2 className="text-white text-lg font-bold text-center">{card.title}</h2>
                  </div>
              </div>
            ))}
          </div>
        </div>

        {/* Book Button */}
                 <div className="absolute bottom-8 left-4 right-4 flex justify-center">
           <button className="h-[38px] w-[160px] bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg flex items-center justify-center">
             Book
           </button>
         </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
          {foodCards.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Food;