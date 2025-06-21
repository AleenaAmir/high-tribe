"use client";
import React from "react";
import Image from "next/image";

// --- TYPE DEFINITION ---
export type Person = {
  name: string;
  avatarUrl: string;
  distance: string;
  backgroundUrl: string;
};

// --- SVG ICONS ---
const LocationPinIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 8.667c.736 0 1.333-.597 1.333-1.334C9.333 6.597 8.737 6 8 6s-1.333.597-1.333 1.333c0 .737.597 1.334 1.333 1.334z"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <path
      d="M8 14.667C10.24 12.427 12.667 10.027 12.667 8.133c0-2.934-2.2-6.133-4.667-6.133S3.333 5.2 3.333 8.133c0 1.894 2.427 4.294 4.667 6.534z"
      stroke="#fff"
      strokeWidth="1.5"
    />
  </svg>
);

const ChatIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"
      fill="white"
    />
  </svg>
);

const FollowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      fill="white"
    />
  </svg>
);

// --- MAIN COMPONENT ---
const NearbyPersonCard = ({ person }: { person: Person }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg w-full aspect-square">
      <Image
        src={person.backgroundUrl}
        alt={`${person.name}'s background`}
        layout="fill"
        className="object-cover z-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
      <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between text-white">
        {/* Top Info */}
        <div
          className="flex items-center gap-0.5
        "
        >
          <div className="relative ">
            <Image
              src={person.avatarUrl}
              alt={person.name}
              //   layout="fill"
              width={24}
              height={24}
              className="rounded-full object-cover border-2 border-white/80"
            />
          </div>
          <div>
            <p className="font-bold text-[12px]">{person.name}</p>
            <p className="text-[10px] flex items-center gap-1">
              <LocationPinIcon />
              {person.distance}
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center gap-1 justify-between flex-wrap">
          <button className="flex items-center gap-0.5 hover:underline text-[10px]">
            <ChatIcon />
            Request to chat
          </button>
          <button className="flex items-center gap-0.5 hover:underline text-[10px]">
            <FollowIcon />
            Follow
          </button>
        </div>
      </div>
    </div>
  );
};

export default NearbyPersonCard;
