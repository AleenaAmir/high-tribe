import React from "react";

type IntarctionsProps = {
  footprint?: string;
  likes?: string;
  photos?: string;
};
const Intarctions = ({ footprint, likes, photos }: IntarctionsProps) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-[18px] font-bold">{footprint ?? "100"}</p>
          <p className="text-[10px] text-gray-500">Footprints</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-center">
            <p className="text-[18px] font-bold">{photos ?? "100"}</p>
            <p className="text-[10px] text-gray-500">Photos</p>
          </div>
          <div className="text-center">
            <p className="text-[18px] font-bold">{likes ?? "100"}</p>
            <p className="text-[10px] text-gray-500">Likes</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-2">
        <button className="w-full bg-gray-700 text-white text-[8px] rounded-full px-3 py-2 hover:bg-gray-600 transition-colors">
          Follow
        </button>
        <button className="w-full bg-gray-700 text-white text-[8px] rounded-full px-3 py-2 hover:bg-gray-600 transition-colors">
          Calendar
        </button>
        <button className="w-full bg-gray-700 text-white text-[8px] rounded-full px-3 py-2 hover:bg-gray-600 transition-colors">
          Share
        </button>
      </div>
      <button className="w-full bg-gradient-to-r from-[#247BFE] to-[#1063E0] text-white rounded-md py-2 hover:bg-blue-500 transition-colors">
        Bucket list
      </button>
    </div>
  );
};

export default Intarctions;
