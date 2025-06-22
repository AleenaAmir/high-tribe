"use client";
import React from "react";
import Image from "next/image";
import LocationSmall from "../svgs/LocationSmall";

// --- TYPE DEFINITION ---
export type Person = {
  name: string;
  avatarUrl: string;
  distance: string;
  backgroundUrl: string;
};

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} fill="none">
    <path
      stroke="#fff"
      strokeWidth={1.5}
      d="M.961 6.433c0-1.441.555-2.823 1.542-3.842A5.181 5.181 0 0 1 6.224 1c1.396 0 2.735.572 3.722 1.591a5.523 5.523 0 0 1 1.541 3.842V9.89c0 .575 0 .862-.082 1.092-.066.183-.17.348-.303.486a1.313 1.313 0 0 1-.47.312c-.223.086-.502.086-1.059.086H6.224a5.18 5.18 0 0 1-3.721-1.591A5.523 5.523 0 0 1 .96 6.432Z"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4.253 5.754h3.948M6.227 8.47h1.974"
    />
  </svg>
);

const FollowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} fill="none">
    <path
      fill="#fff"
      d="M4.786 9.22c2.269 0 4.18 1.643 4.437 3.82a.555.555 0 1 1-1.103.13c-.19-1.61-1.62-2.84-3.334-2.84-1.715 0-3.146 1.23-3.334 2.84a.556.556 0 0 1-1.104-.13c.257-2.177 2.168-3.82 4.438-3.82Zm0-6.662a2.776 2.776 0 1 1 0 5.551 2.776 2.776 0 0 1 0-5.55Zm0 1.11a1.665 1.665 0 1 0 0 3.331 1.665 1.665 0 0 0 0-3.33Zm6.106-3.33a.555.555 0 0 1 .546.455l.009.1v1.665h1.665a.555.555 0 0 1 .546.455l.01.1a.555.555 0 0 1-.556.556h-1.665v1.665a.556.556 0 0 1-1.101.1l-.01-.1V3.669H8.672a.555.555 0 0 1-.546-.456l-.009-.1a.555.555 0 0 1 .555-.555h1.666V.893a.555.555 0 0 1 .555-.555Z"
    />
  </svg>
);

// --- MAIN COMPONENT ---
const NearbyPersonCard = ({ person }: { person: Person }) => {
  return (
    <div className="relative rounded-[7px] overflow-hidden shadow-lg w-full aspect-square">
      <Image
        src={person.backgroundUrl}
        alt={`${person.name}'s background`}
        layout="fill"
        className="object-cover z-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
      <div className="absolute inset-0 z-20 p-1 flex flex-col justify-between text-white">
        {/* Top Info */}
        <div className="flex items-center gap-0.5 mt-1">
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
            <p className="font-bold text-[10px] leading-none">{person.name}</p>
            <p className="text-[8px] flex items-center gap-0.5">
              <LocationSmall />
              {person.distance}
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center gap-1 justify-between mb-1">
          <button className="flex items-center gap-0.5 hover:underline text-[8px]">
            <ChatIcon />
            Request to chat
          </button>
          <button className="flex items-center gap-0.5 hover:underline text-[8px]">
            <FollowIcon />
            Follow
          </button>
        </div>
      </div>
    </div>
  );
};

export default NearbyPersonCard;
