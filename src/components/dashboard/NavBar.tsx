"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import NavMenu from "./leftside/NavMenu";

interface NavBarProps {
  onMenuClick: () => void;
}

const NavBar = ({ onMenuClick }: NavBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="sticky top-0 lg:z-50 z-40 bg-white ">
      <div className="flex items-center justify-between px-4 py-2 max-w-[1920px] mx-auto">
        {/* Left Section - Logo and Mobile Menu */}
        <div className="flex items-center gap-2">
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
            width={80}
            height={32}
            className="h-8 w-auto"
          />
        </div>

        {/* Center Section - Search */}
        <div className="hidden lg:flex flex-1 justify-center max-w-3xl mx-4">
          <div className="relative w-[360px]">
            <div className="absolute inset-y-0 gap-1 left-3 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
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
              <span className="text-gray-400 mx-0.5">|</span>
            </div>
            <input
              type="text"
              placeholder="Search people, trips, places..."
              className="w-full pl-11 pr-4 py-[6px] rounded-full text-xs text-[#3E3E3E] focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Right Section - Navigation Icons & Profile */}
        <div className="flex items-center gap-4">
          {/* Navigation Icons */}
          <nav className="hidden md:flex items-center gap-6">
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
          <div className="relative" ref={menuRef}>
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
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              type="button"
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-full"
            >
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden md:block text-sm font-medium">
                Umer Hussain
              </span>
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    // Navigate to profile page
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    // Navigate to settings page
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    // Navigate to help page
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Help & Support
                </button>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Switch to Hosting Toggle */}
          <div className="hidden md:flex flex-col items-center gap-1">
            <label className="relative h-6 w-12">
              <input
                type="checkbox"
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
    className={`relative flex flex-col items-center ${
      isActive ? "text-blue-600" : "text-gray-700"
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
    <span className="text-xs font-medium mt-0.5">{label}</span>
    {isActive && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transform translate-y-2" />
    )}
  </button>
);

export default NavBar;
