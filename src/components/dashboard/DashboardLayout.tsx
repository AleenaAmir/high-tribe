"use client";
import React from "react";
import UserCard from "./leftside/UserCard";
import NavMenu from "./leftside/NavMenu";
import FriendsList from "./leftside/FriendsList";
import Image from "next/image";

const mockFriends = [
  {
    id: "1",
    name: "Sara Diamond",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    mutualFriends: 2,
  },
  {
    id: "2",
    name: "Sara Diamond",
    avatarUrl: "https://randomuser.me/api/portraits/women/45.jpg",
    mutualFriends: 2,
  },
  {
    id: "3",
    name: "Sara Diamond",
    avatarUrl: "https://randomuser.me/api/portraits/women/46.jpg",
    mutualFriends: 2,
  },
  {
    id: "4",
    name: "Sara Diamond",
    avatarUrl: "https://randomuser.me/api/portraits/women/47.jpg",
    mutualFriends: 2,
  },
  {
    id: "5",
    name: "Sara Diamond",
    avatarUrl: "https://randomuser.me/api/portraits/women/48.jpg",
    mutualFriends: 2,
  },
];

const DashboardLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50 grid grid-cols-12 gap-4">
      {/* Left Sidebar */}
      <aside className="col-span-2 bg-white flex flex-col space-y-4 pt-6 px-2">
        <UserCard
          name="Umer Hussain"
          subtitle="@Specter_Movies"
          avatarUrl="https://randomuser.me/api/portraits/men/32.jpg"
        />
        {/* <NavMenu active="Feed" /> */}
        <FriendsList friends={mockFriends} />
        <Image
          src="/dashboard/hotdeal.png"
          alt="Hot Deal"
          width={315}
          height={212}
          className="rounded-xl max-w-[100%] object-contain"
        />
      </aside>
      {/* Main Content */}
      <main className="col-span-7 pt-6 px-2">
        {children || (
          <div className="text-gray-400 text-center mt-20">
            Main dashboard content goes here.
          </div>
        )}
      </main>
      {/* Right Sidebar (placeholder) */}
      <aside className="col-span-3 pt-6 px-2">
        <div className="bg-white rounded-xl shadow-sm p-4 text-gray-400 text-center">
          Right sidebar content
        </div>
      </aside>
    </div>
  );
};

export default DashboardLayout;
