import Image from "next/image";
import React from "react";
import FootPrint from "../svgs/FootPrint";
import { MoreOptionsIcon } from "./PostCard";

const PostFootPrint = ({
  setJournyMap,
  setFootprintModal,
  setAdvisoryModal,
}: {
  setJournyMap: (value: boolean) => void;
  setFootprintModal: (value: boolean) => void;
  setAdvisoryModal: (value: boolean) => void;
}) => {
  const options = [
    {
      name: "Journey Mapping",
      img: (
        <Image
          src={"/dashboard/footprint1.svg"}
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
      name: "Travel Advisory",
      img: (
        <Image
          src={"/dashboard/footprint2.svg"}
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
    {
      name: "Travel Tip",
      img: (
        <Image
          src={"/dashboard/footprint3.svg"}
          alt={"footprint3"}
          width={24}
          height={24}
          className="md:w-[20px] md:h-[20px] w-[14px] h-[14px]"
        />
      ),
      onclick: () => {},
    },
  ];
  return (
    <div className="bg-white rounded-lg shadow-md ">
      <h2 className="text-xl text-[#696969] border-b p-4 md:p-6 pb-2 font-roboto border-[#EEEEEE]">
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
              className="w-full placeholder:text-[#938585] outline-none"
              placeholder="What's on your mind"
            />
          </div>
          <button
            className="text-white font-bold cursor-pointer outline-none text-[10px] group flex items-center gap-2 justify-end font-poppins bg-gradient-to-r from-[#247CFF] to-[#0F62DE] rounded-full w-[100px] p-1"
            onClick={() => setFootprintModal(true)}
          >
            <span>Footprint</span>
            <span className="bg-white text-[#176BEA] group-hover:text-white group-hover:bg-[#176BEA] transition-all duration-300 rounded-full p-1">
              <FootPrint className="" />
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
