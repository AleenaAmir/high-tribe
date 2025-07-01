import Image from "next/image";
import React from "react";
import FootPrint from "../svgs/FootPrint";
import { MoreOptionsIcon } from "./PostCard";

const PostFootPrint = () => {
  const options = [
    {
      name: "Live Tour",
      img: (
        <Image
          src={"/dashboard/footprint1.svg"}
          alt={"footprint1"}
          width={24}
          height={24}
        />
      ),
      onclick: () => {},
    },
    {
      name: "Photo/Video",
      img: (
        <Image
          src={"/dashboard/footprint2.svg"}
          alt={"footprint2"}
          width={24}
          height={24}
        />
      ),
      onclick: () => {},
    },
    {
      name: "Feeling/Activity",
      img: (
        <Image
          src={"/dashboard/footprint3.svg"}
          alt={"footprint3"}
          width={24}
          height={24}
        />
      ),
      onclick: () => {},
    },
    {
      img: <MoreOptionsIcon className="text-[#000000] hover:text-[#1063E0]" />,
      onclick: () => {},
    },
  ];
  return (
    <div className="bg-white rounded-lg shadow-md ">
      <h2 className="text-xl text-[#696969] border-b p-4 md:p-6 pb-2 font-roboto border-[#EEEEEE]">
        Post Footprint
      </h2>
      <div className="px-4 md:px-8 pt-4">
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
          <div className="flex items-center gap-2 md:gap-4">
            {options.map((option, i) => (
              <button
                type="button"
                key={i}
                onClick={option?.onclick || (() => {})}
                className="flex items-center gap-1"
              >
                {option?.img && option?.img}
                {option?.name && <p>{option.name}</p>}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-2">
        <Image
          src={"/dashboard/footprintmap.png"}
          alt={"footprintmap"}
          width={780}
          height={240}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default PostFootPrint;
