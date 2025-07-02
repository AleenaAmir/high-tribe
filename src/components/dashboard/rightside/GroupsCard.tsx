"use client";
import React from "react";
import Image from "next/image";

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
          src="https://picsum.photos/seed/groups/800/400"
          alt="Groups background"
          layout="fill"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-end items-end text-right text-white p-4">
          <h2 className="text-2xl font-bold">GROUPS</h2>
          <p className="mt-1 text-sm">
            New ways to find and
            <br />
            join communities.
          </p>
          <button className="mt-4 bg-white/20 border border-white/50 backdrop-blur-sm text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors">
            Find Your Group
          </button>
        </div>
      </div>
      <div className="p-2 flex items-center gap-3">
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
      </div>
    </div>
  );
};

export default GroupsCard;
