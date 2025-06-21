"use client";
import React from "react";
import Image from "next/image";

const groupsData = [
  {
    name: "South bay indoor / outdoor Activities Group (SBIO)",
    imageUrl: "https://picsum.photos/seed/group1/200",
  },
  {
    name: "Drum Circles by the sea",
    imageUrl: "https://picsum.photos/seed/group2/200",
  },
  {
    name: "Los Angeles single proteasomal meetup group",
    imageUrl: "https://picsum.photos/seed/group3/200",
  },
  {
    name: "im single Social fun & friends & adventures",
    imageUrl: "https://picsum.photos/seed/group4/200",
  },
  {
    name: "Santa Monica Hiking Club",
    imageUrl: "https://picsum.photos/seed/group5/200",
  },
];

const YourGroups = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 ">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-[#696969] text-[15px]">Your Groups</h3>
        <a
          href="#"
          className="text-[10px] font-semibold text-blue-600 hover:underline"
        >
          See all your Groups
        </a>
      </div>
      <ul className="space-y-4">
        {groupsData.map((group, index) => (
          <li key={index} className="flex items-center gap-4">
            <Image
              src={group.imageUrl}
              alt={group.name}
              width={56}
              height={56}
              className="object-cover rounded-lg flex-shrink-0"
            />
            <p className="text-sm text-custom-gray font-medium">{group.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YourGroups;
