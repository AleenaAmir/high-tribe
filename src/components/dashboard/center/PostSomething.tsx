import Image from "next/image";
import React from "react";
import FootPrint from "../svgs/FootPrint";

const PostSomething = () => {
  return (
    <div className="bg-white rounded-lg shadow-md ">
      <h2 className="text-xl text-[#696969] border-b p-6 pb-2 border-[#696969]">
        Post Someting
      </h2>
      <div className="px-6 pt-4 pb-6">
        <div className="flex  items-center gap-4 bg-gray-50 rounded-lg p-1 border border-gray-50">
          <Image
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="User"
            width={38}
            height={38}
            className="w-10 h-10 rounded-full object-cover"
          />
          <input
            type="text"
            className="w-full placeholder:text-[#938585] outline-none"
            placeholder="Share your adventure or travel Plans"
          />
          <FootPrint className="hover:text-[#1063E0] text-[#BDBDBD]" />
        </div>
      </div>
    </div>
  );
};

export default PostSomething;
