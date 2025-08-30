import React, { useState } from "react";
import { Search, Heart, ChevronRight, Star } from "lucide-react";
import { MoreOptionsIcon } from "@/components/explore/icons/StepIcons";

const Booking = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>("Any type");

  const roomTypes = ["Any type", "Room", "Entire home"];

  return (
    <div className="relative mx-auto bg-white rounded-lg shadow-md  overflow-hidden w-full py-3 px-2.5">
      <div className="flex items-center justify-between">
        <h1 className="font-roboto font-semibold text-[15px] leading-[100%] tracking-[0.01em]">
          Room Booking
        </h1>
        <MoreOptionsIcon className="hover:text-[#0F62DE]" />
      </div>

      <div className="mt-4">
        <div className="relative h-full w-full">
          <Search className=" absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="search"
            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-gray-200 text-sm"
          />
        </div>
      </div>

      <div className="mt-3">
        <div className="mt-4 grid grid-cols-3 gap-3">
          {roomTypes.map((tag) => {
            const isActive = selectedType === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedType(isActive ? null : tag)} // toggle
                aria-pressed={isActive}
                title={tag}
                className={[
                  "flex w-full h-9 items-center justify-center rounded-2xl border px-3 py-1",
                  "text-[10px] sm:text-xs truncate transition-colors cursor-pointer text-gilroy text-[#000000] font-[500] leading-[100%] tracking-[3%]",
                  isActive
                    ? "bg-black text-white border-black"
                    : "bg-white text-[#030303] border-[#D1D4D9] hover:bg-black hover:text-white",
                ].join(" ")}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3">
        <div className="relative bg-white rounded-lg w-full border border-[#F0F0F0] shadow">
          <div className="relative bg-gradient-to-br">
            <img
              src="/dashboard/Room.svg"
              alt="Bedroom"
              className="object-contain rounded-lg w-full h-full"
            />

            <button
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
                  }`}
              />
            </button>

            <button className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-7 h-7 bg-white/70 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:bg-white z-10">
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>
          {/* Room Details */}{" "}
          <div className="p-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-extrabold text-black">
                The wondering Riverside Retreat
              </p>
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-[10px] font-medium text-black">
                  4.93(167)
                </span>
              </div>
            </div>

            <p className="text-black text-[10px] mb-1">
              2 bedrooms + 2beds + 1 Bathroom
            </p>

            <div className="flex items-center gap-1">
              <span className="text-black text-[10px]">Night stay</span>
              <span className="font-bold text-black text-[10px]">2000 PKR</span>
              <span className="text-black text-[10px]">Only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
