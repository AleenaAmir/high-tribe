import Image from "next/image";
import React from "react";

type BadgesProps = {
  badges?: any[];
};
const Badges = ({ badges }: BadgesProps) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col gap-4">
      <h3 className="text-[#6C6868] text-[16px]">Recent Badges</h3>

      <div className="flex items-center gap-2 justify-between flex-wrap">
        {badges?.map((badges, i) => (
          <div key={i}>
            <Image
              src={badges}
              alt={"badges"}
              width={60}
              height={60}
              className="object-contain w-[55px] h-[55px] flex-shrink-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Badges;
