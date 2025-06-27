"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

const menuItems = [
  {
    label: "Profile Settings",
    icon: (
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4v1m0 14v1m8-8h-1M5 12H4m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707"
        />
      </svg>
    ),
  },
  {
    label: "Help Center",
    icon: (
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10h.01M12 14h.01M16 10h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
        />
      </svg>
    ),
  },
  {
    label: "Dark Mode",
    icon: (
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
        />
      </svg>
    ),
  },
  {
    label: "Upgrade Plan",
    icon: (
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

const UserProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setUserName(localStorage.getItem("name"));
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => setOpen((v) => !v)}
      >
        <Image
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="User Avatar"
          width={32}
          height={32}
          className="rounded-full object-cover"
          unoptimized
        />
        <span className="font-medium text-gray-700">{userName}</span>
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {open && (
        <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg py-2 z-50 ">
          {menuItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {item.icon}
              {item.label}
            </div>
          ))}
          <div className="border-t my-2" />
          <div className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer text-sm">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7"
              />
            </svg>
            Sign Out
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;
