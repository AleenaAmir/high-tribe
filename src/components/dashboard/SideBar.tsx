"use client";
import React, { useEffect, useState } from "react";
import UserCard from "./leftside/UserCard";
import NavMenu from "./leftside/NavMenu";
import FriendsList from "./leftside/FriendsList";
import Image from "next/image";
import Intarctions from "./leftside/Intarctions";
import Events from "./leftside/Events";
import Achivments from "./leftside/Achivments";
import Badges from "./leftside/Badges";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import BucketList from "./leftside/BucketList";

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

const mockEvents = [
  // {
  //   id: 1, title: "Events Host", date: "8/13/2025", isHighlighted: true
  // },
  // {
  //   title: "Events in Iceland",
  // },
  // {
  //   title: "Event Stay",
  // },
  // {
  //   title: "Event coffee with ali",
  // },
  // {
  //   title: "Event cofee with ali",
  // },
  // {
  //   title: "event stay",
  // },
  // {
  //   title: "Event in Iceland",
  // },
  { id: 1, title: "Events Host", date: "8/13/2025", isHighlighted: true },
  {
    id: 2,
    title: "Events in Iceland",
    date: "8/14/2025",
    isHighlighted: false,
  },
  { id: 3, title: "Event story", date: "8/15/2025", isHighlighted: false },
  {
    id: 4,
    title: "Event coffee with ali",
    date: "8/16/2025",
    isHighlighted: false,
  },
  {
    id: 5,
    title: "Event coffee with ali",
    date: "8/16/2025",
    isHighlighted: false,
  },
  { id: 6, title: "Event stay", date: "8/16/2025", isHighlighted: false },
  {
    id: 7,
    title: "Events in Iceland",
    date: "8/17/2025",
    isHighlighted: false,
  },
];

const mockBadges = [
  "/dashboard/achivment.png",
  // "/dashboard/achivment.png",
  // "/dashboard/achivment.png",
  // "/dashboard/achivment.png",
  // "/dashboard/achivment.png",
  // "/dashboard/achivment.png",
];

interface SideBarProps {
  onItemClick?: () => void;
}

const SideBar = ({ onItemClick }: SideBarProps) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserName(localStorage.getItem("name"));
      const storedIsHost = localStorage.getItem("isHost");
      setIsHost(storedIsHost === "true");
    }
  }, []);

  const handleHostToggle = () => {
    const newIsHost = !isHost;
    setIsHost(newIsHost);
    if (typeof window !== "undefined") {
      localStorage.setItem("isHost", newIsHost.toString());
    }

    if (newIsHost) {
      toast.success("Switched to Hosting mode!");
      router.push("/host/create");
    } else {
      toast.success("Switched to User mode!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <UserCard
        name={userName || "Umer Hussain"}
        subtitle="Exploring the world, one adventure at a time. Passionate traveler and storyteller."
        avatarUrl="https://randomuser.me/api/portraits/men/32.jpg"
        // onClick={onItemClick}
      />
      {/* <NavMenu active="Feed" onItemClick={onItemClick} /> */}
      <div className="md:hidden flex justify-between items-center gap-1">
        <p className="text-[12px] text-[#3E3E3E]">Switch to Hosting</p>
        <label className="relative h-6 w-12">
          <input
            type="checkbox"
            checked={isHost}
            onChange={handleHostToggle}
            className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
            id="custom_switch_checkbox1"
          />
          <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-[#F28321] peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
        </label>
      </div>
      <Intarctions footprint={"268"} likes={"1.4K"} photos={"2.5K"} />
      <Events events={mockEvents} />
      <BucketList />
      <Badges badges={mockBadges} />
      <Achivments />
      <FriendsList friends={mockFriends} onItemClick={onItemClick} />
      {/* <Image
        src="/dashboard/hotdeal.png"
        alt="Hot Deal"
        width={315}
        height={212}
        className="rounded-xl max-w-[100%] object-contain mt-5"
      /> */}
    </div>
  );
};

export default SideBar;
