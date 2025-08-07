import { apiRequest } from "@/lib/api";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const peopleSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="15"
    fill="none"
    viewBox="0 0 20 15"
  >
    <g stroke="#4F4F4F" strokeMiterlimit="10" clipPath="url(#clip0_2661_1525)">
      <path d="M3.2 7c.883 0 1.6-.697 1.6-1.556S4.083 3.89 3.2 3.89s-1.6.696-1.6 1.555C1.6 6.304 2.316 7 3.2 7ZM4.743 13.111H1.486c-.514 0-.857-.389-.857-.889v-1.555C.629 9.444 1.6 8.5 2.857 8.5h2M10.057 5.556c1.389 0 2.515-1.095 2.515-2.445S11.446.667 10.057.667c-1.388 0-2.514 1.094-2.514 2.444s1.126 2.445 2.514 2.445Z"></path>
      <path d="M13.771 14H6.114c-.8 0-1.428-.611-1.428-1.39v-2.388c0-1.89 1.657-3.445 3.657-3.445H11.6c2 0 3.657 1.556 3.657 3.445v2.389A1.484 1.484 0 0 1 13.771 14ZM16.572 7c.883 0 1.6-.697 1.6-1.556s-.717-1.555-1.6-1.555-1.6.696-1.6 1.555c0 .86.716 1.556 1.6 1.556Z"></path>
      <path d="M15.028 13.111h3.257c.515 0 .858-.389.858-.889v-1.555c0-1.223-.972-2.167-2.229-2.167h-2"></path>
    </g>
    <defs>
      <clipPath id="clip0_2661_1525">
        <path fill="#fff" d="M0 0h20v15H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

const bedIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="13"
    fill="none"
    viewBox="0 0 15 13"
  >
    <path
      fill="#000"
      d="M14.29 11.618H.713l.22.22v-3c0-.586.196-1.166.559-1.626.398-.5.96-.829 1.585-.952.217-.041.44-.041.659-.041h7.682c.427 0 .843.088 1.227.281a2.64 2.64 0 0 1 1.236 1.34c.156.383.194.775.194 1.186v2.806c0 .284.44.284.44 0v-3a3.06 3.06 0 0 0-.54-1.737c-.594-.861-1.567-1.318-2.601-1.318H4.347c-.539 0-1.087-.033-1.611.108C1.421 6.237.506 7.479.498 8.826c-.006 1.002 0 2.004 0 3.003 0 .12.1.22.22.22h13.579c.278.009.278-.43-.006-.43"
    ></path>
    <path
      fill="#000"
      d="M.767 10.013c.905-.208 1.84-.522 2.777-.37.542.089 1.052.262 1.612.28.553.014 1.078-.13 1.614-.247.442-.1.911-.1 1.36-.02.207.035.412.09.618.137a4.4 4.4 0 0 0 2.018.006c.196-.044.39-.094.586-.135.445-.09.914-.085 1.36 0 .372.07.738.17 1.107.252l.419.097c.275.064.392-.36.117-.425-.911-.21-1.843-.513-2.79-.401-.541.064-1.057.258-1.605.29-.553.032-1.072-.109-1.605-.226a4 4 0 0 0-1.371-.055c-.25.032-.492.093-.738.149a4.6 4.6 0 0 1-.868.135 3.7 3.7 0 0 1-1.02-.109c-.652-.15-1.285-.27-1.96-.17-.41.059-.814.173-1.215.264q-.263.062-.527.12c-.281.07-.164.492.111.428M1.427 7.232V3.16c0-1.107 1.084-1.778 2.097-1.778h6.788c.408 0 .815-.003 1.222 0 .639.006 1.31.281 1.705.797.243.316.334.676.334 1.07v3.983c0 .285.44.285.44 0V3.16c0-1.312-1.213-2.168-2.435-2.215-.413-.017-.83 0-1.242 0H3.527C2.314.945 1.09 1.74.99 3.022c-.017.211-.003.428-.003.64v3.573c0 .282.44.282.44-.003"
    ></path>
    <path
      fill="#000"
      d="M6.735 5.786H3.641c-.1 0-.178-.041-.178-.153V4.081c0-.13.117-.138.213-.138H6.59c.11 0 .272-.024.28.138.01.16 0 .325 0 .486v.823c0 .12.054.384-.134.396-.281.014-.284.454 0 .44.322-.018.577-.259.577-.587V4.081c0-.314-.26-.58-.577-.58H3.961c-.349 0-.739-.03-.897.369-.056.14-.038.298-.038.445v1.254c0 .24.076.44.284.577.179.117.466.08.671.08h2.754c.284 0 .284-.44 0-.44M11.4 5.786H8.304c-.1 0-.178-.041-.178-.153V4.081c0-.13.117-.138.214-.138h2.912c.111 0 .272-.024.28.138.01.16 0 .325 0 .486v.823c.004.12.054.384-.134.396-.281.014-.284.454 0 .44.322-.018.577-.259.577-.587V4.081c0-.314-.26-.58-.577-.58H8.625c-.349 0-.739-.03-.897.369-.055.14-.038.298-.038.445v1.254c0 .24.076.44.284.577.179.117.466.08.671.08H11.4c.284 0 .284-.44 0-.44"
    ></path>
  </svg>
);

