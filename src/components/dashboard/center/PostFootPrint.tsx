import Image from "next/image";
import React from "react";
import FootPrint from "../svgs/FootPrint";
import { MoreOptionsIcon } from "./PostCard";

const PostFootPrint = ({
  setJournyMap,
  setFootprintModal,
  setAdvisoryModal,
  setTipModal,
}: {
  setJournyMap: (value: boolean) => void;
  setFootprintModal: (value: boolean) => void;
  setAdvisoryModal: (value: boolean) => void;
  setTipModal: (value: boolean) => void;
}) => {
  const options = [
    {
      name: "Map your Trip",
      src: "/dashboard/postsicon/MapTrip.png",
      onClick: () => setJournyMap(true),

    },
    {
      name: "Foot Print",
      src: "/dashboard/postsicon/FootPrint.png",
      onClick: () => setFootprintModal(true),

    },
    {
      name: "Travel Tip",
      src: "/dashboard/postsicon/TravelTip.png",
      onClick: () => setTipModal(true),

    },
    {
      name: "Travel Advisory",
      src: "/dashboard/postsicon/TripAdvisory.png",
      onClick: () => setAdvisoryModal(true),

    },
  ];

  const addSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="23"
        height="23"
        fill="none"
        viewBox="0 0 23 23"
      >
        <path
          fill="#fff"
          d="M21.89 2.384a1.59 1.59 0 0 0-1.274-1.275 68.5 68.5 0 0 0-18.232 0 1.59 1.59 0 0 0-1.275 1.275 68.5 68.5 0 0 0 0 18.232 1.59 1.59 0 0 0 1.275 1.275c6.05.812 12.182.812 18.232 0a1.59 1.59 0 0 0 1.275-1.275 68.5 68.5 0 0 0 0-18.232m-3.01 9.795c-2.032.149-4.063.22-6.095.243a99 99 0 0 1-.249 6.458.67.67 0 1 1-1.342 0 99 99 0 0 1-.249-6.451 99 99 0 0 1-6.451-.25.672.672 0 0 1 0-1.341 99 99 0 0 1 6.458-.25c.022-2.031.094-4.063.242-6.094a.671.671 0 0 1 1.342 0c.148 2.034.22 4.067.243 6.101a99 99 0 0 1 6.101.242.672.672 0 0 1 0 1.342"
        ></path>
      </svg>
    );
  };
  return (
    <div className="bg-white rounded-lg shadow-md ">
      <h2 className="text-[20px] font-[600] leading-[100%] tracking-[-3%] font-gilroy text-[#000000] border-b p-4 md:p-6 pb-2 font-roboto border-[#EEEEEE]">
        Post Footprint
      </h2>
      <div className="p-4 md:px-8  border-b border-[#EEEEEE]">
        <div className="flex  items-center gap-4 justify-between md:justify-between rounded-lg p-1 md:flex-nowrap flex-wrap">
          <div className="flex items-center gap-2 ">
            <Image
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
              unoptimized
            />
            <input
              type="text"
              className="w-full placeholder:text-[#000000] text-[12px] font-poppins font-[400] leading-[100%] tracking-[-3%] outline-none"
              placeholder="What's on your mind?"
            />
          </div>
          <button
            className="text-white font-bold cursor-pointer outline-none text-[10px] group flex items-center gap-2 justify-center font-poppins bg-gradient-to-r from-[#9243AC] via-[#B6459F] to-[#E74294] rounded-full p-3 shadow-[0px_4px_4px_0px_#6C6A6A40]"
            onClick={() => setFootprintModal(true)}
          >
            {addSvg()}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 rounded-b-lg justify-end bg-[#F9F9F9]">
        {options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={opt.onClick}
            className="group flex items-center gap-3 rounded-full bg-white border border-[#E6E6E6]
                 pl-1 pr-4 py-1.5 shadow-sm hover:shadow-md transition-all"
          >
            {/* Circular icon holder with gradient */}

            <Image
              src={opt.src}
              alt={opt.name}
              width={35}
              height={35}
              className="w-[35px] h-[35px] object-contain"
            />


            {/* Label */}
            <span className="text-[12px] md:text-[13px] font-gilroy text-[#000] whitespace-nowrap">
              {opt.name}
            </span>
          </button>
        ))}
      </div>

    </div>
  );
};

export default PostFootPrint;
