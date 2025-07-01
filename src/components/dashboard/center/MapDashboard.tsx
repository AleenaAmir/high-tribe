"use client";
import React, { useState, useEffect, useRef } from "react";
import Location from "../svgs/Location";
import Filters from "../svgs/Filters";
import InteractiveMap, { InteractiveMapRef } from "./InteractiveMap";
import Image from "next/image";
import DestinationSvg from "../svgs/DestinationSvg";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export const filtersArray = [
  {
    img: "/dashboard/filtersvg1.svg",
  },
  {
    img: "/dashboard/filtersvg2.svg",
  },
  {
    img: "/dashboard/filtersvg3.svg",
  },
  {
    img: "/dashboard/filtersvg4.svg",
  },
  {
    img: "/dashboard/filtersvg5.svg",
  },
  {
    img: "/dashboard/filtersvg6.svg",
  },
  {
    img: "/dashboard/filtersvg7.svg",
  },
];

const MapDashboard = () => {
  const [isExplore, setIsExplore] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const mapRef = useRef<InteractiveMapRef>(null);
  const [isFilters, setIsFilters] = useState<boolean>(false);

  // Autocomplete for search input
  useEffect(() => {
    if (search.length < 2) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        search
      )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&autocomplete=true&limit=5`
    )
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data.features || []);
        setIsLoading(false);
      });
  }, [search]);

  // Handle suggestion click
  const handleSuggestionClick = (feature: any) => {
    setSearch(feature.place_name);
    setSuggestions([]);
    setShowSuggestions(false);
    if (feature.center && mapRef.current) {
      mapRef.current.centerMap(
        feature.center[0],
        feature.center[1],
        feature.place_name
      );
    }
  };

  return (
    <div className="rounded-lg shadow-md">
      <div className="flex items-center justify-between gap-4 p-6 bg-white rounded-t-lg">
        <p className="md:text-[18px] text-[14px] text-[#696969] font-roboto">
          Trip Schedule
        </p>
        <div className="flex items-center border rounded-full border-gray-100">
          <button
            type="button"
            className={` px-4 py-2 rounded-full  border-none ${
              isExplore
                ? "bg-gradient-to-r from-[#257CFF] to-[#0F62DE] text-white"
                : "bg-white"
            }`}
            onClick={() => setIsExplore(true)}
          >
            Explore
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-full  border-none ${
              !isExplore
                ? "bg-gradient-to-r from-[#257CFF] to-[#0F62DE] text-white"
                : "bg-white"
            }`}
            onClick={() => setIsExplore(false)}
          >
            Travel Planner
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between p-3 bg-[#F8F8F8] md:px-6 relative">
        <div className="flex items-center gap-2 w-full  relative">
          <div className="flex items-center px-2 py-1 group gap-2 bg-white border border-[#EEEEEE] rounded-full w-full relative max-w-[160px]">
            <Location className="flex-shrink-0 text-[#696969] group-hover:text-[#F6691D]" />
            <input
              type="text"
              className="outline-none bg-transparent text-sm w-full"
              placeholder="Search for places..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              autoComplete="off"
            />
            {isLoading && (
              <span className="ml-2 text-xs text-gray-400">Loading...</span>
            )}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 top-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-auto">
                {suggestions.map((feature) => (
                  <div
                    key={feature.id}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm"
                    onClick={() => handleSuggestionClick(feature)}
                  >
                    {feature.place_name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center px-2 py-1 gap-2 bg-white border border-[#EEEEEE] rounded-full w-full relative max-w-[160px]">
            <DestinationSvg className="flex-shrink-0" />
            <input
              type="text"
              className="outline-none bg-transparent text-sm w-full"
              placeholder="Search for places..."
            />
          </div>
          <div
            className={`flex items-center justify-center p-2 rounded-full cursor-pointer hover:shadow-lg transition-all delay-300 ${
              isFilters
                ? "bg-gradient-to-r from-[#D6D5D4] to-white"
                : "bg-gradient-to-r from-[#257CFF] to-[#0F62DE]"
            }`}
            onClick={() => setIsFilters(!isFilters)}
          >
            <Filters
              className={`${
                isFilters ? "text-[#6C6868]" : "text-white"
              } flex-shrink-0`}
            />
          </div>
          <div
            className={`${
              isFilters ? "max-w-full" : "max-w-0"
            } flex items-center gap-2 transition-all w-fit delay-300 overflow-hidden`}
          >
            {filtersArray.map((filter, i) => (
              <div
                key={i}
                className="flex items-center justify-center p-2 rounded-full cursor-pointer hover:shadow-lg border border-gray-200"
              >
                <Image
                  src={filter.img}
                  width={17}
                  height={17}
                  alt="svg"
                  className="w-[17px] object-contain flex-shrink-0"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          className="p-2 rounded-lg w-fit text-white border-none cursor-pointer hover:shadow-lg transition-shadow"
          type="button"
          style={{
            background:
              "linear-gradient(93.8deg, #F2306A 5.92%, #F35735 95.98%)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="15"
            fill="none"
            viewBox="0 0 13 15"
          >
            <path
              fill="#fff"
              fillRule="evenodd"
              d="M4.727 5.934c1.399 0 2.533-1.107 2.533-2.473S6.126.99 4.727.99c-1.398 0-2.532 1.107-2.532 2.472 0 1.366 1.134 2.473 2.532 2.473m0 .989c-1.958 0-3.545-1.55-3.545-3.462C1.182 1.55 2.769 0 4.727 0s3.546 1.55 3.546 3.461c0 1.912-1.588 3.462-3.546 3.462m3.714 5.995V11.36c-.046-1.506-1.66-2.789-3.714-2.789-2.048 0-3.66 1.277-3.713 2.779v3.155H8.44zm1.014 1.587H0s0-3.152.002-3.189c.073-2.072 2.16-3.734 4.725-3.734 2.571 0 4.663 1.67 4.726 3.749zm-4.023-3.058c.096.154.3.299.479.34l1.349.317-.923 1.03a.77.77 0 0 0-.173.556L6.337 15l-1.316-.514a.88.88 0 0 0-.591.007L3.218 15l.087-1.32a.8.8 0 0 0-.196-.546l-.914-.978 1.365-.352a.87.87 0 0 0 .472-.347l.696-1.139zm1.929-3.799c.507-1.648 2.397-2.802 3.41-.956S13 5.242 13 5.242V9s-2.938 3.402-3.208 1.252c-.27-2.149-2.708-2.466-2.431-2.604"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
      <div className="overflow-hidden h-fit ">
        <InteractiveMap ref={mapRef} />
      </div>
    </div>
  );
};

export default MapDashboard;
