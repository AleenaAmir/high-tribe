"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import ProfileDropdown from "@/components/global/ProfileDropdown";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const NavBar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
    <div className="sticky top-0 lg:z-50 z-40 border-b border-[#F4F4F4]">
      <div className="flex items-center justify-between   max-w-[1920px] mx-auto">
        {/* Left Section - Logo and Mobile Menu */}
        <div className="flex items-center gap-2 py-2 px-4">
          <Image
            src="/logo.svg"
            alt="High Tribe"
            width={130}
            height={47}
            className="h-11 w-auto"
          />
        </div>

        {/* Right Section - Navigation Icons & Profile */}
        <div className="flex items-center gap-4">
          {/* Profile Button */}
          <ProfileDropdown
            userName={userName}
            isOpen={isProfileOpen}
            onToggle={() => setIsProfileOpen(!isProfileOpen)}
          />

          {/* Switch to Hosting Toggle */}
          <div className="bg-[#F9F9F9] py-2 px-4 -mb-1">
            <div className="flex flex-col items-center gap-1">
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
              <p className="text-[8px] text-[#3E3E3E]">Switch to Hosting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Navigation Icon Component
const NavIcon = ({
  icon,
  label,
  isActive,
  notificationCount,
}: {
  icon: string;
  label: string;
  isActive?: boolean;
  notificationCount?: number;
}) => (
  <button
    className={`relative flex group cursor-pointer flex-col items-center ${
      isActive ? "text-blue-600" : "text-[#6C6C6C] hover:text-blue-600"
    }`}
  >
    <div className="p-1.5 relative">
      <Image
        src={icon}
        alt={label}
        width={19}
        height={19}
        className="w-5 h-5"
      />
      {notificationCount && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
          {notificationCount}
        </span>
      )}
    </div>
    <span className="text-[8px] font-medium mt-0.5">{label}</span>

    <div
      className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300  transform translate-y-2 ${
        isActive ? "bg-blue-600" : "bg-transparent group-hover:bg-blue-600"
      }`}
    />
  </button>
);

export default NavBar;
