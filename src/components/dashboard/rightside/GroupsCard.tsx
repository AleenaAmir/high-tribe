"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const GroupsCard = () => {
  const joinedFriends = [
    { avatarUrl: "https://randomuser.me/api/portraits/men/51.jpg" },
    { avatarUrl: "https://randomuser.me/api/portraits/women/52.jpg" },
    { avatarUrl: "https://randomuser.me/api/portraits/men/53.jpg" },
    { avatarUrl: "https://randomuser.me/api/portraits/women/54.jpg" },
    { avatarUrl: "https://randomuser.me/api/portraits/men/55.jpg" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-60">
        <Image
          src="/dashboard/group-1.svg"
          alt="Groups background"
          layout="fill"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/0 flex flex-col justify-end items-end text-right text-white p-4">
          <h2 className="text-2xl font-bold">GROUPS</h2>
          <p className="mt-1 text-sm">
            New ways to find and
            <br />
            join communities.
          </p>
          <Link href={'/explore'} className="mt-3  bg-gradient-to-r from-[#9243AC] via-[#B6459F] to-[#E74294] text-white px-6 mb-3 py-2 rounded-2xl text-sm font-bold font-gilroy hover:bg-white/30 transition-colors w-[114.2px] h-[32px] ">
            Let's Plan
          </Link>
        </div>
      </div>
      {/* <div className="p-2 flex items-center gap-3">
        <div className="flex -space-x-3">
          {joinedFriends.slice(0, 4).map((friend, i) => (
            <Image
              key={i}
              src={friend.avatarUrl}
              alt={`Friend ${i + 1}`}
              width={25}
              height={25}
              className="rounded-full border-2 border-white object-cover"
              unoptimized
            />
          ))}
        </div>
        <p className="text-[10px] text-[#696969] text-left">
          <span className="font-bold text-gray-800">Josh</span> And{" "}
          {joinedFriends.length - 1} Friends Joined Group
        </p>
      </div> */}
    </div>
  );
};

export default GroupsCard;
