import Image from "next/image";
import React from "react";
import Msg from "../svgs/Msg";
import Clock from "../svgs/Clock";

const Achivments = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col gap-4">
      <h3 className="text-[#6C6868] text-[16px]">Achieved milestones</h3>

      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-[#247BFE] to-[#1063E0]">
          <Msg fill="#fff" />
        </div>
        <div className=" w-full">
          <h3 className="text-[10px] text-[#6C6868]">1 Chats</h3>
        </div>
      </div>
      <p className="text-[12px] text-[#6C6868] font-bold">
        Next milestones Badges
      </p>
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-[#247BFE] to-[#1063E0]">
          <Clock fill="#fff" />
        </div>
        <div className=" w-full">
          <h3 className="text-[10px] text-[#6C6868]">Level 1</h3>
          <div className="w-full h-1 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex">
            <div className="bg-[#1063E0] h-1 rounded-full rounded-bl-full w-5/12 text-center text-white text-xs"></div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-[#247BFE] to-[#1063E0]">
          <Clock fill="#fff" />
        </div>
        <div className=" w-full">
          <h3 className="text-[10px] text-[#6C6868]">Level 2</h3>
          <div className="w-full h-1 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex">
            <div className="bg-[#1063E0] h-1 rounded-full rounded-bl-full w-5/12 text-center text-white text-xs"></div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-[#247BFE] to-[#1063E0]">
          <Clock fill="#fff" />
        </div>
        <div className=" w-full">
          <h3 className="text-[10px] text-[#6C6868]">Level 3</h3>
          <div className="w-full h-1 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex">
            <div className="bg-[#1063E0] h-1 rounded-full rounded-bl-full w-5/12 text-center text-white text-xs"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achivments;
