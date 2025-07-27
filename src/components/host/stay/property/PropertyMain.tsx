import React from "react";
import { useSearchParams } from "next/navigation";
import PropertyLanding from "./PropertyLanding";
import PropertyForm from "./PropertyFormUpdated";

export default function PropertyMain() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("property") || "false";
  return (
    <div>
      {currentTab !== "true" && (
        <div className="flex justify-between items-center gap-4">
          <h3 className="text-[18px] font-bold md:text-[24px]">Listings</h3>
          {/* <button
            type="button"
            className="text-white bg-black py-2 px-5 rounded-full  text-[10px] md:text-[12px] cursor-pointer hover:shadow-md "
           
          >
            + Add a new listing
          </button> */}
        </div>
      )}

      {currentTab === "true" ? <PropertyForm /> : <PropertyLanding />}
    </div>
  );
}
