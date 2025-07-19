import Image from "next/image";
import React from "react";

export default function LandingHero() {
  return (
    <div className="lg:min-h-[calc(100vh-80px)]">
      <div className="max-w-[1440px] mx-auto p-3 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 justify-center lg:justify-between items-center h-full">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <p className="text-2xl lg:text-[30px] font-bold">Global Travel</p>
            </div>
          </div>
          <div>
            <Image
              src="https://res.cloudinary.com/dtfzklzek/image/upload/v1752956378/Group_48096615_wbgamb.png"
              alt="Hero Image"
              width={607}
              height={757}
              className="max-h-[600px] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
