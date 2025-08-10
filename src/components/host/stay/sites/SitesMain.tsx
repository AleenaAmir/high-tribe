import React from "react";
import { useSearchParams } from "next/navigation";
import SitesLanding from "./SitesLanding";
// import SitesForm from "./SitesForm";

export default function SitesMain() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("sites") || "false";
  return (
    <div>
      {currentTab !== "true" && (
        <div className="flex justify-between items-center gap-4">
          <h3 className="text-[18px] font-bold md:text-[24px]">Sites</h3>
          <button
            type="button"
            className="text-white bg-black py-2 px-5 rounded-full  text-[10px] md:text-[12px] cursor-pointer hover:shadow-md "
            onClick={() => {
              // Set the "sites" search param to "true"
              const params = new URLSearchParams(window.location.search);
              params.set("sites", "true");
              window.history.replaceState(
                {},
                "",
                `${window.location.pathname}?${params.toString()}`
              );
            }}
          >
            + Add a new site
          </button>
        </div>
      )}

      {/* {currentTab === "true" ? <SitesForm /> : <SitesLanding />} */}
    </div>
  );
}
