"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import NavMenu from "./leftside/NavMenu";
import ProfileDropdown from "@/components/global/ProfileDropdown";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface NavBarProps {
  onMenuClick: () => void;
}

const NavBar = ({ onMenuClick }: NavBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    <div className="sticky top-0 lg:z-50 z-40 bg-white ">
      <div className="flex items-center justify-between   max-w-[1920px] mx-auto">
        {/* Left Section - Logo and Mobile Menu */}
        <div className="flex items-center gap-2 py-2 px-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Image
            src="/logo.svg"
            alt="High Tribe"
            width={130}
            height={47}
            className="h-11 w-auto"
          />
        </div>

        {/* Center Section - Search */}
        <div className="hidden lg:flex flex-1 justify-center max-w-3xl mx-4 py-2">
          <div className="relative w-[360px]">
            <div className="absolute inset-y-0 gap-1 left-3 flex items-center pointer-events-none text-[#000000]">
              <svg
                className="w-4 h-4 text-[#000000]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="text-[#000000] mx-0.5 text-[12px] font-gilroy font-[400] leading-[100%] tracking-[-3%]">|</span>
            </div>
            <input
              type="text"
              placeholder="Search people, trips, places..."
              className="w-full pl-11 pr-4 py-[6px] rounded-full text-[12px] text-[#000000] font-gilroy font-[400] leading-[100%] tracking-[-3%] focus:outline-none focus:border-blue-500 placeholder:text-[#000000]"
            />
          </div>
        </div>

        {/* Right Section - Navigation Icons & Profile */}
        <div className="flex items-center gap-4">
          {/* Navigation Icons */}
          <nav className="hidden md:flex items-center gap-6 py-2 text-[#000000] font-gilroy font-[500] leading-[100%] tracking-[-3%]" >
            <NavIcon icon="/dashboard/navsvg1.svg" label="Home" isActive />
            <NavIcon
              icon="/dashboard/navsvg3.svg"
              label="Messaging"
            // notificationCount={3}
            />
            <NavIcon icon="/dashboard/navsvg6.svg" label="Notifications" />
            <NavIcon icon="/dashboard/navsvg2.svg" label="Friends" />
            <NavIcon icon="/dashboard/navsvg5.svg" label="My Tribe" />
          </nav>

          {/* Mobile Menu Button */}
          <div className="relative py-2" ref={menuRef}>
            <button
              type="button"
              className="md:hidden relative p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Image
                src="/dashboard/navsvg2.svg"
                alt="Menu"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Menu Dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                <NavMenu onItemClick={() => setIsMenuOpen(false)} />
              </div>
            )}
          </div>

          {/* Profile Button */}
          <ProfileDropdown
            userName={userName}
            isOpen={isProfileOpen}
            onToggle={() => setIsProfileOpen(!isProfileOpen)}
          />

          {/* Switch to Hosting Toggle */}
          <div className="bg-[#F9F9F9] py-2 px-4 -mb-1">
            <div className="hidden md:flex flex-col items-center gap-1">
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
              <p className="text-[8px] font-[#000000] font-gilroy font-[600] leading-[100%] tracking-[-3%]">Switch to Hosting</p>
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
    className={`relative text-[#000000] flex group cursor-pointer flex-col items-center ${isActive ? "text-blue-600" : "text-[#000000] hover:text-blue-600 font-gilroy font-[500] leading-[100%] tracking-[-3%]"
      }`}
  >
    <div className="p-1.5 relative">
      <Image
        src={icon}
        alt={label}
        width={24}
        height={24}
        className="w-6 h-6"
      />
      {notificationCount && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
          {notificationCount}
        </span>
      )}
    </div>
    <span className="text-[10px] font-gilroy font-[500] leading-[100%] tracking-[-3%] mt-0.5">{label}</span>

    <div
      className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300  transform translate-y-2 ${isActive ? "bg-blue-600" : "bg-transparent group-hover:bg-blue-600"
        }`}
    />
  </button>
);

export default NavBar;
