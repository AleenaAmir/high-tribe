"use client";
import { useState } from "react";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa6";

const profileData = {
  name: "Umer Hussain",
  image: '/images/founder.png',
};

export default function ProfileHeader() {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="flex items-center gap-2 p-2 relative">
      <Image
        src={profileData.image}
        alt="Profile Image"
        width={35}
        height={35}
        className="rounded-full"
      />
      <p className="font-medium">{profileData.name}</p>
      <FaChevronDown
        className="text-gray-500 text-sm cursor-pointer"
        onClick={() => setShowLogout(!showLogout)}
      />
      
      {showLogout && (
        <div className="absolute top-full right-0 mt-2 bg-white shadow-md rounded-md px-4 py-2 text-sm">
          Logout
        </div>
      )}
    </div>
  );
}
