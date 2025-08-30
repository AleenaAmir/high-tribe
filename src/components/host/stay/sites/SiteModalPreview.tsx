import GlobalModal from "@/components/global/GlobalModal";
import React from "react";
import SitesPreview from "./SitesPreview";
import { useSearchParams } from "next/navigation";
import Previewmodal from "./Previewmodal";

const SiteModalPreview = ({}) => {
  const searchParams = useSearchParams();
  const propertyId = searchParams ? searchParams.get("propertyId") : null;
  const siteId = searchParams ? searchParams.get("siteId") : null;
  const sitePreview = searchParams ? searchParams.get("sitepreview") : "false";

  // Debug logs
  console.log("Modal state:");
  console.log("PropertyId:", propertyId);
  console.log("SiteId:", siteId);

  return (
    // <GlobalModal
    //   isOpen={sitePreview === "true"}
    //   onClose={() => {
    //     const params = new URLSearchParams(searchParams?.toString());
    //     params.set("sitepreview", "false");
    //     window.history.replaceState(null, "", `?${params.toString()}`);
    //   }}
    //   maxWidth="max-w-[1200px]"
    //   customPadding="p-0"
    // >
    //     <div className="w-full h-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-1
    //    [&::-webkit-scrollbar-track]:bg-[#9743AB]
    //    [&::-webkit-scrollbar-thumb]:bg-[#D9D9D9]
    //     dark:[&::-webkit-scrollbar-track]:bg-[#D9D9D9]
    //    dark:[&::-webkit-scrollbar-thumb]:bg-[#9743AB]">
    //   <SitesPreview onClose={() => { const params = new URLSearchParams(searchParams?.toString());
    //     params.set("sitepreview", "false");
    //     window.history.replaceState(null, "", `?${params.toString()}`);
    //   }} />
    //   </div>

    // </GlobalModal>

    <Previewmodal
      isOpen={sitePreview === "true"}
      onClose={() => {
        const params = new URLSearchParams(searchParams?.toString());
        params.set("sitepreview", "false");
        window.history.replaceState(null, "", `?${params.toString()}`);
      }}
      maxWidth="max-w-[1200px]"
      customPadding="p-0"
    >
      <div
        className="w-full h-full max-h-[90vh] overflow-y-auto scroll-smooth
    scrollbar-thin scrollbar-thumb-[#D9D9D9] scrollbar-track-[#9743AB]
    dark:scrollbar-thumb-[#9743AB] dark:scrollbar-track-[#D9D9D9]
    rounded-md"
      >
        <SitesPreview
          onClose={() => {
            const params = new URLSearchParams(searchParams?.toString());
            params.set("sitepreview", "false");
            window.history.replaceState(null, "", `?${params.toString()}`);
          }}
        />
      </div>
    </Previewmodal>
  );
};

export default SiteModalPreview;
