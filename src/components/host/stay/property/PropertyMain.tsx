import React from "react";

import PropertyLanding from "./PropertyLanding";

export default function PropertyMain() {
  return (
    <div>
      <div className="flex justify-between items-center gap-4">
        <h3 className="text-[18px] font-bold md:text-[24px]">Listings</h3>
        {/* <button
            type="button"
            className="text-white bg-black py-2 px-5 rounded-full  text-[10px] md:text-[12px] cursor-pointer hover:shadow-md "
           
          >
            + Add a new listing
          </button> */}
      </div>

      <PropertyLanding />
    </div>
  );
}
