"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import NavMenu from "@/components/dashboard/leftside/NavMenu";
import ProfileDropdown from "@/components/global/ProfileDropdown";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { fetchGooglePlaceSuggestions } from "@/lib/googlePlaces";
import Menuicon from "./Menuicon";

interface NavBarProps {
  onMenuClick: () => void;
  onPlaceSelected?: (lng: number, lat: number, name?: string) => void;
  onFilterChange?: (filter: string) => void;
  onNewJourneyClick?: () => void;
  onShowJourneyList?: () => void;
}

const Explore = ({
  onMenuClick,
  onPlaceSelected,
  onFilterChange,
  onNewJourneyClick,
  onShowJourneyList,
}: NavBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Add state for the modals
  const [isJournyMap, setJournyMap] = useState(false);
  const [isFootprintModal, setFootprintModal] = useState(false);
  const [isAdvisoryModal, setAdvisoryModal] = useState(false);
  const [isTipModal, setTipModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserName(localStorage.getItem("name"));
      const storedIsHost = localStorage.getItem("isHost");
      setIsHost(storedIsHost === "true");
    }
  }, []);

  // Fetch Google Places suggestions as user types
  useEffect(() => {
    let isCancelled = false;
    const run = async () => {
      if (search.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      const results = await fetchGooglePlaceSuggestions(search.trim());
      if (!isCancelled) {
        setSuggestions(results);
        setIsLoading(false);
      }
    };
    run();
    return () => {
      isCancelled = true;
    };
  }, [search]);

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
    <div className="sticky top-0 lg:z-50 z-40 bg-white">
      <div className="flex items-center justify-between max-w-[1920px] mx-auto">
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
              placeholder="Search places..."
              className="w-full pl-11 pr-4 py-[6px] rounded-full text-xs text-[#3E3E3E] focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
              // value={search}
              // onChange={(e) => {
              //   setSearch(e.target.value);
              //   setShowSuggestions(true);
              // }}
              // onFocus={() => setShowSuggestions(true)}
              // onKeyDown={async (e) => {
              //   if (e.key === "Enter") {
              //     e.preventDefault();
              //     try {
              //       setIsLoading(true);
              //       let first = suggestions?.[0];
              //       if (!first) {
              //         const fresh = await fetchGooglePlaceSuggestions(
              //           search.trim()
              //         );
              //         first = fresh?.[0];
              //       }
              //       if (first) {
              //         const params = new URLSearchParams({
              //           place_id: first.place_id,
              //           fields: "place_id,formatted_address,geometry,name",
              //         });
              //         const res = await fetch(
              //           `/api/google-places?action=details&${params.toString()}`
              //         );
              //         const data = await res.json();
              //         const lng = data?.result?.geometry?.location?.lng;
              //         const lat = data?.result?.geometry?.location?.lat;
              //         if (lng && lat && onPlaceSelected) {
              //           onPlaceSelected(
              //             lng,
              //             lat,
              //             data?.result?.name || first.description
              //           );
              //         }
              //       }
              //     } finally {
              //       setIsLoading(false);
              //       setShowSuggestions(false);
              //     }
              //   }
              // }}
            />
            {/* {isLoading && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                Loading...
              </span>
            )}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 top-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-auto">
                {suggestions.map((s: any) => (
                  <button
                    key={s.place_id}
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                    onClick={async () => {
                      setSearch(s.description);
                      setShowSuggestions(false);
                      setSuggestions([]);
                      try {
                        const params = new URLSearchParams({
                          place_id: s.place_id,
                          fields: "place_id,formatted_address,geometry,name",
                        });
                        setIsLoading(true);
                        const res = await fetch(
                          `/api/google-places?action=details&${params.toString()}`
                        );
                        const data = await res.json();
                        setIsLoading(false);
                        const lng = data?.result?.geometry?.location?.lng;
                        const lat = data?.result?.geometry?.location?.lat;
                        if (lng && lat && onPlaceSelected) {
                          onPlaceSelected(
                            lng,
                            lat,
                            data?.result?.name || s.description
                          );
                        }
                      } catch (e) {
                        setIsLoading(false);
                      }
                    }}
                  >
                    <div className="font-medium text-gray-800">
                      {s?.structured_formatting?.main_text || s.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      {s?.structured_formatting?.secondary_text}
                    </div>
                  </button>
                ))}
              </div>
            )} */}
          </div>
        </div>

        {/* Right Section - Navigation Icons & Profile */}
        <div className="flex items-center gap-4">
          {/* Navigation Icons */}
          <nav className="hidden md:flex items-center gap-6 py-2">
            <NavIcon icon="/dashboard/navsvg1.svg" label="Home" isActive />
            <NavIcon
              icon="/dashboard/navsvg3.svg"
              label="Messaging"
              // notificationCount={3}
            />
            <NavIcon icon="/dashboard/navsvg6.svg" label="Notifications" />
            <NavIcon icon="/dashboard/wishlist.png" label="Wishlist" />
            <NavIcon icon="/dashboard/cart.png" label="Cart" />
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
              <p className="text-[8px] text-[#3E3E3E]">Switch to Hosting</p>
            </div>
          </div>
        </div>
      </div>

      {/* ExploreFeeds Component - Below Navbar */}
      <ExploreFeeds
        setJournyMap={setJournyMap}
        setFootprintModal={setFootprintModal}
        setAdvisoryModal={setAdvisoryModal}
        setTipModal={setTipModal}
        onFilterChange={onFilterChange}
        onNewJourneyClick={onNewJourneyClick}
      />
      <div className="flex items-center gap-2 bg-white p-3">
        <div className="relative w-[360px] border border-[#DFDFDF] rounded-full">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-3 py-[6px] rounded-full text-xs text-[#3E3E3E] focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                try {
                  setIsLoading(true);
                  let first = suggestions?.[0];
                  if (!first) {
                    const fresh = await fetchGooglePlaceSuggestions(
                      search.trim()
                    );
                    first = fresh?.[0];
                  }
                  if (first) {
                    const params = new URLSearchParams({
                      place_id: first.place_id,
                      fields: "place_id,formatted_address,geometry,name",
                    });
                    const res = await fetch(
                      `/api/google-places?action=details&${params.toString()}`
                    );
                    const data = await res.json();
                    const lng = data?.result?.geometry?.location?.lng;
                    const lat = data?.result?.geometry?.location?.lat;
                    if (lng && lat && onPlaceSelected) {
                      onPlaceSelected(
                        lng,
                        lat,
                        data?.result?.name || first.description
                      );
                    }
                  }
                } finally {
                  setIsLoading(false);
                  setShowSuggestions(false);
                }
              }
            }}
          />
          {isLoading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
              Loading...
            </span>
          )}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 top-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-auto">
              {suggestions.map((s: any) => (
                <button
                  key={s.place_id}
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                  onClick={async () => {
                    setSearch(s.description);
                    setShowSuggestions(false);
                    setSuggestions([]);
                    try {
                      const params = new URLSearchParams({
                        place_id: s.place_id,
                        fields: "place_id,formatted_address,geometry,name",
                      });
                      setIsLoading(true);
                      const res = await fetch(
                        `/api/google-places?action=details&${params.toString()}`
                      );
                      const data = await res.json();
                      setIsLoading(false);
                      const lng = data?.result?.geometry?.location?.lng;
                      const lat = data?.result?.geometry?.location?.lat;
                      if (lng && lat && onPlaceSelected) {
                        onPlaceSelected(
                          lng,
                          lat,
                          data?.result?.name || s.description
                        );
                      }
                    } catch (e) {
                      setIsLoading(false);
                    }
                  }}
                >
                  <div className="font-medium text-gray-800">
                    {s?.structured_formatting?.main_text || s.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    {s?.structured_formatting?.secondary_text}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={onShowJourneyList}
          type="button"
          className="p-2 bg-white cursor-pointer"
        >
          <Menuicon />
        </button>
      </div>
    </div>
  );
};

const ExploreFeeds = ({
  setJournyMap,
  setFootprintModal,
  setAdvisoryModal,
  setTipModal,
  onFilterChange,
  onNewJourneyClick,
}: {
  setJournyMap: (value: boolean) => void;
  setFootprintModal: (value: boolean) => void;
  setAdvisoryModal: (value: boolean) => void;
  setTipModal: (value: boolean) => void;
  onFilterChange?: (filter: string) => void;
  onNewJourneyClick?: () => void;
}) => {
  const [activeTab, setActiveTab] = useState("All feeds");

  const options = [
    {
      name: "All feeds",
      img: (
        <Image
          src={"/dashboard/Feeds.svg"}
          alt={"footprint1"}
          width={12}
          height={12}
          className="w-3 h-3 border-black"
        />
      ),
      onclick: () => {
        setActiveTab("All feeds");
        onFilterChange?.("All feeds");
      },
    },
    // {
    //   name: "Footprints",
    //   img: (
    //     <Image
    //       src={"/dashboard/Footicon.svg"}
    //       alt={"footprint1"}
    //       width={12}
    //       height={12}
    //       className="w-3 h-3"
    //     />
    //   ),
    //   onclick: () => {
    //     setActiveTab("Footprints");
    //     onFilterChange?.("Footprints");
    //     setJournyMap(true);
    //   },
    // },
    // {
    //   name: "Mapping journey",
    //   img: (
    //     <Image
    //       src={"/dashboard/Guid.svg"}
    //       alt={"footprint2"}
    //       width={16}
    //       height={16}
    //       className="md:w-[16px] md:h-[16px] w-[12px] h-[12px]"
    //     />
    //   ),
    //   onclick: () => {
    //     setActiveTab("Mapping journey");
    //     onFilterChange?.("Mapping journey");
    //     setJournyMap(true);
    //   },
    // },
    // {
    //   name: "Travel Advisory",
    //   img: (
    //     <Image
    //       src={"/dashboard/footprint2.svg"}
    //       alt={"footprint2"}
    //       width={16}
    //       height={16}
    //       className="md:w-[16px] md:h-[16px] w-[12px] h-[12px]"
    //     />
    //   ),
    //   onclick: () => {
    //     setActiveTab("Travel Advisory");
    //     onFilterChange?.("Travel Advisory");
    //     setAdvisoryModal(true);
    //   },
    // },
    // {
    //   name: "Travel Tip",
    //   img: (
    //     <Image
    //       src={"/dashboard/footprint3.svg"}
    //       alt={"footprint3"}
    //       width={16}
    //       height={16}
    //       className="md:w-[16px] md:h-[16px] w-[12px] h-[12px]"
    //     />
    //   ),
    //   onclick: () => {
    //     setActiveTab("Travel Tip");
    //     onFilterChange?.("Travel Tip");
    //     setTipModal(true);
    //   },
    // },
    {
      name: "Peoples",
      img: (
        <Image
          src={"/dashboard/People.svg"}
          alt={"footprint3"}
          width={16}
          height={16}
          className="md:w-[16px] md:h-[16px] w-[12px] h-[12px]"
        />
      ),
      onclick: () => {
        setActiveTab("Peoples");
        onFilterChange?.("Peoples");
      },
    },
    {
      name: "All Hostings",
      img: (
        <Image
          src={"/dashboard/Host.svg"}
          alt={"footprint2"}
          width={16}
          height={16}
          className="md:w-[16px] md:h-[16px] w-[12px] h-[12px]"
        />
      ),
      onclick: () => {
        setActiveTab("All Hostings");
        onFilterChange?.("All Hostings");
      },
    },
    {
      name: "Events",
      img: (
        <Image
          src={"/dashboard/Event.svg"}
          alt={"footprint3"}
          width={16}
          height={16}
          className="md:w-[16px] md:h-[16px] w-[12px] h-[12px]"
        />
      ),
      onclick: () => {
        setActiveTab("Events");
        onFilterChange?.("Events");
      },
    },
    {
      name: "Restaurants",
      img: (
        <Image
          src={"/dashboard/Resturant.svg"}
          alt={"footprint2"}
          width={24}
          height={24}
          className="md:w-[20px] md:h-[20px] w-[14px] h-[14px]"
        />
      ),
      onclick: () => {
        setActiveTab("Restaurants");
        onFilterChange?.("Restaurants");
      },
    },
    {
      name: "Tour Guide",
      img: (
        <Image
          src={"/dashboard/Guid.svg"}
          alt={"footprint3"}
          width={24}
          height={24}
          className="md:w-[20px] md:h-[20px] w-[14px] h-[14px]"
        />
      ),
      onclick: () => {
        setActiveTab("Tour Guide");
        onFilterChange?.("Tour Guide");
        setTipModal(true);
      },
    },
    {
      name: "Properties",
      img: (
        <Image
          src={"/dashboard/Properties.svg"}
          alt={"footprint3"}
          width={24}
          height={24}
          className="md:w-[20px] md:h-[20px] w-[14px] h-[14px]"
        />
      ),
      onclick: () => {
        setActiveTab("Properties");
        onFilterChange?.("Properties");
        setTipModal(true);
      },
    },
  ];

  return (
    <div className="flex items-center justify-between p-3 rounded-b-lg bg-[#F9F9F9] overflow-x-auto border-[#E5E5E5] border-y ">
      <div className="flex items-center gap-2">
        {options.map((option, i) => (
          <button
            type="button"
            key={i}
            onClick={option?.onclick || (() => {})}
            className={`flex items-center text-[8px] md:text-[10px] gap-0.5 p-1 md:p-1.5 cursor-pointer hover:shadow-md transition-all duration-300 px-1.5 md:px-3 rounded-full whitespace-nowrap border ${
              activeTab === option.name
                ? "bg-gradient-to-r from-[#9743AA] to-[#E54295] text-white"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {option?.img && option?.img}
            {option?.name && <p>{option.name}</p>}
          </button>
        ))}
      </div>

      {/* Right Side - Start New January Button and Three Dots */}
      <div className="flex items-center gap-2">
        {/* Start New January Button */}
        <div className="relative">
          <div className="bg-gradient-to-r from-[#9743AA] to-[#E54295] rounded-full p-px">
            <button
              onClick={onNewJourneyClick ? onNewJourneyClick : () => {}}
              className="flex items-center text-[13px] gap-1 px-3 py-1.5 bg-white text-black rounded-full hover:bg-gray-50 transition-colors cursor-pointer shadow-sm hover:shadow-md active:scale-95"
            >
              <span className="whitespace-nowrap">Start New January</span>
              <div className="w-4 h-4 bg-white border border-black rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer active:scale-95">
                <svg
                  className="w-2.5 h-2.5 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="bg-gradient-to-r from-[#9743AA] to-[#E54295] rounded-full p-px">
            <button
              onClick={onNewJourneyClick ? onNewJourneyClick : () => {}}
              className="flex items-center text-[13px] gap-1 px-5 py-1.5 bg-white text-black rounded-full hover:bg-gray-50 transition-colors cursor-pointer shadow-sm hover:shadow-md active:scale-95"
            >
              Explore
            </button>
          </div>
        </div>

        {/* Three Dots Menu Button */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Image src={"/dashboard/dots.svg"} alt="dots" width={4} height={4} />
        </button>
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
      className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 transform translate-y-2 ${
        isActive ? "bg-blue-600" : "bg-transparent group-hover:bg-blue-600"
      }`}
    />
  </button>
);

export default Explore;
