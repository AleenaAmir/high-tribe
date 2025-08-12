import Image from 'next/image';
import React from 'react';

const SideExplore = () => {
  const sidebarItems = [
    {
      name: "My Journey",
      icon: "/dashboard/footprint1.svg",
      active: true
    }
  ];

  return (
    <div className="w-60 bg-white shadow-sm h-screen flex flex-col">
      {/* Header with Search Icon */}
      <div className="flex items-center gap-2 p-4 bg-blue-500 text-white font-semibold">
        <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <span>Explore</span>
      </div>

      {/* Menu Items */}
      <div className="flex-1">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
              item.active ? 'bg-gray-50' : ''
            }`}
          >
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <Image
                src={item.icon}
                alt={item.name}
                width={16}
                height={16}
                className="w-4 h-4 filter brightness-0 invert"
              />
            </div>
            <span className="font-medium text-gray-800">{item.name}</span>
            <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideExplore;
