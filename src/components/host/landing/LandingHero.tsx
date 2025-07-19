import Image from "next/image";
import React from "react";

export default function LandingHero() {
  const LocationIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="34"
      fill="none"
      viewBox="0 0 23 34"
    >
      <g fill="#000" clipPath="url(#clip0_1248_35509)">
        <path d="M17.868 1.856a11.86 11.86 0 0 0-12.737 0c-4.984 3.183-6.58 9.387-3.71 14.428L11.5 34l10.079-17.716c2.869-5.041 1.276-11.245-3.71-14.428m1.72 13.388L11.503 29.46 3.413 15.244C1.112 11.197 2.39 6.221 6.391 3.667a9.5 9.5 0 0 1 5.109-1.49c1.78-.001 3.556.495 5.109 1.487 4 2.557 5.28 7.533 2.98 11.58"></path>
        <path d="M11.5 4.532c-3.127 0-5.674 2.442-5.674 5.44s2.547 5.44 5.674 5.44 5.674-2.442 5.674-5.44-2.544-5.44-5.674-5.44m0 8.704c-1.877 0-3.404-1.465-3.404-3.264 0-1.8 1.527-3.264 3.404-3.264s3.405 1.464 3.405 3.264-1.528 3.264-3.405 3.264"></path>
      </g>
      <defs>
        <clipPath id="clip0_1248_35509">
          <path fill="#fff" d="M0 0h23v34H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
  return (
    <div className="lg:min-h-[calc(100vh-80px)]">
      <div className="max-w-[1440px] mx-auto p-3 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 justify-center lg:justify-between items-center h-full">
          <div>
            <div className="text-center lg:text-left max-w-[550px] mx-auto lg:mx-0 ">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                {LocationIcon}
                <p className="text-2xl md:text-[30px] font-bold">
                  Global Travel
                </p>
              </div>
              <h3 className="text-4xl md:text-[60px] font-bold">
                Discover the Best Destinations Across the Globe
              </h3>
              <p className="text-[12px] md:text-[15px] mt-4 md:mt-6">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's Lorem Ipsum is
                simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-4 mt-4 md:mt-8">
                <button
                  type="button"
                  className="text-white bg-[#3C83F6] py-2 px-5 rounded-lg text-[10px] md:text-[12px] "
                >
                  Become a Local Host
                </button>
                <button
                  type="button"
                  className="text-[#3E3E3E] bg-white border border-[#3C83F6] py-2 px-5 rounded-lg text-[10px] md:text-[12px] "
                >
                  Add New Property
                </button>
              </div>
            </div>
          </div>
          <div>
            <Image
              src="https://res.cloudinary.com/dtfzklzek/image/upload/v1752956378/Group_48096615_wbgamb.png"
              alt="Hero Image"
              width={607}
              height={757}
              className="max-h-[600px] object-contain mx-auto lg:mx-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
