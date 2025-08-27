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

    <div className="grid grid-cols-2 gap-4 ">
      <div className="flex items-center  gap-3 px-8  py-2 col-span-1">
        <div className="xl:min-w-[260px] w-[260px] xl:w-full xl:max-w-[280px] ">
          <Image src="/logo.svg" alt="High Tribe" width={130} height={47} className="h-11 w-auto" />
        </div>

        <div className="relative flex-2 min-w-[220px] max-w-[280px]">
          <input
            type="text"
            placeholder="Search people, trips, places...."
            className="w-full pl-14 pr-4 py-4 rounded-full bg-[#F7F7F7]
            text-[12px] text-[#000000] font-gilroy font-[400]
            leading-[100%] tracking-[-0.03em]
            focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-[#000000]"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9F9F9F]"
            fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 h-5 w-px bg-[#9F9F9F]" />
        </div>


      </div>
      <div>

        <div className="flex items-center shrink-0">
          <nav className="flex items-center gap-8 py-2 px-2 text-[#000000] font-gilroy font-[500] leading-[100%] tracking-[-3%]  xl:min-w-[500px] max-w-[580px]  xl:w-full xl:max-w-[620px]">
            <NavIcon icon="/dashboard/navsvg1.svg" label="Home" isActive />
            <NavIcon icon="/dashboard/navsvg3.svg" label="Messaging" />
            <NavIcon icon="/dashboard/navsvg6.svg" label="Notifications" />
            <NavIcon icon="/dashboard/group.svg" label="Friends" />
            <NavIcon icon="/dashboard/Heart.svg" label="Wishlist" />
            <NavIcon icon="/dashboard/cart.png" label="Cart" />
          </nav>

          {/* Mobile menu button (kept inline) */}
          <div className="relative py-2" ref={menuRef}>
            <button
              type="button"
              className="md:hidden relative p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Image src="/dashboard/navsvg2.svg" alt="Menu" width={24} height={24} className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">3</span>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                <NavMenu onItemClick={() => setIsMenuOpen(false)} />
              </div>
            )}
          </div>
          <div className="xl:min-w-[180px] max-w-[200px]  xl:w-full xl:max-w-[320px] flex items-center justify-evenly gap-4">
            <ProfileDropdown
              userName={userName}
              isOpen={isProfileOpen}
              onToggle={() => setIsProfileOpen(!isProfileOpen)}
            />

            <div className=" py-2 px-4 -mb-1 rounded-md">
              <div className="flex flex-col items-center gap-1">
                <label className="relative h-6 w-12 inline-block">
                  <input
                    type="checkbox"
                    checked={isHost}
                    onChange={handleHostToggle}
                    className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  />
                  <span className="relative block h-full w-full rounded-full bg-[#ebedf2] transition-colors
                before:content-[''] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4
                before:rounded-full before:bg-white before:transition-all before:duration-300
                peer-checked:bg-[linear-gradient(90.76deg,#9243AC_0.54%,#B6459F_50.62%,#E74294_99.26%)]
                peer-checked:before:left-7" />
                </label>
                <p className="text-[8px] text-[#000000] font-gilroy font-[600] leading-[100%] tracking-[-3%]">
                  Switch to Hosting
                </p>
              </div>
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
        width={36}
        height={36}
        className="w-10 h-8"
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
