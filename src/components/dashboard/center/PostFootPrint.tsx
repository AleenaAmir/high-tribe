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
      name: "Journey Mapping",
      img: (
        <Image
          src={"/dashboard/jurney.svg"}
          alt={"footprint1"}
          width={33}
          height={33}
          className="md:w-[20px] md:h-[20px] w-[14px] h-[14px]"
        />
      ),
      onclick: () => {
        setJournyMap(true);
      },
    },
    {
      name: "Foot Print",
      img: (
        <Image
          src={"/dashboard/foot.svg"}
          alt={"footprint1"}
          width={24}
          height={24}
          className="md:w-[20px] md:h-[20px] w-[14px] h-[14px]"
        />
      ),
      onclick: () => {
        setJournyMap(true);
      },
    },

    {
      name: "Travel Tip",
      img: (
        <Image
          src={"/dashboard/trip.svg"}
          alt={"footprint3"}
          width={24}
          height={24}
          className="md:w-[20px] md:h-[20px] w-[14px] h-[14px]"
        />
      ),
      onclick: () => {
        setTipModal(true);
      },
    },
    {
      name: "Travel Advisory",
      img: (
        <Image
          src={"/dashboard/advisory.svg"}
          alt={"footprint2"}
          width={24}
          height={24}
          className="md:w-[20px] md:h-[20px] w-[14px] h-[14px]"
        />
      ),
      onclick: () => {
        setAdvisoryModal(true);
      },
    },
  ];
  return (
    <div className="bg-white rounded-lg shadow-md ">
      <h2 className="text-[16px] font-[550] leading-[100%] tracking-[-3%]  text-[#000000] border-b p-4 md:p-6 pb-2 font-roboto border-[#EEEEEE]">
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
              className="w-full placeholder:text-[#000000]  text-[12px] font-poppins font-[400] leading-[100%] tracking-[-3%] outline-none"
              placeholder="What's on your mind?"
            />
          </div>
          <button
            className="text-white font-bold cursor-pointer outline-none text-[10px] group flex items-center gap-2 justify-center font-poppins bg-gradient-to-r from-[#9243AC] via-[#B6459F] to-[#E74294] rounded-full w-[114px] h-[32px] p-1"
            onClick={() => setFootprintModal(true)}
          >
            <span>Footprint</span>
            <span className="bg-[#FFFFFF]  transition-all duration-300 rounded-full">
              <FootPrint />
            </span>
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3   p-4 rounded-b-lg justify-end bg-[#F9F9F9]">
        {options.map((option, i) => (
          <button
            type="button"
            key={i}
            onClick={option?.onclick || (() => {})}
            className="flex items-center text-[9px] md:text-[11px] gap-1 p-1 md:p-2 cursor-pointer hover:shadow-md transition-all duration-300 px-2 md:px-4 rounded-full bg-white"
          >
            {option?.img && option?.img}
            {option?.name && <p>{option.name}</p>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PostFootPrint;