export default function SitesPreview() {
  const searchParams = useSearchParams();
  const propertyId = searchParams ? searchParams.get("propertyId") : null;
  const siteId = searchParams ? searchParams.get("siteId") : null;
  const [siteData, setSiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSiteData = async () => {
      // Only fetch from API if we have propertyId and siteId
      if (!propertyId || !siteId) {
        setLoading(false);
        setError("Missing propertyId or siteId");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("Fetching site data for:", { propertyId, siteId });

        // Add additional validation for API request
        if (
          !propertyId.toString().match(/^\d+$/) ||
          !siteId.toString().match(/^\d+$/)
        ) {
          throw new Error("Invalid propertyId or siteId format");
        }

        const data = await apiRequest<any>(
          `properties/${propertyId}/sites/${siteId}`,
          {
            method: "GET",
          }
        );

        console.log("API Response:", data);

        // Handle both possible response structures
        const siteData = data.data || data;
        setSiteData(siteData);

        if (!siteData) {
          setError("No site data received from API");
        }
      } catch (err: any) {
        console.error("Error fetching site data:", err);
        setError(err.message || "Failed to fetch site data");
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();
  }, [propertyId, siteId]);

  // Debug logging
  console.log("Site data state:", siteData);

  // Helper function to get images from media array
  const getImages = () => {
    if (!siteData?.media || siteData.media.length === 0) {
      // Fallback images if no media
      return [
        "https://res.cloudinary.com/dtfzklzek/image/upload/v1754434728/Rectangle_5118_1_zrjm8u.png",
        "https://res.cloudinary.com/dtfzklzek/image/upload/v1754434630/Rectangle_5119_an98lg.png",
        "https://res.cloudinary.com/dtfzklzek/image/upload/v1754434630/Rectangle_5121_il34vh.png",
        "https://res.cloudinary.com/dtfzklzek/image/upload/v1754434630/Rectangle_5123_w359vo.png",
        "https://res.cloudinary.com/dtfzklzek/image/upload/v1754434629/Rectangle_5120_dpnrc1.png",
      ];
    }
    return siteData.media.map((item: any) => `${item.file_path}`);
  };

  const images = getImages();

  // Show loading state
  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-[1092px] mx-auto">
        <div className="animate-pulse">
          {/* Loading skeleton for title */}
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded mb-2 w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded mb-4 w-2/3"></div>

          {/* Loading skeleton for image grid */}
          <div className="grid grid-cols-9 grid-rows-3 gap-1 mt-4 max-h-[388px]">
            <div className="row-span-3 col-span-3">
              <div className="w-full h-full bg-gray-200 rounded-[7px]"></div>
            </div>
            <div className="row-span-3 col-span-4">
              <div className="w-full h-full bg-gray-200 rounded-[7px]"></div>
            </div>
            <div className="row-span-1 col-span-2">
              <div className="w-full h-full bg-gray-200 rounded-[7px]"></div>
            </div>
            <div className="row-span-1 col-span-2">
              <div className="w-full h-full bg-gray-200 rounded-[7px]"></div>
            </div>
            <div className="row-span-1 col-span-2">
              <div className="w-full h-full bg-gray-200 rounded-[7px]"></div>
            </div>
          </div>

          {/* Loading skeleton for content */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 mt-4">
            <div className="lg:col-span-7">
              <div className="h-8 bg-gray-200 rounded mb-4 w-1/2"></div>
              <div className="border border-[#E3E3E3] rounded-[10px] bg-white p-4">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-8 bg-gray-200 rounded-full w-20"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="h-64 bg-gray-200 rounded mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-[1092px] mx-auto">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg font-semibold mb-2">
            Error Loading Site Data
          </div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1092px] mx-auto">
      <h2 className="text-[#1C231F] text-[18px] md:text-[30px] font-bold">
        {siteData?.site_name || "Site Name"}
      </h2>
      <p className="text-[#1C231F] text-[14px] md:text-[16px] font-medium">
        {siteData?.accommodation_type || "Lodging / Room/Cabin"}
      </p>
      <p className="text-[#1C231F] text-[14px] md:text-[16px] font-medium max-w-[730px] mt-2">
        {siteData?.site_description ||
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled"}
      </p>
      <div className="grid grid-cols-9 grid-rows-3 gap-1 mt-4 max-h-[388px]">
        <div className="row-span-3 col-span-3">
          <Image
            src={
              images[0] ||
              "https://res.cloudinary.com/dtfzklzek/image/upload/v1754434728/Rectangle_5118_1_zrjm8u.png"
            }
            alt="Image"
            width={396}
            height={388}
            className="w-full h-full object-cover rounded-[7px]"
          />
        </div>
        <div className="row-span-3 col-span-4">
          <Image
            src={
              images[1] ||
              "https://res.cloudinary.com/dtfzklzek/image/upload/v1754434630/Rectangle_5119_an98lg.png"
            }
            alt="Image"
            width={396}
            height={388}
            className="w-full h-full object-cover rounded-[7px]"
          />
        </div>
        <div className="row-span-1 col-span-2">
          <Image
            src={
              images[2] ||
              "https://res.cloudinary.com/dtfzklzek/image/upload/v1754434630/Rectangle_5121_il34vh.png"
            }
            alt="Image"
            width={396}
            height={388}
            className="w-full h-full object-cover rounded-[7px]"
          />
        </div>
        <div className="row-span-1 col-span-2">
          <Image
            src={
              images[3] ||
              "https://res.cloudinary.com/dtfzklzek/image/upload/v1754434630/Rectangle_5123_w359vo.png"
            }
            alt="Image"
            width={396}
            height={388}
            className="w-full h-full object-cover rounded-[7px]"
          />
        </div>
        <div className="row-span-1 col-span-2">
          <Image
            src={
              images[4] ||
              "https://res.cloudinary.com/dtfzklzek/image/upload/v1754434629/Rectangle_5120_dpnrc1.png"
            }
            alt="Image"
            width={396}
            height={388}
            className="w-full h-full object-cover rounded-[7px]"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 mt-4">
        <div className="lg:col-span-7">
          <div>
            <h3 className="text-[#1C231F] text-[18px] md:text-[28px] font-bold">
              Site Amenities and Facilities
            </h3>
            <div className="border border-[#E3E3E3] rounded-[10px] shadow bg-white p-2 md:p-4 mt-4">
              <div>
                <p className="text-[#1C231F] text-[12px] md:text-[14px] font-semibold">
                  Tell us about guest favorites?
                </p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {siteData?.amenities?.amenities?.map(
                    (item: string, i: number) => (
                      <div
                        key={i}
                        className="px-3 py-2 rounded-full cursor-pointer text-[12px] font-semibold bg-[#EDEBEB] border border-[#DFDFDF]"
                      >
                        {item}
                      </div>
                    )
                  ) || (
                    <div className="px-3 py-2 rounded-full cursor-pointer text-[12px] font-semibold bg-[#EDEBEB] border border-[#DFDFDF]">
                      No amenities selected
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 border-b border-black/25 pb-2 md:pb-4">
                <p className="text-[#1C231F] text-[12px] md:text-[14px] font-semibold">
                  Do you have any standout amenities for your guests?
                </p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {siteData?.amenities?.facilities?.map(
                    (item: string, i: number) => (
                      <div
                        key={i}
                        className="px-3 py-2 rounded-full cursor-pointer text-[12px] font-semibold bg-[#EDEBEB] border border-[#DFDFDF]"
                      >
                        {item}
                      </div>
                    )
                  ) || (
                    <div className="px-3 py-2 rounded-full cursor-pointer text-[12px] font-semibold bg-[#EDEBEB] border border-[#DFDFDF]">
                      No facilities selected
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 border-b border-black/25 pb-2 md:pb-4">
                <p className="text-[#1C231F] text-[12px] md:text-[14px] font-semibold">
                  Do you have any of these safety items?
                </p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {siteData?.amenities?.safety_items?.map(
                    (item: string, i: number) => (
                      <div
                        key={i}
                        className="px-3 py-2 rounded-full cursor-pointer text-[12px] font-semibold bg-[#EDEBEB] border border-[#DFDFDF]"
                      >
                        {item}
                      </div>
                    )
                  ) || (
                    <div className="px-3 py-2 rounded-full cursor-pointer text-[12px] font-semibold bg-[#EDEBEB] border border-[#DFDFDF]">
                      No safety items selected
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 border-b border-black/25 pb-2 md:pb-4">
                <p className="text-[#1C231F] text-[12px] md:text-[14px] font-semibold">
                  Do you allow pet?
                </p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <div className="px-3 py-2 rounded-full cursor-pointer text-[12px] font-semibold bg-[#EDEBEB] border border-[#DFDFDF]">
                    {siteData?.amenities?.pet_policy === "yes_on_leash"
                      ? "Yes, on leash"
                      : siteData?.amenities?.pet_policy === "no"
                      ? "No"
                      : "Not specified"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 border-b border-black/25 pb-2 md:pb-4">
            <h3 className="text-[#1C231F] text-[18px] md:text-[28px] font-bold">
              Site Capacity
            </h3>
            <div className="flex items-center gap-4 mt-4 justify-center lg:justify-between max-w-[400px] flex-wrap">
              <div>
                <p className="text-[16px] md:text-[20px] font-semibold">
                  Maximum Occupancy
                </p>
                <div className="flex items-center gap-2">
                  {peopleSvg}{" "}
                  <p className="text-[12px] md:text-[15px]">
                    {siteData?.capacity?.guest_capacity_max ||
                      siteData?.capacity?.total_beds ||
                      "Not specified"}{" "}
                    people
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[16px] md:text-[20px] font-semibold">
                  Site Size
                </p>
                <div className="flex items-center gap-2">
                  {bedIcon}{" "}
                  <p className="text-[12px] md:text-[15px]">
                    {siteData?.capacity?.site_size || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 border-b border-black/25 pb-2 md:pb-4">
            <h3 className="text-[#1C231F] text-[18px] md:text-[28px] font-bold">
              Booking Settings
            </h3>
            <div className="bg-[#66A2FD] text-white rounded-[10px] p-4 mt-4 max-w-[500px]">
              <div className="border-l border-white pl-2">
                <p className="text-[10px] md:text-[12px]">
                  Booking Type:{" "}
                  {siteData?.booking_setting?.booking_type || "Not specified"}
                </p>
                <p className="text-[14px] md:text-[16px]">
                  Notice Period:{" "}
                  {siteData?.booking_setting?.notice_period || "Not specified"}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 border-b border-black/25 pb-2 md:pb-4">
            <h3 className="text-[#1C231F] text-[18px] md:text-[28px] font-bold">
              Pricing
            </h3>
            <p className="text-[12px] md:text-[14px]">
              Hosting Type: {siteData?.pricing?.hosting_type || "Not specified"}
            </p>
            <p className="text-[14px] md:text-[16px] mt-4">
              Service: {siteData?.pricing?.service || "Not specified"}
            </p>
            {siteData?.pricing?.hosting_description && (
              <p className="text-[12px] md:text-[14px] mt-2">
                Description: {siteData.pricing.hosting_description}
              </p>
            )}
          </div>
          <div className="mt-4 border-b border-black/25 pb-2 md:pb-4">
            <h3 className="text-[#1C231F] text-[18px] md:text-[28px] font-bold">
              Arrival Instructions
            </h3>
            <div className="grid grid-cols-2 mt-4 rounded-[10px] border border-dashed border-[#D3D3D3] max-w-[450px] mx-auto lg:mx-0 text-center">
              <div className="rounded-l-[10px] p-4  ">
                <p className="text-[10px] md:text-[12px]">Check-in Time</p>
                <p className="text-[18px] md:text-[24px] font-bold leading-6">
                  {siteData?.arrival_detail?.check_in_time || "Not specified"}
                </p>
              </div>
              <div className="rounded-r-[10px] p-4 border-l border-[#D3D3D3]">
                <p className="text-[10px] md:text-[12px]">Check-out Time</p>
                <p className="text-[18px] md:text-[24px] font-bold leading-6">
                  {siteData?.arrival_detail?.check_out_time || "Not specified"}
                </p>
              </div>
            </div>
            {siteData?.arrival_detail?.arrival_instructions && (
              <div className="mt-4">
                <p className="text-[12px] md:text-[14px] font-semibold">
                  Arrival Instructions:
                </p>
                <p className="text-[12px] md:text-[14px] mt-1">
                  {siteData.arrival_detail.arrival_instructions}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-3">
          <Image
            src={
              "https://res.cloudinary.com/dtfzklzek/image/upload/v1754433891/Group_48097133_b3ibxi.png"
            }
            alt="Map Image"
            width={333}
            height={294}
            className="max-h-[294px] w-full object-cover"
          />
          <div className="bg-gradient-to-r from-[#237AFC] to-[#154996] mt-4 rounded-[7px] p-4 text-center text-white md:p-6">
            <p className="text-[14px] md:text-[16px] font-medium">
              {siteData?.pricing?.hosting_type === "exchange"
                ? "Exchange Hosting"
                : siteData?.pricing?.hosting_type === "paid"
                ? "Paid stay Hosting"
                : "Hosting"}
            </p>
            <p className="text-[25px] md:text-[48px] font-semibold leading-12 mt-1">
              {siteData?.pricing?.base_price
                ? `$${siteData.pricing.base_price}`
                : "Contact Host"}
            </p>
            <p className="text-[14px] md:text-[16px] font-medium">
              {siteData?.pricing?.currency || "Per Person"}
            </p>
            <div className="flex items-center justify-evenly w-full gap-2 mt-2">
              <div className="text-[14px] md:text-[16px]">
                <p className="font-bold">Service</p>
                <p>{siteData?.pricing?.service || "Not specified"}</p>
              </div>
              <div className="text-[14px] md:text-[16px]">
                <p className="font-bold">Status</p>
                <p>{siteData?.publish_status || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
