
"use client";
import React, { useState } from 'react';
import Image from 'next/image';

const cards = [
    {
        id: 1,
        number: "1",
        title: "EXPERIENCES",
        image: "/dashboard/landingpage/card-1.jpg",
    },   
    { id: 2, number: "2", title: "EVENTS", image: "/dashboard/landingpage/card-2.svg" },
    { id: 3, number: "3", title: "GUIDED", image: "/dashboard/landingpage/card-3.svg" },
    { id: 4, number: "4", title: "PLANNING WITH FRIENDS", image: "/dashboard/landingpage/card-4.svg" },
    { id: 5, number: "5", title: "TOOLS", image: "/dashboard/landingpage/card-5.jpg" },
];

export default function Card() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    setScrollPosition(prev => Math.max(0, prev - 300));
  };

  const scrollRight = () => {
    setScrollPosition(prev => Math.min(prev + 300, (cards.length - 1) * 300));
  };

  const getCardStyles = (index:any) => {
    if (index % 2 === 0) {
      // Cards 1, 3, 5 - taller cards, lower position
      return {
        marginTop: '100px',
        height: '400px',
        numberPosition: '-top-8',
        titlePosition: 'bottom-4'
      };
    } else {
      // Cards 2, 4 - shorter cards, higher position  
      return {
        marginTop: '20px',
        height: '320px',
        numberPosition: '-bottom-8',
        titlePosition: 'top-4'
      };
    }
  };

  return (
    <div className="w-full bg-[#f5f4f4] py-20 px-4 overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          {/* Navigation Buttons */}
          <button 
            onClick={scrollLeft}
            disabled={scrollPosition === 0}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button 
            onClick={scrollRight}
            disabled={scrollPosition >= (cards.length - 2) * 300}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden mx-16">
            <div 
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{ 
                transform: `translateX(-${scrollPosition}px)`,
                width: `${cards.length * 300}px`
              }}
            >
              {cards.map((card, index) => {
                const styles = getCardStyles(index);
                
                return (
                 
                  <div className='py-8 w-full h-full'>
                  <div key={card.id} className={`bg-[#F0F0F0] p-2 md:p-3 flex gap-2 min-w-[343px] w-full min-h-[525px] h-full md:gap-4 ${(index % 2 === 0) ? 'flex-col':'flex-col-reverse'} items-center justify-between text-center rounded-[21px]`}>
                    <div className={`bg-white p-2 rounded-full text-[#14183E] text-[25px] font-semibold aspect-square  ${(index % 2 === 0)?'-translate-y-9':'translate-y-9'} `}>{card.id}</div>
                    <div className='text-[24px] text-[#1C1C24] font-bold'>{card.title}</div>
                    <div><Image src={card.image} alt='Image' width={355} height={444} className='max-w-[355px] w-full object-contain rounded-2xl '/></div>
      
                  </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}