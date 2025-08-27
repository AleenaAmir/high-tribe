"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { fetchGooglePlaceSuggestions } from "@/lib/googlePlaces";
import Menuicon from "./Menuicon";
import PlusIcon from "./icons/PlusIcon";

interface NavBarProps {
  onPlaceSelected?: (lng: number, lat: number, name?: string) => void;
  onFilterChange?: (filter: string) => void;
  onNewJourneyClick?: () => void;
  onShowJourneyList?: () => void;
}

const Explore = ({
  onPlaceSelected,
  onFilterChange,
  onNewJourneyClick,
  onShowJourneyList,
}: NavBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Add state for the modals

  const [isTipModal, setTipModal] = useState(false);

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

  return (
    <div className="sticky top-0 lg:z-50 z-40 bg-white">
      {/* ExploreFeeds Component - Below Navbar */}
      <ExploreFeeds
        setTipModal={setTipModal}
        onFilterChange={onFilterChange}
        onNewJourneyClick={onNewJourneyClick}
      />
      <div className="flex items-center gap-2 bg-white p-3">
        <button
          onClick={onShowJourneyList}
          type="button"
          className="p-2 bg-white cursor-pointer"
        >
          <Menuicon />
        </button>
        <div className="relative w-[360px] border border-[#DFDFDF] rounded-full p-2">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-3 py-[6px] rounded-full text-xs text-[#3E3E3E] focus:outline-none focus:border-blue-500 placeholder:text-[#909090] placeholder:text-[14px] placeholder:font-gilroy placeholder:font-[400] placeholder:leading-[100%] placeholder:tracking-[-3%]"
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

      </div>
    </div>
  );
};

const ExploreFeeds = ({

  setTipModal,
  onFilterChange,
  onNewJourneyClick,
}: {

  setTipModal: (value: boolean) => void;
  onFilterChange?: (filter: string) => void;
  onNewJourneyClick?: () => void;
}) => {
  const [activeTab, setActiveTab] = useState("All feeds");
  const [toggle, setToggle] = useState<"newJourney" | "explore" | null>(null);

  const options = [
    {
      name: "All Feeds",
      img: (
        <Image
          src={"/dashboard/Feeds.svg"}
          alt={"footprint1"}
          width={14}
          height={14}
          className="w-6 h-6 border-black"
        />
      ),
      onclick: () => {
        setActiveTab("All Feeds");
        onFilterChange?.("All Feeds");
      },
    },

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
    <div className="flex items-center justify-between p-3 rounded-b-lg  overflow-x-auto border-b border-[#E5E5E5] ">
      <div className="flex items-center gap-2">
        {options.map((option, i) => (
          <button
            type="button"
            key={i}
            onClick={option?.onclick || (() => { })}
            className={`flex items-center text-[8px] md:text-[10px] gap-0.5 p-1 md:p-1.5 cursor-pointer hover:shadow-md transition-all duration-300 px-1.5 md:px-3 rounded-full whitespace-nowrap border ${activeTab === option.name
              ? "bg-gradient-to-r from-[#9743AA] to-[#E54295] text-white"
              : "bg-white text-gray-700 border-gray-300"
              }`}
          >
            {option?.img && option?.img}
            {option?.name && <p className="text-[12px] md:text-[14px] font-gilroy font-[500] leading-[100%] tracking-[-3%]">{option.name}</p>}
          </button>
        ))}
      </div>

      {/* Right Side - Start New January Button and Three Dots */}
      <div className="flex items-center gap-3">
        {/* Start New Journey */}
        <div className="rounded-full p-[1.5px] bg-[linear-gradient(90.76deg,#9743AA_0.54%,#B6459F_50.62%,#E54295_99.26%)]">
          <button
            onClick={() => {
              setToggle("newJourney");
              onNewJourneyClick?.();
            }}
            className={[
              "flex items-center gap-2 rounded-full px-5 py-2 text-[14px] font-gilroy font-medium",
              "transition-all hover:shadow-md active:scale-[0.99] focus:outline-none",
              toggle === "newJourney"
                // ACTIVE: filled gradient, white text
                ? "bg-[linear-gradient(90.76deg,#9743AA_0.54%,#B6459F_50.62%,#E54295_99.26%)] text-white"
                // IDLE: white fill, black text
                : "bg-white text-black"
            ].join(" ")}
          >
            <span>Start New Journey</span>

            {/* Plus chip */}
            <span
              className={[
                "inline-flex h-5 w-5 items-center justify-center rounded-full",
                // 1.5px ring like Figma (thin, crisp)
                "border-[1.5px]",
                toggle === "newJourney"
                  // ACTIVE: white chip with black plus
                  ? "bg-white border-white/0 text-black"
                  // IDLE: transparent chip with black ring & black plus
                  : "bg-transparent border-black text-black"
              ].join(" ")}
            >
              {/* tiny plus via SVG for consistent stroke */}
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3"
                fill="none"
                stroke="black"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </button>
        </div>


        {/* Explore */}
        <div className="p-[1.5px] rounded-full bg-gradient-to-r from-[#9743AA] to-[#E54295]">
          <button
            onClick={() => setToggle("explore")}
            className={`px-6 py-2 rounded-full text-[14px] font-medium font-gilroy transition-all shadow-sm hover:shadow-md active:scale-95
        ${toggle === "explore"
                ? "bg-gradient-to-r from-[#9743AA] to-[#E54295] text-white"
                : "bg-white text-black"
              }`}
          >
            Explore
          </button>
        </div>


      </div>


    </div>
  );
};


export default Explore;
